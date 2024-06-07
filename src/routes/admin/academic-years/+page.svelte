<script lang="ts">
	import { Pagination } from '$lib/components';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { AcademicYearsTable } from '$lib/components/tables/admin';
	import { Button } from '$lib/components/ui/button';
	import CirclePlusOutline from 'virtual:icons/flowbite/circle-plus-outline';
	import { CreateAcademicYearForm } from '$lib/components/forms';
	import { ContentLayout } from '$lib/components/layouts';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { deleteData } from '$lib';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';

	export let data;

	const selectedRows = writable<number[]>([]);

	setContext('formAcademicYear', data.form);
</script>

<ContentLayout>
	<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0">
				<div class="space-y-1.5">
					<Card.Title>Academic Years</Card.Title>
					<Card.Description>All academic years.</Card.Description>
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
								<Dialog.Title>Delete academic years?</Dialog.Title>
								<Dialog.Description>
									This action cannot be undone. This will permanently delete all selected academic
									years and it's related data from the server.
								</Dialog.Description>
							</Dialog.Header>
							<Dialog.Footer>
								<Button on:click={() => deleteData($selectedRows, '/api/academic-years')}
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
								<Dialog.Title>Create a new academic year</Dialog.Title>
							</Dialog.Header>

							<CreateAcademicYearForm data={data.form} />
						</Dialog.Content>
					</Dialog.Root>
				{/if}
			</Card.Header>
			<Card.Content>
				<AcademicYearsTable data={data.academicYears?.academic_years || []} {selectedRows} />
			</Card.Content>
		</Card.Root>

		<Pagination count={data.academicYears?.count || 0} />
	</div>
</ContentLayout>
