import { strikesresult } from "$lib/stores/strikes";

export function toggleIsActive(id) {
  strikesresult.update(items => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, isActive: !item.isActive } : item
    );
    console.log('Updated Items:', updatedItems);

    const ids = updatedItems.map(item => item.id);
    console.log('Unique IDs:', new Set(ids).size === ids.length);
    
    return updatedItems;
  });
}
