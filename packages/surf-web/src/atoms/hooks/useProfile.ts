import { useMemo } from "react";
import { nameAsKey } from "surf-pac";
import type { Profile } from "surf-pac";
import { useProfiles } from "~/atoms/hooks/useProfiles";

export function useProfile<T extends Profile>(name: string) {
  const { allProfiles, updateProfile } = useProfiles();

  const profile = useMemo(() => {
    return allProfiles[nameAsKey(name)];
  }, [name, allProfiles]) as T;

  const setProfile = (profile: T) => {
    updateProfile(profile);
  };

  return {
    profile,
    setProfile,
  };
}
