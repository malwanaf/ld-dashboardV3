<script lang="ts">
	import { onMount, onDestroy, setContext, createEventDispatcher, tick } from 'svelte';
	import L from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { strikesresult } from '$lib/stores/strikes.ts';
    import ExclamationTriangle from 'svelte-radix/ExclamationTriangle.svelte';
	import * as Alert from '$lib/components/ui/alert';
    import { Badge } from '$lib/components/ui/badge';

	const processedStrikes = new Set();

	const unsubscribe = strikesresult.subscribe((strikesData) => {
		let delay = 0;

		strikesData.forEach((strike, index) => {
			// Check if the strike has already been processed
			if (!processedStrikes.has(strike.id)) {
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
					});

					// Create popup content
					//let popupContent = `Radius: ${strike.distance} km, Intensity: ${strike.intensity}`;

					// Bind popup to circle
					//circle.bindPopup(popupContent);

					// Add circle to the layer group
					circle.addTo(strikeLayerGroup);

					// Fade out animation after 5 seconds
					setTimeout(() => {
						requestAnimationFrame(() => {
							circle.setStyle({ opacity: 0, fillOpacity: 0 });
							circle.animate({ radius: 0 }, { duration: 2000 });
						});
					}, 5000);

					// Mark the strike as processed
					processedStrikes.add(strike.id);
				}, delay);
			}
		});
	});
</script>
