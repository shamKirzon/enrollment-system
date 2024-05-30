import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ fetch, request }) => {
	const ids: string[] = await request.json();

	const response = await fetch(`${BACKEND_URL}/api/users.php`, {
		method: 'DELETE',
		body: JSON.stringify(ids),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		error(response.status, 'Failed to delete user.');
	}

	const result: Result = await response.json();

	console.log(result.message);

	return json(result);
};
