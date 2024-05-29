import type { Result } from '$lib/types';
import type { User } from '$lib/types/user';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { getSession, getUserData } = locals;
	const session = getSession();
	const getUser: Result<{ user: User | undefined }> = await getUserData();
	const getStudent = await locals.getStudentData();

	console.log(getUser.message);
	console.log(getStudent.message);

	return {
		session,
		user: getUser.data?.user,
		student: getStudent.data?.student
	};
};
