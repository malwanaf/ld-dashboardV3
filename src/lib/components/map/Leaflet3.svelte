<script lang="ts">
	import { onMount, onDestroy, setContext, createEventDispatcher, tick } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { strikesresult } from '$lib/stores/strikes.ts';
	import { specificstrikesresult } from '$lib/stores/specificStrike';

	export let bounds: L.LatLngBoundsExpression | undefined = undefined;
	export let view: L.LatLngExpression | undefined = undefined;
	export let zoom: number | undefined = undefined;

	export { map };

	const dispatch = createEventDispatcher();

	let map: L.Map | undefined;
	let mapElement: HTMLElement;

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
		const specificStrikeLayerGroup = L.layerGroup().addTo(map);

		const processedStrikes = new Set();
		function onStrikeResult(id){
			if ($strikesresult.filter(strike => strike.id === id).length > 0){
				return true;
			}else{
				return false;
			}
		}
		const unsubscribe2 = specificstrikesresult.subscribe((specificStrikeData) => {
			specificStrikeData.forEach((strike) => {
				const radius = calculateRadius(strike.distance);
				const color = getColorByIntensity(strike.intensity);
				
					const circle = L.circle(center, {
					color: color, // Border color based on intensity
					opacity: 0.8, // Border opacity
					fillColor: color, // Fill color based on intensity
					fillOpacity: 0, // Increased fill opacity
					radius: radius,
					weight: 6
				}).addTo(specificStrikeLayerGroup);

				if(onStrikeResult(strike.id)){
					console.log("Strike exist");
				}else{
					// specificStrikeLayerGroup.removeLayer(circle);
					console.log("Strike not exist");
				}
				if(onStrikeResult(strike.id)==false){
					console.log("Strike not exist");
				}
			});		
		});


		const unsubscribe3 = strikesresult.subscribe((StrikesData) => {
			StrikesData.forEach((strike) => {
				if(strike.isActive){
					console.log("Strike Activated");
				const radius = calculateRadius(strike.distance);
				const color = getColorByIntensity(strike.intensity);
				
					const circle = L.circle(center, {
					color: color, // Border color based on intensity
					opacity: 0.8, // Border opacity
					fillColor: color, // Fill color based on intensity
					fillOpacity: 0, // Increased fill opacity
					radius: radius,
					weight: 6
				}).addTo(specificStrikeLayerGroup);
			}
				else{
					
					// specificStrikeLayerGroup.removeLayer(circle);
					console.log("Strike Deactivated");
				}
				
			});		
		});
		
		
		


		const unsubscribe = strikesresult.subscribe((strikesData) => {
			let delay = 0;
			const currentTime = new Date();

			const marginSeconds = 1; // Set margin time in seconds
			const adjustedCurrentTime = new Date(currentTime.getTime() - marginSeconds * 1000);

			strikesData.forEach((strike) => {
				const strikeTime = new Date(strike.time);

				// Only process strikes with a timestamp >= currentTime
				if (strikeTime >= adjustedCurrentTime  && !processedStrikes.has(strike.id)) {
					delay += 0; // Delay for each data point to simulate real-time

					setTimeout(() => {
						const radius = calculateRadius(strike.distance);
						const color = getColorByIntensity(strike.intensity);
						const circle = L.circle(center, {
							color: color, // Border color based on intensity
							opacity: 0.8, // Border opacity
							fillColor: color, // Fill color based on intensity
							fillOpacity: 0, // Increased fill opacity
							radius: radius,
							weight: 6
						}).addTo(strikeLayerGroup);

						// Fade out animation after 5 seconds
						setTimeout(() => {
							const interval = setInterval(() => {
								let currentOpacity = parseFloat(circle.options.opacity);
								let currentRadius = circle.getRadius();

								if (currentOpacity <= 0) {
									strikeLayerGroup.removeLayer(circle);
									clearInterval(interval);
								} else {
									circle.setStyle({
										opacity: currentOpacity - 0.02,
										fillOpacity: circle.options.fillOpacity // Keep fill opacity constant
									});
									circle.setRadius(currentRadius);
								}
							}, 100);
						}, 5000);

						// Mark the strike as processed
						processedStrikes.add(strike.id);
					}, delay);
				}
			});
		});

		// Add radius circles for reference
		let radii = [
			1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000,
			15000, 16000, 17000, 18000, 19000, 20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000,
			28000, 29000
		]; // in meters
		radii.reverse().forEach((radius) => {
			let circle = L.circle(center, {
				color: 'yellow', // Border color
				opacity: 0.5, // Border opacity
				fillColor: 'yellow', // Fill color
				fillOpacity: 0, // Adjust fill opacity to prevent stacking
				radius: radius,
				weight: 1
			}).addTo(map);

			// Create popup content
			let popupContent = `Radius: ${radius / 1000} km`;

			// Bind popup to circle
			circle.bindPopup(popupContent);
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
		return distance * 1000; // Adjust the multiplier as needed
	}

	// Function to get color based on intensity
	function getColorByIntensity(intensity) {
		if (intensity <= 1) {
			return 'aqua';
		} else if (intensity > 1 && intensity <= 10) {
			return 'yellow';
		} else {
			return 'red';
		}
	}
</script>

<div class="z-0 h-full w-full" bind:this={mapElement}>
	{#if map}
		<slot />
	{/if}
</div>

<style>
	@keyframes fadeInOut {
		0% {
			opacity: 0;
			transform: translateY(-20px);
		}
		50% {
			opacity: 1;
			transform: translateY(0);
		}
		100% {
			opacity: 0;
			transform: translateY(-20px);
		}
	}

	.leaflet-popup-content-wrapper {
		animation: fadeInOut 5s ease forwards;
	}
</style>
