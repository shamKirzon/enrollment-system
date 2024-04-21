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

export type StatusBadge = {
	color: string;
	icon: ComponentType<SvelteComponent>;
	variant?: 'default' | 'secondary' | 'destructive' | 'outline';
};
