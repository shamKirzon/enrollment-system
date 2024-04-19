import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';
import type { User } from '$lib/types/user';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.getSession = () => {
		const sessionId = event.cookies.get('session');

		return sessionId;
	};

	const sessionId = event.locals.getSession();

	event.locals.getUserData = async () => {
		const response = await event.fetch(`${BACKEND_URL}/users/user.php?id=${sessionId}`);
		const result: Result<{ user: User }> = await response.json();

		return result;
	};

	return await resolve(event);
};
