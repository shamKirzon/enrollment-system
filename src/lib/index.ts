import Users from 'virtual:icons/mdi/users';
import Dashboard from 'virtual:icons/radix-icons/dashboard';
import School from 'virtual:icons/lucide/school';
import Money from 'virtual:icons/mdi/money';
import type { Route } from './types';

export function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function objectToFormData(obj, formData = new FormData(), parentKey = null): FormData {
	for (const key of Object.keys(obj)) {
		const value = obj[key];

		if (value instanceof File) {
			formData.append(parentKey ? `${parentKey}[${key}]` : key, value);
		} else if (value instanceof Object && !(value instanceof Date)) {
			objectToFormData(value, formData, parentKey ? `${parentKey}[${key}]` : key);
		} else {
			formData.append(parentKey ? `${parentKey}[${key}]` : key, value);
		}
	}

	return formData;
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
		name: 'Users',
		path: '/admin/users',
		icon: Users
	}
];

export const COLORS = {
	primary: 'rgb(73, 34, 20)',
	secondary: 'rgb(205, 127, 0)'
};
