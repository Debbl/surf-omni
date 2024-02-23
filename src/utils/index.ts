import type { ICondition, IRule } from "@/types";

class AutoProxy {
  magicPrefix = ["W0F1dG9Qcm94", "[AutoProxy"];

  detect(text: string) {
    return this.magicPrefix.some((prefix) => text.startsWith(prefix));
  }

  preprocess(text: string) {
    if (!this.detect(text)) throw new Error("Not a valid AutoProxy list");

    return text.startsWith(this.magicPrefix[0]) ? atob(text) : text;
  }

  getCond(line: string): ICondition {
    let cond: ICondition;

    if (line[0] === "/") {
      cond = {
        conditionType: "UrlRegexCondition",
        pattern: line.slice(1, -1),
      };
    } else if (line[0] === "|") {
      if (line[1] === "|") {
        cond = {
          conditionType: "HostWildcardCondition",
          pattern: `*.${line.slice(2)}`,
        };
      } else {
        cond = {
          conditionType: "UrlWildcardCondition",
          pattern: `${line.slice(1)}*`,
        };
      }
    } else if (!line.includes("*")) {
      cond = {
        conditionType: "KeywordCondition",
        pattern: line,
      };
    } else {
      cond = {
        conditionType: "UrlWildcardCondition",
        pattern: `http://*${line}*`,
      };
    }

    return {
      ...cond,
      pattern: cond.pattern.replace(/\./g, "\\.").replace(/\*/g, ".*"),
    };
  }

  getIsExclusive(line: string) {
    return line[0] === "@" && line[1] === "@";
  }

  parse(textRaw: string) {
    const text = this.preprocess(textRaw);

    return text
      .split(/\n|\r/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line[0] !== "!" && line[0] !== "[")
      .map((line) => {
        const isExclusive = this.getIsExclusive(line);
        const cond = this.getCond(isExclusive ? line.slice(2) : line);

        return {
          condition: cond,
          isExclusive,
          source: line,
        } as IRule;
      });
  }
}

const autoProxy = new AutoProxy();

export { autoProxy };
