import { atom } from "jotai";
import { browserActionSetTitle, browserStorageLocal, store } from "~/lib";

export const currentProfileNameStoreKey = "currentProfileName";
export const currentProfileNameAtom = atom<string>("system");

currentProfileNameAtom.onMount = () => {
  store.sub(currentProfileNameAtom, () => {
    const currentProfileName = store.get(currentProfileNameAtom);
    browserActionSetTitle({ title: currentProfileName });

    browserStorageLocal.set({
      [currentProfileNameStoreKey]: currentProfileName,
    });
  });
};
