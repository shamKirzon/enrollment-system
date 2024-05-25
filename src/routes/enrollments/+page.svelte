<script lang="ts">
	import { FormEnrollment } from '$lib/components/forms';
	import { ContentLayout } from '$lib/components/layouts';
	import * as Card from '$lib/components/ui/card';
	import { StudentStatus } from '$lib/types/enrollment.js';

	export let data;
</script>

<ContentLayout class="flex-col">
	<div>
		{#if data.studentStatus === StudentStatus.New}
			<p>Welcome!</p>
		{:else}
			<p>Welcome Back!</p>
		{/if}
	</div>

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
				tuitionPlans={data.tuitionPlans || []}
				studentStatus={data.studentStatus || StudentStatus.New}
			/>
		</Card.Content>
	</Card.Root>
</ContentLayout>
