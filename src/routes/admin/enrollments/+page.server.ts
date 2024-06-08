import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type {
	AcademicYearWithStudentCount,
	EnrollmentWithDetails,
	Strand,
	StudentStatus,
	YearLevel
} from '$lib/types/enrollment';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { enrollmentSchema } from '$lib/schemas/enrollment';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import type { PaymentMode, TuitionPlan } from '$lib/types/payment';

export const load: PageServerLoad = async ({ fetch, url, locals }) => {
	const yearLevelId = url.searchParams.get('year_level_id') || undefined;
	const academicYearId = url.searchParams.get('academic_year_id') || undefined;
	const strandId = url.searchParams.get('strand_id') || undefined;
	const enrollmentStatus = url.searchParams.get('status') || undefined;

	const getEnrollments = async () => {
		const searchParams = url.searchParams.toString();

		let api = `${BACKEND_URL}/api/enrollments.php`;

		if (searchParams) {
			api += `?${searchParams}`;
		}

		const response = await fetch(api, { method: 'GET' });
		const result: Result<{ enrollments: EnrollmentWithDetails[]; count: number }> =
			await response.json();

		console.log(result.message);

		if (result.data === undefined) {
			error(404, 'Enrollments undefined.');
		}

		return result.data;
	};

	const getAcademicYears = async () => {
		const response = await fetch(`${BACKEND_URL}/api/academic-years.php`, { method: 'GET' });
		const result: Result<{ academic_years: AcademicYearWithStudentCount[] }> =
			await response.json();

		console.log(result.message);

		if (result.data === undefined) {
			error(404, 'Academic years undefined.');
		}

		return result.data;
	};

	const getYearLevels = async () => {
		const response = await fetch(`${BACKEND_URL}/api/year-levels.php`, { method: 'GET' });
		const result: Result<{ year_levels: YearLevel[] }> = await response.json();

		console.log(result.message);

		if (result.data === undefined) {
			error(404, 'Year levels undefined.');
		}

		return result.data;
	};

	const getStrands = async () => {
		const response = await fetch(`${BACKEND_URL}/api/strands.php`, { method: 'GET' });
		const result: Result<{ strands: Strand[] }> = await response.json();

		console.log(result.message);

		if (result.data === undefined) {
			error(404, 'Strands undefined.');
		}

		return result.data;
	};

	const getPaymentModes = async () => {
		const response = await fetch(`${BACKEND_URL}/api/payments/modes.php`, { method: 'GET' });
		const result: Result<{ payment_modes: PaymentMode[] }> = await response.json();

		console.log(result.message);

		if(result.data === undefined) {
			error(404, "Payment modes undefined.")
		}

		return result.data;
	};

	const getTuitionPlans = async () => {
		const response = await fetch(`${BACKEND_URL}/api/tuition-plans.php`, { method: 'GET' });
		const result: Result<{ tuition_plans: TuitionPlan[] }> = await response.json();

		console.log(result.message);

		if(result.data === undefined) {
			error(404, "Tuition plans undefined.")
		}

		return result.data;
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

		return result.data;
	};

	return {
		form: await superValidate(zod(enrollmentSchema)),
		enrollments: (await getEnrollments()).enrollments,
		enrollmentCount: (await getEnrollments()).count || 0,
		academicYears: (await getAcademicYears()).academic_years,
		yearLevels: (await getYearLevels()).year_levels,
		strands: (await getStrands()).strands,
		paymentModes: (await getPaymentModes()).payment_modes,
		tuitionPlans: (await getTuitionPlans()).tuition_plans,
		studentStatus: (await getStudentStatus()).student_status,
		selectedYearLevelId: yearLevelId,
		selectedAcademicYearId: academicYearId,
		selectedEnrollmentStatus: enrollmentStatus,
		selectedStrandId: strandId
	};
};


