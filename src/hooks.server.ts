import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import { Role, type User } from '$lib/types/user';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.getSession = () => {
		const sessionId = event.cookies.get('session');

		return sessionId;
	};

	const session = event.locals.getSession();

	event.locals.getUserData = async () => {
		const response = await event.fetch(`${BACKEND_URL}/users/user.php?id=${session}`);
		const result: Result<{ user: User }> = await response.json();

		return result;
	};

	const userData = await event.locals.getUserData();
	const user = userData.data?.user;

	if (!event.route.id?.startsWith('/(auth)') && !session) {
		redirect(303, '/login');
	}

	if ((event.route.id?.startsWith('/(auth)') || event.route.id === '/') && session) {
		if (user?.role === Role.Admin) {
			redirect(303, '/admin/dashboard');
		}

		redirect(303, '/dashboard');
	}

	if (event.route.id?.startsWith('/admin') && user?.role === Role.Student) {
		redirect(303, '/dashboard');
	}

	return await resolve(event);
};
