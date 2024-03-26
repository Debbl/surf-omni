import { useAtom } from "jotai";
import { nameAsKey } from "surf-pac";
import { profilesAtom } from "../profiles";
import type { BasicProfile, Profile, Profiles } from "surf-pac";

export const builtinProfiles: Profiles = {
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
    let profile: Profile | null = null;

    if (basicProfile.profileType === "FixedProfile") {
      profile = {
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
      };
    }

    if (profile) {
      setProfiles({
        ...profiles,
        [nameAsKey(profile.name)]: profile,
      });
    }
  };

  const updateProfile = (profile: Profile) => {
    setProfiles({
      ...profiles,
      [nameAsKey(profile.name)]: profile,
    });
  };

  return {
    profiles,
    allProfiles,
    setProfiles,
    addProfile,
    updateProfile,
  };
}
