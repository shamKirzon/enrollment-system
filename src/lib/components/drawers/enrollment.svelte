<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Table from '$lib/components/ui/table';
	import type { EnrollmentWithDetails } from '$lib/types/enrollment';
	import { format } from 'date-fns';
	import { BadgeEnrollment, BadgeStudentStatus } from '../badges';
	import { capitalizeFirstLetter } from '$lib';
	import { Separator } from '../ui/separator';
	import ExternalLink from 'virtual:icons/lucide/external-link';
	import Link from '../link.svelte';

	export let enrollment: EnrollmentWithDetails;
	export let isOpen: boolean = false;

	const studentName = `${enrollment.last_name}, ${enrollment.first_name} ${enrollment.middle_name ? `${enrollment.middle_name}.` : ''}`;
	const academicYear = `${format(enrollment.academic_year_start_at, 'yyyy')} - ${format(enrollment.academic_year_end_at, 'yyyy')}`;

	const enrollmentDate = format(enrollment.enrolled_at, 'MMMM d, yyyy - h:mm a');
</script>

<Drawer.Root shouldScaleBackground bind:open={isOpen}>
	<Drawer.Content class="max-h-[75svh] h-full px-10">
		<!-- <Drawer.Header> -->
		<!-- 	<Drawer.Title class="text-2xl">Enrollment Details</Drawer.Title> -->
		<!-- <Drawer.Description>{studentName}</Drawer.Description> -->
		<!-- </Drawer.Header> -->

		<div class="flex gap-4 pt-10">
			<div class="flex flex-col gap-2 w-full">
				<h2 class="font-inter-bold text-2xl">Enrollment Details</h2>
				<Table.Root class="w-full">
					<!-- <Table.Header> -->
					<!-- </Table.Header> -->
					<Table.Body>
						<Table.Row>
							<Table.Head>Name</Table.Head>
							<Table.Cell>
								<Link href={`/admin/users/students/${enrollment.student_id}`}>
									{studentName}
								</Link>
							</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head>Enrollment Date</Table.Head>
							<Table.Cell>{enrollmentDate}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head>Year Level</Table.Head>
							<Table.Cell>{enrollment.year_level_name}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head>Academic Year</Table.Head>
							<Table.Cell>{academicYear}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head>Enrollment Status</Table.Head>
							<Table.Cell>
								<BadgeEnrollment value={enrollment.status} />
							</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head>Student Status</Table.Head>
							<Table.Cell>
								<BadgeStudentStatus />
							</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head>Payment Method</Table.Head>
							<Table.Cell>{capitalizeFirstLetter(enrollment.payment_method)}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head>Payment Amount</Table.Head>
							<Table.Cell>Php. {enrollment.payment_amount}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head>Tuition Plan</Table.Head>
							<Table.Cell>{enrollment.tuition_plan_name?.toUpperCase() || '---'}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Head>Transaction No.</Table.Head>
							<Table.Cell>{enrollment.transaction_number}</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table.Root>
			</div>

			<Separator orientation="vertical" />

			<div class="w-full flex gap-2 flex-col">
				<h2 class="font-inter-bold text-2xl">Payment Receipt</h2>
				<a
					href={enrollment.payment_receipt_url}
					target="_blank"
					rel="noreferrer"
					class="relative max-h-[60%] [&>img]:hover:scale-110 overflow-hidden rounded-lg"
				>
					<img
						src={enrollment.payment_receipt_url}
						alt="Payment Receipt"
						class="object-cover w-full rounded-md brightness-[0.3] h-full transition-all ease-in-out duration-300"
					/>
					<div
						class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-foreground text-2xl flex gap-2"
					>
						<p class="text-primary-foreground font-inter-semibold">Click to view</p>
						<ExternalLink />
					</div>
				</a>

				<!-- <a href={enrollment.payment_receipt_url} target="_blank" rel="noreferrer"> -->
				<!-- 	<img -->
				<!-- 		src={enrollment.payment_receipt_url} -->
				<!-- 		alt="Payment Receipt" -->
				<!-- 		class="object-cover w-full rounded-md" -->
				<!-- 	/> -->
				<!-- </a> -->
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
