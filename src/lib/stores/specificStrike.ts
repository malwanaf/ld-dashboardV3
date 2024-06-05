import { writable } from "svelte/store";

export const specificstrikesresult = writable([]);

export function updateSpecificStrikesResult(data){
    specificstrikesresult.set(data);
}