export type User = {
	id: number;
	first_name: string;
	middle_name?: string;
	last_name: string;
	contact_number: string;
	email: string;
	role: Role;
};

export enum Role {
	Student = 'student',
	Teacher = 'teacher',
	Admin = 'admin'
}
