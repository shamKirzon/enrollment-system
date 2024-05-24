import { enrollmentSchema } from '$lib/schemas/enrollment.js';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types/index.js';
import type { AcademicYear, YearLevel } from '$lib/types/enrollment.js';
import type { PaymentMode, TuitionPlan } from '$lib/types/payment.js';

export const load: PageServerLoad = async ({ fetch }) => {
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

	// const { data } = await getAcademicYears();

	return {
		form: await superValidate(zod(enrollmentSchema)),
		yearLevels: (await getYearLevels()).data?.year_levels,
		academicYears: (await getAcademicYears()).data?.academic_years,
		paymentModes: (await getPaymentModes()).data?.payment_modes,
		tuitionPlans: (await getTuitionPlans()).data?.tuition_plans
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

		const createTransaction = async () => {
			const {
				transaction_number,
				payment_receipt,
				payment_method,
				payment_amount,
				payment_mode_id
			} = form.data;

			const transactionBody = {
				transaction_number,
				payment_amount,
				payment_method,
				payment_receipt,
				payment_mode_id
			};

			const response = await event.fetch(`${BACKEND_URL}/api/transactions.php`, {
				method: 'POST',
				body: JSON.stringify(transactionBody),
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

			const result: Result = await response.json();

			console.log(result.message);
		};

		// NOTE: Only applicable for those who chose the `installment` payment method
		const createEnrolledTuitionPlan = async () => {
			const response = await event.fetch(`${BACKEND_URL}/api/enrollments/tuition-plans.php`, {
				method: 'POST',
				body: JSON.stringify({
					enrollment_id: '',
					tuition_plan_id: ''
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});
		};

		const params = {
			student_id: userId,
			academic_year_id: form.data.academic_year_id,
			year_level_id: form.data.year_level_id
		};

		const paymentReceiptUrl = await uploadPaymentReceipt(form.data.payment_receipt, params);
		const transactionId = await createTransaction();

		await createEnrollment(paymentReceiptUrl, transactionId);

		return withFiles({
			message: 'Successfully submitted enrollment.',
			form
		});
	}
};
