<script lang="ts">
	import { Chart, Label, Select } from 'flowbite-svelte';

	const { data } = $props();
	const { sessionsInfo } = data;

	let selected = $state(sessionsInfo.sessions?.[0]?.sessionNumber ?? '');
	function listSessions() {
		const sessionChoices = sessionsInfo.sessions.map(session => ({
			value: session.sessionNumber,
			name: session.startDate,
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
					color: '#202937',
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
					show: true,
					hideOverlappingLabels: true,
					rotate: -10,
					style: {
						fontFamily: 'Inter, sans-serif',
						cssClass: 'text-xs font-normal fill-gray-400 dark:fill-gray-444400',
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
				},
			},
		};
	}

	const latDir = $derived(sessionsInfo.lat > 0 ? 'N' : 'S');
	const lonDir = $derived(sessionsInfo.lon > 0 ? 'E' : 'W');

	let levelDesc = $state('');
	let color = $state('');
	if (sessionsInfo.meanNoiseLevel < 60) {
		levelDesc = 'Quiet';
		color = 'quiet-green';
	} else if (sessionsInfo.meanNoiseLevel > 60 && sessionsInfo.meanNoiseLevel < 69) {
		levelDesc = 'Loud';
		color = 'loud-orange';
	} else {
		levelDesc = 'Very Loud';
		color = 'very-loud-red';
	}
</script>

<div class="bg-background-color flex min-w-full flex-col px-4 pt-2">
	<div class="prose border-b pb-2">
		<h2 class="text-2xl">
			This point is in <span class="italic">{sessionsInfo.brgy}, {sessionsInfo.city}</span>.
		</h2>
		<h3>
			This place is <span class="text-{color} italic">{levelDesc}</span>, with mean dBA level
			of <span class="italic text-{color}">{sessionsInfo.meanNoiseLevel}</span>.
		</h3>
		<p class="">
			Latitude and Longitude: [{sessionsInfo.lat}°{latDir}, {sessionsInfo.lon}°{lonDir}]
		</p>
	</div>

	<Label class="text-md mt-2 w-1/4">
		<p>Select date (session)</p>
		<Select
			items={listSessions()}
			bind:value={selected}
			class="rounded-lg px-2 py-2 text-black dark:bg-[#f9fafb] dark:text-black dark:outline-[0.5px]"
		/>
	</Label>

	<div class="flex flex-col items-center justify-center">
		{#each sessionsInfo.sessions as session (session.sessionNumber)}
			{#if selected === session.sessionNumber}
				<h4 class="mb-2 text-xl font-semibold">
					{#if session.startDate === session.endDate}
						Session {session.sessionNumber}: {session.startDate}
					{:else}
						Session {session.sessionNumber}: {session.startDate} - {session.endDate}
					{/if}
				</h4>
				<Chart
					class="w-full rounded-xl border-1 px-4"
					options={buildOptions(session.data, session.startTimes, session.descriptions)}
				/>
			{/if}
		{/each}
	</div>
</div>
