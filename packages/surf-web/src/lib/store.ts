import { getDefaultStore } from "jotai";
import { isSettingsChangeAtom } from "~/atoms/isSettingsChange";
import { profilesAtom, profilesStoreKey } from "~/atoms/profiles";
import {
  currentProfileKeyAtom,
  currentProfileKeyStoreKey,
} from "~/atoms/currentProfileKey";
import type { Profiles } from "surf-pac";

export const store = getDefaultStore();

export const storage = {
  get: browser.storage.local.get,
  set: browser.storage.local.set,
};

let isInit = true;
export async function loadFromLocal() {
  const localProfiles = await storage.get(profilesStoreKey);
  const profiles = (localProfiles[profilesStoreKey] ?? {}) as Profiles;

  const localCurrentProfileKey = await storage.get(currentProfileKeyStoreKey);
  const currentProfileKey =
    localCurrentProfileKey[currentProfileKeyStoreKey] ?? "";

  store.set(profilesAtom, profiles);
  store.set(currentProfileKeyAtom, currentProfileKey);

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
  const localProfiles = await storage.get(profilesStoreKey);
  const profiles = (localProfiles[profilesStoreKey] ?? {}) as Profiles;

  store.set(profilesAtom, profiles);
  store.set(isSettingsChangeAtom, false);
}
