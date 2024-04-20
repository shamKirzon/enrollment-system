<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { DotsHorizontal } from 'svelte-radix';
	import * as Dialog from '$lib/components/ui/dialog';
	import EditIcon from 'virtual:icons/lucide/edit';
	import type { AcademicYear } from '$lib/types/enrollment';
	import { getContext } from 'svelte';
	import type { AcademicYearSchema } from '$lib/schemas/enrollment';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import { CreateAcademicYearForm } from '$lib/components/forms';

	export let academicYear: AcademicYear;

	const form = getContext<SuperValidated<Infer<AcademicYearSchema>>>('form');

	const isOpen = {
		edit: false,
		delete: false
	};
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
			<!-- <Dialog.Trigger class="flex gap-1 items-center w-full py-1.5 px-2"> -->
			<EditIcon />
			<span> Edit </span>
			<!-- </Dialog.Trigger> -->
		</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => (isOpen.delete = true)}>
			<EditIcon />
			<span> Delete </span>
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
			<Dialog.Title>Are you sure?</Dialog.Title>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
