<script lang="ts">
	import { LoginForm } from '$lib/components/forms';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

<div class="flex justify-center items-center min-h-screen bg-gray-100">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
			<Card.Description>Enter your email and password.</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<LoginForm data={data.form} />
		</Card.Content>
	</Card.Root>
</div>
