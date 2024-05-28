export type UserName = {
	first_name: string;
	middle_name?: string;
	last_name: string;
	suffix_name?: string;
};

export type User = UserName & {
	id: string;
	contact_number: string;
	email: string;
	role: Role;
	created_at: string;
	updated_at: string;
	avatar_url?: string;
	sex: Sex;
};

export enum Sex {
	Male = 'male',
	Female = 'female'
}

export type UserCount = {
	role: Role;
	value: number;
};

export enum Role {
	Student = 'student',
	Parent = 'parent',
	Teacher = 'teacher',
	Admin = 'admin'
}

export type Teacher = UserName & {
	id: string;
	sex: Sex;
};
