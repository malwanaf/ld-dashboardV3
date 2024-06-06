import { writable } from 'svelte/store';

export const itemsStore = writable([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
]);
