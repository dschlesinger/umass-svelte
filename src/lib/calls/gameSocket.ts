export function attachGame(state: { messages: string[] }, game_id: string, faction_id: string) {
    if (!game_id || !faction_id) throw new Error('Game ID or Faction ID not provided');

    console.log('func', game_id, faction_id)

    // Construct query params
    const params = new URLSearchParams({ game_id, faction_id });
    const u = `/api/attach-game?${params.toString()}`;
    // console.log(u)
    const evtSource = new EventSource(u);

    evtSource.onmessage = (event) => {
        const d = JSON.parse(event.data)
        console.log(d)
        state.messages = [...state.messages, ...d.game_updates];
    };

    evtSource.onerror = (err) => {
        console.error('SSE error', err);
        evtSource.close();
    };

    return evtSource; // Return it in case caller wants to close it later
}

export async function sendUpdate(type: string, message: any, game_id: string, faction_id: string) {
    const res = await fetch('/api/attach-game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: type, message: message, game_id: game_id, faction_id: faction_id })
    });

    if (!res.ok) {
        throw new Error(`Failed to send update: ${res.statusText}`);
    }

    return res.json();
}
