<script>
	import {
		FillExtrusionLayer,
		FullScreenControl,
		GeoJSONSource,
		GlobeControl,
		MapLibre,
		Marker,
		NavigationControl,
		Popup,
		ScaleControl,
	} from 'svelte-maplibre-gl';
	import { is3d } from '$lib/3d.svelte';
	// import maplibregl from 'maplibre-gl';
	import sampleData from '$lib/sample_data.json';

	// const { data } = $props();

	// Popup state management using Svelte's state
	const OFFSET = 16;
	const popupOffset = {
		top: [0, OFFSET],
		bottom: [0, -OFFSET],
		left: [OFFSET + 12, 0],
		right: [-OFFSET - 12, 0],
		center: [0, 0],
	};
</script>

<!-- <ul>
	{#each data.instruments as instrument}
		<li>{instrument.name}</li>
	{/each}
</ul> -->

<!-- darkMap: style="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json" -->
<!-- openStreetMap: style="https://roblabs.com/xyz-raster-sources/styles/openstreetmap.json" -->

<MapLibre
	class="h-full"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={15.3}
	center={{ lng: 121.068, lat: 14.6539 }}
>
	<NavigationControl />
	<GlobeControl />
	<ScaleControl />
	<FullScreenControl position="top-left" />

	<GeoJSONSource data={sampleData}>
		{#each sampleData.features as feature (feature.id)}
			<Marker lnglat={feature.geometry.coordinates}>
				{#snippet content()}
					<span class="text-3xl">🐸</span>
				{/snippet}
				<Popup class="text-lg" offset={popupOffset}>
					<p>Date: {feature.properties.date}</p>
					<p>Time: {feature.properties.startTime} to {feature.properties.endTime}</p>
					<p>Barangay: {feature.properties.brgy}</p>
					<p>Noise Level: {feature.properties.noiseLevel} dB</p>
					<p>Analysis: Normal ???</p>
				</Popup>
			</Marker>
		{/each}
	</GeoJSONSource>

	{#if is3d.state}
		<FillExtrusionLayer
			source="carto"
			sourceLayer="building"
			minzoom={14}
			filter={['!=', ['get', 'hide_3d'], true]}
			paint={{
				'fill-extrusion-color': [
					'interpolate',
					['linear'],
					['get', 'render_height'],
					0,
					'#aaccbb',
					200,
					'royalblue',
					400,
					'purple',
				],
				'fill-extrusion-height': [
					'interpolate',
					['linear'],
					['zoom'],
					14,
					0,
					15,
					['get', 'render_height'],
				],
				'fill-extrusion-base': [
					'case',
					['>=', ['get', 'zoom'], 14],
					['get', 'render_min_height'],
					0,
				],
			}}
		/>
	{/if}
</MapLibre>
