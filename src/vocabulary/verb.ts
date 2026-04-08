export type { IrregularType, IrregularVerb, 하다Verb } from "./irregular.js";

/**
 * Base shape of a Korean verb (dongsa, 동사).
 *
 * Every Korean verb consists of a stem (eogan, 어간) and the dictionary
 * ending "다". The stem carries the core meaning while "다" marks the
 * dictionary (citation) form.
 *
 * @example
 * ```ts
 * // "먹다" (to eat): stem = "먹", ending = "다"
 * type 먹다 = RegularVerb & { stem: "먹" };
 * ```
 */
export interface Verb {
  stem: string;
  ending: "다";
}

/**
 * Regular verb (gyuchik dongsa, 규칙 동사).
 *
 * Regular verbs follow predictable conjugation patterns without any stem
 * alternation. The `irregularType` field is set to `never` so that
 * `RegularVerb` and `IrregularVerb` are mutually exclusive at the type level.
 *
 * @example
 * ```ts
 * type 먹다 = RegularVerb & { stem: "먹" };
 * type 가다 = RegularVerb & { stem: "가" };
 * ```
 */
export interface RegularVerb extends Verb {
  irregularType?: never;
}
