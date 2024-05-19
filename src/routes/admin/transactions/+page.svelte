<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import { TableTransactions } from '$lib/components/tables/admin';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

<ContentLayout>
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Transactions</Card.Title>
			<Card.Description>A list of transactions.</Card.Description>
		</Card.Header>
		<Card.Content>
			<TableTransactions data={data.resultTransactions?.data?.transactions || []} />
		</Card.Content>
	</Card.Root>
</ContentLayout>
