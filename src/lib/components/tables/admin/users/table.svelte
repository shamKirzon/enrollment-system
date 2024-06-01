<script lang="ts">
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import { readable, type Writable } from 'svelte/store';
	import TableActions from './table-actions.svelte';
	import { capitalizeFirstLetter, formatName, getSelectedRowData } from '$lib';
	import { addSelectedRows } from 'svelte-headless-table/plugins';
	import TableCheckbox from './table-checkbox.svelte';
	import { Role, type User } from '$lib/types/user';
	import Link from './link.svelte';

	export let data: User[];
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
			accessor: ({ id, first_name, middle_name, last_name, suffix_name, role }) => {
				return {
					id,
					first_name,
					middle_name,
					last_name,
					suffix_name,
					role
				};
			},
			header: 'Name',
			cell: ({ value }) => {
				const { id, role, ...name } = value;

				if (role === Role.Student) {
					return createRender(Link, {
						url: `/users/students/${id}`,
						label: formatName(name)
					});
				}

				return formatName(name);
			}
		}),
		table.column({
			accessor: 'email',
			header: 'Email'
		}),
		table.column({
			accessor: 'contact_number',
			header: 'Contact Number'
		}),
		table.column({
			accessor: 'role',
			header: 'Role',
			cell: ({ value }) => {
				return capitalizeFirstLetter(value);
			}
		}),
		table.column({
			accessor: (user) => {
				return user;
			},
			header: '',
			cell: ({ value }) => {
				return createRender(TableActions, { user: value });
			}
		})
	]);

	$: ({ headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns));
	$: ({ selectedDataIds } = pluginStates.select);

	$: getSelectedRowData(data, selectedRows, $selectedDataIds, 'id');
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
