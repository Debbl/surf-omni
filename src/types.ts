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
