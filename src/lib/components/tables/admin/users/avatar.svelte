<script lang="ts">
	import { formatName } from '$lib';
	import * as Avatar from '$lib/components/ui/avatar';
	import { StudentStatus } from '$lib/types/enrollment';
	import { Badge } from '$lib/components/ui/badge';
	import { Role, type UserName } from '$lib/types/user';
	import Link from './link.svelte';

	export let name: UserName;
	export let avatarUrl: string | undefined = undefined;
	export let role: Role;
	export let url: string | undefined = undefined;

	const { first_name, middle_name, last_name, suffix_name } = name;

	const initials = `${first_name[0].toUpperCase()}${last_name[0].toUpperCase()}`;
	const formattedName = formatName(name, 'lfms');
</script>

<div class="flex gap-2 items-center">
	<Avatar.Root class="shadow-sm border">
		<Avatar.Image src={avatarUrl} alt="Avatar" />
		<Avatar.Fallback>{initials}</Avatar.Fallback>
	</Avatar.Root>

	{#if role === Role.Student}
		<Link url={url || ''} label={formattedName} />
	{:else}
		<span class="font-inter-medium">
			{formattedName}
		</span>
	{/if}
</div>
