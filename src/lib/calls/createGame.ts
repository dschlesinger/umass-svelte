export async function createGame(owner: string, name: string, nplayers: number, grain: number) {
        const res = await fetch('/api/create-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                owner: owner,
                name: name,
                nplayers: nplayers,
                grain: grain,
             })
        });

        console.log(res)

        const data = await res.json();

        if (res.status === 500 || res.status == 422) {
            return null
        }
        
        return data
}