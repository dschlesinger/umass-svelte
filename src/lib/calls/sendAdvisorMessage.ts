export async function sendAdvisorMessage(game_id: string, faction_id: string, messages: Message[], token_stream) {
    return new Promise((resolve, reject) => {

        const params = new URLSearchParams({
            payload: JSON.stringify(messages),
            faction_id: faction_id,
            game_id: game_id,
        });

        const u = `/api/advisor-chat?${params.toString()}`;

        const evtSource = new EventSource(u);

        evtSource.addEventListener("llm", (event) => {
            token_stream.current.push(event.data);
        });

        evtSource.addEventListener("done", () => {
            evtSource.close();
            resolve(null);
        });


        evtSource.onerror = (err) => {
            // console.error("SSE error", err);
            evtSource.close();
            resolve(null);
        };

    });
}
