import { z } from 'zod';

export const gradeSchema = z.object({
	grade: z.string().optional().nullable(),
	period: z.string().optional().nullable(),
	student_grade_id: z.coerce.number().optional().nullable()
});

export type GradeSchema = typeof gradeSchema;

export const gradesSchema = z.object({
	subject_grades: z.object({
		subject_level_id: z.string(),
		grades: gradeSchema.array(),
		subject_name: z.string(),
		average_grade: z.string().optional().nullable()
	}).array()
});

export type GradesSchema = typeof gradesSchema;
