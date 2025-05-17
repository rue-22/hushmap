<script lang="ts">
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
	import Circle from '$lib/components/Circle.svelte';
	import { is3d } from '$lib/state.svelte';
	// import maplibregl from 'maplibre-gl';
	import Property from '$lib/components/Property.svelte';
	// import sampleData from '$lib/sample_data.json';

	// for server load
	const { data } = $props();

	const OFFSET = 23;
	const popupOffset = {
		top: [0, OFFSET],
		bottom: [0, -OFFSET],
		left: [OFFSET + 12, 0],
		right: [-OFFSET - 12, 0],
		center: [0, 0],
		'top-left': [OFFSET, OFFSET],
		'top-right': [-OFFSET, OFFSET],
		'bottom-left': [OFFSET, -OFFSET],
		'bottom-right': [-OFFSET, -OFFSET],
	};
</script>

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

	<GeoJSONSource data={data.points}>
		{#each data.points.features as feature (feature.id)}
			<Marker lnglat={feature.geometry.coordinates}>
				{#snippet content()}
					{@const dbaRounded = Math.round(Number(feature.properties.meanNoiseLevel))}
					{#if Number(feature.properties.meanNoiseLevel) <= 60}
						<Circle color="quiet-green" dbaLevel={dbaRounded} />
					{:else if Number(feature.properties.meanNoiseLevel) > 60 && Number(feature.properties.meanNoiseLevel) < 69}
						<Circle color="loud-orange" dbaLevel={dbaRounded} />
					{:else}
						<Circle color="very-loud-red" dbaLevel={dbaRounded} />
					{/if}
				{/snippet}
				<Popup offset={popupOffset}>
					<Property attr="Barangay" val={feature.properties.brgy} />
					<Property attr="City" val={feature.properties.city} />
					<Property attr="Number of sessions" val={feature.properties.noOfSessions} />
					<Property attr="Mean dBA level" val={feature.properties.meanNoiseLevel} />
					<span class="italic">Graph</span>:
					<a href="/{feature.id}" target="_blank" class="italic underline"
						>Click here for more info!</a
					>
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
