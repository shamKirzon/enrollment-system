import type { UserName } from './user';

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
	transaction_id: string;
	transaction_number: string;

	academic_year_start_at: string;
	academic_year_end_at: string;
	year_level_name: string;
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
};

export type AcademicYearEnrollment = {
	academic_year_id: number;
	academic_year_start_at: string;
	academic_year_end_at: string;
	academic_year_status: AcademicYearStatus;
	enrollment_id?: string;
	enrollment_status?: EnrollmentStatus;
	section_name?: string;
	enrolled_at?: string;
	year_level?: string;
};

export type Transaction = {
	id: string;
	amount: string | number;
	payment_receipt_url: string;
	created_at: string; // Date
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
};

export type PreviousReportCardPayload = {
	report_card_url: string;
	enrollment_id: string;
};

// export type SubjectDetails = {
//   id
// }
