import { profilesStoreKey } from "../profiles";
import { useProfiles } from "./useProfiles";

export function useStore() {
  const { profiles } = useProfiles();

  const saveProfiles = () => {
    browser.storage.local.set({ [profilesStoreKey]: profiles });
  };

  const save = () => {
    saveProfiles();
  };

  return {
    save,
  };
}
