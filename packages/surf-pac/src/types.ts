export type ConditionType =
  | "TrueCondition"
  | "FalseCondition"
  | "UrlRegexCondition"
  | "UrlWildcardCondition"
  | "HostRegexCondition"
  | "HostWildcardCondition"
  | "BypassCondition"
  | "KeywordCondition";

export interface ICondition {
  conditionType: ConditionType;
  pattern?: string;
}

export type BuiltinProfileType = "DirectProfile" | "SystemProfile";

export type ProfileType = BuiltinProfileType | "FixedProfile" | "SwitchProfile";

export type OptionProfileType = Exclude<ProfileType, BuiltinProfileType>;

export interface Condition {
  conditionType: ConditionType;
  pattern: string;
}
export interface BasicProfile {
  name: string;
  profileType: ProfileType;
}

export type IScheme = "http" | "https" | "quic" | "socks4" | "socks5";
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

export interface DirectProfile extends BasicProfile {
  profileType: "DirectProfile";
}
export interface SystemProfile extends BasicProfile {
  profileType: "SystemProfile";
}

export type Profile =
  | DirectProfile
  | SystemProfile
  | FixedProfile
  | SwitchProfile;

export type Profiles = Record<string, Profile>;
