import type { IPACRules } from "@/types";

class PAC {
  getIsExclusive(line: string) {
    return line.startsWith("@@");
  }

  getPattern(line: string): string {
    if (line.startsWith("\\") && line.endsWith("\\")) return line.slice(1, -1);

    if (line.startsWith("|"))
      return `^${line.slice(1).replace(/\^/g, "[^\\w\\-\\.%]")}`;
    if (line.endsWith("|"))
      return `${line.slice(0, -1).replace(/\^/g, "[^\\w\\-\\.%]")}$`;

    if (line.startsWith("||"))
      return `^${line.slice(2).replace(/\^/g, "[^\\w\\-\\.%]")}`;

    return "";
  }

  parse(text: string): IPACRules {
    return text
      .split(/\n|\r/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line[0] !== "!" && line[0] !== "[")
      .map((line) => {
        const isExclusive = this.getIsExclusive(line);
        const pattern = this.getPattern(isExclusive ? line.slice(2) : line);

        return isExclusive ? [pattern] : pattern;
      });
  }
}

const pac = new PAC();
export { pac };
