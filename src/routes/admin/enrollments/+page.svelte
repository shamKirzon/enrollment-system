<script lang="ts">
	import { ContentLayout } from '$lib/components/layouts/index.js';
	import { EnrollmentsTable } from '$lib/components/tables';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import CirclePlusOutline from 'virtual:icons/flowbite/circle-plus-outline';
	import {
		AcademicYearsCombobox,
		EnrollmentStatusCombobox,
		YearLevelCombobox
	} from '$lib/components/combobox';
	import { EnrollmentsPagination } from '$lib/components/paginations';

	export let data;

	const academicYears = data.academicYears.map((ay) => {
		return {
			id: ay.id,
			start_at: ay.start_at,
			end_at: ay.end_at
		};
	});
</script>

<ContentLayout class="flex-col">
	<div class="flex gap-2 justify-between">
		<div class="flex gap-2">
			<AcademicYearsCombobox {academicYears} />
			<YearLevelCombobox yearLevels={data.yearLevels} />
		</div>
		<EnrollmentStatusCombobox />
	</div>

	<div class="flex w-full h-full flex-col gap-2">
		<!-- <div class="flex flex-col h-full bg-blue-200">fff</div> -->
		<Card.Root class="w-full h-full flex flex-col overflow-y-auto">
			<Card.Header class="flex flex-row items-center justify-between">
				<div>
					<Card.Title>Enrollments</Card.Title>
					<Card.Description>A list of enrolled students.</Card.Description>
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
							<Dialog.Title>Create a new enrollment entry</Dialog.Title>
						</Dialog.Header>
					</Dialog.Content>
				</Dialog.Root>
			</Card.Header>
			<Card.Content class="h-full overflow-y-auto flex flex-col">
				<EnrollmentsTable data={data.enrollments} />
			</Card.Content>
		</Card.Root>

		<!-- <div class="h-10 w-full flex bg-red-500">foo</div> -->
		<EnrollmentsPagination count={data.enrollmentCount} />
	</div>
</ContentLayout>
