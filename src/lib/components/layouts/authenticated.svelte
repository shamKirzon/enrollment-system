<script lang="ts">
	import { page } from '$app/stores';
	import { ADMIN_ROUTES, PARENT_ROUTES, ROUTES } from '$lib';
	import type { Route } from '$lib/types';
	import { Role, type User } from '$lib/types/user';
	import { cn } from '$lib/utils';
	import Navbar from '../navbar.svelte';

	export let user: User;

	let routes: Route[] = [];

	switch (user.role) {
		case Role.Admin:
			routes = ADMIN_ROUTES;
			break;
		case Role.Parent:
			routes = PARENT_ROUTES;
			break;
		case Role.Student:
			routes = ROUTES;
			break;
	}

	$: isActive = routes.filter((route) => $page.url.pathname.includes(route.path))[0];
</script>

<div class={cn(`max-w-7xl mx-auto sm:px-6 lg:px-8 py-12 flex w-full gap-8 h-full flex-col`)}>
	{#if user}
		<Navbar {user} label={isActive.name} />
	{/if}

	<slot />
</div>
