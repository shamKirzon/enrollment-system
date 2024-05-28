<script lang="ts">
	import type { SectionLevelDetails } from '$lib/types/enrollment';
	import { addSelectedRows } from 'svelte-headless-table/plugins';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable, type Writable } from 'svelte/store';
	import TableCheckbox from './table-checkbox.svelte';
	import { getSelectedRowData } from '$lib';
	import * as Table from '$lib/components/ui/table';
	import TableActions from './table-actions.svelte';

	export let data: SectionLevelDetails[];
	export let selectedRows: Writable<string[]>;

	$: table = createTable(readable(data), {
		select: addSelectedRows()
	});

	$: columns = table.createColumns([
		table.column({
			accessor: 'section_id',
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
			accessor: 'section_name',
			header: 'Section',
			cell: ({ value }) => {
				return `St. ${value}`;
			}
		}),
		table.column({
			accessor: 'year_level_name',
			header: 'Year Level',
			cell: ({ value }) => {
				if (!value) {
					return '---';
				}

				return value;
			}
		}),
		table.column({
			accessor: 'strand_name',
			header: 'Strand',
			cell: ({ value }) => {
				if (!value) {
					return '---';
				}

				return value;
			}
		}),
		table.column({
			accessor: ({
				adviser_first_name,
				adviser_middle_name,
				adviser_last_name,
				adviser_suffix_name,
				adviser_id
			}) => {
				return {
					adviser_first_name,
					adviser_middle_name,
					adviser_last_name,
					adviser_suffix_name,
					adviser_id
				};
			},
			header: 'Adviser',
			cell: ({ value }) => {
				if (!value.adviser_id) {
					return '---';
				}

				return `${value.adviser_last_name}, ${value.adviser_first_name}${value.adviser_middle_name ? ` ${value.adviser_middle_name}.` : ''}${value.adviser_suffix_name ? ` ${value.adviser_suffix_name}.` : ''}`;
			}
		}),
		table.column({
			accessor: (value) => {
				return value;
			},
			header: '',
			cell: ({ value }) => {
				return createRender(TableActions, { section: value });
			}
		})
	]);

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns));
	$: ({ selectedDataIds } = pluginStates.select);

	$: getSelectedRowData(data, selectedRows, $selectedDataIds, 'section_id');
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
