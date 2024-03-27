import {
  blockStatement,
  callExpression,
  functionExpression,
  generate,
  identifier,
  returnStatement,
} from "surf-ast";
import { describe, expect, it } from "vitest";
import { formatURL, parserCondition } from "./conditions";
import type { Condition } from "./conditions";

function testCond(
  condition: Condition,
  request: { url: string; host: string; scheme: string } | string,
  shouldMatch = true,
) {
  const testFuncAst = callExpression(
    functionExpression(
      null,
      [],
      blockStatement([
        returnStatement(
          functionExpression(
            null,
            [identifier("url"), identifier("host"), identifier("scheme")],
            blockStatement([parserCondition(condition, "match")]),
          ),
        ),
      ]),
    ),
    [],
  );

  const code = generate(testFuncAst);
  // eslint-disable-next-line no-eval
  const testFunc = eval(code) as (
    url: string,
    host: string,
    scheme: string,
  ) => string;

  if (typeof request === "string") {
    request = formatURL(request);
  }

  const result = testFunc(request.url, request.host, request.scheme);
  if (shouldMatch) {
    expect(result).toBe("match");
  } else {
    expect(result).not.toBe("match");
  }
}

describe("trueCondition", () => {
  it("should always return true", () => {
    testCond({ conditionType: "TrueCondition" }, "");
  });
});

describe("falseCondition", () => {
  it("should always return false", () => {
    testCond({ conditionType: "FalseCondition" }, "", false);
  });
});

describe("urlRegexCondition", () => {
  const cond: Condition = {
    conditionType: "UrlRegexCondition",
    pattern: "example\\.com",
  };

  it("should match requests based on regex pattern", () => {
    testCond(cond, "http://www.example.com/");
  });

  it("should not match requests not matching the pattern", () => {
    testCond(cond, "http://www.example.net/", false);
  });

  it("should support regex meta chars", () => {
    const con: Condition = {
      conditionType: "UrlRegexCondition",
      pattern: "exam.*\\.com",
    };
    testCond(con, "http://www.example.com/");
  });

  // it("should fallback to not match if pattern is invalid", () => {
  //   const con: ICondition = {
  //     conditionType: "UrlRegexCondition",
  //     pattern: ")Invalid(",
  //   };
  //   testCond(con, "http://www.example.com/", false);
  // });
});

describe("urlWildcardCondition", () => {
  const cond: Condition = {
    conditionType: "UrlWildcardCondition",
    pattern: "*example.com*",
  };
  it("should match requests based on wildcard pattern", () => {
    testCond(cond, "http://www.example.com/");
  });

  it("should not match requests not matching the pattern", () => {
    testCond(cond, "http://www.example.net/", false);
  });

  it("should support wildcard question marks", () => {
    const con: Condition = {
      conditionType: "UrlWildcardCondition",
      pattern: "*exam???.com*",
    };
    testCond(con, "http://www.example.com/");
  });

  it("should not support regex meta chars", () => {
    const con: Condition = {
      conditionType: "UrlWildcardCondition",
      pattern: ".*example.com.*",
    };
    testCond(con, "http://example.com/", false);
  });

  it("should support multiple patterns in one condition", () => {
    const con: Condition = {
      conditionType: "UrlWildcardCondition",
      pattern: "*.example.com/*|*.example.net/*|*.example.net/*",
    };
    testCond(con, "http://a.example.com/abc");
    testCond(con, "http://b.example.net/def");
    testCond(con, "http://c.example.org/ghi", false);
  });
});

describe("hostRegexCondition", () => {
  const cond: Condition = {
    conditionType: "HostRegexCondition",
    pattern: ".*\\.example\\.com",
  };
  it("should match requests based on regex pattern", () => {
    testCond(cond, "http://www.example.com/");
  });
  it("should not match requests not matching the pattern", () => {
    testCond(cond, "http://example.com/", false);
  });
  it("should not match URL parts other than the host", () => {
    testCond(cond, "http://example.net/www.example.com", false);
  });
});

describe("hostWildcardCondition", () => {
  const cond: Condition = {
    conditionType: "HostWildcardCondition",
    pattern: "*.example.com",
  };
  it("should match requests based on wildcard pattern", () => {
    testCond(cond, "http://www.example.com/");
  });
  it("should also match hostname without the optional level", () => {
    testCond(cond, "http://example.com/");
  });
  it("should process patterns like *.*example.com correctly", () => {
    const con: Condition = {
      conditionType: "HostWildcardCondition",
      pattern: "*.*example.com",
    };
    testCond(con, "http://example.com/");
    testCond(con, "http://www.example.com/");
    testCond(con, "http://www.some-example.com/");
    testCond(con, "http://xample.com/", false);
  });
});

describe("bypassCondition", () => {
  it("should correctly support patterns containing hosts", () => {
    const cond: Condition = {
      conditionType: "BypassCondition",
      pattern: ".example.com",
    };
    testCond(cond, "http://www.example.com/");
    testCond(cond, "http://example.com/", false);
    cond.pattern = "*.example.com";
    testCond(cond, "http://www.example.com/");
    testCond(cond, "http://example.com/", false);
    cond.pattern = "example.com";
    testCond(cond, "http://example.com/");
    testCond(cond, "http://www.example.com/", false);
    cond.pattern = "*example.com";
    testCond(cond, "http://example.com/");
    testCond(cond, "http://www.example.com/");
    testCond(cond, "http://anotherexample.com/");
  });
  it("should match the scheme specified in the pattern", () => {
    const cond: Condition = {
      conditionType: "BypassCondition",
      pattern: "http://example.com",
    };
    testCond(cond, "http://example.com/");
    testCond(cond, "https://example.com/", false);
  });
  it("should match the port specified in the pattern", () => {
    const cond: Condition = {
      conditionType: "BypassCondition",
      pattern: "http://example.com:8080",
    };
    testCond(cond, "http://example.com:8080/");
    testCond(cond, "http://example.com:888/", false);
  });
  it("should correctly support patterns using IPv4 literals", () => {
    const cond: Condition = {
      conditionType: "BypassCondition",
      pattern: "http://127.0.0.1:8080",
    };
    testCond(cond, "http://127.0.0.1:8080/");
    testCond(cond, "http://127.0.0.2:8080/", false);
  });
  // TODO
  // it("should correctly support IPv6 canonicalization", () => {
  //   const cond: ICondition = {
  //     conditionType: "BypassCondition",
  //     pattern: "http://[::1]:8080",
  //   };
  //   testCond(cond, "http://[::1]:8080/");
  //   testCond(cond, "http://[1::1]:8080/", false);
  // });
  // it("should correctly support IPv6 canonicalization 2", () => {
  //   const cond: ICondition = {
  //     conditionType: "BypassCondition",
  //     pattern: "[::1]",
  //   };
  //   testCond(cond, "http://[::1]:8080/");
  //   testCond(cond, "http://[1::1]:8080/", false);
  // });
});

describe("keywordCondition", () => {
  const cond: Condition = {
    conditionType: "KeywordCondition",
    pattern: "example.com",
  };
  it("should match requests based on substring", () => {
    testCond(cond, "http://www.example.com/");
    testCond(cond, "http://www.example.net/", false);
  });
  it("should not match HTTPS requests", () => {
    testCond(cond, "https://example.com/", false);
    testCond(cond, "https://example.net/", false);
  });
});
