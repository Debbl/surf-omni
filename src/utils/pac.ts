import type { IRule } from "@/types";

class PAC {
  proxy: string;
  rules: IRule[];

  constructor(proxy: string, rules: IRule[]) {
    this.proxy = proxy;
    this.rules = rules;
  }

  run(url: string, host: string) {
    const rule = this.rules.find((rule) => {
      const regexPattern = new RegExp(rule.condition.pattern);
      return regexPattern.test(host);
    });

    if (rule) {
      if (!rule.isExclusive) {
        return `PROXY ${this.proxy}; DIRECT`;
      } else {
        return "DIRECT";
      }
    }

    return `DIRECT`;
  }
}

function generatePacScript(proxy: string, rules: IRule[]) {
  return `${PAC.toString()}
const proxy = new PAC("${proxy}", ${JSON.stringify(rules)});
function FindProxyForURL(url, host) {
  return proxy.run(url, host);
}`;
}

export { generatePacScript };
