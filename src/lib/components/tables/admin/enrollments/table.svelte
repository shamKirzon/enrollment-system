<script lang="ts">
	import { StudentStatus, type EnrollmentWithDetails } from '$lib/types/enrollment';
	import { TableColumnSort } from '$lib/components/tables';
	import { readable, type Writable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import Badge from './badge.svelte';
	import BadgeNewStudent from './badge-student-status.svelte';
	import { format } from 'date-fns';
	import TableActions from './table-actions.svelte';
	import { addSelectedRows } from 'svelte-headless-table/plugins';
	import TableCheckbox from './table-checkbox.svelte';
	import { getSelectedRowData } from '$lib';
	import Avatar from './avatar.svelte';
	import type { UserName } from '$lib/types/user';

	export let data: EnrollmentWithDetails[];
	export let selectedRows: Writable<string[]>;

	$: table = createTable(readable(data), {
		select: addSelectedRows()
	});

	$: columns = table.createColumns([
		table.column({
			accessor: 'enrollment_id',
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
			accessor: ({
				first_name,
				middle_name,
				last_name,
				suffix_name,
				student_status,
				avatar_url,
				student_id
			}) => {
				return {
					first_name,
					middle_name,
					last_name,
					suffix_name,
					student_status,
					avatar_url,
					student_id
				};
			},
			header: 'Student',
			cell: ({ value }) => {
				const { student_status, student_id, avatar_url, ...name } = value;

				// if (student_status === StudentStatus.New) {
				// 	return createRender(BadgeNewStudent, {
				// 		name: `${value.last_name}, ${value.first_name} ${value.middle_name ? `${value.middle_name}.` : ''}`
				// 	});
				// }

				return createRender(Avatar, { name, avatarUrl: avatar_url, studentStatus: student_status, studentId: student_id });

				// return `${value.last_name}, ${value.first_name} ${value.middle_name ? `${value.middle_name}.` : ''}`;
			}
		}),
		table.column({
			accessor: 'enrolled_at',
			header: () => {
				return createRender(TableColumnSort, {
					label: 'Enrollment Date',
					orderParam: 'enrolled_at_order'
				});
			},
			cell: ({ value }) => {
				const date = format(value, 'MMMM d, yyyy - h:mm a');

				return date;
			}
		}),
		table.column({
			accessor: ({ year_level_name, strand_id }) => {
				return {
					year_level_name,
					strand_id
				};
			},
			header: 'Level',
			cell: ({ value }) => {
				if (!value.strand_id) {
					return value.year_level_name;
				}

				return `${value.year_level_name} - ${value.strand_id.toUpperCase()}`;
			}
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
			accessor: (enrollment) => {
				return enrollment;
			},
			header: '',
			cell: ({ value }) => {
				return createRender(TableActions, { enrollment: value });
			}
		})
	]);

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns));
	$: ({ selectedDataIds } = pluginStates.select);

	$: getSelectedRowData(data, selectedRows, $selectedDataIds, 'enrollment_id');
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
