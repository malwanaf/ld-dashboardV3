// import { writable } from 'svelte/store';
// import { strikesresult } from '$lib/stores/strikes';

// // Create a writable store to hold the isActive state
// export const isActiveStore = writable(false);

// // Derive the isActive state from the main store
// strikesresult.subscribe(items => {
//   const isActive = items.some(item => item.isActive);
//   isActiveStore.set(isActive);
// });

import { derived } from 'svelte/store';
import { strikesresult } from '$lib/stores/strikes';

// Function to get the isActive store for a specific item
export function getIsActiveStore(id) {
  return derived(strikesresult, $strikesresult => {
    const item = $strikesresult.find(item => item.id === id);
    return item ? item.isActive : false;
  });
}

