import type { Result } from '$lib/types';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies, locals }) => {
	const session = locals.getSession();

	if (!session) {
		error(404, 'Already logged out.');
	}

	cookies.delete('session', { path: '/' });

	const result: Result = {
		message: 'Successfully logged out.'
	};

	console.log(result.message);

	return json(result);
};
