export const GET = async ({ url }) => {
    const game_id = url.searchParams.get("game_id");
    const faction_id = url.searchParams.get("faction_id");
    const messages = JSON.parse(url.searchParams.get("payload") || "[]");

    const backendResponse = await fetch("http://localhost:8000/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            game_id: game_id,
            faction_id: faction_id,
            messages: messages,
        })
    });

    console.log(backendResponse)

    return new Response(backendResponse.body, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
    });
};
