<script lang="ts">

    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import { joinGame, available_games, getGames } from "$lib/supabase/games.svelte";
    import { getGameInfo } from '$lib/calls/gameInfo'
    import { onMount } from "svelte";
    import JoinGameButton from "$lib/components/custom/joinGameButton.svelte";
    import { goto } from "$app/navigation";

    let sorted_game = $derived(available_games.current.toSorted((a, b) => (new Date(b.time_joined)).getTime() - new Date(a.time_joined).getTime()))

    let dates = $derived(sorted_game.map((g) => new Date(g.time_joined)))

    let game_id = $state('')

    onMount(async () => {
        getGames()
    })

</script>

<div class='w-full h-full flex bg-linear-310 from-blue-500 to-blue-600 via-cyan-400'>

    <div class='w-full flex flex-col lg:flex-row justify-center items-center gap-4'>

        <div class='w-3/5 p-2 bg-slate-800 rounded-md'>

            <div class='shrink-0 text-white text-center text-2xl font-bold p-2'>
                Join a New Game
            </div>

            <div class='flex justify-center'>

                <Input bind:value={game_id} class='w-32' placeholder='123456' />

                <JoinGameButton bind:game_id />

            </div>

        </div>

        <div class='bg-slate-800 w-3/5 h-1/2 rounded-md border-none p-2 flex flex-col'>

            <div class='shrink-0 text-white text-center text-2xl font-bold p-2'>
                Your Active Games
            </div>

            <div class='grow overflow-y-scroll mt-2'>
                <div class='grid grid-cols-3 gap-2'>
                    {#each sorted_game as g, i}

                        <Button 
                            class={`${g.active ? 'bg-green-600 hover:bg-green-600/60' : 'bg-red-600 hover:bg-red-600/60'} h-fit rounded-md p-2 flex flex-col justify-center items-center`}
                            onclick={() => {
                                goto(`/play?game_id=${g.game_id}`)
                            }}     
                        >

                            <div class='text-center'>
                                {g.name}
                            </div>
                            <div class='text-center'>
                                {dates[i].getMonth()}/{dates[i].getDate()}/{dates[i].getFullYear()}
                            </div>

                        </Button>

                    {/each}       
                </div>
            </div>

        </div>

    </div>

</div>