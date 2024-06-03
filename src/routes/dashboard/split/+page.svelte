<script>
	import { Pane, Splitpanes } from 'svelte-splitpanes';
	import StrikesTable from '$lib/components/ui/StrikesTable.svelte';
	import StrikesMap from '$lib/components/ui/StrikesMap.svelte';
</script>

<div class="w-screen h-screen flex flex-col bg-white dark:bg-black">
	<Splitpanes horizontal class="flex-1 overflow-hidden bg-white dark:bg-black">
		<Pane size={60} minSize={10} class="flex flex-col overflow-hidden bg-white dark:bg-black">
			<div class="flex-1 overflow-auto bg-white dark:bg-black">
				<StrikesMap />
			</div>
		</Pane>
		<Pane size={40} minSize={20} class="flex flex-col overflow-hidden bg-white dark:bg-black">
			<div class="flex-1 overflow-auto bg-white dark:bg-black">
				<StrikesTable />
			</div>
		</Pane>
	</Splitpanes>
</div>
