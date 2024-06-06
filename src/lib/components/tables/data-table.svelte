<script lang="ts">
	import { Column, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addSelectedRows, type AnyPlugins } from 'svelte-headless-table/plugins';
	import { readable, type Writable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import { getSelectedRowData } from '$lib';

	type Foo<T, L extends keyof T> = {
		bar: T[];
		baz: L;
	};

	export let data: Foo<any, any>;
	export let selectedRows: Writable<string[]>;
	export let columns: Column<unknown, AnyPlugins>[];

	$: table = createTable(readable(data.bar), {
		select: addSelectedRows()
	});

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns));
	$: ({ selectedDataIds } = pluginStates.select);

	$: getSelectedRowData(data.bar, selectedRows, $selectedDataIds, data.baz);
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
