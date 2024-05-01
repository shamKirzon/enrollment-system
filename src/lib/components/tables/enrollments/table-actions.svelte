<script lang="ts">
	import { DotsHorizontal } from 'svelte-radix';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import type { Result } from '$lib/types';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';

	export let id: number;

	const isOpen = {
		edit: false,
		delete: false
	};

	async function deleteEnrollment(): Promise<void> {
		const response = await fetch(`/api/enrollments?id=${id}`, { method: 'DELETE' });
		const result: Result = await response.json();

		if (!response.ok) {
			toast.error(result.message);
			return;
		}

		await invalidateAll();

		isOpen.delete = false;
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
		<DropdownMenu.Item>Edit</DropdownMenu.Item>
		<DropdownMenu.Item class="space-x-1" on:click={() => (isOpen.delete = true)}>
			<DeleteIcon />
			<span> Delete </span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

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
			<Button on:click={deleteEnrollment}>Delete</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
