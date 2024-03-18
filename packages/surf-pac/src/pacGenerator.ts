import {
  assignmentExpression,
  binaryExpression,
  blockStatement,
  callExpression,
  directive,
  doWhileStatement,
  expressionStatement,
  functionExpression,
  generate,
  identifier,
  ifStatement,
  literal,
  logicalExpression,
  memberExpression,
  objectExpression,
  property,
  returnStatement,
  unaryExpression,
  variableDeclaration,
  variableDeclarator,
} from "surf-ast";
import { parserCondition } from "./conditions";
import type { Condition } from "./conditions";
import type { Statement } from "estree";

interface IBasicOption {
  name: string;
  profileType: string;
  revision: string;
  defaultProfileName?: string;
}

interface ISwitchProfileOption extends IBasicOption {
  profileType: "SwitchProfile";
  defaultProfileName: string;
  rules: Array<{
    profileName: string;
    condition: Condition;
  }>;
}

interface IFixedProfileOption extends IBasicOption {
  profileType: "FixedProfile";
  fallbackProxy: {
    scheme: string;
    host: string;
    port: number;
  };
  bypassList: Condition[];
}

type IOption = ISwitchProfileOption | IFixedProfileOption;

type IOptions = Record<string, IOption>;

function parserOptions(options: IOptions) {
  const factory = (
    statements: Array<Statement>,
    defaultProfileName: string,
  ) => {
    return functionExpression(
      null,
      [identifier("url"), identifier("host"), identifier("scheme")],
      blockStatement([
        ...statements,
        returnStatement(literal(defaultProfileName)),
      ]),
    );
  };

  const properties = Object.keys(options).map((key) => {
    const option = options[key];
    const { profileType } = option;

    let ifAsts: Array<Statement> = [];
    const rules = option.profileType === "SwitchProfile" ? option.rules : [];
    if (profileType === "SwitchProfile") {
      ifAsts = rules.map((rule) => {
        return parserCondition(rule.condition, `+${rule.profileName}`);
      });
    }

    if (profileType === "FixedProfile") {
      ifAsts = option.bypassList.map((bypass) => {
        return parserCondition(bypass, "DIRECT");
      });
    }

    return property(
      literal(key),
      factory(ifAsts, option.defaultProfileName ?? "DIRECT"),
      "init",
    );
  });

  return objectExpression(properties);
}

function script(init: string, options: IOptions) {
  const doWhile = doWhileStatement(
    blockStatement([
      expressionStatement(
        assignmentExpression(
          "=",
          identifier("result"),
          memberExpression(identifier("profiles"), identifier("result"), true),
        ),
      ),
      ifStatement(
        binaryExpression(
          "===",
          unaryExpression("typeof", identifier("result")),
          literal("function"),
        ),
        expressionStatement(
          assignmentExpression(
            "=",
            identifier("result"),
            callExpression(identifier("result"), [
              identifier("url"),
              identifier("host"),
              identifier("scheme"),
            ]),
          ),
        ),
      ),
    ]),
    logicalExpression(
      "||",
      binaryExpression(
        "!==",
        unaryExpression("typeof", identifier("result")),
        literal("string"),
      ),
      binaryExpression(
        "===",
        callExpression(
          memberExpression(
            identifier("result"),
            identifier("charCodeAt"),
            false,
          ),
          [identifier("0")],
        ),
        identifier("43"),
      ),
    ),
  );

  const factory = functionExpression(
    null,
    [identifier("url"), identifier("host")],
    blockStatement([
      directive("use strict"),
      variableDeclaration("var", [
        variableDeclarator(identifier("result"), identifier("init")),
        variableDeclarator(
          identifier("scheme"),
          callExpression(
            memberExpression(identifier("url"), identifier("substr"), false),
            [
              identifier("0"),
              callExpression(
                memberExpression(
                  identifier("url"),
                  identifier("indexOf"),
                  false,
                ),
                [literal(":")],
              ),
            ],
          ),
        ),
      ]),
      doWhile,
      returnStatement(identifier("result")),
    ]),
  );

  return variableDeclaration("var", [
    variableDeclarator(
      identifier("FindProxyForURL"),
      callExpression(
        functionExpression(
          null,
          [identifier("init"), identifier("profiles")],
          blockStatement([returnStatement(factory)]),
        ),
        [literal(`+${init}`), parserOptions(options)],
      ),
    ),
  ]);
}

export const pacGenerator = {
  script,
  parserOptions,
  generate,
};
