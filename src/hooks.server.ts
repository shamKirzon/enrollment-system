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

		if (!response.ok) {
			return {
				message: 'User does not exist.'
			};
		}

		const result: Result<{ user: User }> = await response.json();

		console.log(result);

		return result;
	};

	event.locals.getStudentData = async () => {
		const userData = await event.locals.getUserData();

		if (userData.data?.user?.role === Role.Parent) {
			const response = await event.fetch(
				`${BACKEND_URL}/api/parents/students.php?parent_id=${userData.data?.user.id}`,
				{
					method: 'GET'
				}
			);

			if (!response.ok) {
				console.error('I AM NOT OKAY');
				return {
					message: 'Student does not exist.'
				};
			}

			const result: Result<{ student: User }> = await response.json();

			console.log('STUDENT');
			console.log(result);

			return result;
		}

		return {
			data: { student: userData.data?.user },
			message: 'Successfully fetched student.'
		};
	};

	if (!event.route.id?.startsWith('/(auth)') && !session) {
		redirect(303, '/login');
	}

	if ((event.route.id?.startsWith('/(auth)') || event.route.id === '/') && session) {
		const userData = await event.locals.getUserData();
		const user = userData.data?.user;

		if (user?.role === Role.Admin) {
			redirect(303, '/admin/dashboard');
		}

		if (event.route.id?.startsWith('/admin') && user?.role === Role.Student) {
			redirect(303, '/dashboard');
		}

		redirect(303, '/dashboard');
	}

	return await resolve(event);
};
