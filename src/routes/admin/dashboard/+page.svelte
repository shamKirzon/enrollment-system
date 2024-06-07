<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { setContext } from 'svelte';
	import * as Chart from '$lib/components/charts';

	export let data;

	const usersCount = data.users.role_count.reduce((acc, cur) => acc + cur.value, 0) || 0;
	const studentCount = data.academicYears.academic_years.reduce((acc, cur) => acc + cur.student_count, 0) || 0;
	const totalRevenue = data.yearlyTransactions.transactions.reduce((acc, cur) => acc + Number(cur.total_payment_amount), 0) || 0;

	setContext('form', data.form);
</script>

<ContentLayout>
	<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
		<div class="flex gap-2">
			<div class="flex-1">
				<Card.Root>
					<Card.Header>
						<Card.Description>Students Enrolled</Card.Description>
						<Card.Title class="text-4xl">{studentCount}</Card.Title>
					</Card.Header>
				</Card.Root>
			</div>

			<div class="flex-1">
				<Card.Root>
					<Card.Header>
						<Card.Description>Money</Card.Description>
						<Card.Title class="text-4xl">₱ {totalRevenue.toFixed(2)}</Card.Title>
					</Card.Header>
				</Card.Root>
			</div>
		</div>

		<Tabs.Root value="students-chart">
			<Tabs.List class="bg-background shadow">
				<Tabs.Trigger value="students-chart" class="data-[state=active]:bg-muted">
					Students
				</Tabs.Trigger>
				<Tabs.Trigger value="transactions-chart" class="data-[state=active]:bg-muted">
					Transactions
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="students-chart">
				<Card.Root>
					<Card.Header>
						<Card.Title>Yearly Student Count</Card.Title>
						<Card.Description>Number of students enrolled per academic year.</Card.Description>
					</Card.Header>
					<Card.Content>
						<Chart.Students data={data.academicYears.academic_years} />
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<Tabs.Content value="transactions-chart">
				<Card.Root>
					<Card.Header>
						<Card.Title>Yearly Transactions</Card.Title>
						<Card.Description>Total amount of revenue earned per academic year.</Card.Description>
					</Card.Header>
					<Card.Content>
						<Chart.Transactions data={data.yearlyTransactions.transactions} />
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>

	<div>
		<Card.Root>
			<Card.Header>
				<Card.Description>Users</Card.Description>
				<Card.Title class="text-4xl">{usersCount}</Card.Title>
			</Card.Header>

			<Card.Content>
				<Chart.Users data={data.users.role_count} />
			</Card.Content>
		</Card.Root>
	</div>
</ContentLayout>
