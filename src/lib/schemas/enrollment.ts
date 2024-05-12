import { z } from 'zod';

export const academicYearSchema = z.object({
	start_at: z.string().refine((s) => s, { message: 'A start date is required.' }),
	end_at: z.string().refine((s) => s, { message: 'An end date is required.' }),
	status: z.enum(['upcoming', 'open', 'ongoing', 'finished']).default('upcoming')
});

export type AcademicYearSchema = typeof academicYearSchema;

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
const MAX_IMAGE_SIZE = 5; // Megabytes

function sizeInMB(sizeInBytes: number, decimals = 2): number {
	const result = sizeInBytes / (1024 * 1024);
	return +result.toFixed(decimals);
}

export const enrollmentSchema = z.object({
	// year: z.string(),
	year_level_id: z.string(),
	tuition_plan: z.string(),
	student_id: z.number(),
	academic_year_id: z.number(),
	amount: z.number(),
	payment_receipt: z
		.instanceof(File, { message: 'Image is required.' })
		.refine(
			(f) => sizeInMB(f.size) <= MAX_IMAGE_SIZE,
			`The maximum file size is ${MAX_IMAGE_SIZE} MB.`
		)
		.refine((file) => {
			return ACCEPTED_IMAGE_TYPES.includes(file.type);
		}, `Only .jpg, .jpeg, .png, .webp, and .avif files are accepted.`)
});

export type EnrollmentSchema = typeof enrollmentSchema;
