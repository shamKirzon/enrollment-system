import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE, sizeInMB } from '$lib';
import { Semester, StudentStatus } from '$lib/types/enrollment';
import { PaymentMethod } from '$lib/types/payment';
import { z } from 'zod';

export const academicYearSchema = z.object({
	start_at: z.string().refine((s) => s, { message: 'A start date is required.' }),
	end_at: z.string().refine((s) => s, { message: 'An end date is required.' }),
	status: z.enum(['upcoming', 'open', 'ongoing', 'finished']).default('upcoming')
});

export type AcademicYearSchema = typeof academicYearSchema;

const ACCEPTED_DOCUMENT_TYPES = ['application/pdf'];
const MAX_DOCUMENT_SIZE = 20; // Megabytes


export const enrollmentSchema = z.object({
	year_level_id: z.string(),
	student_id: z.string(),
	academic_year_id: z.number(),
	strand_id: z.string().optional(),

	transaction_number: z.string(),
	payment_amount: z.coerce.number().nonnegative(),
	payment_method: z.nativeEnum(PaymentMethod),
	payment_receipt: z
		.instanceof(File, { message: 'Image is required.' })
		.refine(
			(f) => sizeInMB(f.size) <= MAX_IMAGE_SIZE,
			`The maximum file size is ${MAX_IMAGE_SIZE} MB.`
		)
		.refine((file) => {
			return ACCEPTED_IMAGE_TYPES.includes(file.type);
		}, `Only .jpg, .jpeg, .png, .webp, and .avif files are accepted.`),

	report_card: z
		.instanceof(File, { message: 'Image is required.' })
		.refine(
			(f) => sizeInMB(f.size) <= MAX_IMAGE_SIZE,
			`The maximum file size is ${MAX_IMAGE_SIZE} MB.`
		)
		.refine((file) => {
			return ACCEPTED_IMAGE_TYPES.includes(file.type);
		}, `Only .jpg, .jpeg, .png, .webp, and .avif files are accepted.`)
		.optional(),

	student_status: z.nativeEnum(StudentStatus),
	tuition_plan_id: z.string().optional(),
	payment_mode_id: z.string()
});

export type EnrollmentSchema = typeof enrollmentSchema;

export const subjectSchema = z.object({
	subject_id: z.string(),
	subject_name: z.string(),
	year_level_ids: z.string().array(),
	strand_ids: z.string().array(),
	semesters: z.string().array()
});

export type SubjectSchema = typeof subjectSchema;

export const sectionAssignmentSchema = z.object({
	academic_year_id: z.number(),
	year_level_id: z.string(),
	strand_id: z.string().optional(),
});

export type SectionAssignmentSchema = typeof sectionAssignmentSchema;

export const sectionSchema = z.object({
	section_name: z.string(),
	section_id: z.string().optional(),
	year_level_id: z.string().optional(),
	section_level_id: z.string().optional(),
	strand_id: z.string().optional(),
	adviser_id: z.string().optional()
});

export type SectionSchema = typeof sectionSchema;
