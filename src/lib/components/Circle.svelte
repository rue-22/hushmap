<script>
	const { color, dbaLevel } = $props();
</script>

<div
	class="text-{color} border-{color} center flex size-10 cursor-pointer flex-col items-center justify-center gap-0 rounded-full border-2 bg-header-color"
>
	{#if color === 'quiet-green'}
		<span class="icon-[solar--volume-small-linear] size-xl"></span>
	{:else if color === 'loud-orange'}
		<span class="icon-[solar--volume-loud-linear]"></span>
	{:else}
		<span class="icon-[solar--volume-loud-bold]"></span>
	{/if}

	<p class="text-xs">{dbaLevel}</p>
</div>

<style>
	span {
		width: 24px;
		height: 24px;
	}
</style>
