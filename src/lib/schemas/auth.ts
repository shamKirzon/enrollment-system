import { z } from 'zod';
import { addressSchema, studentProfileSchema } from './user';

export const accountSchema = z.object({
	first_name: z.string(),
	middle_name: z.string().optional(),
	last_name: z.string(),
	suffix_name: z.string().optional(),
	email: z.string().email(),
	contact_number: z.string(),
	role: z.enum(['student', 'parent']),
	password: z.string().min(6),

	confirm_password: z.string().min(6)
});

export const registerSchema = z
	.object({
		first_name: z.string(),
		middle_name: z.string().optional(),
		last_name: z.string(),
		suffix_name: z.string().optional(),
		email: z.string().email(),
		contact_number: z.string(),
		role: z.enum(['student', 'parent']),
		password: z.string().min(6),

		confirm_password: z.string().min(6)
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords don't match",
		path: ['confirm_password']
	});

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string()
});

// export const registerParentSchema = z.object({
//
// })

export const registerProfileSchema = studentProfileSchema
	.merge(addressSchema)
	.merge(accountSchema)
	.refine((data) => data.password === data.confirm_password, {
		message: "Passwords don't match",
		path: ['confirm_password']
	});

export type RegisterSchema = typeof registerSchema;
export type LoginSchema = typeof loginSchema;
export type RegisterProfileSchema = typeof registerProfileSchema
