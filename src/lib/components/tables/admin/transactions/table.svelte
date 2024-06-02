<script lang="ts">
	import type { TransactionDetails } from '$lib/types/payment';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable, type Writable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import PaymentReceipt from './payment-receipt.svelte';
	import { format } from 'date-fns';
	import { addSelectedRows } from 'svelte-headless-table/plugins';
	import TableCheckbox from './table-checkbox.svelte';
	import { capitalizeFirstLetter, getSelectedRowData } from '$lib';
	import TableActions from './table-actions.svelte';
	import { TableColumnSort } from '$lib/components/tables';

	export let data: TransactionDetails[];
	export let selectedRows: Writable<string[]>;

	$: table = createTable(readable(data), {
		select: addSelectedRows()
	});

	$: columns = table.createColumns([
		table.column({
			accessor: 'transaction_id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(TableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(TableCheckbox, {
					checked: isSelected
				});
			}
		}),
		table.column({
			accessor: 'created_at',
			header: () => {
				return createRender(TableColumnSort, {label: "Date", orderParam: "date_order"})
			},
			cell: ({ value }) => {
				const date = format(value, 'MMMM d, yyyy - h:mm a');

				return date;
			}
		}),
		table.column({
			accessor: 'transaction_number',
			header: 'Transaction Number'
		}),
		table.column({
			accessor: 'payment_method',
			header: 'Payment Method',
			cell: ({value}) => {
				return capitalizeFirstLetter(value)
			}
		}),
		table.column({
			accessor: 'payment_amount',
			header: 'Amount',
			cell: ({ value }) => {
				return `Php. ${value}`;
			}
		}),
		table.column({
			accessor: 'payment_receipt_url',
			header: 'Payment Receipt',
			cell: ({ value }) => {
				return createRender(PaymentReceipt, { paymentReceiptUrl: value });
			}
		}),
		table.column({
			accessor: (transaction) => {
				return transaction;
			},
			header: '',
			cell: ({ value }) => {
				return createRender(TableActions, { transaction: value });
			}
		})
	]);

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns));
	$: ({ selectedDataIds } = pluginStates.select);

	$: getSelectedRowData(data, selectedRows, $selectedDataIds, 'transaction_id');
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
