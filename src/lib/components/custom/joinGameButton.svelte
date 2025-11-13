<script lang='ts'>

    import { toast } from "@zerodevx/svelte-toast";

    import JoinGameModal from "./joinGameModal.svelte";
    import Button from "../ui/button/button.svelte";

    import { getGameInfo } from "$lib/calls/gameInfo";

    let {
        game_id = $bindable()
    } = $props()

    let open = $state(false)
    let game = $state(null)

</script>

<Button
    onclick={
        async () => {

            if (game_id === '') {
                toast.push('Game ID is Blank')
            }
            else {
                const g = await getGameInfo(game_id);

                if (g === null) {
                    toast.push('Game ID not found')
                }
                else {
                    game = g;
                    open = true;
                }
            }
        }
    }
>Join Game</Button>

<JoinGameModal bind:open bind:game />