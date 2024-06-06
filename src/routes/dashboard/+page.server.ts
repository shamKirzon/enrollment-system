import { BACKEND_URL } from '$env/static/private';
import { enrollmentSchema } from '$lib/schemas/enrollment.js';
import type { AcademicYearEnrollment } from '$lib/types/enrollment.js';
import type { Result } from '$lib/types/index.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { Role } from '$lib/types/user.js';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const user = (await locals.getUserData()).data?.user;

	if (user?.id === undefined) {
		error(404, 'User ID not found.');
	}

	const getStudentEnrollments = async (studentId: string) => {
		const response = await fetch(
			`${BACKEND_URL}/api/enrollments/students.php?student_id=${studentId}`,
			{
				method: 'GET'
			}
		);
		const result: Result<{ academic_year_enrollments: AcademicYearEnrollment[]; count: number }> =
			await response.json();

		console.log(result.message);

		return result;
	};

	const enrollments = await getStudentEnrollments(user.id);

	return {
		enrollments,
		form: await superValidate(zod(enrollmentSchema))
	};
};
