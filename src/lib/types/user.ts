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

export type StudentProfile = {
	student_profile_id: string;
	lrn: string;
	birth_date: string;
	birth_place: string;
	sex: Sex;
	citizenship: string;
	religion: string;
	parent_contact_number: string;
	landline: string;
	birth_certificate_url: string;
	baptismal_certificate_url: string;
	address_id: number;

	country: string;
	region: string;
	province: string;
	city: string;
	barangay: string;
	street?: string;
}

export enum Relationship {
	Father = 'father',
	Mother = 'mother',
	Guardian = 'guardian'
}

export type StudentFamilyMember = UserName & {
	id: string;
	relationship: Relationship;
	occupation: string;
	address_id: number;

	country: string;
	region: string;
	province: string;
	city: string;
	barangay: string;
	street?: string;
}
