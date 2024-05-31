import type { LayoutServerLoad } from './$types';
import type { Result } from '$lib/types';
import { BACKEND_URL } from '$env/static/private';
import type { Semester, YearLevel } from '$lib/types/enrollment';
import type { User } from '$lib/types/user';

export const load: LayoutServerLoad = async ({ url }) => {
        const semester: Semester | undefined = url.searchParams.get('semester') || undefined;

        const getYearLevels = async () => {
                const response = await fetch(`${BACKEND_URL}/api/year-levels.php`, { method: 'GET' });
                const result: Result<{ year_levels: YearLevel[] }> = await response.json();

                console.log(result.message);

                return result;
        };

        const getStudents = async () => {
const response = await fetch(`${BACKEND_URL}/api/users.php?role=student`, { method: 'GET' });
                const result: Result<{ users: User[] }> = await response.json();

                console.log(result.message);

                return result;
        }

        return {
                yearLevels: (await getYearLevels()).data?.year_levels,
                students: (await getStudents()).data?.users
        };
};
