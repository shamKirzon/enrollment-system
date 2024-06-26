import type { Sex, UserName } from './user';

export type AcademicYear = {
	id: number;
	start_at: string; // Date
	end_at: string; // Date
	status: AcademicYearStatus;
};

export type AcademicYearWithStudentCount = AcademicYear & {
	student_count: number;
};

export enum AcademicYearStatus {
	Upcoming = 'upcoming',
	Open = 'open',
	Ongoing = 'ongoing',
	Finished = 'finished'
}

export type Enrollment = {
	id: string;
	enrolled_at: string; // Date
	status: EnrollmentStatus;
	student_id: string;
	academic_year_id: number;
	year_level_id: string;
	transaction_id: string;
	// student_status: StudentStatus;
};

export enum StudentStatus {
	Old = 'old',
	New = 'new'
}

export enum EnrollmentStatus {
	Pending = 'pending',
	Done = 'done'
}

export type EnrollmentWithDetails = UserName & {
	enrollment_id: string;
	enrolled_at: string;
	status: EnrollmentStatus;
	student_id: string;
	academic_year_id: number;
	year_level_id: string;
	year_level_name: string;
	strand_id?: string;
	strand_name?: string;
	avatar_url?: string;

	transaction_id: string;
	transaction_number: string;

	academic_year_start_at: string;
	academic_year_end_at: string;
	payment_amount: string;
	payment_method: PaymentMethod;
	tuition_plan_name?: string;
	payment_receipt_url: string;
	student_status: StudentStatus;
};

export enum PaymentMethod {
	Cash = 'cash',
	Installment = 'installment'
}

export type YearLevel = {
	id: string;
	name: string;
	education_level: EducationLevel;
};

export enum EducationLevel {
	Preschool = 'preschool',
	Elementary = 'elementary',
	JuniorHighSchool = 'junior-high-school',
	SeniorHighSchool = 'senior-high-school'
}

export type AcademicYearEnrollment = {
	academic_year_id: number;
	academic_year_start_at: string;
	academic_year_end_at: string;
	academic_year_status: AcademicYearStatus;
	enrollment_id?: string;
	enrollment_status?: EnrollmentStatus;
	section_name?: string;
	strand_id?: string;
	strand_name?: string;
	year_level_name?: string;
	enrolled_at?: string;
};

export type Section = {
	id: string;
	name: string;
};

export type Strand = {
	id: string;
	name: string;
};

export type Subject = {
	id: string;
	name: string;
	year_level_count: number;
};

export type SubjectLevel = {
	id: string;
	subject_id: string;
	year_level_id: string;
	strand_id?: string;
	subject_name: string;
	year_level_name: string;
	strand_name?: string;
	semester?: Semester;
};

export type PreviousReportCardPayload = {
	report_card_url: string;
	enrollment_id: string;
};

export type StudentSectionAssignment = UserName & {
	section_assignment_id: string;
	enrollment_id: string;
	section_name: string;
	avatar_url?: string;
};

export type SectionLevelDetails = {
	section_id: string;
	section_level_id?: string;
	year_level_id?: string;
	section_name: string;
	adviser_id?: string;
	adviser_first_name?: string;
	adviser_middle_name?: string;
	adviser_last_name?: string;
	adviser_suffix_name?: string;
	adviser_sex?: Sex;
	year_level_name: string;
	strand_id?: string;
	strand_name?: string;
};

export enum Semester {
	First = '1',
	Second = '2'
}

// export type SubjectDetails = {
//   id
// }


export type EnrollmentFeeLevel = {
	id: string;
	amount: string;
	enrollment_fee_id: string;
	year_level_id: string;
}

export type EnrollmentFeeLevelDetails = Omit<EnrollmentFeeLevel, 'id'> & {
	enrollment_fee_level_id: string;
	year_level_name: string;
	enrollment_fee_name: string;
}

export type TuitionPlanLevels = {
	id: string;
	down_payment_amount: string;
	monthly_payment_amount: string;
	tuition_plan_id: string;
	tuition_plan_name: string;
	year_level_id: string;
	year_level_name: string;
}

export type TuitionPlanLevelDetails = {
	tuition_plan_level_id: string;
	down_payment_amount: string;
	monthly_payment_amount: string;
	tuition_plan_id: string;
	tuition_plan_name: string;
	year_level_id: string;
	year_level_name: string;
}
