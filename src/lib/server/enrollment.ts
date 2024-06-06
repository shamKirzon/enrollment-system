import type { EnrollmentSchema } from '$lib/schemas/enrollment';
import type { Infer, SuperValidated } from 'sveltekit-superforms';
import { error } from '@sveltejs/kit';
import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types/index.js';
import { StudentStatus, type PreviousReportCardPayload } from '$lib/types/enrollment';
import type { TransactionPayload } from '$lib/types/payment.js';

export async function submitEnrollment(
	fetch: (input: string | URL | Request, init?: RequestInit | undefined) => Promise<Response>,
	form: SuperValidated<Infer<EnrollmentSchema>>
) {
	const uploadPaymentReceipt = async (file: File, params: Record<string, any>) => {
		const queryString = new URLSearchParams(params).toString();
		const blob = new Blob([file], { type: 'image/*' });

		const response = await fetch(`${BACKEND_URL}/api/upload/payment-receipt.php?${queryString}`, {
			method: 'POST',
			body: blob
		});

		const result: Result<{ payment_receipt_url: string }> = await response.json();

		console.log(result.message);

		if (result.data?.payment_receipt_url === undefined) {
			error(404, 'Undefined payment receipt url.');
		}

		console.log(result.data?.payment_receipt_url);

		return result.data?.payment_receipt_url;
	};

	const createTransaction = async (transaction: TransactionPayload) => {
		const response = await fetch(`${BACKEND_URL}/api/transactions.php`, {
			method: 'POST',
			body: JSON.stringify(transaction),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			error(response.status, 'Failed to create transaction.');
		}

		const result: Result<{ transaction_id: string }> = await response.json();

		console.log(result.message);

		if (result.data?.transaction_id === undefined) {
			error(404, 'Transaction ID not returned.');
		}

		return result.data.transaction_id;
	};

	const createEnrollment = async (paymentReceiptUrl: string) => {
		const { student_id, academic_year_id, year_level_id } = form.data;

		const response = await fetch(`${BACKEND_URL}/api/enrollments/students.php`, {
			method: 'POST',
			body: JSON.stringify({
				student_id,
				academic_year_id,
				year_level_id,
				payment_receipt_url: paymentReceiptUrl
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			error(response.status, 'Failed to create enrollment.');
		}

		const result: Result<{ enrollment_id: string }> = await response.json();

		console.log(result.message);

		if (result.data?.enrollment_id === undefined) {
			error(404, 'Enrollment ID not returned.');
		}

		return result.data?.enrollment_id;
	};

	const createEnrollmentTransaction = async (payload: {
		enrollment_id: string;
		transaction_id: string;
	}) => {
		const response = await fetch(`${BACKEND_URL}/api/enrollments/transactions.php`, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			error(response.status, 'Failed to create enrollment transaction.');
		}

		const result: Result = await response.json();

		console.log(result.message);
	};

	const createEnrollmentStrand = async (payload: { enrollment_id: string; strand_id: string }) => {
		const response = await fetch(`${BACKEND_URL}/api/enrollments/strands.php`, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			error(response.status, 'Failed to create enrollment strand.');
		}

		const result: Result = await response.json();

		console.log(result.message);
	};

	// NOTE: Only applicable for those who chose the `installment` payment method
	const createEnrolledTuitionPlan = async (enrollmentId: string, tuitionPlanId: string) => {
		const response = await fetch(`${BACKEND_URL}/api/enrollments/tuition-plans.php`, {
			method: 'POST',
			body: JSON.stringify({
				enrollment_id: enrollmentId,
				tuition_plan_id: tuitionPlanId
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			error(response.status, 'Failed to create enrolled tuition plan.');
		}

		const result: Result = await response.json();

		console.log(result.message);
	};

	const uploadReportCard = async (file: File, params: Record<string, string>) => {
		const queryString = new URLSearchParams(params).toString();
		const blob = new Blob([file], { type: 'image/*' });

		const response = await fetch(`${BACKEND_URL}/api/upload/report-card.php?${queryString}`, {
			method: 'POST',
			body: blob
		});

		const result: Result<{ report_card_url: string }> = await response.json();

		console.log(result.message);

		if (result.data?.report_card_url === undefined) {
			error(404, 'Report card URL not returned.');
		}

		return result.data?.report_card_url;
	};

	const insertPreviousReportCard = async (payload: PreviousReportCardPayload) => {
		const response = await fetch(`${BACKEND_URL}/api/previous-report-cards.php`, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			error(response.status, 'Failed to insert previous report card.');
		}

		const result: Result = await response.json();

		console.log(result.message);
	};

	const sendEmails = async (payload: {
		user_id: string;
		file_url: string;
		subject: string;
		body: string;
	}) => {
		console.log("Sending emails...")

		const response = await fetch(`${BACKEND_URL}/api/mail.php`, {
			method: 'POST',
			body: JSON.stringify(payload),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			error(response.status, 'Failed to send emails.');
		}

		const result: Result = await response.json();

		console.log(result.message);
	};

	const {
		transaction_number,
		payment_method,
		payment_amount,
		payment_mode_id,
		student_id,
		academic_year_id,
		year_level_id,
		academic_year_name
	} = form.data;

	const params = {
		student_id,
		academic_year_id,
		year_level_id
	};

	const paymentReceiptUrl = await uploadPaymentReceipt(form.data.payment_receipt, params);

	const transactionId = await createTransaction({
		transaction_number,
		payment_method,
		payment_amount,
		payment_mode_id,
		payment_receipt_url: paymentReceiptUrl
	});
	const enrollmentId = await createEnrollment(paymentReceiptUrl);

	await createEnrollmentTransaction({
		enrollment_id: enrollmentId,
		transaction_id: transactionId
	});

	if (form.data.strand_id) {
		await createEnrollmentStrand({ enrollment_id: enrollmentId, strand_id: form.data.strand_id });
	}

	if (form.data.tuition_plan_id) {
		await createEnrolledTuitionPlan(enrollmentId, form.data.tuition_plan_id);
	}

	if (form.data.student_status === StudentStatus.New) {
		if (form.data.report_card === undefined) {
			error(404, 'Report Card file not found.');
		}

		const reportCardUrl = await uploadReportCard(form.data.report_card, { student_id });

		await insertPreviousReportCard({
			enrollment_id: enrollmentId,
			report_card_url: reportCardUrl
		});
	}

	await sendEmails({
		user_id: student_id,
		file_url: paymentReceiptUrl,
		subject: `Pateros Catholic School: Enrollment Successful - S.Y ${academic_year_name}`,
		body: `Thank you for enrolling on school year <b>${academic_year_name}</b>.<br>Your payment receipt is attached below.`
	});
}
