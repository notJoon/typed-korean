/**
 * Type-level equality check.
 *
 * Uses the "double function" trick to ensure exact structural equality,
 * avoiding false positives from `extends` distributivity.
 */
export type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

/**
 * Type-level assertion. Causes a compile error when `T` is not `true`.
 */
export type Expect<T extends true> = T;

/**
 * Table-driven type assertion.
 * Returns `true` on match; on mismatch surfaces `{ actual, expected }` in the error.
 */
export type Test<Actual, Expected> =
  Equal<Actual, Expected> extends true
    ? true
    : { error: "Type mismatch"; actual: Actual; expected: Expected };

/**
 * Asserts that every element in the tuple is `true`.
 * Use with `Test` to build table-driven type tests:
 *
 * @example
 * type _먹다 = AssertAll<[
 *   Test<Conjugate<먹다, "해요체">,    "먹어요">,
 *   Test<Conjugate<먹다, "과거_평서">, "먹었다">,
 * ]>;
 */
export type AssertAll<T extends true[]> = T;

import type { Conjugate } from "../src/conjugation/conjugate.js";
import type { EndingType } from "../src/conjugation/ending-types.js";
import type { Verb } from "../src/vocabulary/verb.js";

/**
 * Conjugation test helper — specify the verb once, then list `[ending, expected]` pairs.
 *
 * @example
 * type _먹다 = ConjugateTest<먹다, [
 *   ["해요체",    "먹어요"],
 *   ["과거_평서", "먹었다"],
 * ]>;
 */
export type ConjugateTest<
  V extends Verb,
  Cases extends [EndingType, string][],
> = AssertAll<{
  [K in keyof Cases]: Cases[K] extends [
    infer E extends EndingType,
    infer R extends string,
  ]
    ? Test<Conjugate<V, E>, R>
    : never;
}>;
