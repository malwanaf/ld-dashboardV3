<script lang="ts">
	import { onMount, onDestroy, setContext, createEventDispatcher, tick } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { writable } from 'svelte/store';

	// Get data
	import { strikesresult } from '$lib/stores/strikes.ts';

	export let bounds: L.LatLngBoundsExpression | undefined = undefined;
	export let view: L.LatLngExpression | undefined = undefined;
	export let zoom: number | undefined = undefined;

	export { map };

	const dispatch = createEventDispatcher();

	let map: L.Map | undefined;
	let mapElement: HTMLElement;

	// watch $strikesresult for conditional rendering
	$: strikesdata = $strikesresult;

	onMount(() => {
		if (!bounds && (!view || !zoom)) {
			throw new Error('Must set either bounds, or view and zoom.');
		}

		map = L.map(mapElement, { zoomControl: false })
			.on('zoom', (e) => dispatch('zoom', e))
			.on('popupopen', async (e) => {
				await tick();
				e.popup.update();
			});

		L.tileLayer(
			'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
		).addTo(map);

		let Stadia_StamenTerrainLabels = L.tileLayer(
			'https://tiles.stadiamaps.com/tiles/stamen_terrain_labels/{z}/{x}/{y}{r}.{ext}',
			{
				minZoom: 0,
				maxZoom: 20,
				ext: 'png'
			}
		).addTo(map);

		let center = [51.5, -0.09]; // Default center if not provided

		// Use provided view or bounds if available
		if (view && zoom) {
			map.setView(view, zoom);
			center = view; // Set center to view
		} else if (bounds) {
			map.fitBounds(bounds);
			center = bounds.getCenter(); // Set center to bounds center
		}

		const strikeLayerGroup = L.layerGroup().addTo(map);
		

		const unsubscribe = strikesresult.subscribe((strikesData) => {
			strikesData.forEach((strike) => {
				const radius = calculateRadius(strike.distance);
				const circle = L.circle(center, {
					color: 'yellow', // Border color
					opacity: 1, // Border opacity
					fillColor: 'yellow', // Fill color
					fillOpacity: 0.1, // Initial fill opacity
					radius: radius
				});

				// Create popup content
				let popupContent = `Radius: ${strike.distance} km`;

				// Bind popup to circle
				circle.bindPopup(popupContent);

				// Add circle to the layer group
				circle.addTo(strikeLayerGroup);
			});

			
		});
	});

	onDestroy(() => {
		map?.remove();
		map = undefined;
	});

	setContext('map', {
		getMap: () => map
	});

	// Function to calculate radius
	function calculateRadius(distance) {
		// Logic to calculate radius based on distance
		return distance * 1000; // Adjust the multiplier as needed
	}
</script>

<div class="z-0 h-full w-full" bind:this={mapElement}>
	{#if map}
		<slot />
	{/if}
</div>
