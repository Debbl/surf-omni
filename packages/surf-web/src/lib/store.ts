import { getDefaultStore } from "jotai";
import { getProxyValue, nameAsKey } from "surf-pac";
import type { Profile, Profiles } from "surf-pac";
import {
  browserProxySettings,
  browserStorageLocal,
  updateBrowserAction,
} from "./browser";
import { isSettingsChangeAtom } from "~/atoms/isSettingsChange";
import { profilesAtom, profilesStoreKey } from "~/atoms/profiles";
import {
  currentProfileNameAtom,
  currentProfileNameStoreKey,
} from "~/atoms/currentProfileName";

export const store = getDefaultStore();

export const storageProfiles = {
  get: async (): Promise<Profiles> => {
    const localProfiles = await browserStorageLocal.get(profilesStoreKey);
    return localProfiles[profilesStoreKey] ?? {};
  },
  set: async (profiles: Profiles) => {
    await browserStorageLocal.set({ [profilesStoreKey]: profiles });
  },
};

let isInit = true;
export async function loadFromLocal() {
  const profiles = await storageProfiles.get();

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

  // update current proxy by updated profiles
  const currentProfileName = store.get(currentProfileNameAtom);
  if (currentProfileName) {
    const profile = profiles[nameAsKey(currentProfileName)];
    browserProxySettings.set({
      value: getProxyValue(profile.name, profiles),
    });
    updateBrowserAction(profile);
  }
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

export const storageCurrentProfile = {
  get: async (): Promise<Profile> => {
    const currentProfileName = await storageCurrentProfileName.get();
    const profiles = await storageProfiles.get();

    return profiles[nameAsKey(currentProfileName)] ?? {};
  },
  set: async (profile: Profile) => {
    const profiles = await storageProfiles.get();
    const newProfiles = {
      ...profiles,
      [nameAsKey(profile.name)]: profile,
    };
    await browserStorageLocal.set({ [profilesStoreKey]: newProfiles });
  },
};
