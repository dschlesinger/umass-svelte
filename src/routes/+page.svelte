<script lang="ts">

    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import { joinGame, available_games, getGames } from "$lib/supabase/games.svelte";

    let dates = $derived(available_games.current.map((g) => new Date(g.time_joined)))

    getGames()

</script>

<div class='w-full h-full flex bg-linear-310 from-blue-500 to-blue-600 via-cyan-400'>

    <div class='w-full flex justify-center'>

        <div class='bg-slate-800 w-3/5 h-1/2 rounded-md border-none p-2 flex flex-col'>

            <div class='shrink-0 text-white text-center text-2xl font-bold p-2'>
                Your Active Games
            </div>

            <div class='grow overflow-y-scroll mt-2'>
                <div class='grid grid-cols-3 gap-2'>
                    {#each available_games.current as g, i}

                        <div class={`${g.active ? 'bg-green-500' : 'bg-red-500'} rounded-md p-2 flex flex-col justify-center items-center`}>

                            <div class='text-center'>
                                {g.name}
                            </div>
                            <div class='text-center'>
                                {dates[i].getMonth()}/{dates[i].getDate()}/{dates[i].getFullYear()}
                            </div>

                        </div>

                    {/each}       
                </div>
            </div>

        </div>

    </div>

</div>