<script lang='ts'>

    import { onMount } from "svelte";
    import { toast } from "@zerodevx/svelte-toast";
    import { supabase } from "$lib/supabase/supabase.js";
    import { attachGame, sendUpdate } from "$lib/calls/gameSocket";
    import { getGameInfo } from "$lib/calls/gameInfo.js";
    import { getFactionID } from "$lib/supabase/getFactionID.js";
    import JoinGameModal from "$lib/components/custom/joinGameModal.svelte";
    import Map from "$lib/components/custom/map.svelte";
    import Button, {buttonVariants} from "$lib/components/ui/button/button.svelte";
    import AdvisorChat from "$lib/components/custom/advisorChat.svelte";
    import { STRATEGY_MAP_COLORS } from "$lib/components/custom/mapColors";
    import { update_game_state } from "$lib/components/custom/processUpdate.js"

    import {
        Bot,
        CircleUserRound 
    } from '@lucide/svelte';

    let {
        data
    } = $props();

    let updates = $state({ messages: [] })

    let faction_id = $state('');
    let join_game_model_open = $state(false)

    async function handleAttachGame() {

        console.log(faction_id, data.game_id)

        attachGame(updates, data.game_id, faction_id)
    }

    let gameState = $state(
            null
    )

    let faction_order = $derived(gameState?.factions?.map((f) => f.faction_id))

    function getFactionColor(faction_id: string) {
        // console.log(faction_id)

        const color = STRATEGY_MAP_COLORS[
            faction_order.indexOf(faction_id)
        ]

        // console.log(color)

        return color
    }

    onMount(async () => {

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
            toast.push('Not logged in');
            return;
        }

        gameState = await getGameInfo(data.game_id);

        // Get faction id
        faction_id = await getFactionID(data.game_id)

        if (faction_id === undefined) {
            join_game_model_open = true;
            return
        }

        handleAttachGame()

    })

    $effect(() => {
        if (updates.messages.length > 0) {
            const u = updates.messages.pop();

            if (gameState !== null) {
                update_game_state(gameState, [u])
            }

        }
    })

</script>

<JoinGameModal game={gameState} open={join_game_model_open} />

<div class='w-full h-full flex flex-col lg:flex-row'>

    <div class='h-full flex grow bg-slate-600 justify-center items-center gap-x-4'>
        <!-- Players -->
         <div class='bg-slate-800 rounded-md p-4'>

            {#each gameState?.factions as f}

                <div class='flex items-center gap-x-1'>

                    <div 
                        class='w-2 aspect-square rounded-full'
                        style={`background-color: ${getFactionColor(f?.faction_id)};`}
                    >
                    </div>

                    <div class='text-white'>
                        {f?.name}
                    </div>

                    <div>
                        {#if f?.available}
                            <Bot class='stroke-white' />
                        {:else}
                            <CircleUserRound  class={`${f?.turn_ended ? 'fill-green-600' : 'fill-red-600'}`} />
                        {/if}
                    </div>

                </div>
                
            {/each}
            
        </div>
        <!-- Map -->
        <Map game={gameState} {faction_id} {sendUpdate} />
    </div>

    <AdvisorChat game_id={data.game_id} faction_id={faction_id} />

</div>

<!-- {data.game_id}{data.faction_id}

<Button
    onclick={
        async () => {
            await sendUpdate('endturn', {endturn: true})
        }
    }
>
    Test Update
</Button> -->
