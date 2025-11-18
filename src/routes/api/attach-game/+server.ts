import type { RequestHandler } from '@sveltejs/kit';
import WebSocket from 'ws';

const wsRegistry = new Map<string, WebSocket>();

function key(game_id: string, faction_id: string) {
    return `${game_id}:${faction_id}`;
}

export const GET: RequestHandler = async ({ url }) => {
    const game_id = url.searchParams.get('game_id')!;
    const faction_id = url.searchParams.get('faction_id')!;
    console.log('ws', game_id, faction_id)
    const k = key(game_id, faction_id);

    // Create new WS for this client
    const params = new URLSearchParams({ game_id, faction_id });
    const ws = new WebSocket(`ws://localhost:8000/ws/attach-game?${params}`);

    // Save to registry
    wsRegistry.set(k, ws);

    // console.log(wsRegistry)

    const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const stream = new ReadableStream({
    start(controller) {
        let closed = false;

        ws.onmessage = (msg) => {
            if (closed) return;
            try {
                controller.enqueue(`data: ${msg.data}\n\n`);
            } catch (e) {
                closed = true;
            }
        };

        ws.onclose = () => {
            if (!closed) controller.close();
            closed = true;
            wsRegistry.delete(k);
        };

        ws.onerror = (err) => {
            console.error('WS error', err);
            if (!closed) controller.close();
            closed = true;
            wsRegistry.delete(k);
        };
    }
});


    return new Response(stream, { headers });
};

export const POST: RequestHandler = async ({ request }) => {
    const { type, message, game_id, faction_id } = await request.json();

    const k = key(game_id, faction_id);
    const ws = wsRegistry.get(k);

    // console.log(ws, wsRegistry)

    if (!ws || ws.readyState !== WebSocket.OPEN) {
        return new Response(
            JSON.stringify({ success: false, error: 'WS not connected' }),
            { status: 500 }
        );
    }

    ws.send(JSON.stringify({
        route: type,
        message: message
    }));

    return new Response(JSON.stringify({ success: true }));
};
