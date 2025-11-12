<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import Button from '$lib/components/ui/button/button.svelte';

	import { login } from '$lib/supabase/user.svelte';

	import { SvelteToast } from '@zerodevx/svelte-toast'

	// Optionally set default options here
	const options = {}
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SvelteToast {options} />

<div class='w-screen h-screen'>

	<nav class='min-h-16 w-full flex bg-slate-950 items-center'>
		<Button onclick={() => { login() }} class='ml-auto mr-10' variant='outline'>Login</Button>
	</nav>
	
	{@render children()}
</div>

