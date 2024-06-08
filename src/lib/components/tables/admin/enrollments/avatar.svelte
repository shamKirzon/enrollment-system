<script lang="ts">
	import { formatName } from '$lib';
	import * as Avatar from '$lib/components/ui/avatar';
	import { StudentStatus } from '$lib/types/enrollment';
	import { Badge } from '$lib/components/ui/badge';
	import type { UserName } from '$lib/types/user';
	import { Button } from '$lib/components/ui/button';

	export let name: UserName;
	export let avatarUrl: string | undefined = undefined;
	export let studentStatus: StudentStatus;
	export let studentId: string;

	const { first_name, middle_name, last_name, suffix_name } = name;

	const initials = `${first_name[0].toUpperCase()}${last_name[0].toUpperCase()}`;
	const formattedName = formatName(name, 'lfms');
</script>

<div class="flex gap-2 items-center">
	<Avatar.Root>
		<Avatar.Image src={avatarUrl} alt="Avatar" />
		<Avatar.Fallback>{initials}</Avatar.Fallback>
	</Avatar.Root>

	<Button
		variant="link"
		class="p-0 space-x-1 h-auto underline text-amber-700"
		href={`/admin/users/students/${studentId}`}
		target="_blank"
		rel="noreferrer"
	>
		{#if studentStatus === StudentStatus.New}
			<span class="font-inter-medium">
				{formattedName}
			</span>
			<Badge class={`text-xs`}>New</Badge>
		{:else}
			<span class="font-inter-medium">
				{formattedName}
			</span>
		{/if}
	</Button>
</div>
