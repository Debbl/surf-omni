import { atom } from "jotai";
import { setActionTitle } from "@/lib/utils";
import { storage, store } from "~/lib/store";

export const currentProfileNameStoreKey = "currentProfileName";
export const currentProfileNameAtom = atom<string>("");

currentProfileNameAtom.onMount = () => {
  store.sub(currentProfileNameAtom, () => {
    const currentProfileName = store.get(currentProfileNameAtom);
    setActionTitle({ title: currentProfileName });

    storage.set({ [currentProfileNameStoreKey]: currentProfileName });
  });
};
