import { BACKEND_URL } from '$env/static/private';
import { enrollmentSchema } from '$lib/schemas/enrollment.js';
import type { AcademicYearEnrollment } from '$lib/types/enrollment.js';
import type { Result } from '$lib/types/index.js';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { Role, type StudentFamilyMember, type StudentProfile } from '$lib/types/user.js';

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

		if (!response.ok) {
			error(response.status, "Failed to fetch enrollments.")
		}

		const result: Result<{ academic_year_enrollments: AcademicYearEnrollment[]; count: number }> =
			await response.json();

		console.log(result.message);

		if (result.data === undefined) {
			error(404, "Enrollments undefined.")
		}

		return result.data;
	};

	const getStudentProfile = async (studentId: string) => {
		const response = await fetch(
			`${BACKEND_URL}/api/students/profiles.php?student_id=${studentId}`
		);

		if (!response.ok) {
			error(response.status, 'Failed to fetch student profile.');
		}

		const result: Result<{ student_profile: StudentProfile }> = await response.json();

		console.log(result.message);

		if (result.data === undefined) {
			error(404, 'Student profile undefined.');
		}

		return result.data;
	};

	const getStudentFamilyMembers = async (studentId: string) => {
		const response = await fetch(
			`${BACKEND_URL}/api/students/family-members.php?student_id=${studentId}`
		);

		if (!response.ok) {
			error(response.status, 'Failed to fetch student family members.');
		}

		const result: Result<{ student_family_members: StudentFamilyMember[] }> = await response.json();

		console.log(result.message);

		if (result.data === undefined) {
			error(404, 'Student family members undefined.');
		}

		return result.data;
	};

	const enrollments = await getStudentEnrollments(user.id);

	return {
		enrollments,
		form: await superValidate(zod(enrollmentSchema)),
		familyMembers: (await getStudentFamilyMembers(user.id)).student_family_members,
		profile: (await getStudentProfile(user.id)).student_profile
	};
};
