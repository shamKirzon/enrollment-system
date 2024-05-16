import { enrollmentSchema } from '$lib/schemas/enrollment.js';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types/index.js';
import type { AcademicYearWithStudentCount, YearLevel } from '$lib/types/enrollment.js';

export const load: PageServerLoad = async ({ fetch }) => {
	const getAcademicYears = async () => {
		const response = await fetch(`${BACKEND_URL}/api/academic-years.php`, { method: 'GET' });
		const result: Result<{ academic_years: AcademicYearWithStudentCount[] }> =
			await response.json();

		console.log(result.message);

		return result;
	};

	const getYearLevels = async () => {
		const response = await fetch(`${BACKEND_URL}/api/year-levels.php`, { method: 'GET' });
		const result: Result<{ year_levels: YearLevel[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	// const { data } = await getAcademicYears();

	return {
		form: await superValidate(zod(enrollmentSchema)),
		yearLevels: (await getYearLevels()).data?.year_levels,
		academicYears: (await getAcademicYears()).data?.academic_years
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

		const params = {
			student_id: userId,
			academic_year_id: form.data.academic_year_id,
			year_level_id: form.data.year_level_id
		};

		const paymentReceiptUrl = await uploadPaymentReceipt(
			event.fetch,
			form.data.payment_receipt,
			params
		);

		const { payment_receipt, ...enrollmentData } = form.data;

		const response = await event.fetch(`${BACKEND_URL}/api/enrollments/students.php`, {
			method: 'POST',
			body: JSON.stringify({ ...enrollmentData, payment_receipt_url: paymentReceiptUrl }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const result = await response.json();

		console.log(result);

		return withFiles({
			message: 'Successfully submitted enrollment.',
			form
		});
	}
};

async function uploadPaymentReceipt(
	fetch: (input: string | Request | URL, init?: RequestInit | undefined) => Promise<Response>,
	file: File,
	params: Record<string, any>
): Promise<string> {
	const queryString = new URLSearchParams(params).toString();
	const blob = new Blob([file], { type: 'image/*' });

	const response = await fetch(`${BACKEND_URL}/api/upload/payment-receipt.php?${queryString}`, {
		method: 'POST',
		body: blob
	});

	const result: Result<{ payment_receipt_url: string }> = await response.json();

	if (result.data?.payment_receipt_url === undefined) {
		error(404, 'Undefined payment receipt url.');
	}

	return result.data?.payment_receipt_url;
}
