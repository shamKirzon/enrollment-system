export type User = {
	id: number;
	first_name: string;
	middle_name?: string;
	last_name: string;
	contact_number: string;
	email: string;
	role: Role;
	created_at: string;
	updated_at: string;
};

export type UserCount = {
	role: Role;
	value: number;
};

export enum Role {
	Student = 'student',
	Teacher = 'teacher',
	Admin = 'admin'
}
