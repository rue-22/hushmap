<script lang="ts">
	import { Chart, Label, Select } from 'flowbite-svelte';
	import Progressbar from '$lib/components/Progressbar.svelte';

	const { data } = $props();
	const { sessionsInfo } = data;

	let selected = $state(sessionsInfo.sessions?.[0]?.sessionNumber ?? '');
	function listSessions() {
		const sessionChoices = sessionsInfo.sessions.map(session => ({
			value: session.sessionNumber,
			name: `${session.sessionNumber}: ${session.startDate} - ${session.endDate}`,
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
				custom({
					series,
					seriesIndex,
					dataPointIndex,
				}: {
					series: number[][] | (number | null)[][];
					seriesIndex: number;
					dataPointIndex: number;
				}) {
					const description = descriptions[dataPointIndex];
					const time = startTimes[dataPointIndex];
					let value = $state('');
					if (series[seriesIndex]?.[dataPointIndex] === null) value = 'No Data';
					else value = `${series[seriesIndex]?.[dataPointIndex]} dBA`;

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
				width: 2.5,
				curve: 'smooth',
			},
			grid: {
				show: true,
				strokeDashArray: 3,
			},
			series: [
				{
					name: 'dBA Level',
					data: noiseLevels,
					color: '#ffffff',
				},
			],
			legend: {
				show: false,
			},
			xaxis: {
				categories: startTimes,
				title: {
					text: 'Timeframes',
					style: {
						color: 'white',
					}
				},
				labels: {
					show: true,
					hideOverlappingLabels: true,
					rotate: -10,
					style: {
						fontFamily: 'Inter, sans-serif',
						cssClass: 'text-xs font-light fill-white',
					},
				},
				axisBorder: {
					show: true,
				},
				axisTicks: {
					show: false,
				},
			},
			yaxis: {
				show: true,
				title: {
					text: 'dBA Level',
					style: {
						color: 'white',
					}
				},
				labels: {
					style: {
						fontFamily: 'Inter, sans-serif',
						cssClass: 'text-xs font-light fill-white',
					},
				},
				axisBorder: {
					show: true,
				},
			},
		};
	}

	const latDir = $derived(sessionsInfo.lat > 0 ? 'N' : 'S');
	const lonDir = $derived(sessionsInfo.lon > 0 ? 'E' : 'W');

	let levelDesc = $state('');
	let color = $state('');
	if (sessionsInfo.meanNoise < 60) {
		levelDesc = 'Quiet';
		color = 'quiet-green';
	} else if (sessionsInfo.meanNoise > 60 && sessionsInfo.meanNoise < 69) {
		levelDesc = 'Loud';
		color = 'loud-orange';
	} else {
		levelDesc = 'Very Loud';
		color = 'very-loud-red';
	}
</script>

<div class="bg-background-color flex min-w-full flex-col px-4 pt-2 text-white">
	<div class="prose dark:prose-invert border-b pb-2">
		<h2 class="text-2xl">
			This point is in <span class="italic">{sessionsInfo.brgy}, {sessionsInfo.city}</span>.
		</h2>
		<div>
			<Progressbar {color} level={String((sessionsInfo.meanNoise / 1.40).toFixed(2))} noise={sessionsInfo.meanNoise} desc={levelDesc} />
		</div>
		<p class="">
			Latitude and Longitude: [{sessionsInfo.lat.toFixed(2)}°{latDir}, {sessionsInfo.lon.toFixed(
				2,
			)}°{lonDir}]
		</p>
	</div>

	<Label class="text-md mt-2 w-full md:w-1/4">
		<p class="mb-2">Select date (session)</p>
		<Select
			items={listSessions()}
			bind:value={selected}
			class="rounded-lg px-2 py-2 bg-header-color text-white outline-[0.5px]"
		/>
	</Label>

	<div class="flex flex-col items-center justify-center text-white">
		{#each sessionsInfo.sessions as session (session.sessionNumber)}
			{#if selected === session.sessionNumber}
				<h4 class="mb-2 md:mb-4 text-xl font-semibold">
					{#if session.startDate === session.endDate}
						Session {session.sessionNumber}: {session.startDate}
					{:else}
						Session {session.sessionNumber}: {session.startDate} - {session.endDate}
					{/if}
				</h4>
				<Chart
					class="w-full rounded-xl border-[0.5px] px-4"
					options={buildOptions(session.data, session.startTimes, session.descriptions)}
				/>
			{/if}
		{/each}
	</div>
</div>
