import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { Enrollment } from '$lib/types/enrollment';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ fetch, url, request }) => {
	// const id = url.searchParams.get('id');
	//
	// if (!id) {
	// 	error(404, 'Enrollment ID not found.');
	// }

	const ids: number[] = await request.json();

	const response = await fetch(`${BACKEND_URL}/api/enrollments.php`, {
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

export const PATCH: RequestHandler = async ({ fetch, url, request }) => {
	const id = url.searchParams.get('id');
	const enrollment: Partial<Enrollment> = await request.json();

	if (!id) {
		error(404, 'Enrollment ID not found.');
	}

	console.log(enrollment);

	const response = await fetch(`${BACKEND_URL}/api/enrollments.php?id=${id}`, {
		method: 'PATCH',
		body: JSON.stringify(enrollment),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const result: Result = await response.json();

	console.log(result.message);

	return json(result);
};
