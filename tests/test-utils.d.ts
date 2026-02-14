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
