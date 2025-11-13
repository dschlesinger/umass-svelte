import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		const { game_id } = data;

		console.log('Received:', { game_id });

        const response = await fetch(`http://localhost:8000/game-info/${game_id}`);

        const game_info = await response.json();

		return new Response(
			JSON.stringify(game_info),
			{
				status: response.status,
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
