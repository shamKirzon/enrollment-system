import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { AcademicYearWithStudentCount } from '$lib/types/enrollment';
import { superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { academicYearSchema } from '$lib/schemas/enrollment';

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

	return {
		form: await superValidate(zod(academicYearSchema)),
		academicYears: (await getAcademicYears()).data
	};
};
