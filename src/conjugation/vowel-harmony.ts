import type { LastVowel } from "../hangul-unicode/jamo.js";

/**
 * Bright vowels (yangseong moeum, 양성모음).
 *
 * In Korean vowel harmony (moeum johwa, 모음조화), stems whose last vowel
 * is a bright vowel take "아" as the connective, while all other stems
 * take "어".
 *
 * The four bright vowels are ㅏ, ㅗ and their y-glide variants ㅑ, ㅛ.
 */
export type 양성모음 = "ㅏ" | "ㅗ" | "ㅑ" | "ㅛ";

/**
 * Determine the connective vowel for a stem: "ㅏ" or "ㅓ".
 *
 * Returns the raw vowel jamo rather than a full syllable. This is consumed
 * by {@link ApplyContraction} and {@link ApplyPastContraction} to decide
 * which contraction rule to apply.
 *
 * @typeParam Stem - The verb stem (e.g. `"먹"`, `"가"`, `"오"`).
 *
 * @example
 * ```ts
 * type R1 = 아어Vowel<"가">;  // "ㅏ" (ㅏ is yangseong)
 * type R2 = 아어Vowel<"먹">;  // "ㅓ" (ㅓ is not yangseong)
 * type R3 = 아어Vowel<"오">;  // "ㅏ" (ㅗ is yangseong)
 * ```
 */
export type 아어Vowel<Stem extends string> =
  LastVowel<Stem> extends 양성모음 ? "ㅏ" : "ㅓ";

/**
 * Determine the connective syllable for a stem: "아" or "어".
 *
 * This is the syllable-level counterpart of {@link 아어Vowel}. Used when
 * the connective is appended as a standalone syllable (e.g. stems with
 * batchim: "먹" + "어" -> "먹어").
 *
 * @typeParam Stem - The verb stem.
 *
 * @example
 * ```ts
 * type R1 = 아어<"먹">;  // "어"
 * type R2 = 아어<"잡">;  // "아"
 * ```
 */
export type 아어<Stem extends string> =
  아어Vowel<Stem> extends "ㅏ" ? "아" : "어";
