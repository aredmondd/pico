<script lang="ts">
	let { data } = $props();

	import up from '$lib/up.svg';
	import down from '$lib/down.svg';

	const transactions = $state(data.transactions);
	const categories = $state(data.categories);
	const subcategories = $state(data.subcategories);
	const months = $state(data.months);

	const INCOME_ID = 10;

	let selectedMonth = $state(months[0]?.key);

	function getTransactionsForMonth(monthKey: string) {
		return transactions.filter((t) => monthKey === t.date.slice(0, 7));
	}

	function sumByCategoryAndSubcategory(monthKey: string) {
		const monthTransactions = getTransactionsForMonth(monthKey);

		const categoryMap: Record<
			string,
			{
				name: string;
				total: number;
				subcategories: Record<string, { name: string; total: number }>;
			}
		> = {};

		for (const transaction of monthTransactions) {
			const category = categories.find((c) => c.id === transaction.category_id);
			const subcategory = subcategories.find((s) => s.id === transaction.subcategory_id);

			if (!category) continue;

			if (!categoryMap[category.id]) {
				categoryMap[category.id] = {
					name: category.name,
					total: 0,
					subcategories: {}
				};
			}

			categoryMap[category.id].total += transaction.amount;

			if (subcategory) {
				if (!categoryMap[category.id].subcategories[subcategory.id]) {
					categoryMap[category.id].subcategories[subcategory.id] = {
						name: subcategory.name,
						total: 0
					};
				}
				categoryMap[category.id].subcategories[subcategory.id].total += transaction.amount;
			}
		}

		return categoryMap;
	}

	function getGrandTotal(monthKey: string) {
		return getTransactionsForMonth(monthKey)
			.filter((t) => t.category_id !== INCOME_ID)
			.reduce((sum, t) => sum + t.amount, 0);
	}

	function getMonthlyTotals() {
		const totals: Record<string, number> = {};
		for (const m of months) {
			totals[m.key] = getGrandTotal(m.key);
		}
		return totals;
	}

	function compareToPrevious(monthKey: string): 'up' | 'down' | null {
		const idx = months.findIndex((m) => m.key === monthKey);

		if (idx === -1 || idx === months.length - 1) return null; // no previous month

		const thisTotal = getGrandTotal(monthKey);
		const prevTotal = getGrandTotal(months[idx + 1].key); // next in array = previous month in time

		if (thisTotal > prevTotal) return 'up'; // spent more than previous month
		if (thisTotal < prevTotal) return 'down'; // spent less than previous month
		return null; // same
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

<div class="mt-12 flex">
	<div class="w-48 space-y-2 p-2 pr-12">
		{#each months as month}
			<button
				class="w-full rounded-md p-2 text-left font-medium transition
					   {selectedMonth === month.key
					? 'bg-gunmetal text-white shadow-sm'
					: 'bg-silver text-gunmetal hover:bg-gray-300'}"
				onclick={() => (selectedMonth = month.key)}
			>
				{month.name}
			</button>
		{/each}
	</div>

	<!-- Pivot table content -->
	<div class="flex-1 border border-silver/10">
		<table class="w-full border-collapse">
			<thead>
				<tr class="bg-gray/10 text-left text-white">
					{@render column('Category')}
					{@render column('Category')}
					{@render column('Category')}
				</tr>
			</thead>
			<tbody>
				{#each Object.values(sumByCategoryAndSubcategory(selectedMonth)) as cat}
					<tr class="border-t border-silver/10 font-semibold">
						{@render row(cat.name)}
						{@render row('—')}
						{@render row('$' + cat.total.toFixed(2), true)}
					</tr>
					{#each Object.values(cat.subcategories) as sub}
						<tr class="border-t border-silver/10">
							{@render row('')}
							{@render row(sub.name)}
							{@render row('$' + sub.total.toFixed(2))}
						</tr>
					{/each}
				{/each}

				<!-- Grand total row -->
				<tr class="border-t border-silver/10 bg-gray/20">
					{@render row('Grand Total')}
					{@render row('-')}
					<td class="px-4 py-2">
						<div class="flex items-center gap-1">
							<span>{'$' + getGrandTotal(selectedMonth).toFixed(2)}</span>
							{#if compareToPrevious(selectedMonth) === 'up'}
								<img src={up} alt="Up" class="w-6" />
							{:else if compareToPrevious(selectedMonth) === 'down'}
								<img src={down} alt="Down" class="w-6" />
							{/if}
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
