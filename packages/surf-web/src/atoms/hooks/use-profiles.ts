import { useAtom, useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { nameAsKey } from 'surf-pac'
import {
  builtinProfiles,
  defaultFixedProfile,
  defaultRuleListProfile,
  defaultSwitchProfile,
} from '~/constants'
import { currentProfileNameAtom } from '../current-profile-name'
import { profilesAtom } from '../profiles'
import type {
  BasicProfile,
  FixedProfile,
  Profile,
  Profiles,
  RuleListProfile,
  SwitchProfile,
} from 'surf-pac'

export type BasicProfileWithoutColor = Omit<BasicProfile, 'color'>

export function useProfiles() {
  const [profiles, setProfiles] = useAtom(profilesAtom)
  const currentProfileName = useAtomValue(currentProfileNameAtom)

  const allProfiles: Profiles = {
    ...builtinProfiles,
    ...profiles,
  }

  const addProfile = (basicProfileWithoutColor: BasicProfileWithoutColor) => {
    const addProfiles: Profiles = {}

    if (basicProfileWithoutColor.profileType === 'FixedProfile') {
      addProfiles[nameAsKey(basicProfileWithoutColor.name)] = {
        ...defaultFixedProfile,
        ...basicProfileWithoutColor,
      } as FixedProfile
    }

    if (basicProfileWithoutColor.profileType === 'SwitchProfile') {
      addProfiles[nameAsKey(`__ruleListOf_${basicProfileWithoutColor.name}`)] =
        {
          ...defaultRuleListProfile,
          name: `__ruleListOf_${basicProfileWithoutColor.name}`,
        } as RuleListProfile

      addProfiles[nameAsKey(basicProfileWithoutColor.name)] = {
        ...defaultSwitchProfile,
        ...basicProfileWithoutColor,
        defaultProfileName: `__ruleListOf_${basicProfileWithoutColor.name}`,
      } as SwitchProfile
    }

    if (addProfiles) {
      setProfiles({
        ...profiles,
        ...addProfiles,
      })
    }
  }

  const updateProfile = (profile: Profile) => {
    setProfiles({
      ...profiles,
      [nameAsKey(profile.name)]: profile,
    })
  }

  const showProfiles = useMemo(() => {
    return Object.fromEntries(
      Object.entries(profiles).filter(([_key, profile]) =>
        ['FixedProfile', 'SwitchProfile'].includes(profile.profileType),
      ),
    )
  }, [profiles]) as Record<string, FixedProfile | SwitchProfile>

  const currentProfile = useMemo(
    () => allProfiles[nameAsKey(currentProfileName)],
    [allProfiles],
  )

  return {
    profiles,
    currentProfile,
    showProfiles,
    allProfiles,
    builtinProfiles,
    setProfiles,
    addProfile,
    updateProfile,
  }
}
