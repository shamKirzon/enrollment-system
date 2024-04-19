<script lang="ts">
	import { AcademicYearsTable } from '$lib/components/tables';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

<div class="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12 flex w-full gap-2 h-full">
	<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
		<div class="flex gap-2">
			<Card.Root>
				<Card.Header>
					<Card.Description>Students Enrolled</Card.Description>
					<Card.Title class="text-4xl">100,000</Card.Title>
				</Card.Header>
			</Card.Root>
		</div>

		<Card.Root>
			<Card.Header>
				<Card.Title>Academic Years</Card.Title>
				<Card.Description>Previous academic years.</Card.Description>
			</Card.Header>
			<Card.Content>
				<AcademicYearsTable data={data.academicYears} />
			</Card.Content>
		</Card.Root>
	</div>
</div>
