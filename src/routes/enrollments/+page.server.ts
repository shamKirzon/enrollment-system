import { enrollmentSchema } from '$lib/schemas/enrollment.js';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types/index.js';
import {
	StudentStatus,
	type AcademicYear,
	type PreviousReportCardPayload,
	type YearLevel
} from '$lib/types/enrollment.js';
import type { PaymentMode, TransactionPayload, TuitionPlan } from '$lib/types/payment.js';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const getAcademicYears = async () => {
		const response = await fetch(`${BACKEND_URL}/api/academic-years.php?status=open`, {
			method: 'GET'
		});
		const result: Result<{ academic_years: AcademicYear[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	const getYearLevels = async () => {
		const response = await fetch(`${BACKEND_URL}/api/year-levels.php`, { method: 'GET' });
		const result: Result<{ year_levels: YearLevel[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	const getPaymentModes = async () => {
		const response = await fetch(`${BACKEND_URL}/api/payments/modes.php`, { method: 'GET' });
		const result: Result<{ payment_modes: PaymentMode[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	const getTuitionPlans = async () => {
		const response = await fetch(`${BACKEND_URL}/api/tuition-plans.php`, { method: 'GET' });
		const result: Result<{ tuition_plans: TuitionPlan[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	const getStudentStatus = async () => {
		const userData = await locals.getUserData();

		const response = await fetch(
			`${BACKEND_URL}/api/students/status.php?student_id=${userData?.data?.user?.id}`,
			{ method: 'GET' }
		);
		const result: Result<{ student_status: StudentStatus }> = await response.json();

		console.log(result.message);

		return result;
	};

	return {
		form: await superValidate(zod(enrollmentSchema)),
		yearLevels: (await getYearLevels()).data?.year_levels,
		academicYears: (await getAcademicYears()).data?.academic_years,
		paymentModes: (await getPaymentModes()).data?.payment_modes,
		tuitionPlans: (await getTuitionPlans()).data?.tuition_plans,
		studentStatus: (await getStudentStatus()).data?.student_status
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(enrollmentSchema));

		const { data } = await event.locals.getUserData();
		const userId = data?.user?.id;

		if (userId === undefined) {
			error(404, 'User ID not found.');
		}

		form.data.student_id = userId;

		if (!form.valid) {
			return fail(
				400,
				withFiles({
					message: 'Invalid form data.',
					form
				})
			);
		}

		// TODO: A combination of `/enrollments/students.php` payload and `/transactions.php` payload
		// 1. Submit the transaction
		// 2. Get the submitted transaction's ID,
		// 3. Submit the enrollment

		const uploadPaymentReceipt = async (file: File, params: Record<string, any>) => {
			const queryString = new URLSearchParams(params).toString();
			const blob = new Blob([file], { type: 'image/*' });

			const response = await event.fetch(
				`${BACKEND_URL}/api/upload/payment-receipt.php?${queryString}`,
				{
					method: 'POST',
					body: blob
				}
			);

			const result: Result<{ payment_receipt_url: string }> = await response.json();

			console.log(result.message);

			if (result.data?.payment_receipt_url === undefined) {
				error(404, 'Undefined payment receipt url.');
			}

			return result.data?.payment_receipt_url;
		};

		const createTransaction = async (transaction: TransactionPayload) => {
			const response = await event.fetch(`${BACKEND_URL}/api/transactions.php`, {
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

		const createEnrollment = async (paymentReceiptUrl: string, transactionId: string) => {
			const { student_id, academic_year_id, year_level_id } = form.data;

			const response = await event.fetch(`${BACKEND_URL}/api/enrollments/students.php`, {
				method: 'POST',
				body: JSON.stringify({
					student_id,
					academic_year_id,
					year_level_id,
					payment_receipt_url: paymentReceiptUrl,
					transaction_id: transactionId
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

		// NOTE: Only applicable for those who chose the `installment` payment method
		const createEnrolledTuitionPlan = async (enrollmentId: string, tuitionPlanId: string) => {
			const response = await event.fetch(`${BACKEND_URL}/api/enrollments/tuition-plans.php`, {
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

			const response = await event.fetch(
				`${BACKEND_URL}/api/upload/report-card.php?${queryString}`,
				{
					method: 'POST',
					body: blob
				}
			);

			const result: Result<{ report_card_url: string }> = await response.json();

			console.log(result.message);

			if (result.data?.report_card_url === undefined) {
				error(404, 'Report card URL not returned.');
			}

			return result.data?.report_card_url;
		};

		const insertPreviousReportCard = async (payload: PreviousReportCardPayload) => {
			const response = await event.fetch(`${BACKEND_URL}/api/previous-report-cards.php`, {
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

		const params = {
			student_id: userId,
			academic_year_id: form.data.academic_year_id,
			year_level_id: form.data.year_level_id
		};

		const paymentReceiptUrl = await uploadPaymentReceipt(form.data.payment_receipt, params);

		const { transaction_number, payment_method, payment_amount, payment_mode_id } = form.data;

		const transactionId = await createTransaction({
			transaction_number,
			payment_method,
			payment_amount,
			payment_mode_id,
			payment_receipt_url: paymentReceiptUrl
		});
		const enrollmentId = await createEnrollment(paymentReceiptUrl, transactionId);

		if (form.data.tuition_plan_id) {
			await createEnrolledTuitionPlan(enrollmentId, form.data.tuition_plan_id);
		}

		if (form.data.student_status === StudentStatus.New) {
			if (form.data.report_card === undefined) {
				error(404, 'Report Card file not found.');
			}

			const reportCardUrl = await uploadReportCard(form.data.report_card, { student_id: userId });

			await insertPreviousReportCard({
				enrollment_id: enrollmentId,
				report_card_url: reportCardUrl
			});
		}

		return withFiles({
			message: 'Successfully submitted enrollment.',
			form
		});
	}
};
