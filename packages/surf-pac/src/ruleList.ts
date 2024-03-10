import type { ICondition } from "./types";

interface IRule {
  condition: ICondition;
  profileName: string;
  source: string;
}

export const magicPrefix = "W0F1dG9Qcm94";

export const strStartsWith = (text: string, prefix: string) => {
  return text.slice(0, prefix.length) === prefix;
};

export function detect(text: string) {
  return strStartsWith(text, magicPrefix) || strStartsWith(text, "[AutoProxy");
}

export function preprocess(text: string) {
  if (!detect(text)) return;

  if (strStartsWith(text, magicPrefix)) {
    return atob(text);
  }
  return text;
}

export function getIsExclusive(text: string) {
  return strStartsWith(text, "@@");
}

export function getCondition(line: string): ICondition {
  if (line[0] === "/") {
    return {
      conditionType: "UrlRegexCondition",
      pattern: line.slice(1, line.length - 1),
    };
  }

  if (line[0] === "|") {
    if (line[1] === "|") {
      return {
        conditionType: "HostWildcardCondition",
        pattern: `*.${line.slice(2)}`,
      };
    }

    return {
      conditionType: "UrlWildcardCondition",
      pattern: `${line.slice(1)}*`,
    };
  }

  if (!line.includes("*")) {
    return {
      conditionType: "KeywordCondition",
      pattern: line,
    };
  }
  return {
    conditionType: "UrlWildcardCondition",
    pattern: `http://*${line}*`,
  };
}

export function parse(
  textRaw: string,
  matchProfileName: string,
  defaultProfileName: string,
) {
  const text = preprocess(textRaw);
  const normalRules: IRule[] = [];
  const exclusiveRules: IRule[] = [];

  text
    .split(/\n|\r/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line[0] !== "!" && line[0] !== "[")
    .forEach((line) => {
      const isExclusive = getIsExclusive(line);
      const condition = getCondition(isExclusive ? line.slice(2) : line);

      if (isExclusive) {
        exclusiveRules.push({
          condition,
          profileName: defaultProfileName,
          source: line,
        });
      } else {
        normalRules.push({
          condition,
          profileName: matchProfileName,
          source: line,
        });
      }
    });

  return exclusiveRules.concat(normalRules);
}
