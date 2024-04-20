<script lang="ts">
	import { page } from '$app/stores';
	import { pcsLogo } from '$lib/assets/images';
	import type { Route } from '$lib/types';
	import { Role, type User } from '$lib/types/user';
	// import { Dashboard } from 'svelte-radix';
	import Users from 'virtual:icons/mdi/users';
	import Dashboard from 'virtual:icons/radix-icons/dashboard';
	import School from 'virtual:icons/lucide/school';

	export let user: User;

	const ROUTES: Route[] = [
		{
			name: 'Dashboard',
			path: '/dashboard',
			icon: Dashboard
		}
	];

	const ADMIN_ROUTES: Route[] = [
		{
			name: 'Dashboard',
			path: '/admin/dashboard',
			icon: Dashboard
		},
		{
			name: 'Enrollments',
			path: '/admin/enrollments',
			icon: School
		},
		{
			name: 'Users',
			path: '/admin/users',
			icon: Users
		}
	];

	const routes = user.role === Role.Admin ? ADMIN_ROUTES : ROUTES;
</script>

<aside
	class="fixed inset-y-0 left-0 h-full w-60 p-4 bg-white border-r text-black border-gray-200 flex flex-col"
>
	<div class="flex justify-center mb-10">
		<img src={pcsLogo} alt="PCS Logo" class="w-20 h-20" />
	</div>

	<nav class="flex flex-col">
		{#each routes as route (route.path)}
			{@const isCurrentPath = $page.url.pathname === route.path}
			<a
				href={route.path}
				class={`flex gap-2 items-center py-2 ${isCurrentPath ? 'text-black' : 'text-muted-foreground'}`}
			>
				<svelte:component this={route.icon} class="text-2xl" />
				<span class="text-sm md:text-base lg:text-lg font-medium">
					{route.name}
				</span>
			</a>
		{/each}
	</nav>
</aside>
