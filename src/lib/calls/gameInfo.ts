export async function getGameInfo(game_id: string) {
		const res = await fetch('/api/game-info', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ game_id: game_id })
		});

        console.log(res)

		const data = await res.json();

        if (res.status === 500) {
            return null
        }
		
        return data
}