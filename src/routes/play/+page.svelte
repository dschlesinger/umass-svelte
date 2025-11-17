<script lang='ts'>

    import { onMount } from "svelte";
    import { toast } from "@zerodevx/svelte-toast";
    import { supabase } from "$lib/supabase/supabase.js";
    import { attachGame, sendUpdate } from "$lib/calls/gameSocket";
    import { getGameInfo } from "$lib/calls/gameInfo.js";
    import { getFactionID } from "$lib/supabase/getFactionID.js";
    import JoinGameModal from "$lib/components/custom/joinGameModal.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import AdvisorChat from "$lib/components/custom/advisorChat.svelte";

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

</script>

<JoinGameModal game={gameState} open={join_game_model_open} />

<div class='w-full h-full flex flex-col lg:flex-row'>

    <div class='h-full grow bg-cyan-400'>
        <!-- Map -->

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
