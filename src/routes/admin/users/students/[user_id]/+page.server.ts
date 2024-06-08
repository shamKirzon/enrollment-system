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
  const yearLevelId = url.searchParams.get('year_level_id') || undefined;

  const getStudentData = async (studentId: string) => {
    const response = await fetch(`${BACKEND_URL}/api/users.php?id=${studentId}`);

    if (!response.ok) {
      error(response.status, 'Failed to fetch student data.');
    }

    const result: Result<{ user: User }> = await response.json();

    console.log(result.message);

    if (result.data === undefined) {
      error(404, 'Student data undefined.');
    }

    return result.data;
  };

  const getStudentProfile = async (studentId: string) => {
    const response = await fetch(
      `${BACKEND_URL}/api/students/profiles.php?student_id=${studentId}`
    );

    if (!response.ok) {
      error(response.status, 'Failed to fetch student profile.');
    }

    const result: Result<{ student_profile: StudentProfile }> = await response.json();

    console.log(result.message);

    if (result.data === undefined) {
      error(404, 'Student profile undefined.');
    }

    return result.data;
  };

  const getStudentFamilyMembers = async (studentId: string) => {
    const response = await fetch(
      `${BACKEND_URL}/api/students/family-members.php?student_id=${studentId}`
    );

    if (!response.ok) {
      error(response.status, 'Failed to fetch student family members.');
    }

    const result: Result<{ student_family_members: StudentFamilyMember[] }> = await response.json();

    console.log(result.message);

    if (result.data === undefined) {
      error(404, 'Student family members undefined.');
    }

    return result.data;
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

    console.log(result.message);

    if (result.data === undefined) {
      error(404, 'Student enrollments undefined.');
    }

    return result.data;
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

    console.log(result.message);

    if (result.data === undefined) {
      error(404, 'Student enrollments undefined.');
    }

    return result.data;
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

    console.log(result.message);

    if (result.data === undefined) {
      error(404, 'Grades not found.');
    }

    return result.data;
  };

  const getYearLevels = async () => {
    const response = await fetch(`${BACKEND_URL}/api/year-levels.php`, { method: 'GET' });

    if (!response.ok) {
      error(response.status, 'Failed to get year levels.');
    }

    const result: Result<{ year_levels: YearLevel[] }> = await response.json();

    console.log(result.message);

    if (result.data === undefined) {
      error(404, 'Year levels not found.');
    }

    return result.data.year_levels;
  };

  const studentUserData = (await getStudentData(user_id)).user;
  const studentProfile = (await getStudentProfile(user_id)).student_profile;
  const studentFamilyMembers = (await getStudentFamilyMembers(user_id)).student_family_members;
  const studentEnrollments = (await getStudentEnrollments(user_id))
  const studentTransactions = (await getStudentTransactions(user_id))
  const studentGrades = await getStudentGrades(user_id);
  const yearLevels = await getYearLevels();

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
    tab,
    studentId: user_id,
    yearLevelId
  };
};

type PayloadGrade = {
  subject_level_id: string;
  grades: Grade[];
};

export const actions: Actions = {
  submit_grades: async (event) => {
    const form = await superValidate(event, zod(gradesSchema));

    const { user_id } = event.params;

    if (!user_id) {
      error(404, 'Student ID not found.');
    }

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

      const result: Result<{ strand: Strand | undefined }> = await response.json();

      console.log(result.message)
      console.log(result.data)
      console.log(result.data?.strand?.id)

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

    const strand = await getStrand({ student_id: user_id, year_level_id: form.data.year_level_id });

    await createGrades(form.data.subject_grades, user_id, strand?.id);

    return {
      form,
      message: 'Successfully submitted grades.'
    };
  },
  enroll: async () => {

  }
};
