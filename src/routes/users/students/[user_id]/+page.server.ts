import { BACKEND_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Result } from '$lib/types';
import type { StudentFamilyMember, StudentProfile, User } from '$lib/types/user';
import type { AcademicYearEnrollment } from '$lib/types/enrollment';

export const load: PageServerLoad = async ({ fetch, params, locals }) => {
  const { user_id } = params;

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

  const studentUserData = (await getStudentData(user_id)).data?.user;
  const studentProfile = (await getStudentProfile(user_id)).data?.student_profile;
  const studentFamilyMembers = (await getStudentFamilyMembers(user_id)).data
    ?.student_family_members;
  const studentEnrollments = (await getStudentEnrollments(user_id)).data?.academic_year_enrollments;

  if(studentUserData === undefined) {
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

  return {
    studentUserData,
    studentProfile,
    studentFamilyMembers,
    studentEnrollments
  };
};
