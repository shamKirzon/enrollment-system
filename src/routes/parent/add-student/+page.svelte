<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import Form from './form.svelte';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

<ContentLayout>
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Add Student</Card.Title>
			<Card.Description>Enter your child's details below</Card.Description>
		</Card.Header>
		<Card.Content>
			<Form data={data.form} />
		</Card.Content>
	</Card.Root>
</ContentLayout>
