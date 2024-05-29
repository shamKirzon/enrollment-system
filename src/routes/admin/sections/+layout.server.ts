import type { LayoutServerLoad } from './$types';
import { BACKEND_URL } from '$env/static/private';
import type {
	AcademicYear,
	SectionLevelDetails,
	Strand,
	StudentSectionAssignment,
	YearLevel
} from '$lib/types/enrollment';
import type { Result } from '$lib/types/index.js';
import { error } from '@sveltejs/kit';
import type { Teacher } from '$lib/types/user.js';

export const load: LayoutServerLoad = async ({ fetch, url }) => {
	const getAcademicYears = async () => {
		const response = await fetch(`${BACKEND_URL}/api/academic-years.php`, { method: 'GET' });
		const result: Result<{ academic_years: AcademicYear[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	const getYearLevels = async () => {
		const response = await fetch(`${BACKEND_URL}/api/year-levels.php`, { method: 'GET' });
		const result: Result<{ year_levels: YearLevel[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	const getSectionAssignments = async () => {
		const searchParams = url.searchParams.toString();

		let api = `${BACKEND_URL}/api/sections/assignments/randomize.php`;

		if (searchParams) {
			api += `?${searchParams}`;
		}

		console.log(api);

		const response = await fetch(api, { method: 'GET' });

		if (!response.ok) {
			error(response.status, 'Failed to assign sections to students.');
		}

		const result: Result<{ section_assignments: StudentSectionAssignment[] }> =
			await response.json();

		console.log(result.message);

		return result;
	};

	const getSectionLevels = async () => {
		const searchParams = url.searchParams.toString();

		const response = await fetch(`${BACKEND_URL}/api/sections/levels.php?${searchParams}`, {
			method: 'GET'
		});

		if (!response.ok) {
			error(response.status, 'Failed to get section levels.');
		}

		const result: Result<{ section_levels: SectionLevelDetails[]; count: number }> =
			await response.json();

		console.log(result.message);

		return result;
	};

	const getStrands = async () => {
		const response = await fetch(`${BACKEND_URL}/api/strands.php`, { method: 'GET' });
		const result: Result<{ strands: Strand[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	const getTeachers = async () => {
		const response = await fetch(`${BACKEND_URL}/api/teachers.php`, { method: 'GET' });
		const result: Result<{ teachers: Teacher[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	return {
		academicYears: (await getAcademicYears()).data?.academic_years,
		yearLevels: (await getYearLevels()).data?.year_levels,
		sectionAssignments: (await getSectionAssignments()).data?.section_assignments,
		sectionLevels: (await getSectionLevels()).data,
		strands: (await getStrands()).data?.strands,
		teachers: (await getTeachers()).data?.teachers
	};
};
