import { strikesresult } from '$lib/stores/strikes';
import { activeItemStore } from './activeStore';

export const toggleActiveItem = (id) => {
    activeItemStore.update(activeIds => {
        if (activeIds.includes(id)) {
            return activeIds.filter(activeId => activeId !== id);
        } else {
            return [...activeIds, id];
        }
    });

    strikesresult.update(strike => {
        return items.map(strike => ({
            ...strike,
            isActive: activeItemStore.includes(strike.id)
        }));
    });
};
