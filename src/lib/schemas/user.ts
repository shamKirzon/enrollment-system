import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE, sizeInMB } from '$lib';
import { Role, Sex } from '$lib/types/user';
import { z } from 'zod';

export const userSchema = z.object({
	first_name: z.string(),
	middle_name: z.string().optional().nullable(),
	last_name: z.string(),
	suffix_name: z.string().optional().nullable(),
	email: z.string().email(),
	contact_number: z.string(),
	role: z.nativeEnum(Role),
	avatar_url: z.string().optional().nullable(),
	password: z.string()
});

export type UserSchema = typeof userSchema;

export const addressSchema = z.object({
	country: z.string(),
	region: z.string(),
	province: z.string(),
	city: z.string(),
	barangay: z.string(),
	street: z.string().optional().nullable()
});

export const studentProfileSchema = z.object({
	lrn: z.string(),
	birth_date: z.string().refine((s) => s, { message: 'A birth date is required.' }),
	birth_place: z.string(),
	sex: z.nativeEnum(Sex),
	citizenship: z.string(),
	religion: z.string(),
	parent_contact_number: z.string(),
	landline: z.string(),

	birth_certificate: z
		.instanceof(File, { message: 'Image is required.' })
		.refine(
			(f) => sizeInMB(f.size) <= MAX_IMAGE_SIZE,
			`The maximum file size is ${MAX_IMAGE_SIZE} MB.`
		)
		.refine((file) => {
			return ACCEPTED_IMAGE_TYPES.includes(file.type);
		}, `Only .jpg, .jpeg, .png, .webp, and .avif files are accepted.`),

	baptismal_certificate: z
		.instanceof(File, { message: 'Image is required.' })
		.refine(
			(f) => sizeInMB(f.size) <= MAX_IMAGE_SIZE,
			`The maximum file size is ${MAX_IMAGE_SIZE} MB.`
		)
		.refine((file) => {
			return ACCEPTED_IMAGE_TYPES.includes(file.type);
		}, `Only .jpg, .jpeg, .png, .webp, and .avif files are accepted.`)
});

export const addStudentSchema = studentProfileSchema.merge(addressSchema).merge(userSchema);

export type AddStudentSchema = typeof addStudentSchema;
