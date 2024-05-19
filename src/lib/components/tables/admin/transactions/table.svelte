<script lang="ts">
	import type { Transaction } from '$lib/types/enrollment';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import PaymentReceipt from './payment-receipt.svelte';
	import { format } from 'date-fns';

	export let data: Transaction[];

	$: table = createTable(readable(data));

	$: columns = table.createColumns([
		table.column({
			accessor: 'created_at',
			header: 'Date',
			cell: ({ value }) => {
				const date = format(value, 'MMMM d, yyyy - h:mm a');

				return date;
			}
		}),
		table.column({
			accessor: 'amount',
			header: 'Amount'
		}),
		table.column({
			accessor: 'payment_receipt_url',
			header: 'Payment Receipt',
			cell: ({ value }) => {
				return createRender(PaymentReceipt, { paymentReceiptUrl: value });
			}
		})
	]);

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns));
</script>

<Table.Root {...$tableAttrs}>
	<Table.Header>
		{#each $headerRows as headerRow}
			<Subscribe rowAttrs={headerRow.attrs()}>
				<Table.Row>
					{#each headerRow.cells as cell (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
							<Table.Head {...attrs}>
								<Render of={cell.render()} />
							</Table.Head>
						</Subscribe>
					{/each}
				</Table.Row>
			</Subscribe>
		{/each}
	</Table.Header>
	<Table.Body {...$tableBodyAttrs}>
		{#each $pageRows as row (row.id)}
			<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
				<Table.Row {...rowAttrs}>
					{#each row.cells as cell (cell.id)}
						<Subscribe attrs={cell.attrs()} let:attrs>
							<Table.Cell {...attrs}>
								<Render of={cell.render()} />
							</Table.Cell>
						</Subscribe>
					{/each}
				</Table.Row>
			</Subscribe>
		{/each}
	</Table.Body>
</Table.Root>
