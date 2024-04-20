import { BACKEND_URL } from '$env/static/private';
import { academicYearSchema } from '$lib/schemas/enrollment';
import type { Result } from '$lib/types';
import type { AcademicYearWithStudentCount } from '$lib/types/enrollment';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${BACKEND_URL}/academic-years/academic-years.php`, {
		method: 'GET'
	});
	const result: Result<{ academic_years: AcademicYearWithStudentCount[] }> = await response.json();

	console.log(result.message);

	return {
		form: await superValidate(zod(academicYearSchema)),
		academicYears: result.data?.academic_years || []
	};
};

export const actions: Actions = {
	create_academic_year: async (event) => {
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

		const response = await event.fetch(`${BACKEND_URL}/academic-years/academic-years.php`, {
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
	update_academic_year: async (event) => {
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

		const response = await event.fetch(
			`${BACKEND_URL}/academic-years/academic-years.php?id=${id}`,
			{
				method: 'PATCH',
				body: JSON.stringify(form.data),
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

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
