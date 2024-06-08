<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Tabs from '$lib/components/ui/tabs';
	import { capitalizeFirstLetter } from '$lib';
	import { page } from '$app/stores';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { TableEnrollment, TableTransactions } from '$lib/components/tables';
	import TabGrades from './grades.svelte';
	import { Pagination } from '$lib/components';
	import type { SubjectGradeDetails } from '$lib/types/subject';
	import { Role, type User } from '$lib/types/user';
	import type { TransactionDetails } from '$lib/types/payment';
	import type { AcademicYearEnrollment, YearLevel } from '$lib/types/enrollment';

	export let props: {
		selected: string | null;
		subjectGrades: SubjectGradeDetails;
		user: User;
		studentTransactions: {
			transactions: TransactionDetails[];
			count: number;
		};
		studentEnrollments: {
			academic_year_enrollments: AcademicYearEnrollment[];
			count: number;
		};
		yearLevels: YearLevel[];
		studentId: string;
		selectedYearLevel?: string;
	};

	let tabs = ['enrollments', 'transactions', 'grades'];

	function replaceSearchParam(k: string, v: string | number) {
		let query = new URLSearchParams($page.url.searchParams.toString());

		query.set(k, v.toString());

		goto(`?${query.toString()}`);
	}
</script>

<Tabs.Root value={props.selected || tabs[0]}>
	<Tabs.List class="bg-background border shadow-sm">
		{#each tabs as tab (tab)}
			<Tabs.Trigger
				on:click={() => replaceSearchParam('tab', tab)}
				value={tab}
				class="data-[state=active]:bg-muted data-[state=active]:text-secondary-foreground"
			>
				{capitalizeFirstLetter(tab)}
			</Tabs.Trigger>
		{/each}
	</Tabs.List>

	{#each tabs as tab (tab)}
			{@const link = props.user.role === Role.Admin ? "/admin/users/students" : '/parent/dashboard/students'}

		<Tabs.Content value={tab} class="space-y-2">
			{#if tab === 'enrollments'}
				<Card.Root class="w-full h-full">
					<Card.Header class="flex flex-row items-center justify-between space-y-0">
						<div class="space-y-1.5">
							<Card.Title>Enrollments</Card.Title>
							<Card.Description>Previously enrolled academic years.</Card.Description>
						</div>

						<a
							href={`${link}/${props.studentId}/enrollments`}
							class={buttonVariants({ variant: 'default' })}
						>
							Enroll
						</a>
					</Card.Header>

					<Card.Content>
						<TableEnrollment enrollments={props.studentEnrollments.academic_year_enrollments} />
					</Card.Content>
				</Card.Root>

				<Pagination count={props.studentEnrollments.count} />
			{:else if tab === 'transactions'}
				<Card.Root class="w-full h-full">
					<Card.Header>
						<Card.Title>Transactions</Card.Title>
						<Card.Description>History of transactions.</Card.Description>
					</Card.Header>

					<Card.Content>
						<TableTransactions data={props.studentTransactions.transactions} />
					</Card.Content>
				</Card.Root>

				<Pagination count={props.studentTransactions.count} />
			{:else if tab === 'grades'}
				<TabGrades
					data={{
						studentGrades: props.subjectGrades,
						yearLevels: props.yearLevels,
						user: props.user,
						selectedYearLevel: props.selectedYearLevel
					}}
				/>
			{/if}
		</Tabs.Content>
	{/each}
</Tabs.Root>
