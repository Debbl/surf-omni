import { atom } from "jotai";
import { isProfile } from "surf-pac";
import { store } from "~/lib/store";
import { isSettingsChangeAtom } from "./isSettingsChange";
import type { Profiles } from "~/types";

export const profilesStoreKey = "profiles";
export const profilesAtom = atom<Profiles>({});

profilesAtom.onMount = (set) => {
  (async () => {
    const local = await browser.storage.local.get(profilesStoreKey);
    const profiles = Object.fromEntries(
      Object.entries(local[profilesStoreKey]).filter(([key]) => isProfile(key)),
    ) as Profiles;
    set(profiles);

    // subscribe to profiles changes
    let isInitial = true;
    store.sub(profilesAtom, () => {
      if (!isInitial) store.set(isSettingsChangeAtom, true);
      else isInitial = false;
    });
  })();
};
