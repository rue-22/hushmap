<script>
	const props = $props();

	let dbClass = $state('');
	let dbText = $state('');
	if (props.attr === 'Mean dBA level')
		if (props.val <= 60) {
			dbClass = 'text-quiet-green';
			dbText = ' dBA (Quiet)';
		} else if (props.val > 60 && props.val < 69) {
			dbClass = 'text-loud-orange';
			dbText = ' dBA (Loud)';
		} else {
			dbClass = 'text-very-loud-red';
			dbText = ' dBA (Very Loud)';
		}
</script>

<div>
	<p>
		<span class="italic">{props.attr}</span>:
		{#if props.attr === 'Timeframe'}
			{@const [start, end] = props.val}
			<span class="font-semibold {dbClass}">{start} to {end}</span>
		{:else}
			<span class="font-semibold {dbClass}">{props.val + dbText}</span>
		{/if}
	</p>
</div>
