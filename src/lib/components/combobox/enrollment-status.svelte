<script lang="ts">
	import Check from 'virtual:icons/mdi/check';
	import ChevronsUpDown from 'virtual:icons/lucide/chevrons-up-down';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import { EnrollmentStatus } from '$lib/types/enrollment';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let selected: string | undefined;

	const enrollmentStatuses = [
		{
			value: EnrollmentStatus.Pending,
			label: 'Pending'
		},
		{
			value: EnrollmentStatus.Done,
			label: 'Done'
		}
	];

	let open = false;
	let value = '';

	$: getSelectedValue = (id: string | undefined) => enrollmentStatuses.find((s) => s.value === id);
	$: selectedValue = getSelectedValue(selected)?.label ?? 'Select a status...';

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
			<Command.Input placeholder="Search a status..." />
			<Command.Empty>No status found.</Command.Empty>
			<Command.Group>
				{#each enrollmentStatuses as status}
					<Command.Item
						value={status.value}
						onSelect={(currentValue) => {
							value = currentValue;
							closeAndFocusTrigger(ids.trigger);
							replaceSearchParam('status', value);
						}}
					>
						<Check class={cn('mr-2 h-4 w-4', value !== status.value && 'text-transparent')} />
						{status.label}
					</Command.Item>
				{/each}
			</Command.Group>
			<Command.Separator />
			<Command.Item
				onSelect={() => {
					value = '';
					closeAndFocusTrigger(ids.trigger);
					deleteSearchParam('status');
				}}
			>
				<span class="ml-7"> Reset </span>
			</Command.Item>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
