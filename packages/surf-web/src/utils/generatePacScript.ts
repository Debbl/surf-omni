import type { IPACRules, IRules } from "@/types";

function parserRules(rules: IRules): IPACRules {
  return rules.map((r) =>
    r.isExclusive ? [r.condition.pattern] : r.condition.pattern,
  );
}

function run(url: string, host: string, proxy: string, rules: IPACRules) {
  const r = rules.find((r) => {
    const reg = new RegExp(Array.isArray(r) ? r[0] : r);
    return reg.test(host);
  });
  if (typeof r === "string") return `PROXY ${proxy}; DIRECT`;
  return "DIRECT";
}

function generatePacScript(proxy: string, pacRules: IPACRules) {
  return `${run.toString()}
function FindProxyForURL(url, host) {
  return run(url, host, "${proxy}", ${JSON.stringify(pacRules)});
}`;
}

export { generatePacScript, run, parserRules };
