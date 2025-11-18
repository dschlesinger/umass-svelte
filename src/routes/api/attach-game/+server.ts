import type { RequestHandler } from '@sveltejs/kit';
import WebSocket from 'ws';

let ws: WebSocket | null;

function connectBackend(game_id: string, faction_id: string) {

    const params = new URLSearchParams({
        game_id: game_id,
        faction_id: faction_id
    })

    const u = `ws://localhost:8000/ws/attach-game?${params.toString()}`;

    // console.log(u)
    
    ws = new WebSocket(u);

    ws.on('open', () => console.log('Connected to backend WS'));
    ws.on('close', () => {
        console.log('Backend WS closed, reconnecting in 1s...');
        setTimeout(connectBackend, 1000);
    });
    ws.on('error', (err) => console.error('Backend WS error', err));
}

// SSE GET handler
export const GET: RequestHandler = async ({ url }) => {

    const game_id = url.searchParams.get('game_id');
    const faction_id = url.searchParams.get('faction_id');

    
    if (!game_id || !faction_id) {
        throw Error('Game ID or Faction ID was not given')
    }
    
    console.log('server route', game_id, faction_id)
    
	const headers = new Headers({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});

    connectBackend(game_id, faction_id)

	const stream = new ReadableStream({
        start(controller) {
            ws.onmessage = (msg) => {
            try {
                controller.enqueue(msg.data);
            } catch (e) {
                console.log('Stream already closed, skipping enqueue');
            }
            };

            ws.onclose = () => {
            try {
                controller.close();
            } catch {}
            };

            ws.onerror = (err) => {
            console.error('WebSocket error', err);
            try {
                controller.close();
            } catch {}
            };
        }
        });


	return new Response(stream, { headers });
};

// POST handler: receive client message and send to backend WebSocket
export const POST: RequestHandler = async ({ request }) => {
	const { type, message } = await request.json();

    console.log(type, message)

	if (ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify({
            route: type,
            message: message
        }));

        console.log('sent', type, message)

		return new Response(JSON.stringify({ success: true }));
	} else {

        console.log('not sent')

		return new Response(JSON.stringify({ success: false, error: 'WS not connected' }), { status: 500 });
	}
};
