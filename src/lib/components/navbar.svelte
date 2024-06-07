<script lang="ts">
	import { capitalizeFirstLetter, formatName } from '$lib';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { User } from '$lib/types/user';

	export let user: User;
	export let label: string | undefined = undefined;

	$: ({ first_name, last_name, middle_name, suffix_name } = user);

	$: initials = `${first_name[0].toUpperCase()}${last_name[0].toUpperCase()}`;
	$: name = formatName({ first_name, middle_name, last_name, suffix_name }, 'fmls');
</script>

<div class="flex w-full justify-between items-center">
	<h1 class="font-inter-bold text-4xl">{label ?? 'Label'}</h1>

	<div class="flex items-center gap-2">
		<Avatar.Root class="shadow-sm border">
			<Avatar.Image src={user.avatar_url} alt="Avatar" />
			<Avatar.Fallback>{initials}</Avatar.Fallback>
		</Avatar.Root>

		<div class="flex flex-col">
			<span class="text-sm font-inter-medium">{name}</span>
			<span class="text-xs text-muted-foreground">{capitalizeFirstLetter(user.role)}</span>
		</div>
	</div>
</div>
