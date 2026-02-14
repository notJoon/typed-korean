import type { Verb } from "./verb.js";

/**
 * Korean adjective (hyeongyongsa, 형용사).
 *
 * Korean adjectives conjugate almost identically to verbs, sharing the same
 * stem + ending structure and the same conjugation patterns. The key
 * differences are limited to the present-tense adnominal form (-는 vs -ㄴ/은)
 * and a few ending restrictions. For this reason, `Adjective` extends `Verb`
 * directly.
 *
 * The `partOfSpeech` tag distinguishes adjectives from verbs at the type
 * level, enabling form-specific branching where needed (e.g. 평서_현재 uses
 * "-는다" for verbs but "-다" for adjectives).
 *
 * @example
 * ```ts
 * // Regular adjective
 * type 크다 = Adjective & RegularVerb & { stem: "크" };
 *
 * // Irregular adjective (ㅂ irregular is common in adjectives)
 * type 가깝다 = Adjective & IrregularVerb<"ㅂ"> & { stem: "가깝"; altStem: "가까우" };
 * ```
 */
export interface Adjective extends Verb {
  partOfSpeech: "adjective";
}
