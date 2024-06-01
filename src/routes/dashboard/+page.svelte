<script lang="ts">
	import { Pagination } from '$lib/components';
	import { TableEnrollment } from '$lib/components/tables';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { EnrollmentStatus } from '$lib/types/enrollment';
	import { Role } from '$lib/types/user';
	import { setContext } from 'svelte';

	export let data;

	setContext('enrollmentForm', data.form);
</script>

{#if data.enrollments === undefined}
	You do not have student yet xD
{:else}
	<div class="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12 flex w-full gap-2 h-full">
		<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
			<div class="flex gap-2">
				<Card.Root>
					<Card.Header>
						<Card.Title>Insert Some Title Here</Card.Title>
						<Card.Description>Hello world</Card.Description>
					</Card.Header>
					<Card.Content>
						{#if data.enrollments?.data?.academic_year_enrollments.some((e) => !e.enrollment_status)}
							<div>
								<p>Pls enroll (´,,•ω•,,)♡</p>

								<a href="/enrollments" class={buttonVariants({ variant: 'default' })}> Enroll </a>
							</div>
						{:else if data.enrollments?.data?.academic_year_enrollments.some((e) => e.enrollment_status === EnrollmentStatus.Pending)}
							<div>
								{#if data.user?.role === Role.Parent}
									<p>Thank you for enrolling your child!</p>
									<p>Please wait for the enrollment to be approved.</p>
								{:else}
									<p>Thank you for enrolling!</p>
									<p>Please wait for your enrollment to be approved.</p>
								{/if}
							</div>
						{:else}
							<div>
								{#if data.user?.role === Role.Parent}
									<p>Your child's enrollment has been approved.</p>
								{:else}
									<p>Your enrollment has been approved.</p>
								{/if}
								<p>Welcome to a new journey in Pateros Catholic School!</p>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>

			<Card.Root>
				<Card.Header>
					<Card.Title>Enrollments</Card.Title>
					<Card.Description>Your previously enrolled academic years.</Card.Description>
				</Card.Header>
				<Card.Content>
					<TableEnrollment enrollments={data.enrollments?.data?.academic_year_enrollments || []} />
				</Card.Content>
			</Card.Root>

			<Pagination count={data.enrollments?.count || 1} />
		</div>
	</div>
{/if}
