<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { FormSectionAssignment } from '$lib/components/forms';
	import { TableSectionAssignments } from '$lib/components/tables/admin';
	import { writable } from 'svelte/store';

	export let data;

	const selectedRows = writable<string[]>([]);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Section Assignment</Card.Title>
		<Card.Description>Assign students to their sections</Card.Description>
	</Card.Header>
	<Card.Content>
		<FormSectionAssignment
			data={data.form}
			yearLevels={data.yearLevels || []}
			academicYears={data.academicYears || []}
		/>
	</Card.Content>
</Card.Root>

<Card.Root>
	<Card.Header>
		<Card.Title>Insert Title Help</Card.Title>
		<Card.Description>Description</Card.Description>
	</Card.Header>
	<Card.Content>
		<TableSectionAssignments data={data.sectionAssignments || []} {selectedRows} />
	</Card.Content>
</Card.Root>
