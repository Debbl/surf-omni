export type IConditionType =
  | "UrlRegexCondition"
  | "HostWildcardCondition"
  | "UrlWildcardCondition"
  | "KeywordCondition";

export interface ICondition {
  conditionType: IConditionType;
  pattern: string;
}

export interface IRule {
  condition: ICondition;
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
