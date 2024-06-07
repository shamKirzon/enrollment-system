import { enrollmentSchema, type EnrollmentSchema } from '$lib/schemas/enrollment.js';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { fail, superValidate, withFiles, type Infer, type SuperValidated } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types/index.js';
import {
	StudentStatus,
	type AcademicYear,
	type EnrollmentFeeLevelDetails,
	type PreviousReportCardPayload,
	type Strand,
	type YearLevel
} from '$lib/types/enrollment.js';
import type { PaymentMode, TransactionPayload, TuitionPlan } from '$lib/types/payment.js';
import { submitEnrollment } from '$lib/server/enrollment.js';

export const load: PageServerLoad = async ({ fetch, locals, url }) => {
	const getAcademicYears = async () => {
		const response = await fetch(`${BACKEND_URL}/api/academic-years.php?status=open`, {
			method: 'GET'
		});

		if(!response.ok) {
			error(response.status, "Failed to fetch academic years.")
		}

		const result: Result<{ academic_years: AcademicYear[] }> = await response.json();

		console.log(result.message);

		if(result.data === undefined) {
			error(404, "Academic years undefined.")
		}

		return result;
	};

	const getYearLevels = async () => {
		const response = await fetch(`${BACKEND_URL}/api/year-levels.php`, { method: 'GET' });
		const result: Result<{ year_levels: YearLevel[] }> = await response.json();

		console.log(result.message);

		if(result.data === undefined) {
			error(404, "Year levels undefined.")
		}

		return result;
	};

	const getStrands = async () => {
		const response = await fetch(`${BACKEND_URL}/api/strands.php`, { method: 'GET' });
		const result: Result<{ strands: Strand[] }> = await response.json();

		console.log(result.message);

		if(result.data === undefined) {
			error(404, "Strands undefined.")
		}

		return result;
	};

	const getPaymentModes = async () => {
		const response = await fetch(`${BACKEND_URL}/api/payments/modes.php`, { method: 'GET' });
		const result: Result<{ payment_modes: PaymentMode[] }> = await response.json();

		console.log(result.message);

		if(result.data === undefined) {
			error(404, "Payment modes undefined.")
		}

		return result;
	};

	const getTuitionPlans = async () => {
		const response = await fetch(`${BACKEND_URL}/api/tuition-plans.php`, { method: 'GET' });
		const result: Result<{ tuition_plans: TuitionPlan[] }> = await response.json();

		console.log(result.message);

		if(result.data === undefined) {
			error(404, "Tuition plans undefined.")
		}

		return result;
	};

	const getStudentStatus = async () => {
		const student = (await locals.getStudentData()).data?.student;

		const response = await fetch(
			`${BACKEND_URL}/api/students/status.php?student_id=${student?.id}`,
			{ method: 'GET' }
		);
		const result: Result<{ student_status: StudentStatus }> = await response.json();

		console.log(result.message);

		if(result.data === undefined) {
			error(404, "Student status undefined.")
		}

		return result;
	};

	const getEnrollmentFees = async () => {
		let api = `${BACKEND_URL}/api/enrollments/fees/levels.php`;
		// const searchParams = url.searchParams.toString();
		//
		// if(searchParams) {
		// 	api += `?${searchParams}`
		// }

		const response = await fetch(api, {
			method: "GET"
		})

		if(!response.ok) {
			error(response.status, "Failed to fetch enrollment fees.")
		}

		const result: Result<{ enrollment_fee_levels: EnrollmentFeeLevelDetails[] }> = await response.json();

		console.log(result.message);

		if(result.data === undefined) {
			error(404, "Enrollment fees undefined.")
		}

		return result.data;
	}

	return {
		form: await superValidate(zod(enrollmentSchema)),
		yearLevels: (await getYearLevels()).data?.year_levels,
		academicYears: (await getAcademicYears()).data?.academic_years,
		strands: (await getStrands()).data?.strands,
		paymentModes: (await getPaymentModes()).data?.payment_modes,
		tuitionPlans: (await getTuitionPlans()).data?.tuition_plans,
		studentStatus: (await getStudentStatus()).data?.student_status,
		enrollmentFeeLevels: (await getEnrollmentFees()).enrollment_fee_levels
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

		console.log(form.data)

		if (!form.valid) {
			return fail(
				400,
				withFiles({
					message: 'Invalid form data.',
					form
				})
			);
		}

		await submitEnrollment(event.fetch, form);

		redirect(303, "/dashboard")
	}
};

