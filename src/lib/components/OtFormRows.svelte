<script lang="ts">
	import type { OtHeader, OtRow } from '../types';
	import { computeDurationLabel } from '../time';

	let { rows, header }: { rows: OtRow[]; header: OtHeader } = $props();
</script>

<section class="card">
	<h3>Overtime Entries</h3>
	<table>
		<thead>
			<tr>
				<th>#</th>
				<th>Date</th>
				<th>Time From</th>
				<th>Time End</th>
				<th>Total</th>
				<th>Reason for Overtime</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, i (i)}
				<tr>
					<td>{i + 1}</td>
					<td><input type="date" bind:value={row.date} disabled={header.autoDates} /></td>
					<td><input type="time" bind:value={row.timeFrom} disabled={header.repetitive} /></td>
					<td><input type="time" bind:value={row.timeEnd} disabled={header.repetitive} /></td>
					<td>{computeDurationLabel(row.timeFrom, row.timeEnd)}</td>
					<td><input type="text" bind:value={row.reason} placeholder="Reason for overtime" /></td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>
