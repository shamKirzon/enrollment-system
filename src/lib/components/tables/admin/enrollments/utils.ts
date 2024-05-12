import type { StatusBadge } from '$lib/types';
import { EnrollmentStatus } from '$lib/types/enrollment';
import Check from 'virtual:icons/material-symbols/check';
import Upcoming from 'virtual:icons/ic/round-upcoming';

export const enrollmentStatusMap: Map<EnrollmentStatus, StatusBadge> = new Map([
	[
		EnrollmentStatus.Pending,
		{
			color: 'bg-amber-500 hover:bg-amber-500',
			icon: Upcoming,
			variant: 'secondary'
		}
	],
	[
		EnrollmentStatus.Done,
		{
			color: '',
			variant: 'default',
			icon: Check
		}
	]
]);
