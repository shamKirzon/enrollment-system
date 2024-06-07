import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { AcademicYear } from '$lib/types/enrollment';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ fetch, url, request }) => {
	const ids: number[] = await request.json();

	const response = await fetch(`${BACKEND_URL}/api/academic-years.php`, {
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
	const academicYear: AcademicYear = await request.json();

	if (!id) {
		error(404, 'Academic year ID not found.');
	}

	console.log(academicYear);

	const response = await fetch(`${BACKEND_URL}/api/academic-years.php?id=${id}`, {
		method: 'PATCH',
		body: JSON.stringify(academicYear),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		error(response.status, 'Failed to update academic year.');
	}

	const result: Result = await response.json();

	console.log(result.message);

	return json(result);
};
