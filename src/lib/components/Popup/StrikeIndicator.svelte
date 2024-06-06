<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { strikesresult } from '$lib/stores/strikes';
	import { Button } from '$lib/components/ui/button/index.js';

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
	const secondsToAdd = 1; // For example, add 60 seconds

// Create a new Date object representing the current date and time
const currentDate = new Date();

// Add the desired number of seconds to the current date and time
currentDate.setSeconds(currentDate.getSeconds() + secondsToAdd);
</script>

<div class="">
	{#each $strikesresult as strike (strike.id)}
		{#if new Date(strike.time) > currentDate}
		<div in:fade={{ duration: 1000 }} out:fade={{ duration: 1000 }}>
			<Button variant="indicator" class="space-x-3 pl-0 p-0">
				{#if strike.intensity == 1}
					<svg
						width="2rem"
						height="2rem"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M 8.6967 0.0404 C 8.9086 0.131 9.0311 0.3549 8.9932 0.5822 L 8.0902 6 H 12.5 C 12.6893 6 12.8625 6.107 12.9472 6.2764 C 13.0319 6.4458 13.0136 6.6485 12.8999 6.8 L 6.9 14.8 C 6.7617 14.9844 6.5152 15.0503 6.3033 14.9597 C 6.0914 14.869 5.9689 14.6452 6.0068 14.4178 L 6.9097 9 H 2.5 C 2.3106 9 2.1375 8.893 2.0528 8.7236 C 1.9681 8.5542 1.9864 8.3515 2.1 8.2 L 8.1 0.2 C 8.2383 0.0156 8.4847 -0.0503 8.6967 0.0404 Z M 3.5 8 H 7.5 L 8 8 L 9 8 H 9 L 7 8 L 3.5 8 Z"
							fill="aqua"
							fill-rule="evenodd"
							clip-rule="evenodd"
						></path></svg
					>
				{:else if strike.intensity > 1 && strike.intensity <= 10}
					<svg
						width="2rem"
						height="2rem"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M 8.6967 0.0404 C 8.9086 0.131 9.0311 0.3549 8.9932 0.5822 L 8.0902 6 H 12.5 C 12.6893 6 12.8625 6.107 12.9472 6.2764 C 13.0319 6.4458 13.0136 6.6485 12.8999 6.8 L 6.9 14.8 C 6.7617 14.9844 6.5152 15.0503 6.3033 14.9597 C 6.0914 14.869 5.9689 14.6452 6.0068 14.4178 L 6.9097 9 H 2.5 C 2.3106 9 2.1375 8.893 2.0528 8.7236 C 1.9681 8.5542 1.9864 8.3515 2.1 8.2 L 8.1 0.2 C 8.2383 0.0156 8.4847 -0.0503 8.6967 0.0404 Z M 3.5 8 H 7.5 L 8 8 L 9 8 H 9 L 7 8 L 3.5 8 Z"
							fill="yellow"
							fill-rule="evenodd"
							clip-rule="evenodd"
						></path></svg
					>
				{:else}
					<svg
						width="2rem"
						height="2rem"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M 8.6967 0.0404 C 8.9086 0.131 9.0311 0.3549 8.9932 0.5822 L 8.0902 6 H 12.5 C 12.6893 6 12.8625 6.107 12.9472 6.2764 C 13.0319 6.4458 13.0136 6.6485 12.8999 6.8 L 6.9 14.8 C 6.7617 14.9844 6.5152 15.0503 6.3033 14.9597 C 6.0914 14.869 5.9689 14.6452 6.0068 14.4178 L 6.9097 9 H 2.5 C 2.3106 9 2.1375 8.893 2.0528 8.7236 C 1.9681 8.5542 1.9864 8.3515 2.1 8.2 L 8.1 0.2 C 8.2383 0.0156 8.4847 -0.0503 8.6967 0.0404 Z M 3.5 8 H 7.5 L 8 8 L 9 8 H 9 L 7 8 L 3.5 8 Z"
							fill="red"
							fill-rule="evenodd"
							clip-rule="evenodd"
						></path></svg
					>
				{/if}
                <Button variant="default" class="mr-0"><h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">{strike.distance} km</h3></Button>
				
			</Button>
		</div>
		{/if}
	{/each}
</div>
