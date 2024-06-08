<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import { writable } from 'svelte/store';
	import DataTable from './table.svelte';
	import FeeTable from './fee-table.svelte';
	import * as Tabs from '$lib/components/ui/tabs';

	import * as Card from '$lib/components/ui/card';
	import { setContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	const selectedRows = writable<string[]>([]);

	$: setContext('feeForm', data.form);

	let tabs = ['fees', 'tuition-plans'];
	let selectedTab = data.tab ?? tabs[0]

	function replaceSearchParam(k: string, v: string) {
		let query = new URLSearchParams($page.url.searchParams.toString());

		query.set(k, v);

		goto(`?${query.toString()}`);
	}
</script>

<ContentLayout class="flex-col">
	<Tabs.Root value={data.tab ?? tabs[0]}>
		<Tabs.List>
			<Tabs.Trigger value="fees" on:click={() => replaceSearchParam('tab', 'fees')}
				>Fees</Tabs.Trigger
			>
			<Tabs.Trigger
				value="tuition-plans"
				on:click={() => replaceSearchParam('tab', 'tuition-plans')}>Tuiton Plans</Tabs.Trigger
			>
		</Tabs.List>
	</Tabs.Root>

	{#if data.tab === 'fees'}
		<Card.Root class="w-full">
			<Card.Header>
				<Card.Title>Enrollment Fees</Card.Title>
				<Card.Description>The amount of each enrollment fee per year level</Card.Description>
			</Card.Header>
			<Card.Content>
				<DataTable data={data.fees.enrollment_fee_levels} {selectedRows} />
			</Card.Content>
		</Card.Root>
	{:else if data.tab === 'tuition-plans'}
		<Card.Root class="w-full">
			<Card.Header>
				<Card.Title>Tuition Plans</Card.Title>
				<Card.Description>The tuition fee plans for installment payments</Card.Description>
			</Card.Header>
			<Card.Content>
				<FeeTable data={data.tuitionPlans.tuition_plan_levels} {selectedRows} />
			</Card.Content>
		</Card.Root>
	{/if}
</ContentLayout>
