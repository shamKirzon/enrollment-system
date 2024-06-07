<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { DotsHorizontal } from 'svelte-radix';
	import * as Dialog from '$lib/components/ui/dialog';
	import EditIcon from 'virtual:icons/lucide/edit';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import { AcademicYearStatus, type AcademicYear } from '$lib/types/enrollment';
	import { getContext } from 'svelte';
	import type { AcademicYearSchema } from '$lib/schemas/enrollment';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { CreateAcademicYearForm } from '$lib/components/forms';
	import { deleteData } from '$lib';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import type { Result } from '$lib/types';

	export let academicYear: AcademicYear;

	const form = getContext<SuperValidated<Infer<AcademicYearSchema>>>('formAcademicYear');

	const isOpen = {
		edit: false,
		delete: false
	};

	async function deleteAcademicYear(): Promise<void> {
		await deleteData([academicYear.id], '/api/academic-years');

		isOpen.delete = false;
	}

	async function setAcademicYearStatus(status: AcademicYearStatus): Promise<void> {
		const response = await fetch(`/api/academic-years?id=${academicYear.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ ...academicYear, status }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const result: Result = await response.json();

		if (!response.ok) {
			toast.error(result.message);
			return;
		}

		await invalidateAll();

		toast.success(result.message);
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<DotsHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Label>Actions</DropdownMenu.Label>

		<DropdownMenu.Separator />

		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger>Set status</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent class="p-0" sideOffset={6}>
				<DropdownMenu.Item on:click={() => setAcademicYearStatus(AcademicYearStatus.Upcoming)}>
					Upcoming
				</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => setAcademicYearStatus(AcademicYearStatus.Open)}>
					Open
				</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => setAcademicYearStatus(AcademicYearStatus.Ongoing)}>
					Ongoing
				</DropdownMenu.Item>
				<DropdownMenu.Item on:click={() => setAcademicYearStatus(AcademicYearStatus.Finished)}>
					Finished
				</DropdownMenu.Item>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>

		<DropdownMenu.Separator />

		<DropdownMenu.Item on:click={() => (isOpen.edit = true)}>
			<span class="mr-auto"> Edit </span>
			<EditIcon />
		</DropdownMenu.Item>

		<DropdownMenu.Separator />

		<DropdownMenu.Item class="text-destructive" on:click={() => (isOpen.delete = true)}>
			<span class="mr-auto"> Delete </span>
			<DeleteIcon />
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root bind:open={isOpen.edit}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit an academic year</Dialog.Title>
		</Dialog.Header>

		<CreateAcademicYearForm data={form} {academicYear} mode="update" />
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={isOpen.delete}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete academic year?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete the academic year and all
				enrolled students from the server.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button on:click={deleteAcademicYear}>Delete</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
