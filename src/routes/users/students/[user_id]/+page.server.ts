import { BACKEND_URL } from '$env/static/private';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Result } from '$lib/types';
import type { StudentFamilyMember, StudentProfile, User } from '$lib/types/user';
import type { AcademicYearEnrollment, Strand, YearLevel } from '$lib/types/enrollment';
import type { TransactionDetails } from '$lib/types/payment';
import type { Grade, SubjectGrade, SubjectGradeDetails } from '$lib/types/subject';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { gradesSchema } from '$lib/schemas/subject';

export const load: PageServerLoad = async ({ fetch, params, locals, url }) => {
  const { user_id } = params;
  const tab = url.searchParams.get('tab');

  const getStudentData = async (studentId: string) => {
    const response = await fetch(`${BACKEND_URL}/api/users.php?id=${studentId}`);

    if (!response.ok) {
      error(response.status, 'Failed to fetch student data.');
    }

    const result: Result<{ user: User }> = await response.json();

    if (result.data === undefined) {
      error(404, 'Student data undefined.');
    }
    console.log(result.message);

    return result;
  };

  const getStudentProfile = async (studentId: string) => {
    const response = await fetch(
      `${BACKEND_URL}/api/students/profiles.php?student_id=${studentId}`
    );

    if (!response.ok) {
      error(response.status, 'Failed to fetch student profile.');
    }

    const result: Result<{ student_profile: StudentProfile }> = await response.json();

    if (result.data === undefined) {
      error(404, 'Student profile undefined.');
    }
    console.log(result.message);

    return result;
  };

  const getStudentFamilyMembers = async (studentId: string) => {
    const response = await fetch(
      `${BACKEND_URL}/api/students/family-members.php?student_id=${studentId}`
    );

    if (!response.ok) {
      error(response.status, 'Failed to fetch student family members.');
    }

    const result: Result<{ student_family_members: StudentFamilyMember[] }> = await response.json();

    if (result.data === undefined) {
      error(404, 'Student family members undefined.');
    }
    console.log(result.message);

    return result;
  };

  const getStudentEnrollments = async (studentId: string) => {
    const response = await fetch(
      `${BACKEND_URL}/api/enrollments/students.php?student_id=${studentId}`,
      {
        method: 'GET'
      }
    );

    if (!response.ok) {
      error(response.status, 'Failed to fetch student enrollments.');
    }

    const result: Result<{ academic_year_enrollments: AcademicYearEnrollment[]; count: number }> =
      await response.json();

    if (result.data === undefined) {
      error(404, 'Student enrollments undefined.');
    }

    console.log(result.message);

    return result;
  };

  const getStudentTransactions = async (studentId: string) => {
    const response = await fetch(`${BACKEND_URL}/api/transactions.php?student_id=${studentId}`, {
      method: 'GET'
    });

    if (!response.ok) {
      error(response.status, 'Failed to fetch student transactions.');
    }

    const result: Result<{ transactions: TransactionDetails[]; count: number }> =
      await response.json();

    if (result.data === undefined) {
      error(404, 'Student enrollments undefined.');
    }

    console.log(result.message);

    return result;
  };

  const getStudentGrades = async (studentId: string) => {
    const searchParams = url.searchParams.toString();

    let api = `${BACKEND_URL}/api/students/grades.php?student_id=${studentId}`;

    if (searchParams) {
      api += `&${searchParams}`;
    }

    const response = await fetch(api, {
      method: 'GET'
    });

    if (!response.ok) {
      error(response.status, 'Failed to get grades.');
    }

    const result: Result<SubjectGradeDetails> = await response.json();

    if (result.data === undefined) {
      error(404, 'Grades not found.');
    }

    console.log(result.message);

    return result.data;
  };

  const getYearLevels = async () => {
    const response = await fetch(`${BACKEND_URL}/api/year-levels.php`, { method: 'GET' });

    if (!response.ok) {
      error(response.status, 'Failed to get year levels.');
    }

    const result: Result<{ year_levels: YearLevel[] }> = await response.json();

    if (result.data === undefined) {
      error(404, 'Year levels not found.');
    }

    console.log(result.message);

    return result.data.year_levels;
  };

  const studentUserData = (await getStudentData(user_id)).data?.user;
  const studentProfile = (await getStudentProfile(user_id)).data?.student_profile;
  const studentFamilyMembers = (await getStudentFamilyMembers(user_id)).data
    ?.student_family_members;
  const studentEnrollments = (await getStudentEnrollments(user_id)).data;
  const studentTransactions = (await getStudentTransactions(user_id)).data;
  const studentGrades = await getStudentGrades(user_id);
  const yearLevels = await getYearLevels();

  if (studentUserData === undefined) {
    error(404, 'Student user data undefined.');
  }

  if (studentProfile === undefined) {
    error(404, 'Student profile undefined.');
  }

  if (studentFamilyMembers === undefined) {
    error(404, 'Student profile undefined.');
  }

  if (studentEnrollments === undefined) {
    error(404, 'Student enrollments undefined.');
  }

  if (studentTransactions === undefined) {
    error(404, 'Student transactions undefined.');
  }

  const subject_grades = studentGrades.subject_grades.map((sg) => {
    return sg;
  });

  const gradesForm = await superValidate({ subject_grades }, zod(gradesSchema));

  return {
    studentUserData,
    studentProfile,
    studentFamilyMembers,
    studentEnrollments,
    studentTransactions,
    studentGrades,
    yearLevels,
    gradesForm,
    tab
  };
};

type PayloadGrade = {
  subject_level_id: string;
  grades: Grade[];
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(gradesSchema));

    const yearLevelId = event.url.searchParams.get('year_level_id');
    const { user_id } = event.params;

    console.log(yearLevelId);
    console.log(user_id);

    if (!user_id || !yearLevelId) {
      error(404, 'User ID or Year level ID not found.');
    }

    console.log('FORMDATA');
    console.log(form.data);

    if (!form.valid) {
      return fail(400, {
        form,
        message: 'Invalid form data.'
      });
    }

    const getStrand = async (payload: { student_id: string; year_level_id: string }) => {
      const response = await event.fetch(
        `${BACKEND_URL}/api/students/strands.php?student_id=${payload.student_id}&year_level_id=${payload.year_level_id}`,
        {
          method: 'GET'
        }
      );

      if (!response.ok) {
        error(response.status, 'Failed to get student strand.');
      }

      const result: Result<{ strand: Strand }> = await response.json();

      // if (result.data === undefined) {
      //   error(404, 'Strand is undefined.');
      // }

      return result.data?.strand;
    };

    const createGrades = async (payload: SubjectGrade[], studentId: string, strandId?: string) => {
      console.log('IZZ RUNNING');

      const response = await event.fetch(`${BACKEND_URL}/api/students/grades.php?many=true`, {
        method: 'POST',
        body: JSON.stringify({
          grades: payload,
          student_id: studentId,
          strand_id: strandId
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        error(response.status, 'Failed to submit grades.');
      }

      const result: Result = await response.json();

      console.log(result.message);
    };

    const strand = await getStrand({ student_id: user_id, year_level_id: yearLevelId });
    await createGrades(form.data.subject_grades, user_id, strand?.id);

    return {
      form,
      message: 'Successfully submitted grades.'
    };
  }
};
