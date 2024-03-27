import { describe, expect, it } from "vitest";
import { parse } from "./ruleList";

function test(line: string, result: any) {
  const _result = parse(line, "match", "nomatch");
  expect(_result[0]).toEqual(result);
}

describe("ruleList", () => {
  describe("autoProxy", () => {
    it("should parse keyword conditions", () => {
      test("example.com", {
        condition: {
          conditionType: "KeywordCondition",
          pattern: "example.com",
        },
        profileName: "match",
        source: "example.com",
      });
    });
  });
});
