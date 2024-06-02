<script lang="ts">
	import { DotsHorizontal } from 'svelte-radix';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import type { Result } from '$lib/types';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import { EnrollmentStatus, type EnrollmentWithDetails } from '$lib/types/enrollment';
	import { DrawerEnrollment } from '$lib/components/drawers';
	import { deleteData } from '$lib';
	import type { TransactionDetails } from '$lib/types/payment';

	// export let id: number;
	// export let studentName: string;
	// export let paymentReceiptUrl: string;
	export let enrollment: EnrollmentWithDetails;
	export let transaction: TransactionDetails;

	const isOpen = {
		edit: false,
		delete: false,
		drawer: false
	};

	async function deleteTransaction(): Promise<void> {
		await deleteData([transaction.transaction_id], '/api/transactions');

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
		<DropdownMenu.Item on:click={() => (isOpen.drawer = true)}>View details</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item class="text-destructive" on:click={() => (isOpen.delete = true)}>
			<span class="mr-auto"> Delete </span>
			<DeleteIcon />
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root bind:open={isOpen.delete}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete transaction?</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete the transaction from the server.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button on:click={deleteTransaction}>Delete</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- <DrawerEnrollment {enrollment} isOpen={isOpen.drawer} /> -->
