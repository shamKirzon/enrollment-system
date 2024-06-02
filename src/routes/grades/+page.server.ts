import { BACKEND_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Result } from '$lib/types';
import type { SubjectGrade, SubjectGradeDetails } from '$lib/types/subject';
import { EducationLevel, Semester, type YearLevel } from '$lib/types/enrollment';

export const load: PageServerLoad = async ({ fetch, locals, url }) => {
	const student = (await locals.getStudentData()).data?.student;
	// const semester: Semester | undefined = url.searchParams.get('semester') || undefined;
	// const yearLevel = url.searchParams.get('year_level') || undefined;

	const getSubjectGrades = async () => {
		const searchParams = url.searchParams.toString();

		let api = `${BACKEND_URL}/api/students/grades.php?student_id=${student?.id}`;

		if (searchParams) {
			api += `&${searchParams}`;
		}

		const response = await fetch(api, {
			method: 'GET'
		});

		if (!response.ok) {
			error(response.status, 'Failed to get grades.');
		}

		const result: Result<SubjectGradeDetails> = await response.json();

		if (result.data === undefined) {
			error(404, 'Grades not found.');
		}

		console.log(result.message);

		return result.data;
	};

	// const getEnrolledYearLevels = async () => {
	// 	const response = await fetch(
	// 		`${BACKEND_URL}/api/enrollments/year-levels.php?student_id=${student?.id}`,
	// 		{
	// 			method: 'GET'
	// 		}
	// 	);
	//
	// 	if (!response.ok) {
	// 		error(response.status, 'Failed to get enrolled year levels.');
	// 	}
	//
	// 	const result: Result<{ enrolled_year_levels: YearLevel[] }> = await response.json();
	//
	// 	if (result.data === undefined) {
	// 		error(404, 'Enrolled year levels not found.');
	// 	}
	//
	// 	console.log(result.message);
	//
	// 	return result.data;
	// };

	const getYearLevels = async () => {
		const response = await fetch(`${BACKEND_URL}/api/year-levels.php`, { method: 'GET' });
		const result: Result<{ year_levels: YearLevel[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	const subjectGrades = await getSubjectGrades();

	console.log(subjectGrades);

	return {
		subjectGrades,
		yearLevels: (await getYearLevels()).data?.year_levels,
	};
};
