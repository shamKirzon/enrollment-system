import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { AcademicYearWithStudentCount, EnrollmentWithDetails } from '$lib/types/enrollment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const getEnrollments = async (): Promise<Result<{ enrollments: EnrollmentWithDetails[] }>> => {
		const academicYearId = url.searchParams.get('year');
		let api = `${BACKEND_URL}/api/enrollments.php`;

		if (academicYearId) {
			api += `?year=${academicYearId}`;
		}

		const response = await fetch(api, { method: 'GET' });
		const result: Result<{ enrollments: EnrollmentWithDetails[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	const getAcademicYears = async () => {
		const response = await fetch(`${BACKEND_URL}/api/academic-years.php`, { method: 'GET' });
		const result: Result<{ academic_years: AcademicYearWithStudentCount[] }> =
			await response.json();

		console.log(result.message);

		return result;
	};

	const { data: enrollmentsData } = await getEnrollments();
	const { data: academicYearsData } = await getAcademicYears();

	return {
		enrollments: enrollmentsData?.enrollments || [],
		academicYears: academicYearsData?.academic_years || []
	};
};
