<script lang="ts">
	import { page } from '$app/stores';
	import { pcsLogo } from '$lib/assets/images';
	import type { Result } from '$lib/types';
	import { Role, type User } from '$lib/types/user';
	// import { Dashboard } from 'svelte-radix';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { DotsHorizontal } from 'svelte-radix';
	import { ADMIN_ROUTES, ROUTES } from '$lib';

	export let user: User;

	const routes = user.role === Role.Admin ? ADMIN_ROUTES : ROUTES;

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

	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="mt-auto text-start flex items-center justify-between">
			<span>
				{user.first_name}
				{user.last_name}
			</span>
			<DotsHorizontal size={16} />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-52">
			<DropdownMenu.Group>
				<DropdownMenu.Label>My Account</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item on:click={logout}>Log Out</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</aside>
