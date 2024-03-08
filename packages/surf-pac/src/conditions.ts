import {
  binaryExpression,
  callExpression,
  identifier,
  ifStatement,
  literal,
  logicalExpression,
  memberExpression,
  regExpLiteral,
  returnStatement,
} from "surf-ast";
import type { Expression } from "estree";

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

export function formatURL(url: string) {
  try {
    const urlObj = new URL(url);

    return {
      url: urlObj.href,
      host: urlObj.host,
      scheme: urlObj.protocol.replace(":", ""),
    };
  } catch {
    return {
      url,
      host: "",
      scheme: "",
    };
  }
}

/**
 * start with http or https, optional www, then pattern
 * @param pattern
 * @returns a regex pattern
 */
export function urlRegexConditionPattern(pattern: string) {
  return `^(http|https)?:\\/\\/(?:www\\.)?${pattern}`;
}

/**
 * start with http or https, optional www, * is wildcard
 * @param pattern
 * @returns a string allowing has * as wildcard
 */
export function urlWildcardConditionPattern(pattern: string) {
  return `^(http|https)?:\\/\\/${pattern
    .replace(/[.+^${}()|[\]\\/]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".")}`;
}
/**
 * host regex pattern
 * @param pattern
 * @returns a regex pattern
 */
export function hostRegexConditionPattern(pattern: string) {
  return `^${pattern}`;
}

export function hostWildcardConditionPattern(pattern: string) {
  if (pattern.startsWith("**.")) {
    pattern = pattern.slice(1); // remove one '*'
    return `^.*\\.${pattern
      .replace(/[.+^${}()|[\]\\/]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".")}$`;
  } else if (pattern.startsWith("*.")) {
    return `^(${pattern
      .replace(/[.+^${}()|[\]\\/]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".")}|${pattern
      .slice(2)
      .replace(/[.+^${}()|[\]\\/]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\?/g, ".")})$`;
  }
  return `^${pattern
    .replace(/[.+^${}()|[\]\\/]/g, "\\$&")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".")}$`;
}

export function bypassConditionPattern(pattern: string) {
  try {
    const urlObj = new URL(pattern);
    const scheme = urlObj.protocol.replace(":", "");
    return `^${scheme}?:\\/\\/${urlObj.host}`;
  } catch {}
  if (pattern.startsWith(".")) {
    return `^http:\\/\\/.*${pattern
      .replace(/[.+^${}()|[\]\\/]/g, "\\$&")
      .replace(/\*/g, ".*")}`;
  }
  return `^http:\\/\\/${pattern
    .replace(/[.+^${}()|[\]\\/]/g, "\\$&")
    .replace(/\*/g, ".*")}`;
}

export function keywordConditionPattern(pattern: string) {
  return `^http:\\/\\/\.*${pattern}.*`;
}

export function parserCondition(condition: ICondition, match: string) {
  // this has three identical host, url and scheme
  const { conditionType, pattern = "" } = condition;

  const factory = (expression: Expression) => {
    return ifStatement(expression, returnStatement(literal(match)));
  };

  switch (conditionType) {
    case "TrueCondition":
      return factory(literal(true));
    case "FalseCondition":
      return factory(literal(false));
    case "UrlRegexCondition":
      return factory(
        callExpression(
          memberExpression(
            regExpLiteral(urlRegexConditionPattern(pattern), ""),
            identifier("test"),
            false,
          ),
          [identifier("url")],
        ),
      );
    case "UrlWildcardCondition":
      if (pattern.includes("|")) {
        const patterns = pattern.split("|");
        const expressions = patterns.map((pattern) => {
          return callExpression(
            memberExpression(
              regExpLiteral(urlWildcardConditionPattern(pattern), ""),
              identifier("test"),
              false,
            ),
            [identifier("url")],
          );
        });

        const logicalE = expressions.reduce((pre, cur) => {
          return logicalExpression("||", pre, cur) as any;
        });

        return ifStatement(logicalE, returnStatement(literal(match)));
      }
      return factory(
        callExpression(
          memberExpression(
            regExpLiteral(urlWildcardConditionPattern(pattern), ""),
            identifier("test"),
            false,
          ),
          [identifier("url")],
        ),
      );
    case "HostRegexCondition":
      return factory(
        callExpression(
          memberExpression(
            regExpLiteral(hostRegexConditionPattern(pattern), ""),
            identifier("test"),
            false,
          ),
          [identifier("host")],
        ),
      );
    case "HostWildcardCondition":
      return factory(
        callExpression(
          memberExpression(
            regExpLiteral(hostWildcardConditionPattern(pattern), ""),
            identifier("test"),
            false,
          ),
          [identifier("host")],
        ),
      );
    case "BypassCondition":
      return factory(
        callExpression(
          memberExpression(
            regExpLiteral(bypassConditionPattern(pattern), ""),
            identifier("test"),
            false,
          ),
          [identifier("url")],
        ),
      );
    case "KeywordCondition":
      return factory(
        callExpression(
          memberExpression(
            regExpLiteral(keywordConditionPattern(pattern), ""),
            identifier("test"),
            false,
          ),
          [identifier("url")],
        ),
      );
  }

  return ifStatement(
    binaryExpression("===", literal(1), literal(1)),
    returnStatement(literal(match)),
  );
}
