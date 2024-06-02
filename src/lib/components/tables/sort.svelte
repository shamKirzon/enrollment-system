<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import ArrowUpDown from 'virtual:icons/lucide/arrow-up-down';
	import ArrowUp from 'virtual:icons/lucide/arrow-up';
	import ArrowDown from 'virtual:icons/lucide/arrow-down';

	export let label: string;
	export let orderParam: string;

	let order = 'asc';

	function replaceSearchParam(k: string, v: string) {
		let query = new URLSearchParams($page.url.searchParams.toString());
		query.set(k, v);
		goto(`?${query.toString()}`);
	}

	function toggleOrder() {
		order = order === 'asc' ? 'desc' : 'asc';
		replaceSearchParam(orderParam, order);
	}
</script>

<Button variant="ghost" on:click={toggleOrder}>
	{label}

	{#if order === 'asc'}
		<ArrowUp class={'ml-2 h-4 w-4'} />
	{:else}
		<ArrowDown class={'ml-2 h-4 w-4'} />
	{/if}
</Button>
