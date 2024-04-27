import { getDefaultStore } from "jotai";
import { getProxyValue } from "surf-pac";
import type { Profiles } from "surf-pac";
import { browserProxySettings, browserStorageLocal } from "./browser";
import { isSettingsChangeAtom } from "~/atoms/isSettingsChange";
import { profilesAtom, profilesStoreKey } from "~/atoms/profiles";
import {
  currentProfileNameAtom,
  currentProfileNameStoreKey,
} from "~/atoms/currentProfileName";

export const store = getDefaultStore();

let isInit = true;
export async function loadFromLocal() {
  const localProfiles = await browserStorageLocal.get(profilesStoreKey);
  const profiles = (localProfiles[profilesStoreKey] ?? {}) as Profiles;

  const localCurrentProfileKey = await browserStorageLocal.get(
    currentProfileNameStoreKey,
  );
  const currentProfileName =
    localCurrentProfileKey[currentProfileNameStoreKey] ?? "";

  store.set(profilesAtom, profiles);
  store.set(currentProfileNameAtom, currentProfileName);

  store.sub(profilesAtom, () => {
    if (!isInit) store.set(isSettingsChangeAtom, true);
    isInit = false;
  });
}

export async function saveToLocal() {
  const profiles = store.get(profilesAtom);

  await browserStorageLocal.set({ [profilesStoreKey]: profiles });

  store.set(isSettingsChangeAtom, false);

  // update current profile name
  const currentProfileName = store.get(currentProfileNameAtom);
  browserProxySettings.set({
    value: getProxyValue(currentProfileName, store.get(profilesAtom)),
  });
}

export async function resetFromLocal() {
  const localProfiles = await browserStorageLocal.get(profilesStoreKey);
  const profiles = (localProfiles[profilesStoreKey] ?? {}) as Profiles;

  store.set(profilesAtom, profiles);
  store.set(isSettingsChangeAtom, false);
}

export const storageCurrentProfileName = {
  get: async (): Promise<string> => {
    const localCurrentProfileKey = await browserStorageLocal.get(
      currentProfileNameStoreKey,
    );
    return localCurrentProfileKey[currentProfileNameStoreKey] ?? "";
  },
  set: async (currentProfileName: string) => {
    await browserStorageLocal.set({
      [currentProfileNameStoreKey]: currentProfileName,
    });
  },
};
