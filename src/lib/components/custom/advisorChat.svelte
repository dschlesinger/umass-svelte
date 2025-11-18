<script lang='ts'>
    import Button from "../ui/button/button.svelte";

    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { sendAdvisorMessage } from "$lib/calls/sendAdvisorMessage";

    let textareaValue = $state('')

    let token_stream = $state({current: []})

    let messages: Message[] = $state([
        {
            'role': 'advisor',
            'message': 'Hello I am your helpful advisor'
        }
    ])

    let streaming_message = $state(false);
    let scroll_area = $state(null)

    let show_down_button = $state(false)
    let {
        game_id,
        faction_id
    } = $props();

</script>

<div class="w-full lg:w-96 h-80 lg:h-full bg-slate-800 flex flex-col">

    <header class="p-2 text-lg text-white font-bold text-center flex items-center justify-center gap-x-2">
        Advisor Chat
        {#if show_down_button}
            <Button
                onclick={() => {
                    scroll_area.scrollTop = scroll_area.scrollHeight
                }}
            >
                V
            </Button>
        {/if}
    </header>

    <!-- Chat scroll area -->
    <div 
        bind:this={scroll_area} 
        onscroll={() => show_down_button = scroll_area.scrollTop < -(scroll_area.clientHeight * 2)}
        class="flex-1 overflow-y-auto flex flex-col-reverse p-2 space-y-2"
    >

        <!-- Streaming message -->
        {#if streaming_message}
            <div
                class="w-fit max-w-[80%] p-2 text-white rounded-md self-start bg-amber-500 wrap-break-words"
            >
                {token_stream.current.join("")}
            </div>
        {/if}
        
        <!-- Messages -->
        {#each messages as m}
            <div
                class={`w-fit max-w-[80%] p-2 text-white rounded-md wrap-break-words ${
                    m.role === "advisor"
                        ? "bg-slate-400 self-start"
                        : "bg-blue-500 self-end"
                }`}
            >
                {m.message}
            </div>
        {/each}

    </div>

    <!-- Input area -->
    <div class="p-2 flex flex-col space-y-2">
        <Textarea
            bind:value={textareaValue}
            class="w-full text-white min-h-[60px]"
        />

        <Button
            class="w-full bg-blue-500"
            onclick={async () => {
                messages = [{
                    role: "player",
                    message: $state.snapshot(textareaValue),
                }, ...messages];

                textareaValue = ''
                streaming_message = true;

                await sendAdvisorMessage(
                    game_id,
                    $state.snapshot(faction_id),
                    // Take only previous 10 messages
                    messages.toReversed().slice(0, 10),
                    token_stream
                ).then(() => {
                    messages = [{
                        role: "advisor",
                        message: token_stream.current.join(""),
                    }, ...messages];

                    streaming_message = false;
                    token_stream.current = [];
                });
            }}
        >
            Send Message
        </Button>
    </div>
</div>
