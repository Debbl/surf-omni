import { useAtom } from "jotai";
import { nameAsKey } from "surf-pac";
import { profilesAtom } from "../profiles";
import type { BasicProfile, Profile } from "@/types";

export function useProfiles() {
  const [profiles, setProfiles] = useAtom(profilesAtom);

  const addProfile = (basicProfile: BasicProfile) => {
    let profile: Profile | null = null;

    if (basicProfile.profileType === "FixedProfile") {
      profile = {
        ...basicProfile,
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

  return {
    profiles,
    setProfiles,
    addProfile,
  };
}
