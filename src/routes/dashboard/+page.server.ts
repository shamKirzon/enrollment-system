import { BACKEND_URL } from '$env/static/private';
import { enrollmentSchema } from '$lib/schemas/enrollment.js';
import type { AcademicYearEnrollment } from '$lib/types/enrollment.js';
import type { Result } from '$lib/types/index.js';
import type { PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${BACKEND_URL}/api/enrollments/students.php`, {
		method: 'GET'
	});
	const result: Result<{ academic_year_enrollments: AcademicYearEnrollment[]; count: number }> =
		await response.json();

	return {
		enrollments: result,
		form: await superValidate(zod(enrollmentSchema))
	};
};
