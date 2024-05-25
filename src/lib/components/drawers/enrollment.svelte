<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Table from '$lib/components/ui/table';
	import type { EnrollmentWithDetails } from '$lib/types/enrollment';
	import { format } from 'date-fns';

	export let enrollment: EnrollmentWithDetails;
	export let isOpen: boolean = false;

	const studentName = `${enrollment.last_name}, ${enrollment.first_name} ${enrollment.middle_name ? `${enrollment.middle_name}.` : ''}`;
	const academicYear = `${format(enrollment.academic_year_start_at, 'yyyy')} - ${format(enrollment.academic_year_end_at, 'yyyy')}`;

	const enrollmentDate = format(enrollment.enrolled_at, 'MMMM d, yyyy - h:mm a');
</script>

<Drawer.Root shouldScaleBackground bind:open={isOpen}>
	<Drawer.Content class="max-h-[75svh] h-full">
		<!-- <Drawer.Header> -->
		<!-- 	<Drawer.Title>Enrollment</Drawer.Title> -->
		<!-- 	<Drawer.Description>{studentName}</Drawer.Description> -->
		<!-- </Drawer.Header> -->

		<div class="p-4 flex gap-4">
			<Table.Root class="max-w-[50%]">
				<!-- <Table.Header> -->
				<!-- </Table.Header> -->
				<Table.Body>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Cell>{studentName}</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Head>Enrollment Date</Table.Head>
						<Table.Cell>{enrollmentDate}</Table.Cell>
					</Table.Row>
					<!-- <Table.Row> -->
					<!-- 	<Table.Head>Enrollment ID</Table.Head> -->
					<!-- 	<Table.Cell>{enrollment.enrollment_id}</Table.Cell> -->
					<!-- </Table.Row> -->
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
						<Table.Cell>{enrollment.status}</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Head>Student Status</Table.Head>
						<Table.Cell>{enrollment.student_status}</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Head>Payment Method</Table.Head>
						<Table.Cell>{enrollment.payment_method}</Table.Cell>
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

			<div class="max-w-[50%] flex gap-4">
				<a href={enrollment.payment_receipt_url} target="_blank" rel="noreferrer">
					<img
						src={enrollment.payment_receipt_url}
						alt="Payment Receipt"
						class="object-cover w-full rounded-md"
					/>
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
