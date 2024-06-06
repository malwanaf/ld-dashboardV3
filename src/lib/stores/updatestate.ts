// src/stores/updateActiveState.js
import { strikesresult } from '$lib/stores/strikes';
import { activeItemStore } from '$lib/stores/activestate';

export const setActiveItem = (id) => {
    activeItemStore.set(id); // Update the active item ID store

    strikesresult.update(strike => {
        return items.map(item => ({
            ...item,
            isActive: item.id === id
        }));
    });
};
