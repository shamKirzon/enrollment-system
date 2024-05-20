import { BACKEND_URL } from '$env/static/private';
import { academicYearSchema } from '$lib/schemas/enrollment';
import type { Result } from '$lib/types';
import type { AcademicYearWithStudentCount } from '$lib/types/enrollment';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { User, UserCount } from '$lib/types/user';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const getAcademicYears = async () => {
		const searchParams = url.searchParams.toString();

		let api = `${BACKEND_URL}/api/academic-years.php`;

		if (searchParams) {
			api += `?${searchParams}`;
		}

		const response = await fetch(api, { method: 'GET' });
		const result: Result<{ academic_years: AcademicYearWithStudentCount[]; count: number }> =
			await response.json();

		console.log(result.message);

		return result;
	};

	const getUsers = async () => {
		const response = await fetch(`${BACKEND_URL}/api/users.php`, { method: 'GET' });
		const result: Result<{ users: User[]; count: UserCount[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	const { data: academicYears } = await getAcademicYears();
	const { data: users } = await getUsers();

	return {
		form: await superValidate(zod(academicYearSchema)),
		academicYears,
		users
	};
};
