<script lang="ts">
	import { CreateAcademicYearForm } from '$lib/components/forms';
	import { ContentLayout } from '$lib/components/layouts';
	import { Pagination } from '$lib/components';
	import { AcademicYearsTable } from '$lib/components/tables/admin';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import { setContext } from 'svelte';
	import CirclePlusOutline from 'virtual:icons/flowbite/circle-plus-outline';
	import { Role } from '$lib/types/user.js';
	import { StudentsChart, UsersChart } from '$lib/components/charts';

	export let data;

	const usersCount = data.users?.count.reduce((acc, cur) => acc + cur.value, 0) || 0;
	const studentCount = data.users?.count.filter((u) => u.role === Role.Student)[0].value || 0;

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

			<!-- <div class="flex gap-2"> -->
			<!-- 	<Card.Root> -->
			<!-- 		<Card.Header> -->
			<!-- 			<Card.Description>Users</Card.Description> -->
			<!-- 			<Card.Title class="text-4xl">{usersCount}</Card.Title> -->
			<!-- 		</Card.Header> -->
			<!-- 	</Card.Root> -->
			<!-- </div> -->

			<div class="flex-1">
				<Card.Root>
					<Card.Header>
						<Card.Description>Money</Card.Description>
						<Card.Title class="text-4xl">P 9,999,999.99</Card.Title>
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
						<StudentsChart data={data.academicYears?.academic_years || []} />
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between">
				<div>
					<Card.Title>Academic Years</Card.Title>
					<Card.Description>Previous academic years.</Card.Description>
				</div>

				<Dialog.Root>
					<Dialog.Trigger asChild let:builder>
						<Button class="space-x-1" builders={[builder]}>
							<CirclePlusOutline />
							<span>Create</span>
						</Button>
					</Dialog.Trigger>

					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>Create a new academic year</Dialog.Title>
						</Dialog.Header>

						<CreateAcademicYearForm data={data.form} />
					</Dialog.Content>
				</Dialog.Root>
			</Card.Header>
			<Card.Content>
				<AcademicYearsTable data={data.academicYears?.academic_years || []} />
			</Card.Content>
		</Card.Root>

		<Pagination count={data.academicYears?.count || 0} />
	</div>

	<div>
		<Card.Root>
			<Card.Header>
				<Card.Description>Users</Card.Description>
				<Card.Title class="text-4xl">{usersCount}</Card.Title>
			</Card.Header>

			<Card.Content>
				<UsersChart data={data.users?.count || []} />
			</Card.Content>
		</Card.Root>
	</div>
</ContentLayout>
