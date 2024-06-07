<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import { writable } from 'svelte/store';
	import DataTable from './table.svelte';

	import * as Card from '$lib/components/ui/card';
	import { setContext } from 'svelte';

	export let data;

	const selectedRows = writable<string[]>([]);

	$: setContext('feeForm', data.form);
</script>

<ContentLayout>
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Enrollment Fees</Card.Title>
			<Card.Description>The amount of each enrollment fee per year level</Card.Description>
		</Card.Header>
		<Card.Content>
			<DataTable data={data.fees.enrollment_fee_levels} {selectedRows} />
		</Card.Content>
	</Card.Root>
</ContentLayout>
