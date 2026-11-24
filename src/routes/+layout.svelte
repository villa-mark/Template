<script lang="ts">
	import '#lib/app.css';
	import ThemeToggle from '../lib/components/ThemeToggle.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/mav-logo.png" />
	<title>Form Template Create</title>
</svelte:head>

<header class="topbar">
	<div class="topbar-inner">
		<a class="brand" href="/">
			<img class="brand-logo" src="/mav-logo.png" alt="MAV" />
			<span class="brand-divider"></span>
			<span class="brand-tag">Form Template Create</span>
		</a>
		<ThemeToggle />
	</div>
</header>

<div class="page">
	{@render children()}
</div>
