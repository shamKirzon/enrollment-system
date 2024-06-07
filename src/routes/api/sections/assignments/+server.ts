import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ fetch, request }) => {
	const payload = await request.json();

	console.log(payload);

	const response = await fetch(`${BACKEND_URL}/api/sections/assignments/randomize.php`, {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		error(response.status, 'Failed to assign sections to students.');
	}

	const result: Result = await response.json();

	console.log(result.message);

	return json(result);
};

export const DELETE: RequestHandler = async ({ fetch, request }) => {
	const ids: string[] = await request.json();

	console.log(ids)

	const response = await fetch(`${BACKEND_URL}/api/sections/assignments/randomize.php`, {
		method: 'DELETE',
		body: JSON.stringify(ids),
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const result: Result = await response.json();

	console.log(result.message);

	return json(result);
};
