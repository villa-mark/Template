export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ftc:theme';

export function getActiveTheme(): Theme {
	return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function applyTheme(theme: Theme): void {
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem(STORAGE_KEY, theme);
}
