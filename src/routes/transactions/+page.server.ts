import { BACKEND_URL } from "$env/static/private";
import type { Result } from "$lib/types";
import type { Transaction } from "$lib/types/payment";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({fetch, locals}) => {
	const user = (await locals.getUserData()).data?.user

	const getTransactions = async (studentId: string) => {
		const response = await fetch(`${BACKEND_URL}/api/transactions.php`, {
			method: "GET"
		})

		if(!response.ok){
			error(response.status, "Failed to fetch transactions.")
		}
		const result: Result<{ transactions: Transaction[] }> = await response.json()

		if(result.data === undefined) {
			error(404, "Transactions undefined.")
		}

		return result;
	}

	if(user?.id === undefined) {
		error(404, "User not found.")
	}

	const transactions = (await getTransactions(user.id)).data

	if(transactions === undefined){
		error(404, "Transactions undefined.")
	}
	

	return {
		transactions
	}
}
