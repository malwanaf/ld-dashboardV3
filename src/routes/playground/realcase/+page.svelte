<!-- src/App.svelte -->
<script>
    import { strikesresult } from '$lib/stores/strikes';
    import { activeItemStore } from '$lib/stores/playgrroundStores/activeStore';
    import { toggleActiveItem  } from '$lib/stores/playgrroundStores/updateActiveState';

    let items = [];
    let activeItemIds = [];

    // Subscribe to stores
    $: strikesresult.subscribe(value => items = value);
    $: activeItemStore.subscribe(value => activeItemIds = value);

    $: console.log($strikesresult);
    $: console.log($activeItemStore);
    const handleItemClick = (id) => {
        toggleActiveItem(id);
    };
</script>

<style>
    .active {
        font-weight: bold;
        color: red;
    }

    li button {
        background: none;
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
    }

    li button:focus {
        outline: 2px solid blue;
    }
</style>

<main>
    <ul>
        {#each items as item}
            <li>
                <button
                    type="button"
                    class:active={activeItemIds.includes(item.id)}
                    on:click={() => handleItemClick(item.id)}
                >
                    {item.id}
                </button>
            </li>
        {/each}
    </ul>

    <p>Active Item IDs: {activeItemIds.join(', ')}</p>

    <ul>
        {#each $strikesresult as strike}
            <li>{strike.id}}</li>
            
        {/each}
    </ul>
</main>
