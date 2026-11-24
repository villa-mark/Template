export function parseTimeToMinutes(time: string): number | null {
	if (!time) return null;
	const [h, m] = time.split(':').map(Number);
	if (Number.isNaN(h) || Number.isNaN(m)) return null;
	return h * 60 + m;
}

export function formatAmPm(time: string): string {
	const [h, m] = (time ?? '').split(':').map(Number);
	if (Number.isNaN(h) || Number.isNaN(m)) return '___';
	const period = h >= 12 ? 'PM' : 'AM';
	const hour12 = h % 12 === 0 ? 12 : h % 12;
	return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

/** Overnight-safe: if end is at/before start, treat it as crossing midnight. */
export function computeDurationMinutes(from: string, to: string): number | null {
	const start = parseTimeToMinutes(from);
	const end = parseTimeToMinutes(to);
	if (start === null || end === null) return null;
	let diff = end - start;
	if (diff < 0) diff += 24 * 60;
	return diff;
}

export function formatDuration(minutes: number | null): string {
	if (minutes === null) return '—';
	const hrs = Math.floor(minutes / 60);
	const mins = minutes % 60;
	const parts: string[] = [];
	if (hrs > 0) parts.push(`${hrs} hr${hrs > 1 ? 's' : ''}`);
	if (mins > 0 || hrs === 0) parts.push(`${mins} min`);
	return parts.join(' ');
}

export function computeDurationLabel(from: string, to: string): string {
	return formatDuration(computeDurationMinutes(from, to));
}

/** Sequential dates starting at startDate (YYYY-MM-DD), one per day, optionally skipping Sundays. */
export function generateSequentialDates(startDate: string, count: number, includeSunday: boolean): string[] {
	const dates: string[] = [];
	if (!startDate || count <= 0) return dates;
	const cursor = new Date(`${startDate}T00:00:00Z`);
	if (Number.isNaN(cursor.getTime())) return dates;

	while (dates.length < count) {
		const isSunday = cursor.getUTCDay() === 0;
		if (includeSunday || !isSunday) {
			dates.push(cursor.toISOString().slice(0, 10));
		}
		cursor.setUTCDate(cursor.getUTCDate() + 1);
	}
	return dates;
}
