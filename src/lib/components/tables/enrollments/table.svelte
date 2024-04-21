<script lang="ts">
	import type { EnrollmentWithDetails } from '$lib/types/enrollment';
	import { readable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import Badge from './badge.svelte';
	import { format } from 'date-fns';
	import TableActions from './table-actions.svelte';

	export let data: EnrollmentWithDetails[];

	$: table = createTable(readable(data));
	$: columns = table.createColumns([
		table.column({
			accessor: ({ first_name, middle_name, last_name }) => {
				return {
					first_name,
					middle_name,
					last_name
				};
			},
			header: 'Student',
			cell: ({ value }) => {
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
		table.column({
			accessor: 'payment_receipt_url',
			header: 'Payment Receipt'
		}),
		table.column({
			accessor: 'status',
			header: 'Status',
			cell: ({ value }) => {
				return createRender(Badge, { value });
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				return createRender(TableActions, { id: value });
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
