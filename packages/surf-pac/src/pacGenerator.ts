import {
  assignmentExpression,
  binaryExpression,
  blockStatement,
  callExpression,
  directive,
  doWhileStatement,
  expressionStatement,
  functionExpression,
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
import type { Statement } from "estree";
import { parserCondition } from "./conditions";
import { ruleListParser } from "./ruleList";
import { nameAsKey, pacResult } from "./utils";
import type { Profiles } from "./profiles";

function parserOptions(profiles: Profiles) {
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

  const properties = Object.keys(profiles).map((key) => {
    const profile = profiles[key];
    const { profileType } = profile;
    let defaultProfileName = (profile as any).defaultProfileName;
    if (defaultProfileName === "direct" || !defaultProfileName) {
      defaultProfileName = "DIRECT";
    } else {
      defaultProfileName = nameAsKey(defaultProfileName);
    }

    let ifAsts: Array<Statement> = [];
    const rules = profile.profileType === "SwitchProfile" ? profile.rules : [];

    if (profileType === "FixedProfile") {
      ifAsts = profile.bypassList.map((bypass) => {
        return parserCondition(bypass, "DIRECT");
      });
      defaultProfileName = pacResult(profile.singleProxy);
    }

    if (profileType === "SwitchProfile") {
      ifAsts = rules.map((rule) => {
        return parserCondition(
          rule.condition,
          rule.profileName === "direct"
            ? "DIRECT"
            : nameAsKey(rule.profileName),
        );
      });
    }

    if (profileType === "RuleListProfile") {
      const rules = ruleListParser(
        profile.raw,
        profile.matchProfileName,
        profile.defaultProfileName,
      );

      ifAsts = rules.map((rule) => {
        return parserCondition(
          rule.condition,
          rule.profileName === "direct"
            ? "DIRECT"
            : nameAsKey(rule.profileName),
        );
      });
    }

    return property(literal(key), factory(ifAsts, defaultProfileName), "init");
  });

  return objectExpression(properties);
}

export function pacGeneratorScript(init: string, profiles: Profiles) {
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
        [literal(`+${init}`), parserOptions(profiles)],
      ),
    ),
  ]);
}
