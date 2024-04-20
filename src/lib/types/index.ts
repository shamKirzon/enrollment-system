import type { ComponentType, SvelteComponent } from 'svelte';

export type Route = {
	name: string;
	path: string;
	icon?: ComponentType<SvelteComponent>;
};

export type Result<T = undefined> = {
	message: string;
	data?: T;
};
