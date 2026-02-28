import { astringGenerate } from 'surf-ast'
import { formatURL, matchCondition } from './conditions'
import { pacGeneratorScript } from './pac-generator'
import { ruleListParser } from './rule-list'
import { nameAsKey } from './utils'
import type { Condition } from './conditions'
import type { IProxy } from './utils'

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
  singleProxy: IProxy
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

export type ProxyValue =
  | { mode: 'direct' }
  | { mode: 'system' }
  | {
      mode: 'fixed_servers'
      rules: {
        singleProxy: FixedProfile['singleProxy']
        bypassList: string[]
      }
    }
  | {
      mode: 'pac_script'
      pacScript: {
        data: string
      }
    }

export function getProxyValue(
  currentProfileName: string,
  profiles: Profiles,
): ProxyValue {
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
          bypassList: profile.bypassList
            .map((item) => item.pattern)
            .filter((pattern): pattern is string => pattern != null),
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

export function resolveProfileForUrl(
  url: string,
  profileName: string,
  profiles: Profiles,
): string {
  if (!profileName || profileName === 'direct' || profileName === 'DIRECT') {
    return profileName
  }

  const key = nameAsKey(profileName)
  const profile = profiles[key]
  if (!profile) return profileName

  const { host } = formatURL(url)

  switch (profile.profileType) {
    case 'DirectProfile':
    case 'SystemProfile':
    case 'FixedProfile':
      return profileName

    case 'SwitchProfile': {
      for (const rule of profile.rules) {
        if (matchCondition(rule.condition, url, host)) {
          return resolveProfileForUrl(url, rule.profileName, profiles)
        }
      }
      return resolveProfileForUrl(url, profile.defaultProfileName, profiles)
    }

    case 'RuleListProfile': {
      const rules = ruleListParser(
        profile.raw,
        profile.matchProfileName,
        profile.defaultProfileName,
      )
      for (const rule of rules) {
        if (matchCondition(rule.condition, url, host)) {
          return resolveProfileForUrl(url, rule.profileName, profiles)
        }
      }
      return resolveProfileForUrl(url, profile.defaultProfileName, profiles)
    }
  }

  return profileName
}
