import type { Strand, YearLevel } from "./enrollment";

export type SubjectDetails = {
	subject_id: string;
	subject_name: string;
	year_levels: YearLevel[];
	strands: Strand[]
}
