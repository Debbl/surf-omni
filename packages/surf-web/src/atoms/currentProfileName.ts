import { atom } from "jotai";
import { storage, store } from "~/lib/store";

export const currentProfileNameStoreKey = "currentProfileName";
export const currentProfileNameAtom = atom<string>("");

currentProfileNameAtom.onMount = () => {
  store.sub(currentProfileNameAtom, () => {
    const currentProfileName = store.get(currentProfileNameAtom);
    storage.set({ [currentProfileNameStoreKey]: currentProfileName });
  });
};
