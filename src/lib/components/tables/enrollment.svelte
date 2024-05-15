<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import * as Card from '$lib/components/ui/card';
	import type { AcademicYearEnrollment } from '$lib/types/enrollment';
	import { format } from 'date-fns';

	export let enrollments: AcademicYearEnrollment[];
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Academic Years</Card.Title>
		<Card.Description>Your previously enrolled academic years.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Year</Table.Head>
					<Table.Head>Level</Table.Head>
					<Table.Head>Section</Table.Head>
					<Table.Head>Tuition Plan</Table.Head>
					<Table.Head>Enrollment Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each enrollments as enrollment (enrollment.academic_year_id)}
					{@const year = `${format(enrollment.start_at, 'yyyy')} - ${format(enrollment.end_at, 'yyyy')}`}

					<Table.Row>
						<Table.Cell class="font-medium">{year}</Table.Cell>
						<Table.Cell>{enrollment.year_level}</Table.Cell>
						<Table.Cell>{enrollment.section || '---'}</Table.Cell>
						<Table.Cell>{enrollment.tuition_plan || '---'}</Table.Cell>
						<Table.Cell>{enrollment.enrollment_status}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
