import { itemsStore } from './itemsStore';
import { activeItemStore } from './activeStore';

export const toggleActiveItem = (id) => {
    activeItemStore.update(activeIds => {
        if (activeIds.includes(id)) {
            return activeIds.filter(activeId => activeId !== id);
        } else {
            return [...activeIds, id];
        }
    });

    itemsStore.update(items => {
        return items.map(item => ({
            ...item,
            isActive: activeItemStore.includes(item.id)
        }));
    });
};
