<script lang='ts'>
    import Button from "../ui/button/button.svelte";

    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { sendAdvisorMessage } from "$lib/calls/sendAdvisorMessage";

    let textareaValue = $state('')

    let token_stream = $state({current: []})

    let messages: Message[] = $state([
        {
            'role': 'advisor',
            'message': 'Hello World'
        },
        {
            'role': 'player',
            'message': 'Hello World'
        },
    ])

    let {
        game_id,
        faction_id
    } = $props();

</script>

<div class='w-full h-96 md:w-96 md:h-full bg-slate-800 flex flex-col'>

    <header class='p-2 text-lg text-white font-bold text-center'>
        Advisor Chat
    </header>

    <div class='w-full h-full flex md:flex-col'>

        <div class='flex h-4/5 flex-col grow border-white overflow-y-scroll'>
            <!-- Messages -->
             {#each messages as m}
                <div
                    class={`w-fit m-2 p-1 text-white rounded-md ${m.role === 'advisor' ? 'bg-slate-400 self-start' : 'bg-blue-500 self-end'}`}
                >
                    {m.message}
                </div>
             {/each}

             {token_stream.current.join('')}
        </div>

        <div class='grow max-w-1/2 md:max-w-full flex flex-col items-center m-2'>
            <!-- Send Message -->
            <Textarea bind:value={textareaValue} class='w-9/10 text-white grow' />

            <Button
                class='w-9/10 mt-2 bg-blue-500'
                onclick={
                    async () => {
                        console.log('sent')
                        await sendAdvisorMessage(game_id, faction_id, messages, token_stream)
                    }
                }
            >Send Message</Button>
        </div>

    </div>

</div>