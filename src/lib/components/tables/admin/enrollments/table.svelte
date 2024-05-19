<script lang="ts">
	import { StudentStatus, type EnrollmentWithDetails } from '$lib/types/enrollment';
	import { readable, type Writable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import Badge from './badge.svelte';
	import BadgeNewStudent from './badge-student-status.svelte';
	import { format } from 'date-fns';
	import TableActions from './table-actions.svelte';
	import PaymentReceiptDialog from './payment-receipt-dialog.svelte';
	import { addSelectedRows } from 'svelte-headless-table/plugins';
	import TableCheckbox from './table-checkbox.svelte';

	export let data: EnrollmentWithDetails[];
	export let selectedRows: Writable<number[]>;

	$: table = createTable(readable(data), {
		select: addSelectedRows()
	});

	$: columns = table.createColumns([
		table.column({
			accessor: 'id',
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
			accessor: ({ first_name, middle_name, last_name, student_status }) => {
				return {
					first_name,
					middle_name,
					last_name,
					student_status
				};
			},
			header: 'Student',
			cell: ({ value }) => {
				if (value.student_status === StudentStatus.New) {
					return createRender(BadgeNewStudent, {
						name: `${value.last_name}, ${value.first_name} ${value.middle_name ? `${value.middle_name}.` : ''}`
					});
				}

				return `${value.last_name}, ${value.first_name} ${value.middle_name ? `${value.middle_name}.` : ''}`;
			}
		}),
		table.column({
			accessor: 'enrolled_at',
			header: 'Enrollment Date',
			cell: ({ value }) => {
				const date = format(value, 'MMMM d, yyyy - h:mm a');

				return date;
			}
		}),
		table.column({
			accessor: 'level',
			header: 'Level'
		}),
		// table.column({
		// 	accessor: ({ first_name, middle_name, last_name, payment_receipt_url }) => {
		// 		return {
		// 			first_name,
		// 			middle_name,
		// 			last_name,
		// 			payment_receipt_url
		// 		};
		// 	},
		// 	header: 'Payment Receipt',
		// 	cell: ({ value }) => {
		// 		const studentName = `${value.last_name}, ${value.first_name} ${value.middle_name ? `${value.middle_name}.` : ''}`;
		// 		const paymentReceiptUrl = value.payment_receipt_url;
		//
		// 		return createRender(PaymentReceiptDialog, { studentName, paymentReceiptUrl });
		// 	}
		// }),
		table.column({
			accessor: 'status',
			header: 'Status',
			cell: ({ value }) => {
				return createRender(Badge, { value });
			}
		}),
		table.column({
			accessor: ({ id, first_name, middle_name, last_name, payment_receipt_url }) => {
				return {
					id,
					first_name,
					middle_name,
					last_name,
					payment_receipt_url
				};
			},
			header: '',
			cell: ({ value }) => {
				const studentName = `${value.last_name}, ${value.first_name} ${value.middle_name ? `${value.middle_name}.` : ''}`;
				const paymentReceiptUrl = value.payment_receipt_url;

				return createRender(TableActions, { id: value.id, studentName, paymentReceiptUrl });
			}
		})
	]);

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns));
	$: ({ selectedDataIds } = pluginStates.select);

	function getSelectedRowData(selectedData: Record<string, boolean>): void {
		if (!selectedData) return;

		const keys = Object.keys(selectedData || []);

		$selectedRows = [];

		keys.forEach((idx) => {
			const i = Number(idx);

			selectedRows.update(($row) => {
				$row.push(data[i].id);

				return $row;
			});
		});
	}

	$: getSelectedRowData($selectedDataIds);
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
