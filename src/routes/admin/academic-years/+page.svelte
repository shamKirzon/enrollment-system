<script lang="ts">
	import { Pagination } from '$lib/components';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { AcademicYearsTable } from '$lib/components/tables/admin';
	import { Button } from '$lib/components/ui/button';
	import CirclePlusOutline from 'virtual:icons/flowbite/circle-plus-outline';
	import { CreateAcademicYearForm } from '$lib/components/forms';
	import { ContentLayout } from '$lib/components/layouts';

	export let data;
</script>

<ContentLayout>
	<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
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
				<AcademicYearsTable data={data.academicYears?.academic_years || []} />
			</Card.Content>
		</Card.Root>

		<Pagination count={data.academicYears?.count || 0} />
	</div>
</ContentLayout>
