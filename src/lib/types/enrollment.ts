export type AcademicYear = {
	id: number;
	start_at: string;
	end_at: string;
	status: AcademicYearStatus;
};

export type AcademicYearWithStudentCount = AcademicYear & {
	year: string;
	student_count: number;
};

export enum AcademicYearStatus {
	Upcoming = 'upcoming',
	Open = 'open',
	Ongoing = 'ongoing',
	Finished = 'finished'
}
