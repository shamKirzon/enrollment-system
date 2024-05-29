<script lang="ts">
	import { FormEnrollment } from '$lib/components/forms';
	import { ContentLayout } from '$lib/components/layouts';
	import * as Card from '$lib/components/ui/card';
	import { StudentStatus } from '$lib/types/enrollment.js';
	import { Role } from '$lib/types/user';

	export let data;
</script>

<ContentLayout class="flex-col">
	<div>
		{#if data.studentStatus === StudentStatus.New}
			<p>Welcome!</p>
			{#if data.user?.role === Role.Parent}
				<p>You may now enroll your child: {data.student?.first_name}</p>
			{:else}
				<p>You may now enroll</p>
			{/if}
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
