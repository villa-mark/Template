export interface OtHeader {
	employeeName: string;
	position: string;
	branch: string;
	workSchedule: string;
	copies: number;
	repetitive: boolean;
	sharedTimeFrom: string;
	sharedTimeEnd: string;
	autoDates: boolean;
	startDate: string;
	includeSunday: boolean;
}

export interface OtRow {
	date: string;
	timeFrom: string;
	timeEnd: string;
	reason: string;
}
