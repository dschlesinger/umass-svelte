<script lang='ts'>

    import { onMount } from "svelte";
    import { attachGame, sendUpdate } from "$lib/calls/gameSocket";
    import { getGameInfo } from "$lib/calls/gameInfo.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import AdvisorChat from "$lib/components/custom/advisorChat.svelte";

    let {
        data
    } = $props();

    let updates = $state({ messages: [] })

    onMount(async () => {

        let gameState = $state(
            await getGameInfo(data.game_id)
        )

        console.log($state.snapshot(gameState))

        console.log(data.faction_id, data.game_id)

        attachGame(updates, data.game_id, data.faction_id)
    })

</script>

<div class='w-full h-full flex flex-col lg:flex-row'>

    <div class='h-full grow bg-cyan-400'>
        <!-- Map -->

    </div>

    <AdvisorChat game_id={data.game_id} faction_id={data.faction_id} />

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
