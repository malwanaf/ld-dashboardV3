// src/stores/activeStore.js
import { writable } from 'svelte/store';

export const activeItemStore = writable(null); // Store to keep track of the active item
