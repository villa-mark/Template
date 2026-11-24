import type { OtHeader, OtRow } from './types';

const STORAGE_KEY = 'ftc:ot-form:v1';

export interface OtFormState {
	header: OtHeader;
	rows: OtRow[];
	generated: boolean;
}

export function saveOtFormState(state: OtFormState): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadOtFormState(): OtFormState | null {
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as OtFormState;
	} catch {
		return null;
	}
}

export function clearOtFormState(): void {
	localStorage.removeItem(STORAGE_KEY);
}
