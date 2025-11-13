<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	import Button from '$lib/components/ui/button/button.svelte';

	import { login, logout, user } from '$lib/supabase/user.svelte';

	import { SvelteToast } from '@zerodevx/svelte-toast'

	// Optionally set default options here
	const options = {}

	const routes = [
		{
			'name': 'Home',
			'route': '/'
		},
		{
			'name': 'Create Game',
			'route': '/create-game'
		}
	]
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SvelteToast {options} />

<div class="flex flex-col h-screen w-screen">
	<nav class="min-h-16 w-full flex bg-slate-950 items-center shrink-0">

		<div class='w-32'>

			<img 
				class='w-12 aspect-square ml-10 rounded-full'
				src={ user.current ? user.current.user_metadata.avatar_url : favicon } 
				alt=""
			>

		</div>

		<div class='grow flex justify-center gap-x-2'>

			{#each routes as r}
				<Button
					class='min-w-24'
					href={ r.route }
				>
					{ r.name }
				</Button>
			{/each}

		</div>

		<div class='w-32'>

			{#if !user.current}
	
				<Button onclick={login} class="" variant="outline">
					Login
				</Button>

			{:else}

				<Button onclick={logout} class="" variant="destructive">
					Logout
				</Button>

			{/if}

		</div>
	</nav>

	<!-- Let this fill the rest of the screen and handle its own scroll -->
	<div class="grow w-full overflow-hidden">
		{@render children()}
	</div>
</div>
