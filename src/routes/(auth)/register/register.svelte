<script lang="ts">
	import { RegisterForm } from '$lib/components/forms';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

<div class="flex flex-col flex-1 sm:px-6 lg:px-8 py-12 h-full gap-2 items-center justify-center">
	<Card.Root class="w-full max-w-xl">
		<Card.Header>
			<Card.Title class="text-4xl font-inter-semibold">Register</Card.Title>
			<Card.Description>Enter your details below to create an account.</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<RegisterForm data={data.form} />
		</Card.Content>
	</Card.Root>
</div>
