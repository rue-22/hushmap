<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';

	const { children } = $props();
</script>

<div class="grid min-h-screen grid-rows-[auto_1fr]">
	<Header />

	{@render children()}
</div>
