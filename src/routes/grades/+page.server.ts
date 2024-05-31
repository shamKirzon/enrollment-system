import { BACKEND_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Result } from '$lib/types';
import type { SubjectGrade, SubjectGradeDetails } from '$lib/types/subject';
import { EducationLevel, Semester, type YearLevel } from '$lib/types/enrollment';

export const load: PageServerLoad = async ({ fetch, locals, url }) => {
	const student = (await locals.getStudentData()).data?.student;
	const semester: Semester | undefined = url.searchParams.get('semester') || undefined;
	const yearLevel = url.searchParams.get('year_level') || undefined;

	const getSubjectGrades = async () => {
		const response = await fetch(
			`${BACKEND_URL}/api/students/grades.php?student_id=${student?.id}&year_level_id=${yearLevel}`,
			{
				method: 'GET'
			}
		);

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

	if (subjectGrades.education_level === EducationLevel.SeniorHighSchool) {
		const foo: SubjectGrade[] = [];

		subjectGrades.subject_grades.forEach((subject) => {
			const grades = subject.grades.filter((grade) => {
				if (semester === Semester.First) {
					return grade.period === '1' || grade.period === '2';
				} else {
					return grade.period === '3' || grade.period === '4';
				}
			});

			console.log(grades);

			if (grades.length > 0) {
				foo.push({
					subject_name: subject.subject_name,
					grades,
					average_grade: subject.average_grade
				});
			}
		});

		console.log(foo);

		subjectGrades.subject_grades = foo;
	}

	console.log(subjectGrades);

	return {
		subjectGrades,
		yearLevels: (await getYearLevels()).data?.year_levels,
		semester
	};
};
