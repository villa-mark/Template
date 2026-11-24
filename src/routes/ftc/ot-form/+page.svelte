<script lang="ts">
	import OtFormHeader from '../../../lib/components/OtFormHeader.svelte';
	import OtFormRows from '../../../lib/components/OtFormRows.svelte';
	import OtFormPdfButton from '../../../lib/components/OtFormPdfButton.svelte';
	import OtFormSaveButton from '../../../lib/components/OtFormSaveButton.svelte';
	import BackLink from '../../../lib/components/BackLink.svelte';
	import type { OtHeader, OtRow } from '../../../lib/types';
	import { generateSequentialDates } from '../../../lib/time';
	import { loadOtFormState, clearOtFormState } from '../../../lib/storage';
	import { onMount } from 'svelte';

	function defaultHeader(): OtHeader {
		return {
			employeeName: '',
			position: '',
			branch: '',
			workSchedule: '',
			copies: 1,
			repetitive: false,
			sharedTimeFrom: '',
			sharedTimeEnd: '',
			autoDates: false,
			startDate: '',
			includeSunday: false
		};
	}

	let header = $state<OtHeader>(defaultHeader());
	let rows = $state<OtRow[]>([]);
	let generated = $state(false);
	let headerError = $state('');

	onMount(() => {
		const saved = loadOtFormState();
		if (saved) {
			Object.assign(header, saved.header);
			rows = saved.rows;
			generated = saved.generated;
		}
	});

	function isHeaderValid(): boolean {
		return Boolean(
			header.employeeName.trim() &&
				header.position.trim() &&
				header.branch.trim() &&
				header.workSchedule.trim() &&
				header.copies >= 1
		);
	}

	function syncRowCount() {
		const target = Math.max(1, Math.floor(header.copies) || 1);
		if (rows.length < target) {
			const toAdd = target - rows.length;
			for (let i = 0; i < toAdd; i++) {
				rows.push({
					date: '',
					timeFrom: header.sharedTimeFrom,
					timeEnd: header.sharedTimeEnd,
					reason: ''
				});
			}
		} else if (rows.length > target) {
			rows.length = target;
		}
	}

	function handleGenerate() {
		if (!isHeaderValid()) {
			headerError = 'Please fill in all fields and set copies to at least 1.';
			return;
		}
		headerError = '';
		generated = true;
		syncRowCount();
	}

	function handleReset() {
		if (!confirm('Reset all fields and clear saved data? This cannot be undone.')) return;
		Object.assign(header, defaultHeader());
		rows = [];
		generated = false;
		headerError = '';
		clearOtFormState();
	}

	// Keep row count in sync if Number of Copies changes after generation.
	$effect(() => {
		if (generated) syncRowCount();
	});

	// Propagate shared From/To time to every row while repetitive mode is on.
	$effect(() => {
		if (header.repetitive) {
			for (const row of rows) {
				row.timeFrom = header.sharedTimeFrom;
				row.timeEnd = header.sharedTimeEnd;
			}
		}
	});

	// Auto-populate row dates sequentially from Start Date while auto-date mode is on.
	$effect(() => {
		if (header.autoDates && header.startDate) {
			const dates = generateSequentialDates(header.startDate, rows.length, header.includeSunday);
			rows.forEach((row, i) => {
				row.date = dates[i] ?? '';
			});
		}
	});
</script>

<BackLink href="/ftc" label="Back to Form Template Create" />

<div class="page-head">
	<h1>Litecloud OT Form</h1>
	<p class="page-sub">Fill in employee details, then generate and export OT slips.</p>
</div>

<OtFormHeader {header} error={headerError} onGenerate={handleGenerate} />

{#if generated}
	<OtFormRows {rows} {header} />
	<div class="action-row">
		<OtFormPdfButton {header} {rows} />
		<OtFormSaveButton {header} {rows} {generated} />
		<button class="ghost" onclick={handleReset}>Reset</button>
	</div>
{/if}
