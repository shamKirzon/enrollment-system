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
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import type { Result } from '$lib/types/index.js';
	import { setContext } from 'svelte';
	import { deleteData } from '$lib';

	export let data;

	// const subjectUpdateFormData = data.subjectLevelData?.subject_levels.reduce((acc, obj) => {
	// 	const existingSubject = acc.find((item) => item.subject_id === obj.subject_id);
	// 	if (existingSubject) {
	// 		existingSubject.year_level_ids.push(obj.year_level_id);
	// 		existingSubject.strand_ids.push(obj.strand_id); // Use spread operator for unique elements
	// 	} else {
	// 		acc.push({
	// 			subject_id: obj.subject_id,
	// 			subject_name: obj.subject_name,
	// 			year_level_ids: [obj.year_level_id],
	// 			strand_ids: [obj.strand_id]
	// 		});
	// 	}
	// 	return acc;
	// }, []);

	// console.log(subjectUpdateFormData);

	const selectedRows = writable<string[]>([]);

	setContext('formSubject', data.form);
	setContext('yearLevels', data.yearLevelData?.year_levels || []);
	setContext('strands', data.strandData?.strands || []);
</script>

<ContentLayout>
	<Card.Root class="w-full">
		<Card.Header class="flex flex-row items-center justify-between">
			<div>
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
			<TableSubjects data={data.subjectData?.subjects || []} {selectedRows} />
		</Card.Content>
	</Card.Root>
</ContentLayout>
