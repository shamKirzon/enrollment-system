<script lang="ts">
	import type { SubjectDetails } from '$lib/types/subject';
	import { Column, createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addSelectedRows, type AnyPlugins } from 'svelte-headless-table/plugins';
	import { readable, type Writable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import TableCheckbox from './table-checkbox.svelte';
	import TableActions from './table-actions.svelte';
	import { getSelectedRowData } from '$lib';

	type Foo<T> = Record<string, T>;

	export let data: Foo<unknown>[];
	export let selectedRows: Writable<string[]>;
	export let columnsData: Column<Foo<unknown>, AnyPlugins>[];
	// export let id: string;

	$: table = createTable(readable(data));

	$: columns = table.createColumns(columnsData);

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns));
	$: ({ selectedDataIds } = pluginStates.select);

	$: getSelectedRowData(data, selectedRows, $selectedDataIds, 'subject_id');
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
