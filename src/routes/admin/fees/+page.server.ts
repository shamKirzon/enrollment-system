import { BACKEND_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Result } from '$lib/types';
import type { EnrollmentFeeLevel, EnrollmentFeeLevelDetails } from '$lib/types/enrollment';

export const load: PageServerLoad = async ({ fetch }) => {
  const getFeeLevels = async () => {
    const response = await fetch(`${BACKEND_URL}/api/enrollments/fees/levels.php`, {
      method: 'GET'
    });

    if (!response.ok) {
      error(response.status, 'Failed to fetch fees per level.');
    }

    const result: Result<{ enrollment_fee_levels: EnrollmentFeeLevelDetails[] }> = await response.json();

    console.log(result.message);

    if (result.data === undefined) {
      error(404, 'Enrollment fee levels undefined.');
    }

    return result.data;
  };

  return {
    fees: await getFeeLevels()
  };
};
