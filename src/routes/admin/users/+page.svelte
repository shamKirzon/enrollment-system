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
	import Search from 'virtual:icons/lucide/search';
	import { writable } from 'svelte/store';
	import { FormUser } from '$lib/components/forms';
	import ComboboxRole from './combobox/role.svelte';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	const selectedRows = writable<string[]>([]);

	let searchQuery = '';

	function replaceSearchParam(k: string, v: string | number) {
		let query = new URLSearchParams($page.url.searchParams.toString());

		query.set(k, v.toString());

		goto(`?${query.toString()}`);
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			console.log('Search query:', searchQuery);
			replaceSearchParam('q', searchQuery);
		}
	}

	setContext('formUser', data.form);
</script>

<ContentLayout class="flex-col">
	<div class="flex gap-2 justify-between">
		<div class="relative w-full max-w-96">
			<Search class="absolute top-1/2 -translate-y-1/2 left-2.5 h-4 w-4" />
			<Input
				class="bg-background pl-8"
				placeholder="Search a user..."
				bind:value={searchQuery}
				on:keypress={handleKeyPress}
			/>
		</div>
		<ComboboxRole />
	</div>

	<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between">
				<div>
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
