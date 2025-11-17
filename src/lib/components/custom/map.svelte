<script lang='ts'>
    import { STRATEGY_MAP_COLORS } from "./mapColors";

    import {
        Crown,
        Triangle,
        Sword,
        Castle,
        Waves,
        Maximize as FS,
        X,
    } from '@lucide/svelte'

    import Fullscreen from "svelte-fullscreen";
    import Button from "../ui/button/button.svelte";

    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import Label from "../ui/label/label.svelte";

    let {
        game
    } = $props()

    let faction_order = $derived(game?.factions?.map((f) => f.faction_id))

    function getFactionColor(faction_id: string) {
        return STRATEGY_MAP_COLORS[
            faction_order.indexOf(faction_id)
        ]
    }

    let width = $state(0)
    let height = $state(0)
    let fullscreen = $state(false)

    let fsButtonWidth = $state(0);


    // Toggles for map
    let map_config = $state({
        army: true,
        city: true,
        port: true,
        fort: true,
        fullscreen: true,
    })

</script>

<!-- As game is initialy null -->
{#if game}

<Fullscreen on:change={() => {fullscreen = !fullscreen}} let:onRequest let:onExit>
    <div
        bind:clientWidth={width}
        bind:clientHeight={height}
        class='w-9/10 h-7/10 md:w-7/10 md:h-4/5 flex flex-col md:flex-row gap-2'
    >
        <div
            class='w-full h-full flex items-center justify-center'
        >


            <svg
            width={width - 20}
            height={height - 20}
            class=""
        >

            <!-- 1. PROVINCES -->
            {#each game.provinces as p}
                <polygon 
                    points={p.border.map((b) => `${b[0] * (width - 20)},${b[1] * (height - 20)}`).join(' ')}
                    style={`
                        fill:${p.is_ocean ? 'cyan' : getFactionColor(p.faction_id)};
                        stroke-width: 1;
                        stroke:black;
                    `}
                />
                {#if fullscreen}
                    <text
                        x={p.centriod[0] * (width - 20)}
                        y={p.centriod[1] * (height - 20) + 20}
                        transform={`rotate(-45 ${p.centriod[0] * (width - 20)} ${p.centriod[1] * (height - 20)})`}
                        class={`fill-current text-xl text-slate-800/50`}
                        text-anchor="middle"
                        dominant-baseline="middle"
                    >
                        {p?.name}
                    </text>
                {/if}
            {/each}

            {#if map_config.city}

                <!-- 2. CITIES -->
                {#each game.provinces as p}
                    {#if p?.city?.is_capital}
                        <g transform="translate({p.centriod[0] * (width - 20) - 8.5}, {p.centriod[1] * (height - 20) - 8.5})">
                            <Crown size={17} class="fill-amber-300" />
                        </g>
                    {:else if p?.city}
                        <g transform="translate({p.centriod[0] * (width - 20) - 8.5}, {p.centriod[1] * (height - 20) - 8.5})">
                            <Triangle size={17} class="fill-black" />
                        </g>
                    {/if}
                {/each}
            {/if}

            <!-- 3. ARMIES, Forts, and Ports (ALWAYS ON TOP) -->
            {#each game.provinces as p}
                
                {#if map_config.army}
                    <foreignObject 
                        x={p.centriod[0] * (width - 20)}
                        y={p.centriod[1] * (height - 20)}
                        width="200"
                        height="200"
                    >
                        <div xmlns="http://www.w3.org/1999/xhtml" class="flex flex-col">
                            {#each p.army as a}
                                <div class="flex items-center bg-white/20 rounded-md w-fit p-1">
                                    <div
                                    class='bg-white rounded-full w-1 aspect-square self-start'
                                    >
                                    </div>
                                    <Sword 
                                        size={15}
                                        fill={getFactionColor(a.faction_id)}
                                    />
                                    <small>
                                        {a.numbers}
                                    </small>
                                </div>
                            {/each}
                        </div>
                    </foreignObject>
                {/if}
                {#if map_config.fort && p.fort}
                    <foreignObject 
                        x={p.centriod[0] * (width - 20) - 20}
                        y={p.centriod[1] * (height - 20) - 15}
                        width="200"
                        height="200"
                    >
                        <div xmlns="http://www.w3.org/1999/xhtml" class="">
                            <div class="">
                                <Castle
                                    size={14}
                                    fill='black'
                                />
                            </div>
                        </div>
                    </foreignObject>
                {/if}
                {#if map_config.port && p.port}
                    <foreignObject 
                        x={p.centriod[0] * (width - 20) - 20}
                        y={p.centriod[1] * (height - 20)}
                        width="200"
                        height="200"
                    >
                        <div xmlns="http://www.w3.org/1999/xhtml" class="">
                            <div class="">
                                <Waves
                                    size={14}
                                    class='stroke-blue-800'
                                />
                            </div>
                        </div>
                    </foreignObject>
                {/if}
                <!-- Full screen -->
                {#if map_config.fullscreen}
                    <foreignObject 
                            x={(width - 20) - 36}
                            y={0}
                            width="200"
                            height="200"
                        >
                            <div xmlns="http://www.w3.org/1999/xhtml" class="">
                                {#if !fullscreen}
                                    <Button size='icon' onclick={() => {onRequest()}}><FS size={10} /></Button>
                                {:else}
                                    <Button size='icon' onclick={() => {onExit()}}><X size={10} /></Button>
                                {/if}
                            </div>
                    </foreignObject>
                {/if}
            {/each}
                
            </svg>
        </div>
        
        
        <!-- Toggles -->
        <div
            class='flex md:flex-col justify-center gap-4'
        >
            <div
                class='flex gap-x-1'
            >
            <Checkbox bind:checked={map_config.army} />
                <Label
                >
                    <Sword 
                        class='bg-white/50 rounded p-0.5'
                        size={14}
                        fill='black'
                    />
                    Armys
                </Label>
            </div>
            <div
                class='flex gap-x-1'
            >
                <Checkbox bind:checked={map_config.city} />
                <Label>
                    <Triangle 
                        class='bg-white/50 rounded p-0.5 fill-black'
                        size={14} 
                    />
                    Citys
                </Label>
            </div>
            <div
                class='flex gap-x-1'
            >
                <Checkbox bind:checked={map_config.fort} />
                <Label>
                    <Castle
                        class='bg-white/50 rounded p-0.5'
                        size={14}
                        fill='black'
                    />
                    Forts
                </Label>
            </div>
            <div
                class='flex gap-x-1'
            >
                <Checkbox bind:checked={map_config.port} />
                <Label>
                    <Waves
                        size={14}
                        class='stroke-blue-800 bg-white/50 rounded p-0.5'
                    />
                    Ports
                </Label>
            </div>
            <div
                class='flex gap-x-1'
            >
                <Checkbox bind:checked={map_config.fullscreen} />
                <Label>
                    <FS
                        size={14}
                        class=' bg-white/50 rounded p-0.5'
                    />
                    Fullscreen
                </Label>
            </div>


        </div>
    </div>
</Fullscreen>
    

{/if}