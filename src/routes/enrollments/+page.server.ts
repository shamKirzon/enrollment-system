import { enrollmentSchema } from '$lib/schemas/enrollment.js';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ fetch }) => {
	return {
		form: await superValidate(zod(enrollmentSchema))
	};
};

export const actions: Actions = {
	default: async ({ fetch }) => {
		return {};
	}
};
