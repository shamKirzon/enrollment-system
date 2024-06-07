import { BACKEND_URL } from '$env/static/private';
import { sectionAssignmentSchema, sectionSchema } from '$lib/schemas/enrollment.js';
import type {
	AcademicYear,
	Section,
	Strand,
	StudentSectionAssignment,
	YearLevel
} from '$lib/types/enrollment';
import type { Result } from '$lib/types/index.js';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ url }) => {
	const yearLevelId = url.searchParams.get('year_level_id') || undefined;
	const academicYearId = url.searchParams.get('academic_year_id') || undefined;
	const strandId = url.searchParams.get('strand_id') || undefined;

	return {
		form: await superValidate(zod(sectionSchema)),
		selectedYearLevelId: yearLevelId,
		selectedAcademicYearId: academicYearId,
		selectedStrandId: strandId
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

		console.log(form.data);

		if (!form.valid) {
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const updateSection = async (payload: Section) => {
			const response = await event.fetch(`${BACKEND_URL}/api/sections.php`, {
				method: 'PATCH',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				error(response.status, 'Failed to update section.');
			}

			const result: Result = await response.json();

			console.log(result.message);
		};

		const updateSectionLevel = async (payload: {
			section_id: string;
			year_level_id: string;
			adviser_id?: string;
		}) => {
			const response = await event.fetch(`${BACKEND_URL}/api/sections/levels.php`, {
				method: 'PATCH',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				error(response.status, 'Failed to update section level.');
			}

			const result: Result<{ section_level_id: string }> = await response.json();

			// if (result.data?.section_level_id === undefined) {
			// 	error(404, 'Section level ID not returned.');
			// }

			console.log(result.message);

			return result.data?.section_level_id;
		};

		const updateSectionStrand = async (payload: {
			section_level_id: string;
			strand_id: string;
		}) => {
			const response = await event.fetch(`${BACKEND_URL}/api/sections/strands.php`, {
				method: 'PATCH',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				error(response.status, 'Failed to update section strand.');
			}

			const result: Result = await response.json();

			console.log(result.message);
		};

		const { adviser_id, section_level_id, section_id, section_name, strand_id, year_level_id } =
			form.data;

		await updateSection({ id: section_id, name: section_name });

		if (year_level_id) {
			const sectionLevelId = await updateSectionLevel({ section_id, adviser_id, year_level_id });

			if (sectionLevelId) {
				if (strand_id) {
					await updateSectionStrand({ section_level_id: sectionLevelId, strand_id });
				}
			} else {
				if (strand_id) {
					await updateSectionStrand({ section_level_id, strand_id });
				}
			}
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
