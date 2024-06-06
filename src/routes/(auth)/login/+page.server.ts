import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schemas/auth';
import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import { Role, type User } from '$lib/types/user';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(loginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(loginSchema));

		console.log('Logging in...');

		if (!form.valid) {
			console.error('Invalid form data.');
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const response = await event.fetch(`${BACKEND_URL}/auth/login.php`, {
			method: 'POST',
			body: JSON.stringify(form.data),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const result: Result<{ user: User }> = await response.json();

		console.log(result);

		if (!response.ok || !result.data) {
			error(response.status, `ERROR ${response.status}: ${result.message}`);
		}

		event.cookies.set('session', `${result.data.user.id}`, { path: '/' });

		let dashboardRoute = '/dashboard';

		if(result.data?.user.role === Role.Admin) {
			dashboardRoute = "/admin/dashboard"
		} else if (result?.data.user.role === Role.Parent) {
			dashboardRoute = "/parent/dashboard"
		} else {
			dashboardRoute = "/dashboard"
		}

		redirect(303, dashboardRoute);
	}
};
