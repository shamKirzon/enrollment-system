import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { AcademicYearWithStudentCount } from '$lib/types/enrollment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${BACKEND_URL}/academic-years/academic-years.php`, {
		method: 'GET'
	});
	const result: Result<{ academic_years: AcademicYearWithStudentCount[] }> = await response.json();

	console.log(result.message);

	return {
		academicYears: result.data?.academic_years || []
	};
};
