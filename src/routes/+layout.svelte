<script lang="ts">
	import '../app.css';
	// import { DarkMode } from 'flowbite-svelte';
	import Header from '$lib/components/Header.svelte';

	const { children } = $props();
</script>

<!-- <DarkMode /> -->
<div class="grid min-h-screen grid-rows-[auto_1fr]">
	<Header />

	{@render children()}
</div>
