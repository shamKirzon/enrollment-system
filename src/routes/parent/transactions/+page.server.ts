import { BACKEND_URL } from "$env/static/private";
import type { Result } from "$lib/types";
import type { TransactionDetails } from "$lib/types/payment";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({fetch, locals, url}) => {
	const user = (await locals.getUserData()).data?.user

	const getTransactions = async (studentId: string) => {
		const searchParams = url.searchParams.toString();

		let api = `${BACKEND_URL}/api/transactions.php?parent_id=${studentId}&order=desc`;

		if(searchParams) {
			api += searchParams;
		}

		const response = await fetch(api, {
			method: "GET"
		})

		if(!response.ok){
			error(response.status, "Failed to fetch transactions.")
		}
		const result: Result<{ transactions: TransactionDetails[], count: number }> = await response.json()

		if(result.data === undefined) {
			error(404, "Transactions undefined.")
		}

		return result;
	}

	if(user?.id === undefined) {
		error(404, "Parent not found.")
	}

	const transactions = (await getTransactions(user.id)).data

	if(transactions === undefined){
		error(404, "Transactions undefined.")
	}

	return {
		transactions
	}
}
