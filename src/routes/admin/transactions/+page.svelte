<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import { TableTransactions } from '$lib/components/tables/admin';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { writable } from 'svelte/store';
	import { Button } from '$lib/components/ui/button';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import { deleteData } from '$lib';

	export let data;

	const selectedRows = writable<string[]>([]);
</script>

<ContentLayout>
	<Card.Root class="w-full">
		<Card.Header class="flex flex-row items-center justify-between">
			<div>
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
			<TableTransactions data={data.resultTransactions?.data?.transactions || []} {selectedRows} />
		</Card.Content>
	</Card.Root>
</ContentLayout>
