<script lang="ts">
	import type { OtHeader, OtRow } from '../types';
	import { saveOtFormState } from '../storage';

	let { header, rows, generated }: { header: OtHeader; rows: OtRow[]; generated: boolean } = $props();
	let error = $state('');
	let saved = $state(false);

	function handleClick() {
		error = '';
		try {
			saveOtFormState({ header, rows, generated });
			saved = true;
		} catch {
			error = 'Could not save locally. Your browser may be blocking storage.';
		}
	}
</script>

<div class="pdf-export">
	<button class="secondary" onclick={handleClick}>Save</button>
	{#if saved}
		<p class="hint">Saved locally. It will still be here after you refresh the page.</p>
	{/if}
	{#if error}
		<p class="error">{error}</p>
	{/if}
</div>
