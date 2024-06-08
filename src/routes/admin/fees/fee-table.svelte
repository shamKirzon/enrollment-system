<script lang="ts">
	import { type EnrollmentFeeLevelDetails, type TuitionPlanLevelDetails } from '$lib/types/enrollment';
	import { TableColumnSort } from '$lib/components/tables';
	import { readable, type Writable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import TableActions from './table-actions.svelte';
	import { addSelectedRows } from 'svelte-headless-table/plugins';
	import TableCheckbox from './table-checkbox.svelte';
	import { getSelectedRowData } from '$lib';

	export let data: TuitionPlanLevelDetails[];
	export let selectedRows: Writable<string[]>;

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
			accessor: 'tuition_plan_name',
			header: 'Tuition Plan'
		}),
		table.column({
			accessor: 'down_payment_amount',
			header: 'Down Payment'
		}),
		table.column({
			accessor: 'monthly_payment_amount',
			header: 'Monthly Payment'
		}),
		table.column({
			accessor: 'year_level_name',
			header: 'Year Level'
		}),
		// table.column({
		// 	accessor: (fee) => {
		// 		return fee;
		// 	},
		// 	header: '',
		// 	cell: ({ value }) => {
		// 		return createRender(TableActions, { fee: value });
		// 	}
		// })
	]);

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns));
	$: ({ selectedDataIds } = pluginStates.select);

	$: getSelectedRowData(data, selectedRows, $selectedDataIds, 'enrollment_fee_level_id');
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
