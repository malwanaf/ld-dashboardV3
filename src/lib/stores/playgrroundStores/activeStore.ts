import { writable } from 'svelte/store';

export const activeItemStore = writable([]); // Store to keep track of active item IDs
