import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { TransactionDetails } from '$lib/types/payment';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const paymentMethod = url.searchParams.get('payment_method') || undefined

	const searchParams = url.searchParams.toString();
	let api = `${BACKEND_URL}/api/transactions.php`;

	if (searchParams) {
		api += `?${searchParams}`;
	}

	const response = await fetch(api, {
		method: 'GET'
	});
	const result: Result<{ transactions: TransactionDetails[]; count: number }> =
		await response.json();

	return {
		resultTransactions: result.data,
		selectedPaymentMethod: paymentMethod
	};
};
