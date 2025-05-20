<script lang="ts">
	import { Chart, Label, Select } from 'flowbite-svelte';
	import Card from '$lib/components/Card.svelte';
	import Progressbar from '$lib/components/Progressbar.svelte';
	import Spinner from '$lib/components/Spinner.svelte';

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
	
	function fillMeanData(mean: number, length: number) {
		return Array(length).fill(mean)
	}

	function getTimeAndLevel(type: string, noiseLevels: number[], startTimes: string[]) {
		let time, level;
		if (type === "min") {
			level = Math.min(...noiseLevels);
		} else if (type === "max") {
			level = Math.max(...noiseLevels);
		}
		time = startTimes[noiseLevels.indexOf(level!)];
		return [time, level]
	}

	function buildOptions(noiseLevels: number[], meanNoise: number[], colorHex: string, startTimes: string[], descriptions: string[]) {
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
				{
					name: 'mean',
					data: meanNoise,
					color: colorHex,
				}
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
					rotate: -7,
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

	let isLoading = $state(false);
	let result = $state('');
	async function handleClick(sessionId: number) {
		isLoading = true
		
		const resp = await fetch(`https://hushmap-backend.reofficial.dev/session_info/${sessionId}`)
		result = await resp.json()

		isLoading = false
	}

	const latDir = $derived(sessionsInfo.lat > 0 ? 'N' : 'S');
	const lonDir = $derived(sessionsInfo.lon > 0 ? 'E' : 'W');

	let levelDesc = $state('');
	let color = $state('');
	let colorHex = $state('');
	if (sessionsInfo.meanNoise < 60) {
		levelDesc = 'Quiet';
		color = 'quiet-green';
		colorHex = '#32cd32'
	} else if (sessionsInfo.meanNoise > 60 && sessionsInfo.meanNoise < 69) {
		levelDesc = 'Loud';
		color = 'loud-orange';
		colorHex = '#ff5f1f';
	} else {
		levelDesc = 'Very Loud';
		color = 'very-loud-red';
		colorHex = '#dc143c';
	}
</script>

<div class="bg-background-color flex min-w-full flex-col px-4 pt-2 text-white">
	<div class="border-b pb-2">
		<h2 class="text-2xl md:text-3xl font-bold mb-2">
			This point is in <span class="italic">{sessionsInfo.brgy}, {sessionsInfo.city}</span>.
		</h2>
		<div class="mb-2">
			<Progressbar {color} level={String((sessionsInfo.meanNoise / 1.40).toFixed(2))} noise={sessionsInfo.meanNoise} desc={levelDesc} />
		</div>
		<p class="">
			Latitude and Longitude: [{sessionsInfo.lat.toFixed(2)}°{latDir}, {sessionsInfo.lon.toFixed(
				2,
			)}°{lonDir}]
		</p>
	</div>

	<Label class="text-md mt-2 w-full md:w-1/4 mb-2">
		<p class="mb-1 text-white">Select date (session)</p>
		<Select
			items={listSessions()}
			bind:value={selected}
			class="rounded-lg px-2 py-2 bg-header-color text-white outline-[0.5px]"
		/>
	</Label>

	<div class="flex flex-col justify-center text-white gap-2 md:gap-4">
		{#each sessionsInfo.sessions as session (session.sessionNumber)}
			{#if selected === session.sessionNumber}
				<h4 class="text-xl font-semibold text-center">
					{#if session.startDate === session.endDate}
						Session {session.sessionNumber}: {session.startDate}
					{:else}
						Session {session.sessionNumber}: {session.startDate} - {session.endDate}
					{/if}
				</h4>
				<Chart
					class="w-full border-2 px-4 border-gray-700"
					options={buildOptions(session.data, fillMeanData(session.meanNoiseSession, session.data.length), colorHex, session.startTimes, session.descriptions)}
				/>
				<div class="grid grid-cols-1 md:grid-cols-4 gap-2">
					<Card title={"Mean dBA level"} value={`${session.meanNoiseSession} dBA`} icon="dba" />
					<Card title={"Time"} value={`${session.startTimes[0]} - ${session.startTimes[session.startTimes.length - 1]}`} icon="time" />
					<Card title={"Quietest Time"} value={getTimeAndLevel("min", session.data, session.startTimes)[0]} adtl={String(getTimeAndLevel("min", session.data, session.startTimes)[1])} icon="quiet" />
					<Card title={"Loudest Time"} value={getTimeAndLevel("max", session.data, session.startTimes)[0]} adtl={String(getTimeAndLevel("max", session.data, session.startTimes)[1])} icon="loud" />
				</div>
				<div class="flex items-center justify-center flex-col">
					{#if result}
						<p class="border-3 px-2 border-gray-700 py-2">{result}</p>
					{:else}
						{#if isLoading}
							<Spinner />
							<p class="mt-2">Summarizing insights...</p>
						{:else}
							<button type="button" class="border-2 rounded-full border-header-color py-3 px-8 cursor-pointer hover:bg-gray-700" onclick={() => handleClick(session.session_id)}>Summarize insights with AI</button>
						{/if}
					{/if}
				</div>
			{/if}
		{/each}
	</div>
</div>