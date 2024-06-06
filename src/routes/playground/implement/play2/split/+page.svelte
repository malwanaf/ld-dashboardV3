<script>
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import StrikesTable from '$lib/components/play2/implement/StrikesTable.svelte';
	import StrikesMap from '$lib/components/play2/implement/StrikesMap.svelte';
	import { panestatus } from '$lib/stores/togglepane';
	import { slide } from 'svelte/transition';

	let panesize = 0;
	
</script>

<div class="w-screen h-screen flex flex-col bg-white dark:bg-black">
	<Splitpanes horizontal class="flex-1 overflow-hidden bg-white dark:bg-black">
		
		{#if $panestatus == true}
		<Pane size={80} minSize={10} class="flex flex-col overflow-hidden bg-white dark:bg-black">
			<div class="flex-1 overflow-auto bg-white dark:bg-black">
				<StrikesMap />
			</div>
		</Pane>
		<Pane size={20} minSize={20} class="flex flex-col overflow-hidden bg-white dark:bg-black">
			<div class="flex-1 overflow-auto bg-white dark:bg-black">
				<StrikesTable />
			</div>
		</Pane>
		{:else}
		<Pane size={80} minSize={10} class="flex flex-col overflow-hidden bg-white dark:bg-black">
			<div class="flex-1 overflow-auto bg-white dark:bg-black">
				<StrikesMap />
			</div>
		</Pane>
		<Pane size={0} minSize={0} class="flex flex-col overflow-hidden bg-white dark:bg-black">
			<div class="flex-1 overflow-auto bg-white dark:bg-black">
				<StrikesTable />
			</div>
		</Pane>
		{/if}
	</Splitpanes>
</div>
