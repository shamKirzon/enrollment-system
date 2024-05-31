<script lang="ts">
	import TableGrades from './table.svelte';
	import * as Card from '$lib/components/ui/card';
	import { YearLevelCombobox } from '$lib/components/combobox';
	import { ContentLayout } from '$lib/components/layouts';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	export let data;

	console.log('Subject grades');
	console.log(data.subjectGrades);
	console.log(data.yearLevels);

	function updateSemester(semester: number) {
		const url = new URL(window.location.href);
		const params = new URLSearchParams(url.search);

		params.set('semester', semester.toString());

		goto(`${url.pathname}?${params.toString()}`);
	}
</script>

<ContentLayout class="flex-col">
	<YearLevelCombobox yearLevels={data.yearLevels} includeSemester={true} />

	<div class="flex gap-1 items-center">
		<Button on:click={() => updateSemester(1)}>1st Semester</Button>
		<Button on:click={() => updateSemester(2)}>2nd Semester</Button>
	</div>

	<Card.Root>
		<Card.Header>
			<Card.Title>Grades</Card.Title>
			<Card.Description>Your report card</Card.Description>
		</Card.Header>
		<Card.Content>
			<TableGrades data={data.subjectGrades} semester={data.semester} />
		</Card.Content>
	</Card.Root>
</ContentLayout>
