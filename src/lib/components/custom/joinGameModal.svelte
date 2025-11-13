<script>

    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import Button from "../ui/button/button.svelte";

    import { joinGameServer } from "$lib/calls/joinGame";
    import { joinGame } from "$lib/supabase/games.svelte";
    import { redirect } from "@sveltejs/kit";
    import { toast } from "@zerodevx/svelte-toast";
    import Label from "../ui/label/label.svelte";
    import { Clipboard } from '@lucide/svelte';

    let {
        open = $bindable(false),
        game = $bindable(null)
    } = $props();

</script>

<Dialog.Root bind:open>

    <Dialog.Content>

        <Dialog.Header>
            <Dialog.Title>Choose a Faction</Dialog.Title>
            <Dialog.Description>
                For {game.name}
            </Dialog.Description>
        </Dialog.Header>

        {#each game.factions.filter((f) => !f.is_taken) as f}

            <Button
                onclick={async () => {
                    const sucsess = await joinGameServer(game.game_id, f.faction_id)

                    if (sucsess) {

                        // Update supabase
                        joinGame(game.name, game.game_id, f.faction_id)

                        // const params = new URLSearchParams({ 
                        //     game_id: var1, 
                        //     var2: var2 
                        // });
                        
                        // throw redirect(308, '/play')

                    }
                    else {
                        toast.push('Failed to join Game, please refresh')
                    }
                }}
            >
                {f.name}
            </Button>

        {/each}

        <Dialog.Footer>
            <Label 
                class='w-full text-center bg-slate-600 rounded-md text-white'
                for='copy-game-id'>
                <div class='w-full text-center'>
                    Game ID: {game.game_id}
                </div>
            </Label>
            <Button
                class='bg-slate-600'
                name='copy-game-id'
                size='icon'
                onclick={
                    () => {
                        navigator.clipboard.writeText(game.game_id);
                        toast.push('Copied Game ID!')
                    }
                }
            >
                <Clipboard />
            </Button>
        </Dialog.Footer>

    </Dialog.Content>

</Dialog.Root>

