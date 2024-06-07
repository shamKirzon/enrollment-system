<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import { TableSubjects } from '$lib/components/tables/admin';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import CirclePlusOutline from 'virtual:icons/flowbite/circle-plus-outline';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import { FormSubject } from '$lib/components/forms';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import { deleteData } from '$lib';
	import { Pagination } from '$lib/components';
	import { Search } from '$lib/components';
	import { YearLevelCombobox, StrandCombobox } from '$lib/components/combobox';

	export let data;

	const selectedRows = writable<string[]>([]);

	setContext('formSubject', data.form);
	setContext('yearLevels', data.yearLevelData.year_levels);
	setContext('strands', data.strandData.strands);
</script>

<ContentLayout class="flex-col gap-2">
	<div class="flex gap-2 justify-between">
		<Search placeholder="Search a subject..." />

		<div>
			<StrandCombobox strands={data.strandData.strands} selected={data.selectedStrandId} />
			<YearLevelCombobox
				yearLevels={data.yearLevelData.year_levels}
				selected={data.selectedYearLevelId}
			/>
		</div>
	</div>

	<Card.Root class="w-full">
		<Card.Header class="flex flex-row items-center justify-between space-y-0">
			<div class="space-y-1.5">
				<Card.Title>Subjects</Card.Title>
				<Card.Description>Description here</Card.Description>
			</div>

			{#if $selectedRows.length > 0}
				<Dialog.Root>
					<Dialog.Trigger asChild let:builder>
						<Button class="space-x-1" builders={[builder]}>
							<DeleteIcon />
							<span>Delete</span>
						</Button>
					</Dialog.Trigger>

					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Delete subjects?</Dialog.Title>
							<Dialog.Description>
								This action cannot be undone. This will permanently delete all selected subjects
								from the server.
							</Dialog.Description>
						</Dialog.Header>
						<Dialog.Footer>
							<Button on:click={() => deleteData($selectedRows, '/api/subjects')}>Delete</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			{:else}
				<Dialog.Root>
					<Dialog.Trigger asChild let:builder>
						<Button class="space-x-1" builders={[builder]}>
							<CirclePlusOutline />
							<span>Create</span>
						</Button>
					</Dialog.Trigger>

					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Create a new subject</Dialog.Title>
						</Dialog.Header>

						<FormSubject />
					</Dialog.Content>
				</Dialog.Root>
			{/if}
		</Card.Header>
		<Card.Content>
			<TableSubjects data={data.subjectDetailsData?.subjects || []} {selectedRows} />
		</Card.Content>
	</Card.Root>

	<Pagination count={data.subjectDetailsData?.count || 1} />
</ContentLayout>
