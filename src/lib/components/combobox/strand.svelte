<script lang="ts">
	import type { Strand } from '$lib/types/enrollment';
	import Check from 'virtual:icons/mdi/check';
	import ChevronsUpDown from 'virtual:icons/lucide/chevrons-up-down';
	import * as Command from '$lib/components/ui/command';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import * as Popover from '$lib/components/ui/popover';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';

	export let strands: Strand[];
	export let selected: string | undefined;
	export let disabled: boolean = false;

	let open = false;
	let value = '';

	$: getSelectedValue = (id: string | undefined) => strands.find((s) => s.id === id);
	$: selectedValue = getSelectedValue(selected)?.id.toUpperCase() ?? 'Select a strand...';

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	function replaceSearchParam(k: string, v: string | number) {
		let query = new URLSearchParams($page.url.searchParams.toString());

		query.set(k, v.toString());

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
			{disabled}
		>
			{selectedValue}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-52 p-0">
		<Command.Root>
			<Command.Input placeholder="Search strand..." class="h-9" />
			<Command.Empty>No framework found.</Command.Empty>
			<Command.Group>
				{#each strands as { id, name } (id)}
					<Command.Item
						value={id}
						onSelect={(currentValue) => {
							value = currentValue;
							closeAndFocusTrigger(ids.trigger);
							replaceSearchParam('strand_id', `${id}`);
						}}
					>
						<Check class={cn('mr-2 h-4 w-4', value !== id && 'text-transparent')} />
						{id.toUpperCase()}
					</Command.Item>
				{/each}
			</Command.Group>
			<Command.Separator />
			<Command.Item
				onSelect={() => {
					value = '';
					closeAndFocusTrigger(ids.trigger);
					deleteSearchParam('strand_id');
				}}
			>
				<span class="ml-7"> Reset </span>
			</Command.Item>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
