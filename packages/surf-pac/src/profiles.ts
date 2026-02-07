import { astringGenerate } from 'surf-ast'
import { pacGeneratorScript } from './pacGenerator'
import { nameAsKey } from './utils'
import type { Condition } from './conditions'

export type BuiltinProfileType = 'DirectProfile' | 'SystemProfile'

export type ProfileType =
  | BuiltinProfileType
  | 'FixedProfile'
  | 'SwitchProfile'
  | 'RuleListProfile'

export type OptionProfileType = Exclude<ProfileType, BuiltinProfileType>

export interface BasicProfile {
  name: string
  profileType: ProfileType
  color: string
}

export type Scheme = 'http' | 'https' | 'socks4' | 'socks5'

export interface DirectProfile extends BasicProfile {
  profileType: 'DirectProfile'
}
export interface SystemProfile extends BasicProfile {
  profileType: 'SystemProfile'
}

export interface FixedProfile extends BasicProfile {
  profileType: 'FixedProfile'
  singleProxy: {
    scheme: Scheme
    host: string
    port: number
  }
  bypassList: Condition[]
}

export interface SwitchProfile extends BasicProfile {
  profileType: 'SwitchProfile'
  defaultProfileName: string
  rules: {
    condition: Condition
    profileName: string
  }[]
}

export interface RuleListProfile extends BasicProfile {
  profileType: 'RuleListProfile'
  matchProfileName: string
  defaultProfileName: string
  url: string
  raw: string
}

export type Profile =
  | DirectProfile
  | SystemProfile
  | FixedProfile
  | SwitchProfile
  | RuleListProfile

export type Profiles = Record<string, Profile>

export function getProxyValue(currentProfileName: string, profiles: Profiles) {
  const profile = profiles[nameAsKey(currentProfileName)]

  switch (profile.profileType) {
    case 'DirectProfile':
      return {
        mode: 'direct',
      }
    case 'SystemProfile':
      return {
        mode: 'system',
      }
    case 'FixedProfile':
      return {
        mode: 'fixed_servers',
        rules: {
          singleProxy: profile.singleProxy,
          bypassList: profile.bypassList.map((item) => item.pattern),
        },
      }
    case 'SwitchProfile':
      return {
        mode: 'pac_script',
        pacScript: {
          data: astringGenerate(
            pacGeneratorScript(currentProfileName, profiles),
          ),
        },
      }
  }

  return {
    mode: 'direct',
  }
}
