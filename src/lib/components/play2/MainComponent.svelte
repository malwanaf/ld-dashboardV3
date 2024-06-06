<script>
    import { strikesresult } from '$lib/stores/strikes';
    import { toggleIsActive } from './toggleIsActive';
    import Button from '../ui/button/button.svelte';
  
    // Subscribe to the main store
    let items;
  
    $: items = $strikesresult;
  </script>
  
  <ul>
    {#each items as item}
      <li>
        {item.id} 
        <Button on:click={() => toggleIsActive(item.id)}>
            {item.isActive ? 'Activate' : 'Deactivate'}
        </Button>
      </li>
    {/each}
  </ul>
  