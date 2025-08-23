<script lang="ts">
	let { data } = $props();

	const transactions = $state(data.transactions);
	const categories = $state(data.categories);
	const subcategories = $state(data.subcategories);
	const months = $state(data.months);

	console.log(months);
</script>

{#each months as month}
	<button class="rounded-md bg-silver p-2 text-gunmetal">{month.name}</button>
{/each}
