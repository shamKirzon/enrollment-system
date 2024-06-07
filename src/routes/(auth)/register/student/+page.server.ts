import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerProfileSchema, registerSchema } from '$lib/schemas/auth';
import { BACKEND_URL } from '$env/static/private';
import { Role, type StudentProfilePayload, type Address } from '$lib/types/user';
import type { Result } from '$lib/types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(registerProfileSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(registerProfileSchema));

		form.data.role = 'student';

		console.log('Registering student...');
		console.log(form.data);

		if (!form.valid) {
			console.error('Invalid form data.');
			return fail(400, {
				form,
				message: 'Invalid form data.'
			});
		}

		const createStudentUser = async () => {

			console.log("Creating student user...")

			const response = await event.fetch(`${BACKEND_URL}/auth/register.php`, {
				method: 'POST',
				body: JSON.stringify(form.data),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				error(response.status, `ERROR ${response.status}: ${message}`);
			}
			const result: Result<{ user_id: string }> = await response.json();

			console.log(result.message)

			if(result.data === undefined) {
				error(404, "User ID undefined.")
			}

			return result.data.user_id
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

    const uploadBaptismalCertificate = async (file: File, params: Record<string, string>) => {
      const queryString = new URLSearchParams(params).toString();
      const blob = new Blob([file], { type: 'image/*' });

      const response = await event.fetch(
        `${BACKEND_URL}/api/upload/baptismal-certificate.php?${queryString}`,
        {
          method: 'POST',
          body: blob
        }
      );

      const result: Result<{ baptismal_certificate_url: string }> = await response.json();

      console.log(result.message);

      if (result.data?.baptismal_certificate_url === undefined) {
        error(404, 'Undefined birth certificate url.');
      }

      return result.data?.baptismal_certificate_url;
    };

    const createStudentAddress = async (payload: Omit<Address, 'id'>) => {
      const response = await event.fetch(`${BACKEND_URL}/api/addresses.php`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result: Result<{ address_id: number }> = await response.json();

      if (!response.ok) {
        error(response.status, result.message);
      }

      console.log(result.message);

      if (result.data === undefined) {
        error(404, 'Address ID not returned.');
      }

      return result.data.address_id;
    };

    const createStudentProfile = async (payload: StudentProfilePayload) => {
      const response = await event.fetch(`${BACKEND_URL}/api/students/profiles.php`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result: Result = await response.json();

      if (!response.ok) {
        error(response.status, result.message);
      }

      console.log(result.message);
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
      sex,
      city,
      barangay,
      region,
      province,
      street,
      country,
      lrn,
      landline,
      birth_date,
      birth_place,
      citizenship,
      parent_contact_number,
      religion,
      password
    } = form.data;

		const studentId = await createStudentUser();

    const birthCertificateUrl = await uploadBirthCertificate(form.data.birth_certificate, {
      student_id: studentId
    });

    const baptismalCertificateUrl = await uploadBaptismalCertificate(
      form.data.baptismal_certificate,
      {
        student_id: studentId
      }
    );

    const addressId = await createStudentAddress({
      country,
      region,
      province,
      street: street || undefined,
      barangay,
      city
    });

    await createStudentProfile({
      address_id: addressId,
      lrn,
      parent_contact_number,
      citizenship,
      birth_place,
      birth_date,
      sex,
      landline,
      religion,
      student_id: studentId,
      birth_certificate_url: birthCertificateUrl,
      baptismal_certificate_url: baptismalCertificateUrl
    });

		redirect(303, '/login');
	}
};
