<script lang="ts">
	import { TableEnrollment } from '$lib/components/tables';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { EnrollmentStatus } from '$lib/types/enrollment';
	import { setContext } from 'svelte';

	export let data;

	setContext('enrollmentForm', data.form);
</script>

<div class="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12 flex w-full gap-2 h-full">
	<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
		<div class="flex gap-2">
			<Card.Root>
				<Card.Header>
					<Card.Title>Insert Some Title Here</Card.Title>
					<Card.Description>Hello world</Card.Description>
				</Card.Header>
				<Card.Content>
					{#if data.enrollments.data?.academic_year_enrollments.some((e) => !e.enrollment_status)}
						<div>
							<p>Pls enroll (´,,•ω•,,)♡</p>

							<a href="/enrollments" class={buttonVariants({ variant: 'default' })}> Enroll </a>
						</div>
					{:else if data.enrollments.data?.academic_year_enrollments.some((e) => e.enrollment_status === EnrollmentStatus.Pending)}
						<div>
							<p>Thank you for enrolling!</p>

							<p>Please wait for your enrollment to be approved.</p>
						</div>
					{:else}
						<div>
							<p>Your enrollment has been approved.</p>

							<p>Welcome to a new journey in Pateros Catholic School!</p>
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>

		<TableEnrollment enrollments={data.enrollments.data?.academic_year_enrollments || []} />
	</div>
</div>
