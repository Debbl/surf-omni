import { atom } from "jotai";
import { browserActionSetTitle, storageCurrentProfileName, store } from "~/lib";

export const currentProfileNameStoreKey = "currentProfileName";
export const currentProfileNameAtom = atom<string>("system");

currentProfileNameAtom.onMount = () => {
  store.sub(currentProfileNameAtom, async () => {
    const currentProfileName = store.get(currentProfileNameAtom);
    browserActionSetTitle({ title: currentProfileName });

    await storageCurrentProfileName.set(currentProfileName);
  });
};
