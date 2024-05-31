<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { EducationLevel, Semester } from '$lib/types/enrollment';
	import type { SubjectGrade, SubjectGradeDetails } from '$lib/types/subject';

	export let data: SubjectGradeDetails;
	export let semester: Semester | undefined = undefined;
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Subjects</Table.Head>
			<Table.Head>1st Period</Table.Head>
			<Table.Head>2nd Period</Table.Head>
			{#if data.education_level !== EducationLevel.SeniorHighSchool}
				<Table.Head>3rd Period</Table.Head>
				<Table.Head>4th Period</Table.Head>
			{/if}
			<Table.Head>Final Rating</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.subject_grades as { subject_name, grades, average_grade }, i (i)}
			<Table.Row>
				<Table.Cell>{subject_name}</Table.Cell>

				{#each grades as { grade }, j (j)}
					<Table.Cell>{grade}</Table.Cell>
				{/each}

				<Table.Cell>{average_grade}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
