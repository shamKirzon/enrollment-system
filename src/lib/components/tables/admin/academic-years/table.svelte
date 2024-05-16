<script lang="ts">
	import { type AcademicYearWithStudentCount } from '$lib/types/enrollment';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import { readable } from 'svelte/store';
	import TableActions from './table-actions.svelte';
	import { capitalizeFirstLetter } from '$lib';
	import { Badge } from '$lib/components/ui/badge';
	import { academicYearStatusMap } from './utils';
	import { format } from 'date-fns';

	export let data: AcademicYearWithStudentCount[];

	$: table = createTable(readable(data));
	$: columns = table.createColumns([
		table.column({
			accessor: ({ start_at, end_at }) => {
				return {
					start_at,
					end_at
				};
			},
			header: 'Year',
			cell: ({ value }) => {
				return `${format(value.start_at, 'yyyy')}-${format(value.end_at, 'yyyy')}`;
			}
		}),
		table.column({
			accessor: 'start_at',
			header: 'Start',
			cell: ({ value }) => {
				return `${format(value, 'MMMM')} ${format(value, 'd')}`;
			}
		}),
		table.column({
			accessor: 'end_at',
			header: 'End',
			cell: ({ value }) => {
				return `${format(value, 'MMMM')} ${format(value, 'd')}`;
			}
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
			accessor: ({ id, start_at, end_at, status }) => {
				return {
					id,
					start_at,
					end_at,
					status
				};
			},
			header: '',
			cell: ({ value }) => {
				return createRender(TableActions, { academicYear: value });
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
