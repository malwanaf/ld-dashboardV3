<script lang="ts">
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
	export const ssr = false;

	import DigitalClock from '$lib/components/DigitalClock.svelte';

	let websocketIndicatorColor = 'red';

	import { strikesresult } from '$lib/stores/strikes.ts';
	import { dbstatus } from '$lib/stores/dbstatus.ts';

	const initialView: LatLngExpression = [-7.816177085162616, 110.29458648417666];
	const markerLocations: Array<LatLngExpression> = [[-7.816177085162616, 110.29458648417666]];

	$: console.log($dbstatus);
	if ($dbstatus == 'connected') {
		websocketIndicatorColor = 'green';
	} else {
		websocketIndicatorColor = 'red';
	}

	$: latestStrike = $strikesresult.length ? $strikesresult[$strikesresult.length - 1] : null;
</script>

<div class="relative w-full h-full overflow-hidden">
	<div class="absolute top-0 left-0 z-20 m-2 space-y-2">
		<Badge variant="secondary">
			<DigitalClock />
		</Badge>

		<StrikeIndicator />
	</div>

	<div class="absolute top-0 right-0 z-20 m-2">
		<a href="/data-table">
			<Button variant="secondary">
				Go to data-viewer
				<ChevronRight />
			</Button>
		</a>
	</div>

	<div class="absolute bottom-0 left-0 z-30 m-2">
		<LightningPopup />
	</div>

	<div class="h-full w-full">
		<Leaflet view={initialView} zoom={12} class="h-full w-full">
			{#each markerLocations as latLng}
				<Marker {latLng} width={40} height={40}>
					<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 50 50">
						<path d="M20,10 L20,30 M10,20 L30,20" stroke="red" stroke-width="2" style="fill:#e9204f;fill-rule:nonzero" transform="matrix(1.25,0,0,1.25,0,0)" />
					</svg>
					<Popup>Sensor Location</Popup>
				</Marker>
			{/each}
		</Leaflet>
	</div>
</div>
