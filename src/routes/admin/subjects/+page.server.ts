import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { Strand, Subject, SubjectLevel, YearLevel } from '$lib/types/enrollment';
import { fail, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { subjectSchema } from '$lib/schemas/enrollment';
import { error, type Actions } from '@sveltejs/kit';
import type { SubjectDetails } from '$lib/types/subject';

export const load: PageServerLoad = async ({ fetch, url }) => {

	const yearLevelId = url.searchParams.get('year_level_id') || undefined
	const strandId = url.searchParams.get('strand_id') || undefined

	const getSubjects = async () => {
		const response = await fetch(`${BACKEND_URL}/api/subjects.php`, {
			method: 'GET'
		});
		const result: Result<{ subjects: Subject[];  }> = await response.json();

		console.log(result.message);

		return result;
	};

	const getSubjectsDetails = async () => {
		const searchParams = url.searchParams.toString();

		let api = `${BACKEND_URL}/api/subjects/details.php`;

		if (searchParams) {
			api += `?${searchParams}`;
		}

		const response = await fetch(api, {
			method: 'GET'
		});
		const result: Result<{ subjects: SubjectDetails[], count: number }> = await response.json();

		console.log(result.message);

		if(result.data === undefined) {
			error(404, "Subjects not found.");
		}

		return result.data;
	};

	const getYearLevels = async () => {
		const response = await fetch(`${BACKEND_URL}/api/year-levels.php`, { method: 'GET' });
		const result: Result<{ year_levels: YearLevel[] }> = await response.json();

		console.log(result.message);

		if(result.data === undefined) {
			error(404, "Year levels not found.");
		}

		return result.data;
	};

	const getStrands = async () => {
		const response = await fetch(`${BACKEND_URL}/api/strands.php`, { method: 'GET' });
		const result: Result<{ strands: Strand[] }> = await response.json();

		console.log(result.message);

		if(result.data === undefined) {
			error(404, "Strands not found.");
		}

		return result.data;
	};

	return {
		form: await superValidate(zod(subjectSchema)),
		subjectData: (await getSubjects()).data,
		yearLevelData: (await getYearLevels()),
		strandData: (await getStrands()),
		subjectDetailsData: (await getSubjectsDetails()),
		selectedYearLevelId: yearLevelId,
		selectedStrandId: strandId
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(subjectSchema));

		console.log("CREATE SUBJECT")
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
			semesters: string[]
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

		const { subject_id, subject_name, year_level_ids, strand_ids, semesters } = form.data;

		await createSubject({ id: subject_id, name: subject_name });
		const subjectLevelIds = await createSubjectLevel({ subject_id, year_level_ids });

		console.log("SUBJECT LEVELS")
		console.log(subjectLevelIds)

		if (subjectLevelIds.length > 0) {
			for (let i = 0; i < subjectLevelIds.length; i++) {
				await createSubjectStrand({ subject_level_id: subjectLevelIds[i], strand_ids, semesters });
			}
		}

		return {
			form,
			message: 'Successfully created subject.'
		};
	},
	update: async (event) => {
		const form = await superValidate(event, zod(subjectSchema));

		const id = event.url.searchParams.get('id');
		console.log("SUBJECT UPDATE")
		console.log(id);
		console.log(form.data);

		if (!form.valid) {
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const updateSubject = async (payload: Omit<Subject, 'year_level_count'>) => {
			const response = await event.fetch(`${BACKEND_URL}/api/subjects.php`, {
				method: 'PATCH',
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

		const updateSubjectLevel = async (payload: {
			subject_id: string;
			year_level_ids: string[];
		}) => {
			const response = await event.fetch(`${BACKEND_URL}/api/subjects/levels.php`, {
				method: 'PATCH',
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

		const updateSubjectStrand = async (payload: {
			subject_level_id: string;
			strand_ids: string[];
			semesters: string[];
		}) => {
			const response = await event.fetch(`${BACKEND_URL}/api/subjects/strands.php`, {
				method: 'PATCH',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				error(response.status, 'Failed to update subject strands.');
			}

			const result: Result = await response.json();

			console.log(result.message);
		};

		const { subject_id, subject_name, year_level_ids, strand_ids, semesters } = form.data;

		await updateSubject({ id: subject_id, name: subject_name });
		const subjectLevelIds = await updateSubjectLevel({ subject_id, year_level_ids });

		console.log(subjectLevelIds)
		console.log(strand_ids)

		if (subjectLevelIds.length > 0) {
			for (let i = 0; i < subjectLevelIds.length; i++) {
				await updateSubjectStrand({ subject_level_id: subjectLevelIds[i], strand_ids, semesters});
			}
		}

		return {
			form,
			message: 'Successfully updated subject.'
		};
	}
};
