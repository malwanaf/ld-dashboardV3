<script lang="ts">
	// Import statements
	import type { LatLngExpression } from 'leaflet';
	import Leaflet from '$lib/components/map/Leaflet3.svelte';
	import Marker from '$lib/components/map/Marker.svelte';
	import Popup from '$lib/components/map/Popup.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import ExclamationTriangle from 'svelte-radix/ExclamationTriangle.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import ChevronRight from 'svelte-radix/ChevronRight.svelte';
	import { Label } from '$lib/components/ui/label/';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import LightningPopup from '$lib/components/Popup/LightningPopup.svelte';
	import LightningBolt from 'svelte-radix/LightningBolt.svelte';
	import Accessibility from 'svelte-radix/Accessibility.svelte';
	import { fade } from 'svelte/transition';
	import StrikeIndicator from '$lib/components/Popup/StrikeIndicator.svelte';
	

	import DigitalClock from '$lib/components/DigitalClock.svelte';
	

	// var
	let websocketIndicatorColor = 'red';

	// Import Stores
	import { strikesresult } from '$lib/stores/strikes.ts';
	import { dbstatus } from '$lib/stores/dbstatus.ts';

	// Initial data and variables for Leaflet map
	const initialView: LatLngExpression = [-7.816177085162616, 110.29458648417666];
	const markerLocations: Array<LatLngExpression> = [[-7.816177085162616, 110.29458648417666]];

	// watch $dbstatus for connection status
	$: console.log($dbstatus);
	if ($dbstatus == 'connected') {
		websocketIndicatorColor = 'green';
	} else {
		websocketIndicatorColor = 'red';
	}

	// watch $strikesresult for latest strike
	$: latestStrike = $strikesresult.length ? $strikesresult[$strikesresult.length - 1] : null;

	
</script>

<!-- HTML Structure -->
<div class="absolute left-0 top-0 z-20 ml-2 mt-1 w-max">
	<Badge variant="secondary">
		<DigitalClock />
	</Badge>

	<StrikeIndicator />
</div>

<div class="absolute right-0 top-0 z-20 m-2 w-max">
	<a href="/data-table">
		<Button variant="secondary" class="">
			Go to data-viewer
			<ChevronRight class="h-4 w-4" />
		</Button>
	</a>
</div>

<div class="absolute bottom-0 left-0 z-30 w-max">
	<LightningPopup />
	<!-- <div class="alert-area">
		{#each $strikesresult.slice().slice(-1) as strike}
			<Alert.Root variant="default" class="m-2 border-opacity-10 bg-opacity-70">
				<ExclamationTriangle class="h-4 w-4" />
				<Alert.Title>Latest Strike</Alert.Title>
				<Alert.Description>
					{strike.time} - {strike.distance} km - <Badge>{strike.intensity}</Badge>
				</Alert.Description>
			</Alert.Root>
		{/each}
	</div> -->
</div>

<div class="z-0 h-screen w-full">
	<!-- Leaflet Map -->
	<Leaflet view={initialView} zoom={12}>
		{#each markerLocations as latLng}
			<Marker {latLng} width={40} height={40}>
				<!-- Icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					xml:space="preserve"
					style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"
					viewBox="0 0 50 50"
				>
					<path
						d="M20,10 L20,30 M10,20 L30,20"
						stroke="red"
						stroke-width="2"
						style="fill:#e9204f;fill-rule:nonzero"
						transform="matrix(1.25,0,0,1.25,0,0)"
					/>
				</svg>
				<Popup>Sensor Location</Popup>
			</Marker>
		{/each}
	</Leaflet>
</div>
