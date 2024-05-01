<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as Pagination from '$lib/components/ui/pagination';

	export let count: number;

	function replaceSearchParam(k: string, v: string) {
		let query = new URLSearchParams($page.url.searchParams.toString());

		query.set(k, v);

		goto(`?${query.toString()}`);
	}
</script>

<Pagination.Root
	{count}
	perPage={12}
	page={Number($page.url.searchParams.get('page')) || 1}
	let:pages
	let:currentPage
	onPageChange={(n) => {
		replaceSearchParam('page', `${n}`);
	}}
>
	<Pagination.Content>
		<Pagination.Item>
			<Pagination.PrevButton />
		</Pagination.Item>
		{#each pages as p (p.key)}
			{#if p.type === 'ellipsis'}
				<Pagination.Item>
					<Pagination.Ellipsis />
				</Pagination.Item>
			{:else}
				<Pagination.Item isVisible={currentPage == p.value}>
					<Pagination.Link page={p} isActive={currentPage == p.value}>
						{p.value}
					</Pagination.Link>
				</Pagination.Item>
			{/if}
		{/each}
		<Pagination.Item>
			<Pagination.NextButton />
		</Pagination.Item>
	</Pagination.Content>
</Pagination.Root>
