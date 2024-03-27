import { useAtom } from "jotai";
import { nameAsKey } from "surf-pac";
import { useMemo } from "react";
import { profilesAtom } from "../profiles";
import type {
  BasicProfile,
  DirectProfile,
  FixedProfile,
  Profile,
  Profiles,
  RuleListProfile,
  SwitchProfile,
  SystemProfile,
} from "surf-pac";

export const builtinProfiles: Record<string, DirectProfile | SystemProfile> = {
  "+direct": {
    name: "direct",
    profileType: "DirectProfile",
  },
  "+system": {
    name: "system",
    profileType: "SystemProfile",
  },
};

export function useProfiles() {
  const [profiles, setProfiles] = useAtom(profilesAtom);

  const allProfiles: Profiles = {
    ...builtinProfiles,
    ...profiles,
  };

  const addProfile = (basicProfile: BasicProfile) => {
    const addProfiles: Profiles = {};

    if (basicProfile.profileType === "FixedProfile") {
      addProfiles[nameAsKey(basicProfile.name)] = {
        ...basicProfile,
        singleProxy: {
          scheme: "http",
          host: "example.com",
          port: 80,
        },
        bypassList: [
          { conditionType: "BypassCondition", pattern: "127.0.0.1" },
          { conditionType: "BypassCondition", pattern: "[::1]" },
          { conditionType: "BypassCondition", pattern: "localhost" },
        ],
      } as FixedProfile;
    }

    if (basicProfile.profileType === "SwitchProfile") {
      addProfiles[nameAsKey(`__ruleListOf_${basicProfile.name}`)] = {
        name: `__ruleListOf_${basicProfile.name}`,
        profileType: "RuleListProfile",
        matchProfileName: "direct",
        defaultProfileName: "direct",
        url: "",
        raw: "",
      } as RuleListProfile;

      addProfiles[nameAsKey(basicProfile.name)] = {
        ...basicProfile,
        profileType: "SwitchProfile",
        defaultProfileName: `__ruleListOf_${basicProfile.name}`,
        rules: [],
      } as SwitchProfile;
    }

    if (addProfiles) {
      setProfiles({
        ...profiles,
        ...addProfiles,
      });
    }
  };

  const updateProfile = (profile: Profile) => {
    setProfiles({
      ...profiles,
      [nameAsKey(profile.name)]: profile,
    });
  };

  const showProfiles = useMemo(() => {
    return Object.fromEntries(
      Object.entries(profiles).filter(([_key, profile]) =>
        ["FixedProfile", "SwitchProfile"].includes(profile.profileType),
      ),
    );
  }, [profiles]) as Record<string, FixedProfile | SwitchProfile>;

  return {
    profiles,
    showProfiles,
    allProfiles,
    builtinProfiles,
    setProfiles,
    addProfile,
    updateProfile,
  };
}
