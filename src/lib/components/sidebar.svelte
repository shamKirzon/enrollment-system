<script lang="ts">
	import { page } from '$app/stores';
	import { pcsLogo, pcsLogoNewOutlineWhite } from '$lib/assets/images';
	import type { Result, Route } from '$lib/types';
	import { Role, type User } from '$lib/types/user';
	// import { Dashboard } from 'svelte-radix';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { DotsHorizontal } from 'svelte-radix';
	import { ADMIN_ROUTES, ROUTES, PARENT_ROUTES } from '$lib';
	import { Button } from './ui/button';
	import Logout from 'virtual:icons/material-symbols/logout';
	import { crossfade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	export let user: User;

	let routes: Route[] = [];

	if (user.role === Role.Admin) {
		routes = ADMIN_ROUTES;
	} else if (user.role === Role.Parent) {
		routes = PARENT_ROUTES;
	} else {
		routes = ROUTES;
	}

	async function logout(): Promise<void> {
		const response = await fetch('/api/logout', { method: 'post' });

		const result: Result = await response.json();

		if (!response.ok) {
			toast.error(result.message);
			return;
		}

		await invalidateAll();

		toast.success(result.message);
	}

	const [send, receive] = crossfade({
		duration: 300,
		easing: cubicInOut
	});
</script>

<aside
	class="fixed inset-y-0 left-0 h-full w-64 p-4 bg-primary-dark border-r text-black border-gray-200 flex flex-col shadow"
>
	<div class="flex justify-between mb-10 gap-1 items-center relative">
		<img src={pcsLogoNewOutlineWhite} alt="PCS Logo" class="w-20 h-20" />
		<img
			src={pcsLogo}
			alt="PCS Logo"
			class="w-20 h-20 hover:opacity-100 opacity-0 transition-opacity duration-200 absolute ease-in-out"
		/>
		<div class="text-primary-foreground">
			<span class="font-inter-bold text-3xl uppercase">Pateros</span>
			<div class="flex justify-between">
				<span class="text-xs font-inter-bold uppercase tracking-widest">Catholic</span>
				<span class="text-xs font-inter-bold uppercase tracking-widest">School</span>
			</div>
		</div>
	</div>

	<nav class="flex flex-col">
		{#each routes as route (route.path)}
			{@const isCurrentPath = $page.url.pathname === route.path}
			<a
				href={route.path}
				class={`relative px-4 rounded-lg items-center py-3 border border-transparent transition-all`}
				data-sveltekit-noscroll
			>
				{#if isCurrentPath}
					<div
						class={`absolute inset-0 rounded-lg border border-transparent transition-all ${isCurrentPath ? 'text-primary-foreground bg-primary/50 border-primary/50 shadow-sm' : 'text-muted-foreground hover:bg-primary/40 hover:text-primary-foreground/60 '}`}
						in:send={{ key: 'active-sidebar-tab' }}
						out:receive={{ key: 'active-sidebar-tab' }}
					>
						<span
							class={`absolute z-[5] w-3/4 h-1/2 blur rounded-[50%] bg-primary left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${isCurrentPath ? 'opacity-80' : 'opacity-0'}`}
						></span>
					</div>
				{/if}

				<div class="z-10 flex gap-4 relative">
					<svelte:component
						this={route.icon}
						class={`text-2xl transition-all duration-300 ease-in-out ${isCurrentPath ? 'text-secondary' : 'text-muted-foreground'}`}
					/>
					<span
						class={`text-sm md:text-base duration-300 ease-in-out transition-all lg:text-lg font-inter-medium ${isCurrentPath ? 'text-primary-foreground' : 'text-muted-foreground'}`}
					>
						{route.name}
					</span>
				</div>
			</a>
		{/each}
	</nav>

	<!-- <DropdownMenu.Root> -->
	<!-- 	<DropdownMenu.Trigger -->
	<!-- 		class="mt-auto text-start flex items-center justify-between bg-amber-600 px-4 py-3 rounded-lg text-primary-foreground" -->
	<!-- 	> -->
	<!-- 		<span class="text-primary-foreground"> -->
	<!-- 			{user.first_name} -->
	<!-- 			{user.last_name} -->
	<!-- 		</span> -->
	<!-- 		<DotsHorizontal size={16} /> -->
	<!-- 	</DropdownMenu.Trigger> -->
	<!-- 	<DropdownMenu.Content class="w-52"> -->
	<!-- 		<DropdownMenu.Group> -->
	<!-- 			<DropdownMenu.Label>My Account</DropdownMenu.Label> -->
	<!-- 			<DropdownMenu.Separator /> -->
	<!-- 			<DropdownMenu.Item on:click={logout}>Log Out</DropdownMenu.Item> -->
	<!-- 		</DropdownMenu.Group> -->
	<!-- 	</DropdownMenu.Content> -->
	<!-- </DropdownMenu.Root> -->

	<Button
		on:click={logout}
		class={`relative px-4 rounded-lg [&>svg]:hover:text-secondary items-center py-3 bg-transparent border border-transparent transition-all h-auto justify-start gap-4 mt-auto text-muted-foreground hover:text-primary-foreground hover:bg-primary/50 hover:border-primary/50 hover:shadow-sm`}
	>
		<Logout class="text-2xl -scale-x-[1] transition-all" />
		<span class="text-sm md:text-base lg:text-lg font-inter-medium"> Log Out </span>
	</Button>
</aside>
