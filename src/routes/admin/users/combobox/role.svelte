<script lang="ts">
	import Check from 'virtual:icons/mdi/check';
	import ChevronsUpDown from 'virtual:icons/lucide/chevrons-up-down';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Role } from '$lib/types/user';

	const userRoles = [
		{
			value: Role.Student,
			label: 'Student'
		},
		{
			value: Role.Parent,
			label: 'Parent'
		},
		{
			value: Role.Admin,
			label: 'Admin'
		},
	];

	let open = false;
	let value = '';

	$: selectedValue =
		userRoles.find((f) => f.value === value)?.label ?? 'Select a role...';

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	function replaceSearchParam(k: string, v: string) {
		let query = new URLSearchParams($page.url.searchParams.toString());

		query.set(k, v);

		goto(`?${query.toString()}`);
	}

	function deleteSearchParam(k: string) {
		let query = new URLSearchParams($page.url.searchParams.toString());

		query.delete(k);

		goto(`?${query.toString()}`);
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-52 justify-between"
		>
			{selectedValue}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-52 p-0">
		<Command.Root>
			<Command.Input placeholder="Search a role..." />
			<Command.Empty>No role found.</Command.Empty>
			<Command.Group>
				{#each userRoles as role (role.value)}
					<Command.Item
						value={role.value}
						onSelect={(currentValue) => {
							value = currentValue;
							closeAndFocusTrigger(ids.trigger);
							replaceSearchParam('role', value);
						}}
					>
						<Check class={cn('mr-2 h-4 w-4', value !== role.value && 'text-transparent')} />
						{role.label}
					</Command.Item>
				{/each}
			</Command.Group>
			<Command.Separator />
			<Command.Item
				onSelect={() => {
					value = '';
					closeAndFocusTrigger(ids.trigger);
					deleteSearchParam('role');
				}}
			>
				<span class="ml-7"> Reset </span>
			</Command.Item>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
