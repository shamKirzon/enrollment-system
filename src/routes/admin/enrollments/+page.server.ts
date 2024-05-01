import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type {
	AcademicYearWithStudentCount,
	EnrollmentWithDetails,
	YearLevel
} from '$lib/types/enrollment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const getEnrollments = async (): Promise<
		Result<{ enrollments: EnrollmentWithDetails[]; total_count: number }>
	> => {
		const searchParams = url.searchParams.toString();

		let api = `${BACKEND_URL}/api/enrollments.php`;

		if (searchParams) {
			api += `?${searchParams}`;
		}

		const response = await fetch(api, { method: 'GET' });
		const result: Result<{ enrollments: EnrollmentWithDetails[]; total_count: number }> =
			await response.json();

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

	const getYearLevels = async () => {
		const response = await fetch(`${BACKEND_URL}/api/year-levels.php`, { method: 'GET' });
		const result: Result<{ year_levels: YearLevel[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	const { data: enrollmentsData } = await getEnrollments();
	const { data: academicYearsData } = await getAcademicYears();
	const { data: yearLevelsData } = await getYearLevels();

	return {
		enrollments: enrollmentsData?.enrollments || [],
		enrollmentCount: enrollmentsData?.total_count || 0,
		academicYears: academicYearsData?.academic_years || [],
		yearLevels: yearLevelsData?.year_levels || []
	};
};
