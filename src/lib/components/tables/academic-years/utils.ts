import { AcademicYearStatus } from '$lib/types/enrollment';
import Upcoming from 'virtual:icons/ic/round-upcoming';
import DoorOpen from 'virtual:icons/material-symbols/door-open';
import Check from 'virtual:icons/material-symbols/check';
import Timer from 'virtual:icons/mdi/timer-play-outline';
import type { ComponentType, SvelteComponent } from 'svelte';

type AcademicYearBadge = {
	color: string;
	icon: ComponentType<SvelteComponent>;
	variant?: 'default' | 'secondary' | 'destructive' | 'outline';
};

export const academicYearStatusMap: Map<AcademicYearStatus, AcademicYearBadge> = new Map([
	[
		AcademicYearStatus.Upcoming,
		{
			color: 'bg-amber-500 hover:bg-amber-500',
			icon: Upcoming,
			variant: 'secondary'
		}
	],
	[
		AcademicYearStatus.Open,
		{
			color: 'bg-green-300 hover:bg-green-400',
			icon: DoorOpen,
			variant: 'secondary'
		}
	],
	[
		AcademicYearStatus.Ongoing,
		{
			color: 'bg-yellow-500 hover:bg-yellow-500',
			variant: 'secondary',
			icon: Timer
		}
	],
	[
		AcademicYearStatus.Finished,
		{
			color: '',
			variant: 'default',
			icon: Check
		}
	]
]);
