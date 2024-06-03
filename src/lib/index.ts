import Users from 'virtual:icons/mdi/users';
import Dashboard from 'virtual:icons/radix-icons/dashboard';
import School from 'virtual:icons/lucide/school';
import Money from 'virtual:icons/mdi/money';
import Calendar from 'virtual:icons/mdi/calendar';
import Books from 'virtual:icons/ph/books-duotone';
import Group from 'virtual:icons/lets-icons/group-scan';
import FileTable from 'virtual:icons/mdi/file-table-outline';
import type { Result, Route } from './types';
import type { Writable } from 'svelte/store';
import { toast } from 'svelte-sonner';
import { invalidateAll } from '$app/navigation';
import { type ChartArea } from 'chart.js';
import type { UserName } from './types/user';


export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
export const MAX_IMAGE_SIZE = 5; // Megabytes


export function sizeInMB(sizeInBytes: number, decimals = 2): number {
	const result = sizeInBytes / (1024 * 1024);
	return +result.toFixed(decimals);
}

export function capitalizeFirstLetter(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getSelectedRowData<T, R, L extends keyof T>(
	data: T[],
	selectedRows: Writable<R[]>,
	selectedData: Record<string, boolean>,
	key: L
): void {
	if (!selectedData) return;

	const keys = Object.keys(selectedData || []);

	selectedRows.set([]);

	keys.forEach((idx) => {
		const i = Number(idx);

		selectedRows.update(($row) => {
			$row.push(data[i][key] as R);

			return $row;
		});
	});
}

export async function deleteData<T>(data: T[], url: string): Promise<void> {
	console.log('Deleting data...');

	const response = await fetch(url, {
		method: 'DELETE',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const result: Result = await response.json();

	console.log(result.message);

	if (!response.ok) {
		toast.error(result.message);
		return;
	}

	await invalidateAll();

	toast.success(result.message);
}

export function getGradient(ctx: CanvasRenderingContext2D, chartArea: ChartArea, color: string) {
	const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
	gradient.addColorStop(0.6, color);
	gradient.addColorStop(0, 'transparent');

	return gradient;
}

export function formatName(name: UserName): string {
	const { last_name, first_name, middle_name, suffix_name } = name;

	return `${last_name}, ${first_name}${middle_name ? ` ${capitalizeFirstLetter(middle_name[0])}.` : ''}${suffix_name ? ` ${suffix_name}.` : ''}`;
}

export const ROUTES: Route[] = [
	{
		name: 'Dashboard',
		path: '/dashboard',
		icon: Dashboard
	},
	{
		name: 'Transactions',
		path: '/transactions',
		icon: Money
	},
	{
		name: 'Grades',
		path: '/grades',
		icon: FileTable
	}
];

export const PARENT_ROUTES: Route[] = [
	{
		name: 'Dashboard',
		path: '/parent/dashboard',
		icon: Dashboard
	},
	{
		name: 'Transactions',
		path: '/parent/transactions',
		icon: Money
	},
	{
		name: 'Grades',
		path: '/parent/grades',
		icon: FileTable
	}
];

export const ADMIN_ROUTES: Route[] = [
	{
		name: 'Dashboard',
		path: '/admin/dashboard',
		icon: Dashboard
	},
	{
		name: 'Enrollments',
		path: '/admin/enrollments',
		icon: School
	},
	{
		name: 'Transactions',
		path: '/admin/transactions',
		icon: Money
	},
	{
		name: 'Academic Years',
		path: '/admin/academic-years',
		icon: Calendar
	},
	{
		name: 'Sections',
		path: '/admin/sections',
		icon: Group
	},
	{
		name: 'Subjects',
		path: '/admin/subjects',
		icon: Books
	},
	{
		name: 'Users',
		path: '/admin/users',
		icon: Users
	}
];

export const COLORS = {
	primary: (opacity: number) => {
		return `rgba(73, 34, 20, ${opacity})`;
	},
	secondary: (opacity: number) => {
		return `rgba(205, 127, 0, ${opacity})`;
	}
};

export function roundNumber(numberString: string | number, decimalPlaces: number) {
	try {
		const number = parseFloat(numberString.toString());

		return number.toFixed(decimalPlaces);
		// const factor = Math.pow(10, decimalPlaces);
		// return Number((Math.round(number * factor) / factor).toFixed(decimalPlaces));
	} catch (error) {
		console.error('Invalid number format:', error);
		return Number.NaN; // Or any other default value you prefer
	}
}
