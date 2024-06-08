<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Input } from '$lib/components/ui/input';
	import Search from 'virtual:icons/lucide/search';

	export let placeholder: string | undefined;
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
</script>

<div class="relative w-full lg:max-w-96">
	<Search class="absolute top-1/2 -translate-y-1/2 left-2.5 h-4 w-4" />
	<Input
		class="bg-background pl-8"
		{placeholder}
		bind:value={searchQuery}
		on:keypress={handleKeyPress}
	/>
</div>
