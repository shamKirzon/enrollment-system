<script lang="ts">
	import { Pagination } from '$lib/components';
	import { ContentLayout } from '$lib/components/layouts';
	import { TableUsers } from '$lib/components/tables/admin';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { deleteData } from '$lib';
	import CirclePlusOutline from 'virtual:icons/flowbite/circle-plus-outline';
	import { setContext } from 'svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import DeleteIcon from 'virtual:icons/material-symbols/delete-outline';
	import { writable } from 'svelte/store';
	import { FormUser } from '$lib/components/forms';
	import { Search } from '$lib/components';
	import ComboboxRole from './combobox/role.svelte';

	export let data;

	const selectedRows = writable<string[]>([]);


	setContext('formUser', data.form);
</script>

<ContentLayout class="flex-col">
	<div class="flex gap-2 justify-between">
		<Search placeholder="Search a user..." />
		<ComboboxRole />
	</div>

	<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between space-y-0">
				<div class="space-y-1.5">
					<Card.Title>Users</Card.Title>
					<Card.Description>All registered users.</Card.Description>
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
								<Dialog.Title>Delete users?</Dialog.Title>
								<Dialog.Description>
									This action cannot be undone. This will permanently delete all selected users from
									the server.
								</Dialog.Description>
							</Dialog.Header>
							<Dialog.Footer>
								<Button on:click={() => deleteData($selectedRows, '/api/users')}>Delete</Button>
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
								<Dialog.Title>Create a new user</Dialog.Title>
							</Dialog.Header>

							<FormUser />
						</Dialog.Content>
					</Dialog.Root>
				{/if}
			</Card.Header>
			<Card.Content>
				<TableUsers data={data.users?.users || []} {selectedRows} />
			</Card.Content>
		</Card.Root>

		<Pagination count={data.users?.count || 0} />
	</div>
</ContentLayout>
