<script lang="ts">
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import L from 'leaflet';

	export let width: number;
	export let height: number;
	export let latLng: L.LatLngExpression;

	let marker: L.Marker | undefined;
	let markerElement: HTMLElement;

	const { getMap }: { getMap: () => L.Map | undefined } = getContext('map');
	const map = getMap();

	let center = [-7.816177085162616, 110.29458648417666]; // Central point
	setContext('layer', {
		// L.Marker inherits from L.Layer
		getLayer: () => marker
	});

	onMount(() => {
		if (map) {
			let icon = L.divIcon({
				html: markerElement,
				className: 'map-marker',
				iconSize: L.point(width, height)
			});
			marker = L.marker(latLng, { icon }).addTo(map);

			//Define radii in meters
		let radii = [
			1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000,
			15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000,
			28000, 29000
		]; // in meters

		// Draw geodetic range rings
		radii.reverse().forEach((radius) => {
			let circle = L.circle(center, {
				color: 'yellow', // Border color
				opacity: 0, // Border opacity
				fillColor: 'yellow', // Fill color
				fillOpacity: 0, // Adjust fill opacity to prevent stacking
				radius: radius,
				weight: 0
			}).addTo(map);

			// Create popup content
			let popupContent = `Radius: ${radius / 1000} km`;

			// Bind popup to circle
			circle.bindPopup(popupContent);
		});
		}
	});

	onDestroy(() => {
		marker?.remove();
		marker = undefined;
	});
</script>

<div bind:this={markerElement}>
	{#if marker}
		<slot />
	{/if}
</div>