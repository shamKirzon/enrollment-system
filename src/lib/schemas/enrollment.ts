import { z } from 'zod';

export const academicYearSchema = z.object({
	start_at: z.string().refine((s) => s, { message: 'A start date is required.' }),
	end_at: z.string().refine((s) => s, { message: 'An end date is required.' }),
	status: z.enum(['upcoming', 'open', 'ongoing', 'finished']).default('upcoming')
});

export type AcademicYearSchema = typeof academicYearSchema;
