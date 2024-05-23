import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { Strand, Subject, SubjectLevel, YearLevel } from '$lib/types/enrollment';
import { fail, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { subjectSchema } from '$lib/schemas/enrollment';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch }) => {
	const getSubjects = async () => {
		const response = await fetch(`${BACKEND_URL}/api/subjects.php`, {
			method: 'GET'
		});
		const result: Result<{ subjects: Subject[]; count: number }> = await response.json();

		console.log(result.message);

		return result;
	};

	const getSubjectLevels = async () => {
		const response = await fetch(`${BACKEND_URL}/api/subjects/levels.php`, {
			method: 'GET'
		});
		const result: Result<{ subject_levels: SubjectLevel[]; count: number }> = await response.json();

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
		subjectLevelData: (await getSubjectLevels()).data,
		yearLevelData: (await getYearLevels()).data,
		strandData: (await getStrands()).data
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(subjectSchema));

		if (!form.valid) {
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		// console.log(form.data);

		const createSubject = async () => {
			const response = await event.fetch(`${BACKEND_URL}/api/subjects.php`, {
				method: 'POST',
				body: JSON.stringify({ id: form.data.subject_id, name: form.data.subject_name }),
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

		const createSubjectLevel = async () => {
			const response = await event.fetch(`${BACKEND_URL}/api/subjects/levels.php`, {
				method: 'POST',
				body: JSON.stringify({
					subject_id: form.data.subject_id,
					year_level_id: form.data.year_level_ids,
					strand_ids: form.data.strand_ids
				}),
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

		let result = await createSubject();

		if (result.code === 201 || result.code === 409) {
			result = await createSubjectLevel();
		}

		console.log(result);

		return {
			form,
			message: result.message
		};
	}
};
