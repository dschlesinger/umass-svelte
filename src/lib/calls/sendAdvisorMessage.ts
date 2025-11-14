export interface Message {
    role: 'player' | 'advisor'
    message: string
}

export async function sendAdvisorMessage(game_id: string, faction_id: string, messages: Message[], token_stream) {

    const params = new URLSearchParams({
        payload: JSON.stringify(messages),
        faction_id: faction_id,
        game_id: game_id,
    })

    const u = `/api/advisor-chat?${params.toString()}`;

    console.log(u);

    const evtSource = new EventSource(
        u
    );

    evtSource.onmessage = (event) => {
        console.log(event.data)
        token_stream.current.push(event.data);
    };

    evtSource.onerror = (err) => {
        console.error('SSE error', err);
        evtSource.close();
    };

    return evtSource;
}
