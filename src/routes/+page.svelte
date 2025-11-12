<script lang="ts">

    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import { joinGame, available_games, getGames } from "$lib/supabase/games.svelte";

    let game_id = $state('')
    let faction_id = $state('')

    getGames()

</script>

<div class='w-full flex flex-col gap-y-2 pt-4 items-center'>

    <div class='flex gap-x-2'>

        <Input class='max-w-48' placeholder='game id' bind:value={game_id} />
        <Input class='max-w-48' placeholder='faction id' bind:value={faction_id} />

        <Button onclick={() => {
            joinGame(
                game_id,
                faction_id
            )
        }}
        >Add Game</Button>

        <Button onclick={() => getGames()}>
            Refresh
        </Button>
    </div>

    <div class='w-lg grid grid-cols-5 gap-2'>
        {#each available_games.current as ag}
            <div class="bg-slate-950 p-2 rounded-md text-white">
                {ag.game_id}
                {ag.faction_id}
                {ag.time_joined}
            </div>
        {/each}
    </div>
</div>

