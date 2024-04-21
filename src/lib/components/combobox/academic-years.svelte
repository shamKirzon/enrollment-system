<script lang="ts">
	import Check from 'virtual:icons/mdi/check';
	import ChevronsUpDown from 'virtual:icons/lucide/chevrons-up-down';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';

	// export let academicYears: string[];
	export let academicYears: { id: number; start_at: string; end_at: string }[];

	let open = false;
	let value = '';

	$: selectedValue = academicYears.find((f) => ayFormat(f.start_at, f.end_at) === value)
		? value
		: 'Select an academic year...';

	console.log(selectedValue);

	function ayFormat(startAt: string, endAt: string, mode: 'label' | 'default' = 'default'): string {
		if (mode === 'label') {
			return `${format(startAt, 'yyyy')} - ${format(endAt, 'yyyy')}`;
		}

		return `${format(startAt, 'yyyy')}-${format(endAt, 'yyyy')}`;
	}

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-60 justify-between"
		>
			{selectedValue}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-60 p-0">
		<Command.Root>
			<Command.Input placeholder="Search academic years..." />
			<Command.Empty>No academic years found.</Command.Empty>
			<Command.Group>
				<Command.Item
					onSelect={() => {
						value = '';
						closeAndFocusTrigger(ids.trigger);
						goto(`/admin/enrollments`);
					}}
				>
					<span class="ml-6"> None </span>
				</Command.Item>
				{#each academicYears as { id, start_at, end_at } (id)}
					<Command.Item
						value={ayFormat(start_at, end_at)}
						onSelect={(currentValue) => {
							value = currentValue;
							console.log(value);
							closeAndFocusTrigger(ids.trigger);
							goto(`/admin/enrollments?year=${id}`);
						}}
					>
						<Check
							class={cn('mr-2 h-4 w-4', value !== ayFormat(start_at, end_at) && 'text-transparent')}
						/>
						{ayFormat(start_at, end_at, 'label')}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
