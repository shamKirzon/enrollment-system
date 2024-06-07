<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { FormSectionAssignment } from '$lib/components/forms';
	import { TableSectionAssignments } from '$lib/components/tables/admin';
	import { writable } from 'svelte/store';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import * as Dialog from '$lib/components/ui/dialog';
	import {
		StrandCombobox,
		YearLevelCombobox,
		AcademicYearsCombobox
	} from '$lib/components/combobox/index.js';
	import { toast } from 'svelte-sonner';
	import type { Result } from '$lib/types/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Dice from 'virtual:icons/fad/random-1dice';
	import { deleteData } from '$lib';
	import { invalidateAll } from '$app/navigation';
	import { EducationLevel } from '$lib/types/enrollment.js';

	export let data;

	const selectedRows = writable<string[]>([]);

	async function createSectionAssignments() {
		const payload = {
			year_level_id: data.selectedYearLevelId,
			academic_year_id: data.selectedAcademicYearId,
			strand_id: data.selectedStrandId
		};

		const response = await fetch('/api/sections/assignments', {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			toast.error('Failed to assign sections.');
			return;
		}

		const result: Result = await response.json();

		console.log(result.message);

		await invalidateAll()

		toast.success(result.message);
	}

	$: isShsSelected = data?.yearLevels?.some(({ id, education_level }) => {
		return id === data.selectedYearLevelId && education_level === EducationLevel.SeniorHighSchool;
	});
</script>

<div class="flex gap-2 justify-between">
	<div class="flex gap-2">
		<AcademicYearsCombobox
			academicYears={data.academicYears || []}
			selected={data.selectedAcademicYearId}
		/>
		<YearLevelCombobox yearLevels={data.yearLevels || []} selected={data.selectedYearLevelId} />
		<StrandCombobox strands={data.strands || []} selected={data.selectedStrandId} disabled={!isShsSelected} />
	</div>

	<Button on:click={createSectionAssignments} class="space-x-1">
		<Dice />
		<span> Assign </span>
	</Button>
</div>

<Card.Root>
	<Card.Header class="flex flex-row items-center justify-between space-y-0">
		<div class="space-y-1.5">
			<Card.Title>Section Assignments</Card.Title>
			<Card.Description>Students and their respective sections.</Card.Description>
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
						<Dialog.Title>Delete section assignments?</Dialog.Title>
						<Dialog.Description>
							This action cannot be undone. This will permanently delete the selected section
							assignments from the server.
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Footer>
						<Button on:click={() => deleteData($selectedRows, '/api/sections/assignments')}
							>Delete</Button
						>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>
		{/if}
	</Card.Header>
	<Card.Content>
		<TableSectionAssignments data={data.sectionAssignments || []} {selectedRows} />
	</Card.Content>
</Card.Root>
