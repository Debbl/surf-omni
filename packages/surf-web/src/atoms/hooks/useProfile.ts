import { useMemo } from 'react'
import { nameAsKey } from 'surf-pac'
import { useProfiles } from '~/atoms/hooks/useProfiles'
import type { Profile } from 'surf-pac'

export function useProfile<T extends Profile>(name: string) {
  const profiles = useProfiles()
  const { allProfiles, updateProfile } = profiles

  const profile = useMemo(() => {
    return allProfiles[nameAsKey(name)]
  }, [name, allProfiles]) as T

  const setProfile = (profile: T) => {
    updateProfile(profile)
  }

  return {
    ...profiles,
    profile,
    setProfile,
  }
}
