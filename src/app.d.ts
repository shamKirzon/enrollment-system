// See https://kit.svelte.dev/docs/types#app
import 'unplugin-icons/types/svelte';
import type { Result } from '$lib/types';
import type { User } from '$lib/types/user';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User;
			getSession: () => string | undefined;
			getUserData: () => Promise<Result<{ user: User | undefined }>>;
			getStudentData: () => Promise<Result<{ student: User | undefined }>>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
