<script lang="ts">
	import Check from 'virtual:icons/mdi/check';
	import ChevronsUpDown from 'virtual:icons/lucide/chevrons-up-down';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { ayFormat } from '$lib';

	// export let academicYears: string[];
	export let academicYears: { id: number; start_at: string; end_at: string }[];
	export let selected: string | undefined;

	let open = false;
	let value = '';

	$: getSelectedValue = (id: string | undefined) =>
		academicYears.find((s) => s.id.toString() === id);
	$: selectedValue = getSelectedValue(selected);
	$: formattedValue = selectedValue ? ayFormat(selectedValue.start_at, selectedValue.end_at, "label") : "Select an academic year..."

	$: console.log(getSelectedValue(selected))

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
			class="w-60 justify-between"
		>
			{formattedValue}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-60 p-0">
		<Command.Root>
			<Command.Input placeholder="Search academic years..." />
			<Command.Empty>No academic years found.</Command.Empty>
			<Command.Group>
				{#each academicYears as { id, start_at, end_at } (id)}
					<Command.Item
						value={ayFormat(start_at, end_at)}
						onSelect={(currentValue) => {
							value = currentValue;
							closeAndFocusTrigger(ids.trigger);
							replaceSearchParam('academic_year_id', `${id}`);
						}}
					>
						<Check
							class={cn('mr-2 h-4 w-4', value !== ayFormat(start_at, end_at) && 'text-transparent')}
						/>
						{ayFormat(start_at, end_at, 'label')}
					</Command.Item>
				{/each}
			</Command.Group>
			<Command.Separator />
			<Command.Item
				onSelect={() => {
					value = '';
					closeAndFocusTrigger(ids.trigger);
					deleteSearchParam('academic_year_id');
				}}
			>
				<span class="ml-7"> Reset </span>
			</Command.Item>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
