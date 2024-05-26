import { BACKEND_URL } from '$env/static/private';
import { sectionAssignmentSchema } from '$lib/schemas/enrollment.js';
import type { AcademicYear, StudentSectionAssignment, YearLevel } from '$lib/types/enrollment.js';
import type { Result } from '$lib/types/index.js';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

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

	return {
		form: await superValidate(zod(sectionAssignmentSchema)),
		academicYears: (await getAcademicYears()).data?.academic_years,
		yearLevels: (await getYearLevels()).data?.year_levels,
		sectionAssignments: (await getSectionAssignments()).data?.section_assignments
	};
};

export const actions: Actions = {
	default: async (event) => {
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
