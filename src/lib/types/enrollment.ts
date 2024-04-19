export type AcademicYear = {
	id: number;
	year: string;
	start_at: Date;
	end_at: Date;
	status: AcademicYearStatus;
};

export type AcademicYearWithStudentCount = AcademicYear & {
	student_count: number;
};

export enum AcademicYearStatus {
	Upcoming = 'upcoming',
	Open = 'open',
	Ongoing = 'Ongoing',
	Finished = 'finished'
}
