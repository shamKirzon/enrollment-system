<script lang="ts">
	import { FormEnrollment } from '$lib/components/forms';
	import { ContentLayout } from '$lib/components/layouts';
	import * as Card from '$lib/components/ui/card';
	import { StudentStatus } from '$lib/types/enrollment.js';
	import Table from './table.svelte'

	export let data;

	let title = "Welcome Back!"
	let description = "You may now enroll."

	if(data.studentStatus === StudentStatus.New) {
		title = "Welcome!"
	}
</script>

<ContentLayout class="flex-col-reverse">
	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>{title}</Card.Title>
			<Card.Description>{description}</Card.Description>
		</Card.Header>
		<Card.Content>
			<FormEnrollment
				data={data.form}
				yearLevels={data.yearLevels || []}
				academicYears={data.academicYears || []}
				paymentModes={data.paymentModes || []}
				tuitionPlans={data.tuitionPlans || []}
				studentStatus={data.studentStatus || StudentStatus.New}
				strands={data.strands || []}
				user={data.user}
			/>

		</Card.Content>
	</Card.Root>

	<Card.Root class="w-full">
		<Card.Header>
			<Card.Title>Enrollment Fees</Card.Title>
			<Card.Description>See how much you have to pay</Card.Description>
		</Card.Header>
		<Card.Content>
		<Table data={data.enrollmentFeeLevels} />
		</Card.Content>
	</Card.Root>
</ContentLayout>
