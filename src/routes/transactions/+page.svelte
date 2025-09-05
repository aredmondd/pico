<script lang="ts">
	import type { Transaction } from '$lib/database.js';

	let { data } = $props();

	const INCOME_ID = 10;

	const transactions = $state(data.transactions);
	const categories = $state(data.categories);
	const subcategories = $state(data.subcategories);

	// have a static list of all months, and display 'no rows found'
	//  if transactions with specified month do not exist within this data
	const months = [
		{ name: 'january', number: '01' },
		{ name: 'feburary', number: '02' },
		{ name: 'march', number: '03' },
		{ name: 'april', number: '04' },
		{ name: 'may', number: '05' },
		{ name: 'june', number: '06' },
		{ name: 'july', number: '07' },
		{ name: 'august', number: '08' },
		{ name: 'september', number: '09' },
		{ name: 'october', number: '10' },
		{ name: 'november', number: '11' },
		{ name: 'december', number: '12' }
	];

	// dynamically display the years based on the data we have
	const yearSet: Set<string> = new Set<string>();

	for (const t of transactions) {
		yearSet.add(t.date.slice(0, 4));
	}

	const years = Array.from(yearSet).sort().reverse();

	// convert ids into names
	function getCategoryName(id: number): string {
		const category = categories.find((category) => category.id === id);
		return category ? category.name : '';
	}

	function getSubCategoriesName(id: number): string {
		const subcategory = subcategories.find((subcategory) => subcategory.id === id);
		return subcategory ? subcategory.name : '';
	}

	// search & filter functionality
	let searchQuery = $state('');
	let selectedMonth = $state(String(new Date().getMonth() + 1).padStart(2, '0'));
	let selectedYear = $state(String(new Date().getFullYear()));
	let selectedCategory = $state(0);
	let selectedSubCategory = $state(0);

	function getFilteredTransactions(): Transaction[] {
		const query = searchQuery.toLowerCase().trim();

		return transactions.filter((transaction) => {
			const matchesDescription = !query || transaction.description.toLowerCase().includes(query);
			const matchesMonth = selectedMonth === '00' || selectedMonth === transaction.date.slice(5, 7);
			const matchesYear = selectedYear === '00' || selectedYear === transaction.date.slice(0, 4);
			const matchesCategory =
				selectedCategory === 0 || selectedCategory === transaction.category_id;
			const matchesSubCategory =
				selectedSubCategory === 0 || selectedSubCategory === transaction.subcategory_id;

			return (
				matchesDescription && matchesMonth && matchesYear && matchesCategory && matchesSubCategory
			);
		});
	}

	// sum of transactions
	let sumOfTransactions = $derived(
		getFilteredTransactions()
			.filter((t) => t.category_id !== INCOME_ID)
			.reduce((sum, t) => sum + t.amount, 0)
	);

	// modal & form stuff
	let isOpen = $state(false);

	function handleClose() {
		isOpen = false;
		inputAmount = '$0.00';
		inputAmountArray = [];
		amountFieldKey++;
	}

	function handleOpen() {
		isOpen = true;
	}

	let inputDate = $state(null);
	let inputAmount = $state('$0.00');
	let inputDescription = $state(null);
	let selectedCategoryId = $state(null);
	let selectedSubCategoryId = $state(null);

	let filteredSubCategories = $derived(() => {
		return subcategories.filter((subcategory) => subcategory.category_id === selectedCategoryId);
	});

	$effect(() => {
		if (selectedCategoryId) {
			selectedSubCategoryId = null;
		}
	});

	// amount stuff
	let inputAmountArray: string[] = $state([]);
	let amountFieldKey: number = $state(0);

	function handleAmountInput(event: Event) {
		let formattedValue: string = '';

		if (event.inputType === 'deleteContentBackward') {
			if (inputAmountArray.length <= 1) {
				formattedValue = '$0.00';
				document.getElementById('amountInput').value = formattedValue;
				inputAmountArray = [];
				return;
			} else {
				inputAmountArray.pop();
			}
		} else {
			inputAmountArray.push(inputAmount.substring(inputAmount.length - 1, inputAmount.length));
		}

		if (inputAmountArray.length == 1) {
			formattedValue = `$0.0${inputAmountArray[inputAmountArray.length - 1]}`;
		} else if (inputAmountArray.length == 2) {
			formattedValue = `$0.${inputAmountArray[inputAmountArray.length - 2]}${inputAmountArray[inputAmountArray.length - 1]}`;
		} else if (inputAmountArray.length == 3) {
			formattedValue = `$${inputAmountArray[inputAmountArray.length - 3]}.${inputAmountArray[inputAmountArray.length - 2]}${inputAmountArray[inputAmountArray.length - 1]}`;
		}
		// anything larger than $9.99
		else {
			formattedValue += '$';
			for (let i = 0; i < inputAmountArray.length; i++) {
				if (i === inputAmountArray.length - 2) {
					formattedValue += '.';
				}
				formattedValue += inputAmountArray[i];
			}
		}
		// update the value to be the formatted string
		document.getElementById('amountInput').value = formattedValue;
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
				bind:value={searchQuery}
			/>
			<select
				name="month"
				id="month-select"
				class="border border-silver/10 px-2"
				bind:value={selectedMonth}
			>
				<option value="00">all months</option>
				{#each months as month}
					<option value={month.number}>{month.name}</option>
				{/each}
			</select>
			<select
				name="year"
				id="year-select"
				class="border border-silver/10 px-2"
				bind:value={selectedYear}
			>
				<option value="00">all years</option>
				{#each years as year}
					<option value={year}>{year}</option>
				{/each}
			</select>
			<select
				name="category"
				id="category-select"
				class="border border-silver/10 px-2"
				bind:value={selectedCategory}
			>
				<option value={0}>all categories</option>
				{#each categories as category}
					<option value={category.id}>{category.name}</option>
				{/each}
			</select>
			<select
				name="subcategory"
				id="subcategory-select"
				class="border border-silver/10 px-2"
				bind:value={selectedSubCategory}
			>
				<option value={0}>all subcategories</option>
				{#each subcategories as subcategory}
					<option value={subcategory.id}>{subcategory.name}</option>
				{/each}
			</select>
		</div>

		<button
			class="border border-silver/10 bg-gray/10 px-2 text-3xl text-silver"
			onclick={handleOpen}>+</button
		>
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
			{#each getFilteredTransactions() as transaction}
				<tr>
					{@render row(transaction.date)}
					{@render row(transaction.description, true)}
					{@render row(getCategoryName(transaction.category_id))}
					{@render row(getSubCategoriesName(transaction.subcategory_id))}
					{@render row('$' + transaction.amount)}
				</tr>
			{/each}
			{#if getFilteredTransactions().length === 0}
				{@render row('no results found...')}
			{:else}
				<!-- i'm aware this is so ghetto i'm sorry you have to see this... but it does work... -->
				<tr class="border-b border-silver/10 font-bold text-silver/85">
					<td></td>
					<td></td>
					<td></td>
					<td class="px-6 py-4">TOTAL:</td>
					<td class="px-6 py-4">{`$${Math.round(sumOfTransactions * 100) / 100}`}</td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>

{#if isOpen}
	<div role="dialog" aria-modal="true" class="relative z-10">
		<div aria-hidden="true" class="fixed inset-0 bg-gray/75"></div>

		<div class="overflow y-auto fixed inset-0 z-10 w-screen">
			<div class="flex min-h-full items-center justify-center p-4">
				<div class="relative w-full max-w-lg transform overflow-hidden bg-silver shadow-xl">
					<form class="mx-12 px-4 py-12 text-gunmetal" method="POST" action="?/create">
						<button
							class="absolute top-1 right-1 px-2 py-1 text-2xl font-semibold text-gunmetal"
							onclick={handleClose}>X</button
						>
						<h1 class="text-3xl">add a transaction</h1>
						<div class="my-6 flex flex-col gap-2">
							<input
								class="border px-2 py-1"
								type="date"
								name="date"
								required
								bind:value={inputDate}
							/>
							<input
								class="border px-2 py-1"
								type="text"
								name="description"
								placeholder="description"
								bind:value={inputDescription}
								required
							/>
							<select
								class="border px-2 py-1"
								required
								bind:value={selectedCategoryId}
								name="categoryId"
							>
								<option value={null}>select a category...</option>
								{#each categories as category}
									<option value={category.id}>{category.name}</option>
								{/each}
							</select>
							{#if !selectedCategoryId}
								<select class="border bg-gunmetal/15 px-2 py-1 text-gunmetal/50" disabled>
									<option value="">select a subcategory...</option>
								</select>
							{:else}
								<select
									class="border px-2 py-1"
									bind:value={selectedSubCategoryId}
									required
									name="subcategoryId"
								>
									<option value={null}>select a subcategory...</option>
									{#each filteredSubCategories() as subcategory}
										<option value={subcategory.id}>{subcategory.name}</option>
									{/each}
								</select>
							{/if}
							{#key amountFieldKey}
								<input
									id="amountInput"
									class="border px-2 py-1"
									name="amount"
									placeholder="amount"
									bind:value={inputAmount}
									oninput={handleAmountInput}
									required
								/>
							{/key}
						</div>
						<button class="bg-gunmetal px-2 py-1 text-silver">add</button>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}
