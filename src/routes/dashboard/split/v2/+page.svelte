<script>
	import { Pane, Splitpanes } from 'svelte-splitpanes';
</script>

<div class="w-screen h-screen bg-white dark:bg-black">
	<Splitpanes horizontal={true} class="h-full w-full bg-white dark:bg-white">
		<Pane size={100}  minSize={20}>1<br /><em class="h-full">I have a min width of 20%</em></Pane>
		<Pane size={40} class="bg-white dark:bg-black"><div class="m-2 w-full h-full bg-white dark:bg-black"></div></Pane>
	</Splitpanes>
</div>

