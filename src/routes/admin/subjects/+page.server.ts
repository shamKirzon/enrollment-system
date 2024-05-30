import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { Strand, Subject, SubjectLevel, YearLevel } from '$lib/types/enrollment';
import { fail, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { subjectSchema } from '$lib/schemas/enrollment';
import { error, type Actions } from '@sveltejs/kit';
import type { SubjectDetails } from '$lib/types/subject';

export const load: PageServerLoad = async ({ fetch }) => {
	const getSubjects = async () => {
		const response = await fetch(`${BACKEND_URL}/api/subjects.php`, {
			method: 'GET'
		});
		const result: Result<{ subjects: Subject[]; count: number }> = await response.json();

		console.log(result.message);

		return result;
	};

	const getSubjectsDetails = async () => {
		const response = await fetch(`${BACKEND_URL}/api/subjects/details.php`, {
			method: 'GET'
		});
		const result: Result<{ subjects: SubjectDetails[]; }> = await response.json();

		console.log(result.message);

		return result;
	};

	const getYearLevels = async () => {
		const response = await fetch(`${BACKEND_URL}/api/year-levels.php`, { method: 'GET' });
		const result: Result<{ year_levels: YearLevel[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	const getStrands = async () => {
		const response = await fetch(`${BACKEND_URL}/api/strands.php`, { method: 'GET' });
		const result: Result<{ strands: Strand[] }> = await response.json();

		console.log(result.message);

		return result;
	};

	return {
		form: await superValidate(zod(subjectSchema)),
		subjectData: (await getSubjects()).data,
		yearLevelData: (await getYearLevels()).data,
		strandData: (await getStrands()).data,
		subjectDetailsData: (await getSubjectsDetails()).data
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(subjectSchema));

		console.log(form.data);

		if (!form.valid) {
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const createSubject = async (payload: Omit<Subject, 'year_level_count'>) => {
			const response = await event.fetch(`${BACKEND_URL}/api/subjects.php`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const result: Result = await response.json();

			console.log(result.message);

			return {
				message: result.message,
				code: response.status
			};
		};

		const createSubjectLevel = async (payload: {
			subject_id: string;
			year_level_ids: string[];
		}) => {
			const response = await event.fetch(`${BACKEND_URL}/api/subjects/levels.php`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const result: Result<{ subject_level_ids: string[] }> = await response.json();

			console.log(result.message);

			if (result.data?.subject_level_ids === undefined) {
				error(404, 'Subject level IDs not returned.');
			}

			return result.data?.subject_level_ids;
		};

		const createSubjectStrand = async (payload: {
			subject_level_id: string;
			strand_ids: string[];
		}) => {
			const response = await event.fetch(`${BACKEND_URL}/api/subjects/strands.php`, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				error(response.status, 'Failed to create subject strands.');
			}

			const result: Result = await response.json();

			console.log(result.message);
		};

		const { subject_id, subject_name, year_level_ids, strand_ids } = form.data;

		await createSubject({ id: subject_id, name: subject_name });
		const subjectLevelIds = await createSubjectLevel({ subject_id, year_level_ids });

		if (subjectLevelIds.length > 0 && strand_ids.length > 0) {
			for (let i = 0; i < subjectLevelIds.length; i++) {
				await createSubjectStrand({ subject_level_id: subjectLevelIds[i], strand_ids });
			}
		}

		return {
			form,
			message: 'Successfully created subject.'
		};
	},

	update: async () => {
	}
};
