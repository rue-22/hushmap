<script>
	import Toggle from '$lib/components/Toggle.svelte';
	import favicon from '$lib/static/logo.png';
</script>

<header class="bg-header-color flex justify-between px-4 pt-2 py-3 text-center shadow-xl md:px-8">
	<a class="flex w-8 aspect-square items-center gap-2" href="/">
		<img src={favicon} alt="HushMap's logo" />
		<h1 class="text-3xl font-bold text-white">HushMap</h1>
	</a>
	<Toggle />
</header>
