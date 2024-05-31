import type { EducationLevel, Strand, YearLevel } from "./enrollment";

export type SubjectDetails = {
	subject_id: string;
	subject_name: string;
	year_levels: YearLevel[];
	strands: Strand[],
	semesters: string[]
}

export type SubjectGradeDetails = {
	subject_grades: SubjectGrade[];
	final_grade: number;
	education_level: EducationLevel
}

export type Grade = {
	grade: string;
	period: string;
}

export type SubjectGrade = {
	subject_name: string;
	grades: Grade[];
	average_grade: string;
}
