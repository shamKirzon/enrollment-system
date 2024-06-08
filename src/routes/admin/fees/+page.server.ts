import { BACKEND_URL } from '$env/static/private';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Result } from '$lib/types';
import type { EnrollmentFeeLevel, EnrollmentFeeLevelDetails, TuitionPlanLevelDetails, TuitionPlanLevels } from '$lib/types/enrollment';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { feeSchema } from '$lib/schemas/enrollment';

export const load: PageServerLoad = async ({ fetch, url }) => {
  const tab = url.searchParams.get('tab') || undefined;

  const getFeeLevels = async () => {
    const response = await fetch(`${BACKEND_URL}/api/enrollments/fees/levels.php`, {
      method: 'GET'
    });

    if (!response.ok) {
      error(response.status, 'Failed to fetch fees per level.');
    }

    const result: Result<{ enrollment_fee_levels: EnrollmentFeeLevelDetails[] }> =
      await response.json();

    console.log(result.message);

    if (result.data === undefined) {
      error(404, 'Enrollment fee levels undefined.');
    }

    return result.data;
  };


const getTuitionPlansPerLevel = async () => {
   const response = await fetch(`${BACKEND_URL}/api/tuition-plans/levels.php`, {
    method: "GET"
  });

  const result: Result<{tuition_plan_levels: TuitionPlanLevelDetails[]}> = await response.json()

  if(result.data === undefined) {
    error(404, "Tuition plan levels not found.")
  }

  return result.data
}

  return {
    form: await superValidate(zod(feeSchema)),
    fees: await getFeeLevels(),
    tuitionPlans: await getTuitionPlansPerLevel(),
    tab
  };
};

export const actions: Actions = {
  update: async (event) => {
    const form = await superValidate(event, zod(feeSchema));
    if (!form.valid) {
      return fail(400, {
        form,
        message: 'Invalid form data.'
      });
    }

    const response = await event.fetch(`${BACKEND_URL}/api/enrollments/fees/levels.php`, {
      method: 'PATCH',
      body: JSON.stringify(form.data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      error(response.status, 'Failed to update enrollment fee.');
    }

    const result: Result = await response.json();

    console.log(result.message);

    return {
      form,
      message: result.message
    };
  }
};
