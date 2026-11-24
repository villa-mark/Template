<script lang="ts">
	let { href, label }: { href: string; label: string } = $props();
</script>

<a class="back-link-top" {href}>
	<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M15 18l-6-6 6-6"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
	{label}
</a>
