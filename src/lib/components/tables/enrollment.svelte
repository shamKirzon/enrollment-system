<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { AcademicYearEnrollment } from '$lib/types/enrollment';
	import { format } from 'date-fns';

	export let enrollments: AcademicYearEnrollment[];
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Year</Table.Head>
			<Table.Head>Level</Table.Head>
			<Table.Head>Section</Table.Head>
			<Table.Head>Enrollment Status</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each enrollments as enrollment, idx (idx)}
			{@const year = `${format(enrollment.academic_year_start_at, 'yyyy')} - ${format(enrollment.academic_year_end_at, 'yyyy')}`}

			<Table.Row>
				<Table.Cell class="font-medium">{year}</Table.Cell>
				<Table.Cell>{enrollment.year_level_name || '---'}</Table.Cell>
				<Table.Cell
					>{enrollment.section_name
						? `St. ${enrollment.section_name}${enrollment.strand_id ? ` - ${enrollment.strand_id.toUpperCase()}` : ''}`
						: '---'}</Table.Cell
				>
				<Table.Cell>{enrollment.enrollment_status || '---'}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
