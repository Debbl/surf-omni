import { useAtom } from "jotai";
import { nameAsKey } from "surf-pac";
import { useMemo } from "react";
import type {
  BasicProfile,
  FixedProfile,
  Profile,
  Profiles,
  RuleListProfile,
  SwitchProfile,
} from "surf-pac";
import { profilesAtom } from "../profiles";
import {
  builtinProfiles,
  defaultFixedProfile,
  defaultRuleListProfile,
  defaultSwitchProfile,
} from "~/constants";

export type BasicProfileWithoutColor = Omit<BasicProfile, "color">;

export function useProfiles() {
  const [profiles, setProfiles] = useAtom(profilesAtom);

  const allProfiles: Profiles = {
    ...builtinProfiles,
    ...profiles,
  };

  const addProfile = (basicProfileWithoutColor: BasicProfileWithoutColor) => {
    const addProfiles: Profiles = {};

    const basicProfile = {
      ...basicProfileWithoutColor,
      color: "#60a5fa",
    } as BasicProfile;

    if (basicProfile.profileType === "FixedProfile") {
      addProfiles[nameAsKey(basicProfile.name)] = {
        ...defaultFixedProfile,
        ...basicProfile,
      } as FixedProfile;
    }

    if (basicProfile.profileType === "SwitchProfile") {
      addProfiles[nameAsKey(`__ruleListOf_${basicProfile.name}`)] = {
        ...defaultRuleListProfile,
        name: `__ruleListOf_${basicProfile.name}`,
      } as RuleListProfile;

      addProfiles[nameAsKey(basicProfile.name)] = {
        ...defaultSwitchProfile,
        ...basicProfile,
        defaultProfileName: `__ruleListOf_${basicProfile.name}`,
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
