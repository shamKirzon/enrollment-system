<script lang="ts">
	import type { StudentSectionAssignment } from '$lib/types/enrollment';
	import { addSelectedRows } from 'svelte-headless-table/plugins';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable, type Writable } from 'svelte/store';
	import TableCheckbox from './table-checkbox.svelte';
	import { getSelectedRowData } from '$lib';
	import * as Table from '$lib/components/ui/table';

	export let data: StudentSectionAssignment[];
	export let selectedRows: Writable<string[]>;

	$: table = createTable(readable(data), {
		select: addSelectedRows()
	});

	$: columns = table.createColumns([
		table.column({
			accessor: 'section_assignment_id',
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
			accessor: ({ first_name, middle_name, last_name, suffix_name }) => {
				return {
					first_name,
					middle_name,
					last_name,
					suffix_name
				};
			},
			header: 'Student',
			cell: ({ value }) => {
				return `${value.last_name}, ${value.first_name}${value.middle_name ? ` ${value.middle_name}.` : ''}${value.suffix_name ? ` ${value.suffix_name}.` : ''}`;
			}
		}),
		table.column({
			accessor: 'section_name',
			header: 'Section',
			cell: ({ value }) => {
				return `St. ${value}`;
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
