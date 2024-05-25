import { useMemo } from "react";
import { nameAsKey } from "surf-pac";
import type { Profile } from "surf-pac";
import { useProfiles } from "~/atoms/hooks/useProfiles";

export function useSwitchProfile<T extends Profile>(name: string) {
  const { allProfiles, updateProfile, showProfiles } = useProfiles();

  const switchProfile = useMemo(() => {
    return allProfiles[nameAsKey(name)];
  }, [name, allProfiles]) as T;

  const setSwitchProfile = (profile: T) => {
    updateProfile(profile);
  };

  const matchProfileNames = useMemo(() => {
    return [
      ...Object.values(showProfiles)
        .map((profile) => ({
          label: profile.name,
          value: profile.name,
        }))
        .filter(({ value }) => value !== switchProfile.name),
      {
        label: "直接连接",
        value: "direct",
      },
    ];
  }, [showProfiles, switchProfile.name]);

  return {
    switchProfile,
    setSwitchProfile,
    matchProfileNames,
  };
}
