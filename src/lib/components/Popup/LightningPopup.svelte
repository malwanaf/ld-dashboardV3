<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { strikesresult } from '$lib/stores/strikes';
	import ExclamationTriangle from 'svelte-radix/ExclamationTriangle.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Badge } from '$lib/components/ui/badge';

	const visibleStrikes = writable([]);

	let unsubscribe: () => void;

	// Subscribe to the strikesresult store
	onMount(() => {
		unsubscribe = strikesresult.subscribe((value) => {
			const latestStrike = value.slice(-1)[0];
			if (latestStrike) {
				addStrike(latestStrike);
			}
		});
	});

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});

	// Function to add a new strike and remove it after 10 seconds
	function addStrike(strike) {
		visibleStrikes.update((strikes) => {
			const newStrikes = [...strikes, strike];
			setTimeout(() => {
				visibleStrikes.update((currentStrikes) => {
					return currentStrikes.filter((s) => s !== strike);
				});
			}, 10000);
			return newStrikes;
		});
	}
</script>

<div class="alert-area">
	{#each $visibleStrikes as strike (strike.time)}
		<div in:fade={{ duration: 1000 }} out:fade={{ duration: 1000 }}>
			<Alert.Root variant="default" class="m-2 border-opacity-10 bg-opacity-70">
				<ExclamationTriangle class="h-4 w-4" />
				<Alert.Title>Latest Strike</Alert.Title>
				<Alert.Description>
					{strike.time} - {strike.distance} km - 
          {#if strike.intensity == 1}
            <Badge variant="blue">{strike.intensity}</Badge>
          {:else if strike.intensity > 1 && strike.intensity <= 10}
            <Badge variant="warning">{strike.intensity}</Badge>
          {:else}
            <Badge variant="destructive">{strike.intensity}</Badge>
          {/if}
				</Alert.Description>
			</Alert.Root>
		</div>
	{/each}
</div>
