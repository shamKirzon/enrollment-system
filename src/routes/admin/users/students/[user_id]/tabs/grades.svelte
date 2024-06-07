<script lang="ts">
	import { EducationLevel, Semester, type YearLevel } from '$lib/types/enrollment';
	import { YearLevelCombobox } from '$lib/components/combobox';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import type { SubjectGradeDetails } from '$lib/types/subject';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { TableGrades } from '$lib/components/tables';
	import { Role, type User } from '$lib/types/user';

	export let data: {
		studentGrades: SubjectGradeDetails;
		yearLevels: YearLevel[];
		user: User | undefined;
	};

	$: isSeniorHigh = data.studentGrades.education_level === EducationLevel.SeniorHighSchool;

	function replaceSearchParam(k: string, v: string | number) {
		let query = new URLSearchParams($page.url.searchParams.toString());

		query.set(k, v.toString());

		goto(`?${query.toString()}`);
	}

	async function submitGrades() {
		console.log('foo');
	}
</script>

<div class="space-y-2">
	<div class="flex items-center gap-2 justify-between">
		<YearLevelCombobox yearLevels={data.yearLevels || []} includeSemester={true} />

		<Tabs.Root value={Semester.First}>
			<Tabs.List class="bg-background border">
				<Tabs.Trigger
					on:click={() => replaceSearchParam('semester', 1)}
					value={Semester.First}
					class="data-[state=active]:bg-muted data-[state=active]:text-secondary-foreground"
					disabled={!isSeniorHigh}
				>
					1st Semester
				</Tabs.Trigger>
				<Tabs.Trigger
					on:click={() => replaceSearchParam('semester', 2)}
					value={Semester.Second}
					class="data-[state=active]:bg-muted data-[state=active]:text-secondary-foreground"
					disabled={!isSeniorHigh}
				>
					2nd Semester
				</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Grades</Card.Title>
			<Card.Description>Your report card</Card.Description>

			<!-- <button on:click={submitGrades}>Test</button> -->
		</Card.Header>
		<Card.Content>
			<TableGrades
				data={data.studentGrades}
				interactive={data.user?.role === Role.Admin}
				submit={submitGrades}
			/>
		</Card.Content>
	</Card.Root>
</div>
