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
	id: number;
	enrolled_at: string; // Date
	tuition_plan: string;
	status: EnrollmentStatus;
	payment_receipt_url: string;
	student_id: number;
	section_id?: string;
	academic_year_id: number;
	year_level: number;
	student_status: StudentStatus;
};

export enum StudentStatus {
	Old = 'old',
	New = 'new'
}

export enum EnrollmentStatus {
	Pending = 'pending',
	Done = 'done'
}

export type EnrollmentWithDetails = Enrollment & {
	ay_start_at: string;
	ay_end_at: string;
	first_name: string;
	middle_name?: string;
	last_name: string;
	level: string;
};

export type YearLevel = {
	id: string;
	name: string;
};

export type AcademicYearEnrollment = {
	academic_year_id: number;
	start_at: string;
	end_at: string;
	academic_year_status: AcademicYearStatus;
	tuition_plan?: string;
	enrollment_status?: EnrollmentStatus;
	section?: string;
	enrolled_at: string;
	year_level?: string;
};

export type Transaction = {
	id: string;
	amount: string | number;
	payment_receipt_url: string;
	created_at: string; // Date
};
