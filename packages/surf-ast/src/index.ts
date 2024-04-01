import type {
  AssignmentExpression,
  BinaryExpression,
  BinaryOperator,
  BlockStatement,
  CallExpression,
  Directive,
  DoWhileStatement,
  Expression,
  ExpressionStatement,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  IfStatement,
  Literal,
  LogicalExpression,
  MemberExpression,
  NewExpression,
  ObjectExpression,
  Pattern,
  PrivateIdentifier,
  Property,
  RegExpLiteral,
  RestElement,
  ReturnStatement,
  SpreadElement,
  Statement,
  Super,
  UnaryExpression,
  VariableDeclaration,
  VariableDeclarator,
} from "estree";

export { generate as astringGenerate } from "astring";

export function property(
  key: Property["key"],
  value: Property["value"],
  kind: Property["kind"],
): Property {
  return {
    type: "Property",
    key,
    value,
    kind,
    computed: false,
    method: false,
    shorthand: false,
  };
}

export function objectExpression(
  properties: ObjectExpression["properties"],
): ObjectExpression {
  return {
    type: "ObjectExpression",
    properties: properties.flat(),
  };
}

export function regExpLiteral(pattern: string, flags: string): RegExpLiteral {
  return {
    type: "Literal",
    regex: {
      pattern,
      flags,
    },
  };
}

export function literal(value: string | number | boolean): Literal {
  return {
    type: "Literal",
    value,
  };
}

export function newExpression(
  callee: Expression,
  args: Array<Expression | SpreadElement>,
): NewExpression {
  return {
    type: "NewExpression",
    callee,
    arguments: args,
  };
}

export function unaryExpression(
  operator: UnaryExpression["operator"],
  argument: Expression,
): UnaryExpression {
  return {
    type: "UnaryExpression",
    operator,
    argument,
    prefix: true,
  };
}

export function assignmentExpression(
  operator: AssignmentExpression["operator"],
  left: Identifier,
  right: Expression,
): AssignmentExpression {
  return {
    type: "AssignmentExpression",
    operator,
    left,
    right,
  };
}

export function expressionStatement(
  expression: Expression,
): ExpressionStatement {
  return {
    type: "ExpressionStatement",
    expression,
  };
}

export function functionExpression(
  id: Identifier | null | undefined,
  params: Array<Identifier | Pattern | RestElement>,
  body: BlockStatement,
): FunctionExpression {
  return {
    type: "FunctionExpression",
    id,
    params,
    body,
  };
}

export function variableDeclarator(
  id: Identifier | Pattern,
  init?: Expression | null,
): VariableDeclarator {
  return {
    type: "VariableDeclarator",
    id,
    init,
  };
}

export function ifStatement(
  test: Expression,
  consequent: Statement,
  alternate?: Statement,
): IfStatement {
  return {
    type: "IfStatement",
    test,
    consequent,
    alternate,
  };
}

export function logicalExpression(
  operator: LogicalExpression["operator"],
  left: Expression,
  right: Expression,
): LogicalExpression {
  return {
    type: "LogicalExpression",
    operator,
    left,
    right,
  };
}

export function doWhileStatement(
  body: Statement,
  test: Expression,
): DoWhileStatement {
  return {
    type: "DoWhileStatement",
    body,
    test,
  };
}

export function memberExpression(
  object: Expression | Super,
  property: Expression | PrivateIdentifier,
  computed: boolean,
  optional?: boolean,
): MemberExpression {
  return {
    type: "MemberExpression",
    object,
    property,
    computed,
    optional,
  };
}

export function expression(expression: Expression): Statement {
  return {
    type: "ExpressionStatement",
    expression,
  };
}

export function callExpression(
  callee: Expression,
  args: Array<Expression | SpreadElement>,
): CallExpression {
  return {
    type: "CallExpression",
    optional: false,
    callee,
    arguments: args,
  };
}

export function directive(value: string): Directive {
  return {
    type: "ExpressionStatement",
    expression: {
      type: "Literal",
      value,
    },
    directive: value,
  };
}

export function variableDeclaration(
  kind: VariableDeclaration["kind"],
  declarations: VariableDeclaration["declarations"],
): VariableDeclaration {
  return {
    type: "VariableDeclaration",
    declarations: declarations.flat(),
    kind,
  };
}

export function functionDeclaration(
  id: Identifier | null | undefined,
  params: Array<Identifier | Pattern | RestElement>,
  body: BlockStatement,
): FunctionDeclaration {
  return {
    type: "FunctionDeclaration",
    id,
    params,
    body,
  };
}

export function identifier(name: string): Identifier {
  return {
    type: "Identifier",
    name,
  };
}

export function blockStatement(body: Array<Statement>): BlockStatement {
  return {
    type: "BlockStatement",
    body,
  };
}

export function returnStatement(argument?: Expression | null): ReturnStatement {
  return {
    type: "ReturnStatement",
    argument,
  };
}

export function binaryExpression(
  operator: BinaryOperator,
  left: Expression,
  right: Expression,
): BinaryExpression {
  return {
    type: "BinaryExpression",
    operator,
    left,
    right,
  };
}
