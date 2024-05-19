import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { Transaction } from '$lib/types/enrollment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${BACKEND_URL}/api/transactions.php`, {
		method: 'GET'
	});
	const result: Result<{ transactions: Transaction[]; count: number }> = await response.json();

	return {
		resultTransactions: result
	};
};
