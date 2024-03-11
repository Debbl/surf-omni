import { getDefaultStore } from "jotai";
import { isSettingsChangeAtom } from "@/atoms/isSettingsChange";
import { profilesAtom, profilesStoreKey } from "~/atoms/profiles";
import type { Profiles } from "~/types";

export const store = getDefaultStore();

export const storage = {
  get: browser.storage.local.get,
  set: browser.storage.local.set,
};

let isInit = true;
export async function loadFromLocal() {
  const local = await storage.get(profilesStoreKey);
  const profiles = (local[profilesStoreKey] ?? {}) as Profiles;

  store.set(profilesAtom, profiles);

  store.sub(profilesAtom, () => {
    if (!isInit) store.set(isSettingsChangeAtom, true);
    isInit = false;
  });
}

export async function saveToLocal() {
  const profiles = store.get(profilesAtom);

  await storage.set({ [profilesStoreKey]: profiles });
  store.set(isSettingsChangeAtom, false);
}

export async function resetFromLocal() {
  const local = await storage.get(profilesStoreKey);
  const profiles = (local[profilesStoreKey] ?? {}) as Profiles;

  store.set(profilesAtom, profiles);
  store.set(isSettingsChangeAtom, false);
}
