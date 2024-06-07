<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import type { User } from '$lib/types/user';

	export let user: User;

	const initials = `${user.first_name[0].toUpperCase()}${user.last_name[0].toUpperCase()}`;
</script>

<div class="flex w-full">
	<Avatar.Root>
		<Avatar.Image src={user.avatar_url} alt="Avatar" />
		<Avatar.Fallback>{initials}</Avatar.Fallback>
	</Avatar.Root>
</div>
