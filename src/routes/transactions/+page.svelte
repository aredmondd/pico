<script lang="ts">
	import { isAuthSessionMissingError } from '@supabase/supabase-js';

	let { data } = $props();

	const transactions = $state(data.transactions);
	const categories = $state(data.categories);
	const subcategories = $state(data.subcategories);

	// have a static list of all months, and display 'no rows found'
	//  if transactions with specified month do not exist within this data
	const months = [
		{ name: 'january', number: 1 },
		{ name: 'feburary', number: 2 },
		{ name: 'march', number: 3 },
		{ name: 'april', number: 4 },
		{ name: 'may', number: 5 },
		{ name: 'june', number: 6 },
		{ name: 'july', number: 7 },
		{ name: 'august', number: 8 },
		{ name: 'september', number: 9 },
		{ name: 'october', number: 10 },
		{ name: 'november', number: 11 },
		{ name: 'december', number: 12 }
	];

	// dynamically display the years based on the data we have
	const yearSet: Set<string> = new Set<string>();

	for (const t of transactions) {
		yearSet.add(t.date.slice(0, 4));
	}

	const years = Array.from(yearSet).sort().reverse();

	function getCategoryName(id: number): string {
		const category = categories.find((category) => category.id === id);
		return category ? category.name : '';
	}

	function getSubCategoriesName(id: number): string {
		const subcategory = subcategories.find((subcategory) => subcategory.id === id);
		return subcategory ? subcategory.name : '';
	}
</script>

{#snippet column(colName: string)}
	<th scope="col" class="px-6 py-2 font-light text-silver/50 uppercase">{colName}</th>
{/snippet}

{#snippet row(value: any, focus: boolean = false)}
	<td
		class={[
			'border-b border-silver/10 px-6 py-4',
			{ 'text-silver/85': focus, 'text-silver/50': !focus }
		]}>{value}</td
	>
{/snippet}

<div class="mx-36 mt-12">
	<div class="mb-4 flex justify-between">
		<div class="flex gap-4">
			<input
				type="text"
				class="border-1 border-silver/10 px-2 py-2"
				placeholder="search for a transaction"
			/>
			<select name="month" id="month-select" class="border border-silver/10 px-2">
				<option value="all months">all months</option>
				{#each months as month}
					<option value={month.number}>{month.name}</option>
				{/each}
			</select>
			<select name="year" id="year-select" class="border border-silver/10 px-2">
				<option value="0">all years</option>
				{#each years as year}
					<option value={year}>{year}</option>
				{/each}
			</select>
			<select name="category" id="category-select" class="border border-silver/10 px-2">
				<option value="0">all categories</option>
				{#each categories as category}
					<option value={category.id}>{category.name}</option>
				{/each}
			</select>
			<select name="subcategory" id="subcategory-select" class="border border-silver/10 px-2">
				<option value="0">all subcategories</option>
				{#each subcategories as subcategory}
					<option value={subcategory.id}>{subcategory.name}</option>
				{/each}
			</select>
		</div>

		<button class="border border-silver/10 bg-gray/10 px-2 text-silver">add a transaction</button>
	</div>
	<table class="w-full border-1 border-silver/10 text-left text-white">
		<thead class="border-b-1 border-silver/10 bg-gray/10">
			<tr>
				{@render column('Date')}
				{@render column('Description')}
				{@render column('Category')}
				{@render column('Subcategory')}
				{@render column('Amount')}
			</tr>
		</thead>
		<tbody>
			{#each transactions as transaction}
				<tr>
					{@render row(transaction.date)}
					{@render row(transaction.description, true)}
					{@render row(getCategoryName(transaction.category_id))}
					{@render row(getSubCategoriesName(transaction.subcategory_id))}
					{@render row('$' + transaction.amount)}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
