<script lang="ts">
	import type { OtHeader, OtRow } from '../types';
	import { generateOtFormPdf } from '../pdf';

	let { header, rows }: { header: OtHeader; rows: OtRow[] } = $props();
	let error = $state('');
	let generating = $state(false);

	function isRowsValid(): boolean {
		return rows.length > 0 && rows.every((r) => r.date && r.timeFrom && r.timeEnd && r.reason.trim());
	}

	async function handleClick() {
		if (!isRowsValid()) {
			error = 'Please fill in Date, Time From, Time End, and Reason for every row before exporting.';
			return;
		}
		error = '';
		generating = true;
		try {
			await generateOtFormPdf(header, rows);
		} finally {
			generating = false;
		}
	}
</script>

<div class="pdf-export">
	<button class="primary" onclick={handleClick} disabled={generating}>
		{generating ? 'Generating…' : 'Generate PDF'}
	</button>
	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>
