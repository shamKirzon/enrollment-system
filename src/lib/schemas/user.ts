import { Role } from '$lib/types/user';
import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	created_at: z.string(),
	first_name: z.string(),
	middle_name: z.string().optional().nullable(),
	last_name: z.string(),
	suffix_name: z.string().optional().nullable(),
	email: z.string().email(),
	contact_number: z.string(),
	role: z.nativeEnum(Role),
	avatar_url: z.string().optional().nullable(),
	password: z.string().min(6)
});

export type UserSchema = typeof userSchema;
