export function load({ url }) {

    const game_id = url.searchParams.get('game_id');

    if (!game_id) {
        throw Error('GameID was not provided')
    }

    return {
        game_id: game_id
    }
}