import { type Game } from '$lib/supabase/games.svelte'

export let active_game: {
    current: Game | null
} = $state({current: null})