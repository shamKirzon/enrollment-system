import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ fetch, url }) => {
	const id = url.searchParams.get('id');

	if (!id) {
		error(404, 'Academic year ID not found.');
	}

	const response = await fetch(`${BACKEND_URL}/api/enrollments.php?id=${id}`, {
		method: 'DELETE'
	});
	const result: Result = await response.json();

	console.log(result.message);

	return json(result);
};
