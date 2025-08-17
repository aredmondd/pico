<script lang="ts">
	const text = $state('heyyy');
</script>

{#snippet column(colName: string)}
	<th scope="col" class="px-6 py-2 font-light text-silver/50 uppercase">{colName}</th>
{/snippet}

{#snippet row(value: any, focus: boolean = false)}
	<td class="border-b-1 border-silver/50 px-6 py-4">{value}</td>
{/snippet}

<div class="mx-36 mt-12">
	<table class="w-full text-left text-white">
		<thead class="bg-gray/20">
			<tr>
				{@render column('Date')}
				{@render column('Description')}
				{@render column('Group')}
				{@render column('Category')}
				{@render column('Amount')}
				{@render column('Card')}
			</tr>
		</thead>
		<tbody>
			<tr>
				{@render row('8/15/2025')}
				{@render row('Print frames')}
				{@render row('Home')}
				{@render row('Decorations')}
				{@render row('$180.50')}
				{@render row('Debit')}
			</tr>
		</tbody>
	</table>
</div>
