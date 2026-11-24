<script lang="ts">
	import type { OtHeader } from '../types';

	let {
		header,
		error = '',
		onGenerate
	}: { header: OtHeader; error?: string; onGenerate: () => void } = $props();
</script>

<section class="card">
	<h2>Employee Details</h2>

	<div class="field">
		<label for="employeeName">Employee Name</label>
		<input id="employeeName" bind:value={header.employeeName} />
	</div>

	<div class="field">
		<label for="position">Position</label>
		<input id="position" bind:value={header.position} />
	</div>

	<div class="field">
		<label for="branch">Branch</label>
		<input id="branch" bind:value={header.branch} />
	</div>

	<div class="field">
		<label for="workSchedule">Work Schedule</label>
		<input id="workSchedule" bind:value={header.workSchedule} placeholder="e.g. 8:00 AM - 5:00 PM" />
	</div>

	<div class="field">
		<label for="copies">Number of Copies</label>
		<input id="copies" type="number" min="1" bind:value={header.copies} />
	</div>

	<div class="field checkbox">
		<label>
			<input type="checkbox" bind:checked={header.autoDates} />
			Date Entry: {header.autoDates ? 'Auto' : 'Manual'}
		</label>
	</div>

	{#if header.autoDates}
		<div class="field">
			<label for="startDate">Start Date</label>
			<input id="startDate" type="date" bind:value={header.startDate} />
		</div>

		<div class="field checkbox">
			<label>
				<input type="checkbox" bind:checked={header.includeSunday} />
				Include Sunday
			</label>
		</div>
	{/if}

	<div class="field checkbox">
		<label>
			<input type="checkbox" bind:checked={header.repetitive} />
			Repetitive data for Time Start and Time End
		</label>
	</div>

	{#if header.repetitive}
		<div class="field-row">
			<div class="field">
				<label for="sharedFrom">Time From</label>
				<input id="sharedFrom" type="time" bind:value={header.sharedTimeFrom} />
			</div>
			<div class="field">
				<label for="sharedTo">Time End</label>
				<input id="sharedTo" type="time" bind:value={header.sharedTimeEnd} />
			</div>
		</div>
	{/if}

	{#if error}
		<p class="error">{error}</p>
	{/if}

	<button class="primary" onclick={onGenerate}>Generate</button>
</section>
