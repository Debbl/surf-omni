export interface ICondition {
  conditionType:
    | "TrueCondition"
    | "FalseCondition"
    | "UrlRegexCondition"
    | "UrlWildcardCondition"
    | "HostRegexCondition"
    | "HostWildcardCondition"
    | "BypassCondition"
    | "KeywordCondition";
  pattern?: string;
}
