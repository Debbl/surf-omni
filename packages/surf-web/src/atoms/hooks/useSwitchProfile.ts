import { useMemo } from "react";
import { nameAsKey } from "surf-pac";
import { useProfiles } from "~/atoms/hooks/useProfiles";
import type { SwitchProfile } from "surf-pac";

export function useSwitchProfile<T extends SwitchProfile>(name: string) {
  const profiles = useProfiles();
  const { allProfiles, updateProfile, showProfiles } = profiles;

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
    ...profiles,
    switchProfile,
    setSwitchProfile,
    matchProfileNames,
  };
}
