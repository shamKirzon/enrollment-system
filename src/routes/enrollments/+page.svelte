<script lang="ts">
	import { FormEnrollment } from '$lib/components/forms';
	import { ContentLayout } from '$lib/components/layouts';
	import * as Card from '$lib/components/ui/card';

	export let data;
</script>

<ContentLayout>
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Enrollment</Card.Title>
			<Card.Description>Description here</Card.Description>
		</Card.Header>
		<Card.Content>
			<FormEnrollment
				data={data.form}
				yearLevels={data.yearLevels || []}
				academicYears={data.academicYears || []}
				paymentModes={data.paymentModes || []}
			/>
		</Card.Content>
	</Card.Root>
</ContentLayout>
