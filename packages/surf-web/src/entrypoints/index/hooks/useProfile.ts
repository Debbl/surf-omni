import { useMemo } from "react";
import { useProfiles } from "@/atoms/hooks/useProfiles";
import type { Profile } from "surf-pac";

export function useProfile(key: string) {
  const { profiles, updateProfile } = useProfiles();

  const profile = useMemo(() => {
    return profiles[key];
  }, [key, profiles]);

  const setProfile = (profile: Profile) => {
    updateProfile(profile);
  };

  return {
    profile,
    setProfile,
  };
}
