import { BACKEND_URL } from '$env/static/private';
import { sectionAssignmentSchema, sectionSchema } from '$lib/schemas/enrollment.js';
import type {
	AcademicYear,
	SectionLevelDetails,
	Strand,
	StudentSectionAssignment,
	YearLevel
} from '$lib/types/enrollment.js';
import type { Result } from '$lib/types/index.js';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Teacher } from '$lib/types/user.js';

export const load: PageServerLoad = async ({ fetch, url }) => {
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
		formSectionAssignment: await superValidate(zod(sectionAssignmentSchema)),
		formSection: await superValidate(zod(sectionSchema)),
		academicYears: (await getAcademicYears()).data?.academic_years,
		yearLevels: (await getYearLevels()).data?.year_levels,
		sectionAssignments: (await getSectionAssignments()).data?.section_assignments,
		sectionLevels: (await getSectionLevels()).data,
		strands: (await getStrands()).data?.strands,
		teachers: (await getTeachers()).data?.teachers
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(sectionSchema));

		if (!form.valid) {
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const createSection = async (name: string) => {
			const response = await event.fetch(`${BACKEND_URL}/api/sections.php`, {
				method: 'POST',
				body: JSON.stringify({ name }),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				error(response.status, 'Failed to create section.');
			}

			const result: Result<{ section_id: string }> = await response.json();

			if (result.data?.section_id === undefined) {
				error(404, 'Section ID not returned.');
			}

			console.log(result.message);

			return result.data?.section_id;
		};

		const createSectionLevel = async (payload: {
			section_id: string;
			year_level_id: string;
			adviser_id?: string;
		}) => {
			const response = await event.fetch(`${BACKEND_URL}/api/sections/levels.php`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				error(response.status, 'Failed to create section level.');
			}

			const result: Result<{ section_level_id: string }> = await response.json();

			if (result.data?.section_level_id === undefined) {
				error(404, 'Section level ID not returned.');
			}

			console.log(result.message);

			return result.data?.section_level_id;
		};

		const createSectionStrand = async (payload: {
			section_level_id: string;
			strand_id: string;
		}) => {
			const response = await event.fetch(`${BACKEND_URL}/api/sections/strands.php`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				error(response.status, 'Failed to create section strand.');
			}

			const result: Result = await response.json();

			console.log(result.message);
		};

		const { section_name, year_level_id, adviser_id, strand_id } = form.data;

		const sectionId = await createSection(section_name);

		if (year_level_id) {
			const sectionLevelId = await createSectionLevel({
				section_id: sectionId,
				adviser_id,
				year_level_id
			});

			if (strand_id) {
				await createSectionStrand({ section_level_id: sectionLevelId, strand_id });
			}
		}

		return {
			form,
			message: 'Successfully created section.'
		};
	},
	update: async (event) => {
		const form = await superValidate(event, zod(sectionSchema));

		if (!form.valid) {
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		return {
			form,
			message: 'Successfully updated section.'
		};
	},
	assign: async (event) => {
		const form = await superValidate(event, zod(sectionAssignmentSchema));

		if (!form.valid) {
			console.error('Invalid form data.');
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const { academic_year_id, year_level_id } = form.data;

		event.url.searchParams.set('academic_year_id', `${academic_year_id}`);
		event.url.searchParams.set('year_level_id', year_level_id);

		const createSectionAssignments = async (academic_year_id: number, year_level_id: string) => {
			const response = await event.fetch(`${BACKEND_URL}/api/sections/assignments/randomize.php`, {
				method: 'POST',
				body: JSON.stringify({
					academic_year_id,
					year_level_id
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				error(response.status, 'Failed to assign sections to students.');
			}

			const result: Result = await response.json();

			console.log(result.message);
		};

		const getSectionAssignments = async (academic_year_id: number, year_level_id: string) => {
			const response = await event.fetch(
				`${BACKEND_URL}/api/sections/assignments/randomize.php?academic_year_id=${academic_year_id}&year_level_id=${year_level_id}`,
				{
					method: 'GET'
				}
			);

			if (!response.ok) {
				error(response.status, 'Failed to assign sections to students.');
			}

			const result: Result<{ section_assignments: StudentSectionAssignment[] }> =
				await response.json();

			console.log(result.message);

			if (result.data?.section_assignments === undefined) {
				error(404, 'Section assignments not returned.');
			}

			return result.data?.section_assignments;
		};

		await createSectionAssignments(academic_year_id, year_level_id);

		// const sectionAssignments = await getSectionAssignments(academic_year_id, year_level_id);

		redirect(303, event.url);
		// return {
		// 	form,
		// 	message: 'Success!',
		// 	sectionAssignments
		// };
	}
};
