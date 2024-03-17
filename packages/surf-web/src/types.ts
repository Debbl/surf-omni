import type { OptionProfileType } from "surf-pac";

export type ConditionType =
  | "UrlRegexCondition"
  | "HostWildcardCondition"
  | "UrlWildcardCondition"
  | "KeywordCondition"
  | "BypassCondition";

export interface Condition {
  conditionType: ConditionType;
  pattern: string;
}

export interface IRule {
  condition: Condition;
  isExclusive: boolean;
  source: string;
}
export type IRules = IRule[];

export type IPACRule = [string] | string;
export type IPACRules = IPACRule[];

export type IScheme = "http" | "https" | "quic" | "socks4" | "socks5";
export enum ProfileMode {
  direct = "direct",
  system = "system",
  auto_detect = "auto_detect",
  pac_script = "pac_script",
  fixed_servers = "fixed_servers",
}

export interface BasicProfile {
  name: string;
  profileType: OptionProfileType;
}

export interface FixedProfile extends BasicProfile {
  profileType: "FixedProfile";
  fallbackProxy?: {
    scheme: IScheme;
    host: string;
    port: number;
  };
  bypassList: Condition[];
}

export interface SwitchProfile extends BasicProfile {
  profileType: "SwitchProfile";
  fallbackProxy?: {
    scheme: IScheme;
    host: string;
    port: number;
  };
  bypassList: Condition[];
}

export type Profile = FixedProfile | SwitchProfile;
export type Profiles = Record<string, Profile>;
