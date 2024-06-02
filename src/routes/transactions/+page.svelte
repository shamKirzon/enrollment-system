<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import Table from './table.svelte';
	import * as Card from '$lib/components/ui/card';
	import { Pagination } from '$lib/components';

	export let data;

	console.log(data.transactions.transactions)
</script>

<ContentLayout class="flex-col">
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Transactions</Card.Title>
			<Card.Description>History of your transactions.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Table data={data.transactions.transactions} />
		</Card.Content>
	</Card.Root>

	<Pagination count={data.transactions.count} />
</ContentLayout>
