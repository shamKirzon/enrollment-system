<script lang="ts">
	import { RegisterForm } from '$lib/components/forms';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

asdhadaudsa
<div class="flex justify-center items-center min-h-screen bg-gray-100">
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title class="text-2xl">Register</Card.Title>
			<Card.Description>Enter your details below to create an account.</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<RegisterForm data={data.form} />
		</Card.Content>
	</Card.Root>
</div>
