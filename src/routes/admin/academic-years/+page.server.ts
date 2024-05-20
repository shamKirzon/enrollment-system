import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { AcademicYearWithStudentCount } from '$lib/types/enrollment';
import { fail, superValidate } from 'sveltekit-superforms';
import type { PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { academicYearSchema } from '$lib/schemas/enrollment';
import { error, type Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const getAcademicYears = async () => {
		const searchParams = url.searchParams.toString();

		let api = `${BACKEND_URL}/api/academic-years.php`;

		if (searchParams) {
			api += `?${searchParams}`;
		}

		const response = await fetch(api, { method: 'GET' });
		const result: Result<{ academic_years: AcademicYearWithStudentCount[]; count: number }> =
			await response.json();

		console.log(result.message);

		return result;
	};

	return {
		form: await superValidate(zod(academicYearSchema)),
		academicYears: (await getAcademicYears()).data
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(academicYearSchema));

		console.log('Creating academic year...');
		console.log(form.data);

		if (!form.valid) {
			console.error('Invalid form data.');
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const response = await event.fetch(`${BACKEND_URL}/api/academic-years.php`, {
			method: 'POST',
			body: JSON.stringify(form.data),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const result: Result = await response.json();

		if (!response.ok) {
			error(response.status, result.message);
		}

		return {
			form,
			message: result.message
		};
	},
	update: async (event) => {
		const form = await superValidate(event, zod(academicYearSchema));

		console.log('Editing academic year...');
		console.log(form.data);

		const id = event.url.searchParams.get('id');
		console.log(id);

		if (!form.valid) {
			console.error('Invalid form data.');
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const response = await event.fetch(`${BACKEND_URL}/api/academic-years.php?id=${id}`, {
			method: 'PATCH',
			body: JSON.stringify(form.data),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const result: Result = await response.json();

		if (!response.ok) {
			error(response.status, result.message);
		}

		return {
			form,
			message: result.message
		};
	}
};
