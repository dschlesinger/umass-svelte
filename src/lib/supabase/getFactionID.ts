import { supabase } from "$lib/supabase/supabase";
import { user } from "./user.svelte";

export async function getFactionID(game_id: string) {

    console.log(game_id)

    if (user.current) {
        const { data, error } = await supabase.from('games')
            .select('faction_id')
            .eq('game_id', game_id)
            .single()

        if (error) {

            if (error.code == 'PGRST116') {
                return undefined
            }

            throw error
        }

        console.log(data?.faction_id)

        return data?.faction_id
    }
    else {
        throw Error('Not logged in')
    }

}