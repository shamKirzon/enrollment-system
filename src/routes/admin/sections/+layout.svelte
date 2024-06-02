<script lang="ts">
	import { page } from '$app/stores';
	import { ContentLayout } from '$lib/components/layouts';

	let tabs = [
		{
			label: 'Sections',
			path: '/admin/sections'
		},
		{
			label: 'Assignments',
			path: '/admin/sections/assignments'
		}
	];

	$: console.log($page.route.id);
</script>

<ContentLayout class="flex-col">
	<div class="inline-flex gap-1 items-center justify-center shadow-sm border h-9 p-1 rounded-lg bg-background w-fit">
		{#each tabs as { path, label } (path)}
			<a href={path} class={`${$page.route.id === path ? "bg-muted text-foreground shadow" : "text-muted-foreground relative"} rounded-md text-sm py-1 px-3 transition-all inline-flex`}>
				{label}
			</a>
		{/each}
	</div>

	<slot />
</ContentLayout>
