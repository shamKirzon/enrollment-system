<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts/index.js';
	import { EnrollmentsTable } from '$lib/components/tables/admin';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import CirclePlusOutline from 'virtual:icons/flowbite/circle-plus-outline';
	import {
		AcademicYearsCombobox,
		EnrollmentStatusCombobox,
		StrandCombobox,
		YearLevelCombobox
	} from '$lib/components/combobox';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import { EnrollmentsPagination } from '$lib/components/paginations';
	import { writable } from 'svelte/store';
	import { deleteData } from '$lib';

	export let data;

	const academicYears = data.academicYears.map((ay) => {
		return {
			id: ay.id,
			start_at: ay.start_at,
			end_at: ay.end_at
		};
	});

	const selectedRows = writable<string[]>([]);
</script>

<ContentLayout class="flex-col">
	<div class="flex gap-2 justify-between">
		<div class="flex gap-2">
			<AcademicYearsCombobox {academicYears} selected={data.selectedAcademicYearId} />
			<YearLevelCombobox yearLevels={data.yearLevels} selected={data.selectedYearLevelId} />
			<StrandCombobox strands={data.strands} selected={data.selectedStrandId} />
		</div>
		<EnrollmentStatusCombobox selected={data.selectedEnrollmentStatus} />
	</div>

	<div class="flex w-full h-full flex-col gap-2">
		<Card.Root class="w-full h-full flex flex-col overflow-y-auto">
			<Card.Header class="flex flex-row items-center justify-between space-y-0">
				<div class="space-y-1.5">
					<Card.Title>Enrollments</Card.Title>
					<Card.Description>A list of enrolled students.</Card.Description>
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
								<Dialog.Title>Delete enrollments?</Dialog.Title>
								<Dialog.Description>
									This action cannot be undone. This will permanently delete the enrollments of all
									selected students from the server.
								</Dialog.Description>
							</Dialog.Header>
							<Dialog.Footer>
								<Button on:click={() => deleteData($selectedRows, '/api/enrollments')}
									>Delete</Button
								>
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
								<Dialog.Title>Create a new enrollment entry</Dialog.Title>
							</Dialog.Header>
						</Dialog.Content>
					</Dialog.Root>
				{/if}
			</Card.Header>
			<Card.Content class="h-full overflow-y-auto flex flex-col">
				<EnrollmentsTable data={data.enrollments} {selectedRows} />
			</Card.Content>
		</Card.Root>

		<EnrollmentsPagination count={data.enrollmentCount} />
	</div>
</ContentLayout>
