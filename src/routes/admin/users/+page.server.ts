import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { User, UserCount } from '$lib/types/user';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/schemas/user';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const getUsers = async () => {
		const searchParams = url.searchParams.toString();

		let api = `${BACKEND_URL}/api/users.php`;

		if (searchParams) {
			api += `?${searchParams}`;
		}

		const response = await fetch(api, { method: 'GET' });
		const result: Result<{ users: User[]; count: number; role_count: UserCount[] }> =
			await response.json();

		console.log(result.message);

		return result;
	};

	return {
		form: await superValidate(zod(userSchema)),
		users: (await getUsers()).data
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod(userSchema));

		console.log(form.data);

		if (!form.valid) {
			console.error('Invalid form data.');
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const response = await event.fetch(`${BACKEND_URL}/api/users.php`, {
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
		const form = await superValidate(event, zod(userSchema));

		const id = event.url.searchParams.get('id');

		if (!form.valid) {
			console.error('Invalid form data.');
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const response = await event.fetch(`${BACKEND_URL}/api/users.php?id=${id}`, {
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
