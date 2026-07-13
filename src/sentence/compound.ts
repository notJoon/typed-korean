import type { Join } from "./sentence.js";

/**
 * Compound sentence composition.
 *
 * Clauses are already-formed strings. This layer only joins them; connective
 * morphology such as 고 / 면 / 지만 is handled upstream.
 *
 * The three aliases are currently identical structurally, but are kept
 * separate to document intent at call sites and to allow future divergence.
 */

export type ConnectedSentence<
  Clause1 extends string,
  Clause2 extends string,
> = Join<Clause1, Clause2>;

export type ConditionalSentence<
  Cond extends string,
  Result extends string,
> = Join<Cond, Result>;

export type ContrastSentence<A extends string, B extends string> = Join<A, B>;
