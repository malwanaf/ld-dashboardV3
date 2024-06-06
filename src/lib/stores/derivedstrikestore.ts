// src/derivedstrikestore.js
import { derived, writable } from 'svelte/store';
import { strikesresult } from './strikes';

// Writable store to hold isActive states
const activeStateStore = writable({});

// Derived store to combine strikes data with isActive field
export const derivedstrikesresult = derived(
  [strikesresult, activeStateStore],
  ([$strikesresult, $activeStateStore]) => {
    return $strikesresult.map(strike => ({
      ...strike,
      isActive: $activeStateStore[strike.id] || false
    }));
  }
);

// Function to toggle isActive field for a specific strike
export function toggleActive(id) {
  activeStateStore.update(activeStates => {
    activeStates[id] = !activeStates[id];
    return activeStates;
  });
}
