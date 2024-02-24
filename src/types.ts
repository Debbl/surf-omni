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
