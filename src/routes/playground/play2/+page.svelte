<script>
    import MainComponent from '$lib/components/play2/MainComponent.svelte';
    import ItemComponent from '$lib/components/play2/ItemComponent.svelte';
    import { strikesresult } from '$lib/stores/strikes';
  
    // Subscribe to the main store
    let items;
  
    $: items = $strikesresult;
  </script>
  
  <MainComponent />
  
  <ul>
    {#each items as item}
      <li>
        <ItemComponent itemId={item.id} />
      </li>
    {/each}
  </ul>