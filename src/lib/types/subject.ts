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

// ????
export type Grade = {
	grade?: string | null;
	period?: string | null;
	student_grade_id?: number | null;
}

export type SubjectGrade = {
	subject_name: string;
	subject_level_id: string;
	grades: Grade[];
	average_grade?: string | null;
}
