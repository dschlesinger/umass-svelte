import type { RequestHandler } from '@sveltejs/kit';
import crypto from 'crypto';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();

        const { owner, name, nplayers, grain } = data;

        console.log('Received:', { owner, name, nplayers, grain });

        // Make owner key
        const owner_key = crypto
            .createHash('sha256')
            .update(owner)
            .digest('hex');

        const response = await fetch(
            `http://localhost:8000/create-game/`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    owner: owner_key,
                    name: name,
                    nplayers: nplayers,
                    grain: grain,
                })
        });

        const game = await response.json();

        return new Response(
            JSON.stringify(game),
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
