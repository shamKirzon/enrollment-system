<script lang="ts">
	import { CreateAcademicYearForm } from '$lib/components/forms';
	import { ContentLayout } from '$lib/components/layouts';
	import { AcademicYearsTable } from '$lib/components/tables';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { setContext } from 'svelte';
	import CirclePlusOutline from 'virtual:icons/flowbite/circle-plus-outline';

	export let data;

	let totalStudents = 0;

	data.academicYears?.map((ay) => (totalStudents += ay.student_count));

	setContext('form', data.form);
</script>

<ContentLayout>
	<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
		<div class="flex gap-2">
			<Card.Root>
				<Card.Header>
					<Card.Description>Students Enrolled</Card.Description>
					<Card.Title class="text-4xl">{totalStudents}</Card.Title>
				</Card.Header>
			</Card.Root>
		</div>

		<Card.Root>
			<Card.Header class="flex flex-row items-center justify-between">
				<div>
					<Card.Title>Academic Years</Card.Title>
					<Card.Description>Previous academic years.</Card.Description>
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
							<Dialog.Title>Create a new academic year</Dialog.Title>
						</Dialog.Header>

						<CreateAcademicYearForm data={data.form} />
					</Dialog.Content>
				</Dialog.Root>
			</Card.Header>
			<Card.Content>
				<AcademicYearsTable data={data.academicYears} />
			</Card.Content>
		</Card.Root>
	</div>
</ContentLayout>
