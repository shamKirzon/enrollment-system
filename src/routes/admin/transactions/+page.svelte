<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import { TableTransactions } from '$lib/components/tables/admin';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { writable } from 'svelte/store';
	import { Button } from '$lib/components/ui/button';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import { deleteData } from '$lib';
	import { Pagination } from '$lib/components/index.js';
	import { PaymentMethodCombobox } from '$lib/components/combobox/index.js';

	export let data;

	const selectedRows = writable<string[]>([]);
</script>

<ContentLayout class="flex-col">
	<div class="flex gap-2 justify-between">
		<PaymentMethodCombobox selected={data.selectedPaymentMethod} />
		</div>

	<Card.Root class="w-full">
		<Card.Header class="flex flex-row items-center justify-between space-y-0">
			<div class="space-y-1.5">
				<Card.Title>Transactions</Card.Title>
				<Card.Description>A list of transactions.</Card.Description>
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
							<Dialog.Title>Delete transactions?</Dialog.Title>
							<Dialog.Description>
								This action cannot be undone. This will permanently delete all selected transactions
								and it's corresponding enrollments from the server.
							</Dialog.Description>
						</Dialog.Header>
						<Dialog.Footer>
							<Button on:click={() => deleteData($selectedRows, '/api/transactions')}>
								Delete
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			{/if}
		</Card.Header>
		<Card.Content>
			<TableTransactions data={data.resultTransactions?.transactions || []} {selectedRows} />
		</Card.Content>
	</Card.Root>

	<Pagination count={data.resultTransactions?.count || 1} />
</ContentLayout>
