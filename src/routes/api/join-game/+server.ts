import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		const { game_id, faction_id } = data;

		console.log('Received:', { game_id, faction_id });

        const response = await fetch(
            `http://localhost:8000/join-game/`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ game_id: game_id, faction_id: faction_id })
		});

        const success = await response.json();

		return new Response(
			JSON.stringify(success),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		console.error('POST error:', error);
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Invalid request'
			}),
			{
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			}
		);
	}
};
