---
name: type-system-implementer
description: Build and refine a compile-time type system in TypeScript (or similar). Use when designing type-level representations, rule application pipelines, or when type computation performance and maintainability matter.
argument-hint: "[goal] [optional: constraints]"
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob
---

# Type System Implementer (Generic)

Use this skill to **design, implement, refactor, and validate** a type-level “engine” (e.g., a grammar/type system, rule-based transformer, or compile-time evaluator).

---

## Inputs

- **Goal**: `$ARGUMENTS`  
  If arguments are missing, infer a reasonable goal from the conversation and proceed.

---

## Outputs

When invoked, produce:

1. **A short diagnosis** of the current type design (strengths, risks, likely failure modes).
2. **Concrete refactors** with code snippets (not pseudo-code), using generic identifiers (`Foo`, `Bar`, …).
3. **A validation plan**: type tests, negative tests, and performance checks.
4. **A maintainability plan**: how to add new rules/features without exploding complexity.

---

## Core Principles

### 1) Prefer a “Rule Table” Over Deep Conditional Chains

Avoid long `A extends ... ? ... : B extends ... ? ... : ...` ladders. Replace them with:

- A **mapping type** (rule table) indexed by a key (`FooKey`)
- A single dispatcher: `FooMap[FooKey]`

This keeps the system extensible and reduces compiler strain.

### 2) Compute Expensive Intermediates Once

If you repeatedly compute `FooCompute<Bar, Baz>` in multiple branches, refactor to:

- `infer FooTmp` once
- reuse `FooTmp` everywhere

This improves both clarity and compile performance.

### 3) Control Conditional Type Distribution Intentionally

TypeScript distributes conditionals over unions by default. Decide deliberately:

- If you **want** distribution: `T extends U ? ... : ...`
- If you **don’t want** distribution: `[T] extends [U] ? ... : ...`

Use this to prevent accidental “union blow-up”.

### 4) Keep Literal Types From Widening

If helpers return `string` (or `number`) too early, everything collapses into broad types. Prefer:

- constrained `infer` (`infer FooTmp extends string`)
- narrow helpers that preserve literals as long as possible

### 5) Separate “Representation” From “Evaluation”

Model your system in layers:

- **Representation types**: AST-like shapes (`FooNode`, `BarNode`)
- **Evaluation types**: transformations (`FooEval<...>`, `BarRewrite<...>`)
- **Utilities**: string/symbol operations (`FooJoin`, `FooSplit`, `FooNormalize`)

This prevents circular complexity.

---

## Recommended Architecture (Generic)

### A) Data Model

Create minimal, composable primitives:

- `type FooToken = ...`
- `type FooNode = { kind: FooKind; data: FooData }`
- `type FooKind = "foo" | "bar" | "baz"` (generic strings)

Avoid embedding business/domain semantics in names.

### B) Normalization Stage

Before rule application, normalize inputs:

- canonicalize forms (`FooNormalize<T>`)
- validate invariants (`FooValidate<T>`)
- split multi-step logic into smaller passes

### C) Rule Application Pipeline

Use a pipeline like:

- `FooParse<Input> -> FooNormalize<Ast> -> FooApplyRules<Ast, FooRuleSet> -> FooPrint<Result>`

Where `FooApplyRules` uses a rule table.

### D) Rule Table Pattern

Create:

- `type FooRuleKey = ...`
- `type FooRuleMap<FooCtx> = { [K in FooRuleKey]: ... }`
- `type FooApplyRule<FooCtx, K extends FooRuleKey> = FooRuleMap<FooCtx>[K]`

Prefer “key extraction” in a dedicated helper:

- `type FooPickRuleKey<FooCtx> = ...`

---

## Type-Level Testing Guidance

Provide tests using a conventional pattern, e.g.:

- `type FooAssert<T extends true> = T`
- `type FooEq<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false`

Include:

- **Positive tests**: expected equalities
- **Negative tests**: expected `never` / failure states
- **Regression tests**: minimal cases reproducing past issues
- **Performance guardrails**: avoid tests that generate huge unions unintentionally

---

## Performance Checklist (When Types Get Slow)

If the user reports sluggish IntelliSense or long builds, check for:

- runaway union distribution
- deep recursive conditional chains
- repeated recomputation of the same intermediate
- string template recursion without termination constraints
- overly generic constraints that widen early (`string`/`any`)

Provide at least one refactor aimed specifically at compile-time cost reduction.

---

## Error-Handling Strategy (Type-Level)

Define explicit “error channels”:

- `type FooError<Message extends string> = { __error: Message }`
- `type FooResult<T> = T | FooError<...>`

Or:

- return `never` for impossible states, but only if users can diagnose it
- for developer-facing systems, prefer structured error payloads

---

## Extensibility Guidance

When adding a new feature:

1. Add a new `FooRuleKey`
2. Add a new entry in `FooRuleMap`
3. Update `FooPickRuleKey` (or equivalent) with minimal logic
4. Add tests: one happy path + one edge case + one negative case

Avoid touching multiple unrelated modules.

---

## If Supporting Files Exist

If the skill directory includes supporting files, follow these conventions:

- `reference.md`: stable conventions and invariants
- `examples.md`: expected inputs/outputs and golden tests
- `scripts/*`: optional generators/validators (do not assume execution unless explicitly permitted)

When the user asks for more examples, point them to `examples.md` and extend it with generic cases.

---

## Invocation Control Notes

- This skill is safe for automatic invocation (no side effects).
- If the user asks for destructive workflows (writing files, running commands, publishing), recommend creating a separate skill with `disable-model-invocation: true` and stricter `allowed-tools`.

---

## Argument Usage Examples

- `/type-system-implementer add a new rule for Foo and keep it maintainable`
- `/type-system-implementer refactor FooApply so it compiles faster`
- `/type-system-implementer design a rule-table dispatcher pattern for FooKey`

(Arguments are available via `$ARGUMENTS`, `$ARGUMENTS[0]`, `$0`, etc.) :contentReference[oaicite:0]{index=0}

---

## Notes on Dynamic Context (Optional Pattern)

If dynamic data is needed, use a preprocessing placeholder pattern (shell command expansion) so the model receives real outputs rather than commands. Only do this if the environment supports it and permissions are appropriate. :contentReference[oaicite:1]{index=1}

---

## Notes on Tool Restrictions

Keep this skill read-only by default. If the user requests automated code modifications, instruct them to enable additional tools explicitly (or create a separate skill with broader permissions). :contentReference[oaicite:2]{index=2}
