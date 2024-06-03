import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addStudentSchema } from '$lib/schemas/user';
import { Role, type User } from '$lib/types/user';
import { BACKEND_URL } from '$env/static/private';
import type { Result } from '$lib/types';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(addStudentSchema))
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(addStudentSchema));

    form.data.role = Role.Student;

    console.log(form.data);

    if (!form.valid) {
      return fail(
        400,
        withFiles({
          message: 'Invalid form data.',
          form
        })
      );
    }

    const createStudentUser = async (payload: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await event.fetch(`${BACKEND_URL}/api/users.php`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result: Result<{ user_id: string }> = await response.json();

      if (!response.ok) {
        error(response.status, result.message);
      }

      console.log(result.message);

      if (result.data === undefined) {
        error(404, 'User ID not returned.');
      }

      return result.data.user_id;
    };

    const uploadBirthCertificate = async (file: File, params: Record<string, string>) => {
      const queryString = new URLSearchParams(params).toString();
      const blob = new Blob([file], { type: 'image/*' });

      const response = await event.fetch(
        `${BACKEND_URL}/api/upload/birth-certificate.php?${queryString}`,
        {
          method: 'POST',
          body: blob
        }
      );

      const result: Result<{ birth_certificate_url: string }> = await response.json();

      console.log(result.message);

      if (result.data?.birth_certificate_url === undefined) {
        error(404, 'Undefined birth certificate url.');
      }

      return result.data?.birth_certificate_url;
    };

    const {
      first_name,
      middle_name,
      last_name,
      suffix_name,
      contact_number,
      email,
      role,
      avatar_url,
      sex
    } = form.data;

    const studentId = await createStudentUser({
      first_name,
      middle_name: middle_name || undefined,
      last_name,
      suffix_name: suffix_name || undefined,
      contact_number,
      email,
      role,
      avatar_url: avatar_url || undefined,
      sex
    });

    const birthCertificateUrl = await uploadBirthCertificate(form.data.birth_certificate, {
      student_id: studentId
    });

    return {
      form,
      message: 'Successfully added student.'
    };
  }
};
