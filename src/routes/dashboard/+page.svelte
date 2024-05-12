<script lang="ts">
	import { TableEnrollment } from '$lib/components/tables';
	import * as Card from '$lib/components/ui/card';
	import { setContext } from 'svelte';

	export let data;

	setContext('enrollmentForm', data.form);
</script>

<div class="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12 flex w-full gap-2 h-full">
	<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
		<div class="flex gap-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>You are not enrolled</Card.Title>
					<Card.Description>hello world</Card.Description>
				</Card.Header>
			</Card.Root>
		</div>

		<TableEnrollment />
	</div>
</div>
