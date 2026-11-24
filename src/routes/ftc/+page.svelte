<script lang="ts">
	import BackLink from '../../lib/components/BackLink.svelte';
</script>

<BackLink href="/" label="Back to Dashboard" />

<div class="page-head">
	<h1>Form Template Create</h1>
	<p class="page-sub">Choose a template to fill out and export.</p>
</div>

<div class="card-grid">
	<a class="app-card" href="/ftc/ot-form">
		<span class="card-icon" style="background: linear-gradient(135deg, #fb923c, #ea580c);">
			<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="12" cy="13" r="8" stroke="#fff" stroke-width="1.6" />
				<path d="M12 9v4l3 2" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
				<path d="M9 2h6M12 2v2" stroke="#fff" stroke-width="1.6" stroke-linecap="round" />
			</svg>
		</span>
		<span class="card-body">
			<span class="card-title">Litecloud OT Form</span>
			<span class="card-sub">Overtime request slip generator</span>
		</span>
		<span class="card-arrow" aria-hidden="true">→</span>
	</a>
</div>

