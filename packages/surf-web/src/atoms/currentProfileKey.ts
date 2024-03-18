import { atom } from "jotai";
import { storage, store } from "~/lib/store";

export const currentProfileKeyStoreKey = "currentProfileKey";
export const currentProfileKeyAtom = atom<string>("");

currentProfileKeyAtom.onMount = () => {
  store.sub(currentProfileKeyAtom, () => {
    const currentProfileKey = store.get(currentProfileKeyAtom);
    storage.set({ [currentProfileKeyStoreKey]: currentProfileKey });
  });
};
