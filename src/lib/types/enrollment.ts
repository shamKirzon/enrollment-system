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
	level: string;
	section?: string;
	tuition_plan: string;
	status: EnrollmentStatus;
	payment_receipt_url: string;
	student_id: number;
	academic_year_id: number;
};

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
};
