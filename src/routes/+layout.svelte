<script lang="ts">
	import '../app.css';
	import icon from '$lib/favicon.ico';

	let { children } = $props();
</script>

<div class="flex items-center justify-between">
	<div>
		<!-- <h1
			class="bg-[linear-gradient(90deg,rgba(170,140,40,1)_0%,rgba(212,175,55,1)_35%,rgba(255,240,120,1)_50%,rgba(212,175,55,1)_65%,rgba(170,140,40,1)_100%)] bg-clip-text font-serif text-7xl text-transparent italic"
		>
			pico
		</h1> -->
		<a
			href="/"
			class="bg-[linear-gradient(90deg,rgba(120,120,120,1)_0%,#BFC0C0_35%,rgba(230,230,230,1)_50%,#BFC0C0_65%,rgba(120,120,120,1)_100%)] bg-clip-text font-serif text-6xl text-transparent italic"
		>
			pico
		</a>
	</div>

	<div class="flex gap-6 text-lg">
		<a href="/dashboard">dashboard</a>
		<a href="/transactions">transactions</a>
	</div>
</div>

<svelte:head>
	<link rel="icon" href={icon} />
</svelte:head>

{@render children?.()}
