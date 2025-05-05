<script lang="ts">
	import { Chart, Label, Select } from 'flowbite-svelte';
	import sampleSessions from '$lib/sample_point.json';

	let selected = $state(sampleSessions.sessions[0].sessionId);
	function listSessions() {
		const sessionChoices = sampleSessions.sessions.map(session => ({
			value: session.sessionId,
			name: session.date,
		}));

		return sessionChoices;
	}

	function buildOptions(noiseLevels: number[], startTimes: string[], descriptions: string[]) {
		return {
			chart: {
				height: '300px',
				maxWidth: '95%',
				type: 'line',
				fontFamily: 'Inter, sans-serif',
				dropShadow: {
					enabled: false,
				},
				toolbar: {
					show: false,
				},
			},
			tooltip: {
				enabled: true,
				x: {
					show: true,
				},
				custom({ series, seriesIndex, dataPointIndex }) {
					const description = descriptions[dataPointIndex];
					const time = startTimes[dataPointIndex];
					let value = '';
					if (series[seriesIndex][dataPointIndex] === null) value = 'No Data';
					else value = `${series[seriesIndex][dataPointIndex]} dBA`;

					return `
						<div class="p-2 text-sm">
							<p><strong>Time:</strong> ${time}</p>
							<p><strong>Level:</strong> ${value}</p>
							<p><strong>Description:</strong> ${description}</p>
						</div>
					`;
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				width: 6,
				curve: 'smooth',
			},
			grid: {
				show: true,
				strokeDashArray: 4,
			},
			series: [
				{
					name: 'dBA Level',
					data: noiseLevels,
					color: '#1A56DB',
				},
			],
			legend: {
				show: false,
			},
			xaxis: {
				categories: startTimes,
				title: {
					text: 'Timeframes',
				},
				labels: {
					show: false,
					style: {
						fontFamily: 'Inter, sans-serif',
						cssClass: 'text-lg font-normal fill-gray-400 dark:fill-gray-400',
					},
				},
				axisBorder: {
					show: true,
				},
				axisTicks: {
					show: true,
				},
			},
			yaxis: {
				show: true,
				title: {
					text: 'dBA Level',
				},
			},
		};
	}

	const { data } = $props();
	const latDir = $derived(sampleSessions.lat > 0 ? 'N' : 'S');
	const lonDir = $derived(sampleSessions.lon > 0 ? 'E' : 'W');
</script>

<div class="bg-background-color flex min-w-full flex-col px-4 pt-2">
	<div class="prose border-b pb-2">
		<h2 class="text-2xl">
			This point is in {sampleSessions.brgy}, {sampleSessions.city}.
		</h2>
		<h3 class="text-xl">
			Latitude and Longitude: [{sampleSessions.lat}°{latDir}, {sampleSessions.lon}°{lonDir}]
		</h3>
	</div>

	<Label class="text-md mt-2 w-1/4">
		<p>Select date (session)</p>
		<Select
			items={listSessions()}
			bind:value={selected}
			class="rounded-lg px-2 py-2 dark:bg-[#f9fafb] dark:text-black dark:outline-[0.5px]"
		/>
	</Label>

	<div class="flex flex-col items-center justify-center">
		{#each sampleSessions.sessions as session (session.sessionId)}
			{#if selected === session.sessionId}
				<h4 class="mb-2 text-xl font-semibold">
					Session {session.sessionId} - {session.date}
				</h4>
				<Chart
					class="w-full rounded-xl border-1"
					options={buildOptions(session.data, session.startTimes, session.descriptions)}
				/>
				<p class="border text-center">Test</p>
			{/if}
		{/each}
	</div>
</div>
