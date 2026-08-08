/**
 * A sentence whose semantic roles remain available to type-level operations.
 *
 * Slot values are surface forms that already include any required particles.
 *
 * @example
 * ```ts
 * const 비가_와요 = { subject: "비가", predicate: "와요" } satisfies SentenceShape;
 * ```
 */
export interface SentenceShape {
  subject?: string;
  time?: string;
  locFrom?: string;
  locTo?: string;
  object?: string;
  manner?: string;
  cause?: string;
  predicate: string;
}
