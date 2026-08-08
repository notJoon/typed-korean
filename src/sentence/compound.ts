import type { Join } from "./sentence.js";

/**
 * Joins a connective clause and the clause that follows it.
 *
 * @example
 * ```ts
 * type Result = ConnectedSentence<"비가 오고", "바람이 분다">;
 * //   ^? "비가 오고 바람이 분다"
 * ```
 */
export type ConnectedSentence<
  Clause1 extends string,
  Clause2 extends string,
> = Join<Clause1, Clause2>;

/**
 * Joins a conditional clause and its result.
 *
 * @example
 * ```ts
 * type Result = ConditionalSentence<"비가 오면", "우산을 쓴다">;
 * //   ^? "비가 오면 우산을 쓴다"
 * ```
 */
export type ConditionalSentence<
  Cond extends string,
  Result extends string,
> = Join<Cond, Result>;

/**
 * Joins two clauses that express a contrast.
 *
 * @example
 * ```ts
 * type Result = ContrastSentence<"덥지만", "참을 만하다">;
 * //   ^? "덥지만 참을 만하다"
 * ```
 */
export type ContrastSentence<A extends string, B extends string> = Join<A, B>;
