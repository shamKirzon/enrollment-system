<script lang="ts">
	import { type AcademicYearWithStudentCount } from '$lib/types/enrollment';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import { readable } from 'svelte/store';
	import TableActions from './table-actions.svelte';
	import { capitalizeFirstLetter } from '$lib';
	import { Badge } from '$lib/components/ui/badge';
	import { academicYearStatusMap } from './utils';

	export let data: AcademicYearWithStudentCount[];

	const table = createTable(readable(data));
	const columns = table.createColumns([
		table.column({
			accessor: 'year',
			header: 'Year'
		}),
		table.column({
			accessor: 'start_at',
			header: 'Start'
		}),
		table.column({
			accessor: 'end_at',
			header: 'End'
		}),
		table.column({
			accessor: 'student_count',
			header: 'Student Count'
		}),
		table.column({
			accessor: 'status',
			header: 'Status',
			cell: ({ value }) => {
				return capitalizeFirstLetter(value);
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

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
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
								{#if cell.id === 'status'}
									{@const status = academicYearStatusMap.get(cell.value)}

									<Badge class={`text-xs space-x-1 ${status?.color}`} variant={status?.variant}>
										<svelte:component this={status?.icon} />
										<span>
											<Render of={cell.render()} />
										</span>
									</Badge>
								{:else}
									<Render of={cell.render()} />
								{/if}
							</Table.Cell>
						</Subscribe>
					{/each}
				</Table.Row>
			</Subscribe>
		{/each}
	</Table.Body>
</Table.Root>
