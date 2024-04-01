import type {
  DirectProfile,
  FixedProfile,
  RuleListProfile,
  SwitchProfile,
  SystemProfile,
} from "surf-pac";

export const projectName = "surf-omni";

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

export const defaultFixedProfile: FixedProfile = {
  name: "",
  profileType: "FixedProfile",
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

export const defaultSwitchProfile: SwitchProfile = {
  name: "",
  profileType: "SwitchProfile",
  defaultProfileName: "direct",
  rules: [],
};

export const defaultRuleListProfile: RuleListProfile = {
  name: "",
  profileType: "RuleListProfile",
  matchProfileName: "direct",
  defaultProfileName: "direct",
  url: "",
  raw: "",
};
