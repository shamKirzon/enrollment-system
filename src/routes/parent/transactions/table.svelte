
<script lang="ts">
	import type { TransactionDetails } from '$lib/types/payment';
	import * as Table from '$lib/components/ui/table';
	import { capitalizeFirstLetter } from '$lib';

	export let data: TransactionDetails[];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Date</Table.Head>
			<Table.Head>Transaction Number</Table.Head>
			<Table.Head>Payment Method</Table.Head>
			<Table.Head>Amount</Table.Head>
			<Table.Head>Payment Receipt</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data as transaction (transaction.transaction_id)}
			<Table.Row>
				<Table.Cell>{transaction.created_at}</Table.Cell>
				<Table.Cell>{transaction.transaction_number}</Table.Cell>
				<Table.Cell>{capitalizeFirstLetter(transaction.payment_method)}</Table.Cell>
				<Table.Cell>{transaction.payment_amount}</Table.Cell>
				<Table.Cell>
					<a
						class="line-clamp-1 max-w-40 text-start underline text-blue-600"
						href={transaction.payment_receipt_url}
						target="_blank"
						rel="noreferrer"
					>
						{transaction.payment_receipt_url}
					</a>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
