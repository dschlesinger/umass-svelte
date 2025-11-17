import type { RequestHandler } from '@sveltejs/kit';
import crypto from 'crypto';

export const POST: RequestHandler = async ({ request }) => {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      try {
        const data = await request.json();
        const { owner, name, nplayers, grain } = data;
        
        // Make owner key
        const owner_key = crypto
          .createHash('sha256')
          .update(owner)
          .digest('hex');
        
        const response = await fetch(
          `http://localhost:8000/create-game`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              owner: owner_key,
              name: name,
              nplayers: nplayers,
              grain: grain,
            })
          }
        );
        
        if (!response.ok) {
          const error = await response.text();
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error, step: 'error' })}\n\n`)
          );
          controller.close();
          return;
        }
        
        // Stream the response from FastAPI to the client
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        
      } catch (error) {
        console.error('POST error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Invalid request';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errorMessage, step: 'error' })}\n\n`)
        );
      } finally {
        controller.close();
      }
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
};