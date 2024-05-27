import { BACKEND_URL } from '$env/static/private';
import { enrollmentSchema } from '$lib/schemas/enrollment.js';
import type { AcademicYearEnrollment } from '$lib/types/enrollment.js';
import type { Result } from '$lib/types/index.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const userId = (await locals.getUserData()).data?.user?.id;

	if (userId === undefined) {
		error(404, 'User ID not found.');
	}

	const response = await fetch(`${BACKEND_URL}/api/enrollments/students.php?student_id=${userId}`, {
		method: 'GET'
	});
	const result: Result<{ academic_year_enrollments: AcademicYearEnrollment[]; count: number }> =
		await response.json();

	console.log(result.message);

	return {
		enrollments: result,
		form: await superValidate(zod(enrollmentSchema))
	};
};
