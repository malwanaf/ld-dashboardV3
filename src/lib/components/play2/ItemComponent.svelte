<script>
    import { getIsActiveStore } from './isActiveStore';
  
    export let itemId;
  
    // Get the isActive store for the specific item
    const isActiveStore = getIsActiveStore(itemId);
  
    // Subscribe to the isActive store
    let isActive;
  
    $: isActive = $isActiveStore;

    
  </script>
  
  <div>
    Item {itemId} is {isActive ? 'Active' : 'Inactive'}
  </div>
  