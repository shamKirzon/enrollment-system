import { BACKEND_URL } from '$env/static/private';
import { academicYearSchema } from '$lib/schemas/enrollment';
import type { Result } from '$lib/types';
import type { AcademicYearWithStudentCount } from '$lib/types/enrollment';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { User, UserCount } from '$lib/types/user';
import type { TransactionYearly } from '$lib/types/payment';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const getAcademicYears = async () => {
		const searchParams = url.searchParams.toString();

		let api = `${BACKEND_URL}/api/academic-years.php`;

		if (searchParams) {
			api += `?${searchParams}`;
		}

		const response = await fetch(api, { method: 'GET' });
		const result: Result<{ academic_years: AcademicYearWithStudentCount[]; count: number }> =
			await response.json();

		console.log(result.message);

		if (result.data === undefined) {
			error(404, 'Academic years undefined.');
		}

		return result.data;
	};

	const getUsers = async () => {
		const response = await fetch(`${BACKEND_URL}/api/users.php`, { method: 'GET' });
		const result: Result<{ users: User[]; role_count: UserCount[] }> = await response.json();

		console.log(result.message);

		if (result.data === undefined) {
			error(404, 'Users undefined.');
		}

		return result.data;
	};

	const getYearlyTransactions = async () => {
		const response = await fetch(`${BACKEND_URL}/api/transactions/yearly.php`, { method: 'GET' });
		const result: Result<{ transactions: TransactionYearly[] }> = await response.json();

		console.log(result.message);

		if (result.data === undefined) {
			error(404, 'Yearly transactions undefined.');
		}

		return result.data;
	};

	return {
		form: await superValidate(zod(academicYearSchema)),
		academicYears: await getAcademicYears(),
		users: await getUsers(),
		yearlyTransactions: await getYearlyTransactions()
	};
};
