export async function createGame(
  owner: string, 
  name: string, 
  nplayers: number, 
  grain: number, 
  game_create_step
) {
  try {
    const response = await fetch('/api/create-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        owner: owner,
        name: name,
        nplayers: nplayers,
        grain: grain,
      })
    });

    if (!response.ok) {
      console.error('Response not ok:', response.status);
      return null;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      console.error('No response body');
      return null;
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let finalGameId = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const jsonStr = line.slice(6); // Remove 'data: ' prefix
            const data = JSON.parse(jsonStr);
            
            if (data.error) {
              console.error('Stream error:', data.error);
              return null;
            }
            
            if (data.step && data.game_id) {
              finalGameId = data.game_id;
              game_create_step.current = data.step
            }
          } catch (e) {
            console.error('Failed to parse SSE data:', e, line);
          }
        }
      }
    }

    return { game_id: finalGameId };
    
  } catch (error) {
    console.error('createGame error:', error);
    return null;
  }
}