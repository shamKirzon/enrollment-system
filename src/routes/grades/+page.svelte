<script lang="ts">
	import TableGrades from './table.svelte';
	import * as Card from '$lib/components/ui/card';
	import { YearLevelCombobox } from '$lib/components/combobox';
	import { ContentLayout } from '$lib/components/layouts';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import * as Tabs from '$lib/components/ui/tabs';
	import { EducationLevel, Semester } from '$lib/types/enrollment';
	import { page } from '$app/stores';

	export let data;

	$: isSeniorHigh = data.subjectGrades.education_level === EducationLevel.SeniorHighSchool;

	function replaceSearchParam(k: string, v: string | number) {
		let query = new URLSearchParams($page.url.searchParams.toString());

		query.set(k, v.toString());

		goto(`?${query.toString()}`);
	}
</script>

<ContentLayout class="flex-col">
	<div class="flex items-center gap-2 justify-between">
		<YearLevelCombobox yearLevels={data.yearLevels || []} includeSemester={true} />

		<Tabs.Root value={Semester.First}>
			<Tabs.List class="bg-background border shadow-sm">
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
		</Card.Header>
		<Card.Content>
			<TableGrades data={data.subjectGrades} />
		</Card.Content>
	</Card.Root>
</ContentLayout>
