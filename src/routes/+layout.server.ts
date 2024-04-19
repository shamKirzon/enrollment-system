import type { Result } from '$lib/types';
import type { User } from '$lib/types/user';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { getSession, getUserData } = locals;
	const session = getSession();
	const getUser: Result<{ user: User | undefined }> = await getUserData();

	console.log(getUser.message);

	return {
		session,
		user: getUser.data?.user
	};
};
