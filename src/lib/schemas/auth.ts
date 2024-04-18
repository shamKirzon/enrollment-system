import { z } from 'zod';

export const registerSchema = z.object({
	first_name: z.string(),
	middle_name: z.string().optional(),
	last_name: z.string(),
	email: z.string().email(),
	contact_number: z.string(),
	password: z.string().min(6)
});

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string()
});

export type RegisterSchema = typeof registerSchema;
export type LoginSchema = typeof loginSchema;
