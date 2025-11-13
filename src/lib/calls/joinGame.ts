export async function joinGameServer(game_id: string, faction_id: string) {
		const res = await fetch('/api/join-game', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ game_id: game_id, faction_id: faction_id })
		});

		const data = await res.json();

        console.log(data)
		
        return data
}