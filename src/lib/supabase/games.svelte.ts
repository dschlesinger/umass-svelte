import { toast } from "@zerodevx/svelte-toast"
import { supabase } from "./supabase"

interface Game {
    game_id: string
    faction_id: string
    time_joined: string
}

export let available_games: { current: Game[] } = $state({ current: [] })

export async function getGames() {
    const { data, error } = await supabase.from("games").select("*")

    if (error) {
        console.error("Error fetching games:", error)
        return
    }

    // assign directly to your reactive state
    available_games.current = data.map((row: any) => ({
        game_id: row.game_id,
        faction_id: row.faction_id,
        time_joined: row.created_at,
    }))
}

export async function joinGame(game_id: string, faction_id: string) {
    const { error } = await supabase
        .from("games")
        .insert([{
            game_id: game_id,
            faction_id: faction_id
        }]) // you can pass a single object or an array of objects

    if (error) {
        console.error("Error inserting game:", error)

        // Duplicate keys
        if (error.code === '23505') {
            toast.push('Faction ID is already taken for this game')
        }

        throw new Error(error.message) // throws so caller can handle it
    }

    console.log("Game inserted successfully:", {
        game_id: game_id,
        faction_id: faction_id
    })

    // Update front end
    getGames()
}
