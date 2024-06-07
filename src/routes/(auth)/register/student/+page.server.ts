import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerSchema } from '$lib/schemas/auth';
import { BACKEND_URL } from '$env/static/private';
import { Role } from '$lib/types/user';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(registerSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(registerSchema));

		form.data.role = 'student'

		console.log('Registering student...');
		console.log(form.data);

		if (!form.valid) {
			console.error('Invalid form data.');
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const response = await event.fetch(`${BACKEND_URL}/auth/register.php`, {
			method: 'POST',
			body: JSON.stringify(form.data),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const { message }: { message: string } = await response.json();

		console.log(message);

		if (!response.ok) {
			error(response.status, `ERROR ${response.status}: ${message}`);
		}

		redirect(303, '/login');
	}
};
