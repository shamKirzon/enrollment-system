<script lang="ts">
	import { ayFormat } from '$lib';
	import { pcsAnnex } from '$lib/assets/images/index.js';
	import { Pagination } from '$lib/components';
	import { ProfileStudent } from '$lib/components/profiles/index.js';
	import { TableEnrollment } from '$lib/components/tables';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { EnrollmentStatus } from '$lib/types/enrollment';
	import { Role } from '$lib/types/user';
	import { setContext } from 'svelte';

	import Enroll from 'virtual:icons/fluent/notepad-edit-16-regular';

	export let data;

	setContext('enrollmentForm', data.form);

	$: latestAcademicYear = ayFormat(
		data.enrollments.academic_year_enrollments[0].academic_year_start_at,
		data.enrollments.academic_year_enrollments[0].academic_year_end_at,
		'label'
	);

	$: isEnrollmentOpen = data.enrollments?.academic_year_enrollments.some(
		(e) => !e.enrollment_status
	);
	$: isEnrollmentPending = data.enrollments?.academic_year_enrollments.some(
		(e) => e.enrollment_status === EnrollmentStatus.Pending
	);
</script>

<div class="flex gap-2">
	<ProfileStudent
		props={{
			familyMembers: data.familyMembers,
			profile: data.profile,
			user: data.user
		}}
	/>

	<div class="flex flex-col gap-2 flex-[2_2_0%] h-full">
		<div class="flex gap-2">
			<Card.Root class="w-full">
				<Card.Header class="space-y-0 flex-row items-center justify-between">
					<div class="space-y-1.5">
						<Card.Title class="text-2xl font-inter-bold">
							{#if isEnrollmentOpen}
								Enrollments are now open!
							{:else if isEnrollmentPending}
								Thank you for enrolling!
							{:else}
								Your enrollment has been approved!
							{/if}
						</Card.Title>
						<Card.Description>
							{#if isEnrollmentOpen}
								You may now enroll for school year {latestAcademicYear}
							{:else if isEnrollmentPending}
								Please wait for your enrollment to be approved.
							{:else}
								Welcome to a new journey of faith in Pateros Catholic School.
							{/if}
						</Card.Description>
					</div>

					<a href="/enrollments" class={`${buttonVariants({ variant: 'default' })} gap-1`}>
						<Enroll />
						Enroll Now
					</a>
				</Card.Header>
			</Card.Root>
		</div>

		<Card.Root>
			<Card.Header>
				<Card.Title>Enrollments</Card.Title>
				<Card.Description>Your previously enrolled academic years.</Card.Description>
			</Card.Header>
			<Card.Content>
				<TableEnrollment enrollments={data.enrollments?.academic_year_enrollments || []} />
			</Card.Content>
		</Card.Root>

		<Pagination count={data.enrollments?.count || 1} />
	</div>
</div>
