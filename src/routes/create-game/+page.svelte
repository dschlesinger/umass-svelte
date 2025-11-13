<script lang='ts'>

    import { Separator } from "$lib/components/ui/separator/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import { user } from "$lib/supabase/user.svelte";
    import { joinGame } from "$lib/supabase/games.svelte";

    import bg from '$lib/assets/bg-continents.png'

    let game_name = $derived(user.current ? `${user.current.user_metadata.full_name}'s Game` : 'Not logged in')
    let number_players = $state(4)
    let grain = $state(100)

    let game_id = $state('')
    let faction_id = $state('')

</script>

<div 
	class="w-full h-full flex bg-no-repeat bg-center bg-cover"
	style={`background-image: url('${bg}')`}
>
	<div class="w-4/5 h-4/5 mx-auto my-auto bg-slate-800 rounded-md flex flex-col">
		
        <header class='w-full p-4 text-3xl text-white text-center font-bold shrink-0'>
            Create a Sketch Game
        </header>

        <Separator />

        <div class='w-full grow flex flex-col items-center justify-center gap-y-4'>

            <div class='flex flex-col md:flex-row gap-4'>
                <div class='flex gap-x-4'>
                    <Label class='text-lg text-white' for='name'>Game Name</Label>
                    <Input bind:value={game_name} class='w-80 text-center' name='name' placeholder='Awsome Adventure' />
                </div>

                <div class='flex gap-x-4'>
                    <Label class='text-lg text-white' for='number_players'>Number of Players</Label>
                    <Input bind:value={number_players} type='number' class='w-16' name='number_players' />
                </div>
            </div>

            <div class='w-3/5 p-2'>
                <Separator />
            </div>

            <div class='flex flex-col md:flex-row gap-4'>
                <div class='flex gap-x-4'>
                    <Label class='text-lg text-white' for='game_id'>Game ID</Label>
                    <Input bind:value={game_id} class='w-80 text-center' name='game_id' />
                </div>

                <div class='flex gap-x-4'>
                    <Label class='text-lg text-white' for='faction_id'>Faction ID</Label>
                    <Input bind:value={faction_id} class='w-64' name='faction_id' />
                </div>
                <small class='text-amber-500'>For debugging</small>

            </div>

            <div class='w-3/5 p-2'>
                <Separator />
            </div>

            <div class='flex flex-col md:flex-row gap-4 items-center justify-center'>
                <div>
                    <div class='flex gap-x-4 justify-center'>
                        <Label class='text-lg text-white' for='grain'>Map Grain</Label>
                        <Input bind:value={grain} class='w-16' name='grain' />
                    </div>
                    <small class='text-amber-500'>Number of Provinces (Including Ocean Tiles)</small>
                </div>
                <Button
                    class='bg-green-500 hover:bg-green-800'
                    onclick={() => {
                        joinGame(
                            game_name,
                            game_id,
                            faction_id
                        )
                    }}
                >
                    Start Game
                </Button>
            </div>
        </div>

	</div>
</div>
