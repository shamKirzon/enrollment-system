<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import { EducationLevel, Semester } from '$lib/types/enrollment';
	import { roundNumber } from '$lib';
	import type { SubjectGradeDetails } from '$lib/types/subject';

	export let data: SubjectGradeDetails;
	export let semester: Semester | undefined = undefined;

</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Subjects</Table.Head>
			<Table.Head>1st</Table.Head>
			<Table.Head>2nd</Table.Head>
			{#if data.education_level !== EducationLevel.SeniorHighSchool}
				<Table.Head>3rd</Table.Head>
				<Table.Head>4th</Table.Head>
			{/if}
			<Table.Head>Final Rating</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.subject_grades as { subject_name, grades, average_grade }, i (i)}
			<Table.Row>
				<Table.Cell class="w-2/5">{subject_name}</Table.Cell>

				{#each grades as { grade }, j (j)}
					<Table.Cell>{grade ? roundNumber(grade, 0) : '---'}</Table.Cell>
				{/each}

				<Table.Cell>{average_grade ? roundNumber(average_grade, 3) : '---'}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
