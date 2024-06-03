import { BACKEND_URL } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Role, type User } from '$lib/types/user';
import type { Result } from '$lib/types';

export const load: PageServerLoad = async ({ fetch, locals }) => {
  const user = (await locals.getUserData()).data?.user;

  if (user === undefined) {
    error(404, 'User data not found.');
  }

  if (user.role !== Role.Parent) {
    console.log('YOU ARE NOT A PARENT!');
    redirect(302, '/dashboard');
  }

  const getStudentsData = async () => {
    const response = await fetch(`${BACKEND_URL}/api/parents/students.php?parent_id=${user.id}`, {
      method: 'GET'
    });

    if (!response.ok) {
      console.error('I AM NOT OKAY');
      return {
        message: 'Student does not exist.'
      };
    }

    const result: Result<{ students: User[] }> = await response.json();

    if(result.data === undefined) {
      error(404, "Student data not found.")
    }

    console.log(result.message)

    return result.data.students;
  };

  return {
    students: (await getStudentsData())
  };
};
