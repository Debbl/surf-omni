import { version as packageVersion } from "../package.json";
import type {
  ConditionType,
  DirectProfile,
  FixedProfile,
  Profiles,
  RuleListProfile,
  SwitchProfile,
  SystemProfile,
} from "surf-pac";

export const isDev = import.meta.env.DEV;

export const projectName = "surf-omni";

export const version = packageVersion;

export const builtinProfiles: Record<string, DirectProfile | SystemProfile> = {
  "+[direct]": {
    name: "[direct]",
    profileType: "DirectProfile",
    color: "#d4d4d8",
  },
  "+[system]": {
    name: "[system]",
    profileType: "SystemProfile",
    color: "#030712",
  },
};

export const defaultFixedProfile: FixedProfile = {
  name: "",
  profileType: "FixedProfile",
  color: "#2563eb",
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
  color: "#10b981",
  profileType: "SwitchProfile",
  defaultProfileName: "[direct]",
  rules: [],
};

export const defaultRuleListProfile: RuleListProfile = {
  name: "",
  color: "#6ee7b7",
  profileType: "RuleListProfile",
  matchProfileName: "direct",
  defaultProfileName: "direct",
  url: "",
  raw: "",
};

export const defaultCustomProfiles: Profiles = {
  "+proxy": {
    ...defaultFixedProfile,
    name: "proxy",
  },
  "+auto switch": {
    ...defaultSwitchProfile,
    defaultProfileName: "__ruleListOf_auto switch",
    name: "auto switch",
  },
  "+__ruleListOf_auto switch": {
    ...defaultRuleListProfile,
    name: "__ruleListOf_auto switch",
  },
};

export const conditionType: {
  label: string;
  value: ConditionType;
}[] = [
  {
    label: "域名通配符",
    value: "HostWildcardCondition",
  },
  {
    label: "网址通配符",
    value: "UrlWildcardCondition",
  },
  {
    label: "网址正则",
    value: "UrlRegexCondition",
  },
  {
    label: "(禁用)",
    value: "FalseCondition",
  },
];
