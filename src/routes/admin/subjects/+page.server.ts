import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { Subject } from '$lib/types/enrollment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${BACKEND_URL}/api/subjects.php`, {
		method: 'GET'
	});
	const result: Result<{ subjects: Subject[]; count: number }> = await response.json();

	console.log(result.message);

	return {
		dataSubject: result.data
	};
};
