<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { DotsHorizontal } from 'svelte-radix';
	import * as Dialog from '$lib/components/ui/dialog';
	import EditIcon from 'virtual:icons/lucide/edit';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import type { SectionLevelDetails } from '$lib/types/enrollment';
	import { FormSection } from '$lib/components/forms';
	import { deleteData } from '$lib';

	export let section: SectionLevelDetails;

	const isOpen = {
		edit: false,
		delete: false
	};

	async function deleteSection(): Promise<void> {
		await deleteData([section.section_id], '/api/sections');

		isOpen.delete = false;
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
		<DropdownMenu.Item on:click={() => (isOpen.edit = true)}>
			<span class="mr-auto"> Edit </span>
			<EditIcon />
		</DropdownMenu.Item>
		<DropdownMenu.Item class="text-destructive" on:click={() => (isOpen.delete = true)}>
			<span class="mr-auto"> Delete </span>
			<DeleteIcon />
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root bind:open={isOpen.edit}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit a section</Dialog.Title>
		</Dialog.Header>

		<FormSection {section} mode="update" />
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={isOpen.delete}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete section?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete the section and all its related
				data from the server.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button on:click={deleteSection}>Delete</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
