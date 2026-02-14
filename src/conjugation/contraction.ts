import type { Compose, DecomposeLastChar } from "../hangul-unicode/jamo.js";
import type { DropLast } from "../hangul-unicode/string-utils.js";

/**
 * Replace the vowel (jungseong) of the last syllable in a stem while
 * preserving its initial consonant (choseong). Optionally inserts a final
 * consonant (jongseong).
 *
 * This is the core mechanic behind vowel contraction: decompose the last
 * syllable, swap the vowel, and recompose via {@link Compose}.
 *
 * @typeParam Stem - The full stem string.
 * @typeParam NewVowel - The replacement jungseong jamo.
 * @typeParam NewJong - Optional jongseong to insert (used by past tense for ㅆ).
 *
 * @example
 * ```ts
 * // "오" (ㅇ+ㅗ) with new vowel ㅘ -> Compose<"ㅇ","ㅘ",null> -> "와"
 * type R1 = ReplaceLastSyllableVowel<"오", "ㅘ">;  // "와"
 *
 * // "보" (ㅂ+ㅗ) with new vowel ㅘ and jong ㅆ -> Compose<"ㅂ","ㅘ","ㅆ"> -> "봤"
 * type R2 = ReplaceLastSyllableVowel<"보", "ㅘ", "ㅆ">;  // "봤"
 * ```
 */
type ReplaceLastSyllableVowel<
  Stem extends string,
  NewVowel extends string,
  NewJong extends string | null = null,
> =
  DecomposeLastChar<Stem> extends infer D extends { 초: string }
    ? `${DropLast<Stem>}${Compose<D["초"], NewVowel, NewJong>}`
    : never;

/**
 * Vowel contraction rule table (moeum chuknyak, 모음 축약).
 *
 * Maps a `"StemVowel_EndingVowel"` key to the contracted result vowel.
 * When a key is absent, no contraction applies and the ending is appended
 * as-is.
 *
 * | Key   | Result | Example         |
 * | ----- | ------ | --------------- |
 * | ㅏ_ㅏ  | ㅏ     | 가 + 아 -> 가     |
 * | ㅗ_ㅏ  | ㅘ     | 오 + 아 -> 와     |
 * | ㅜ_ㅓ  | ㅝ     | 주 + 어 -> 줘     |
 * | ㅡ_ㅓ  | ㅓ     | 쓰 + 어 -> 써     |
 * | ㅣ_ㅓ  | ㅕ     | 마시 + 어 -> 마셔  |
 * | ㅐ_ㅓ  | ㅐ     | 보내 + 어 -> 보내  |
 */
export type ContractionTable = {
  ㅏ_ㅏ: "ㅏ";
  ㅗ_ㅏ: "ㅘ";
  ㅜ_ㅓ: "ㅝ";
  ㅡ_ㅓ: "ㅓ";
  ㅣ_ㅓ: "ㅕ";
  ㅐ_ㅓ: "ㅐ";
};

/**
 * Look up the contraction result for a stem vowel + ending vowel pair.
 *
 * Returns the contracted vowel if a rule exists in {@link ContractionTable},
 * or `null` if no contraction applies.
 *
 * @example
 * ```ts
 * type R1 = Contract<"ㅗ", "ㅏ">;  // "ㅘ"
 * type R2 = Contract<"ㅡ", "ㅓ">;  // "ㅓ"
 * type R3 = Contract<"ㅔ", "ㅓ">;  // null (no rule)
 * ```
 */
export type Contract<
  StemVowel extends string,
  EndingVowel extends string,
> = `${StemVowel}_${EndingVowel}` extends keyof ContractionTable
  ? ContractionTable[`${StemVowel}_${EndingVowel}`]
  : null;

/**
 * Core contraction logic shared by present and past tense.
 *
 * Looks up the stem's last vowel, runs {@link Contract}, and recomposes
 * the syllable. The `Jong` parameter controls whether a final consonant
 * is inserted (past tense passes `"ㅆ"`, present passes `null`).
 *
 * @typeParam Stem - The verb stem (must end in an open syllable).
 * @typeParam EndingVowel - The vowel jamo of the ending ("ㅏ" or "ㅓ").
 * @typeParam Jong - Jongseong to insert, or `null` for present tense.
 * @typeParam Fallback - What to return when no contraction rule applies.
 */
type ApplyContractionBase<
  Stem extends string,
  EndingVowel extends string,
  Jong extends string | null,
  Fallback extends string,
> =
  DecomposeLastChar<Stem> extends infer D extends { 중: string }
    ? Contract<D["중"], EndingVowel> extends infer V extends string
      ? ReplaceLastSyllableVowel<Stem, V, Jong>
      : Fallback
    : Fallback;

/**
 * Apply vowel contraction to a stem and produce the contracted syllable(s).
 *
 * Pipeline:
 * 1. Look up the stem's last vowel from `JamoTable`.
 * 2. Run {@link Contract} against the ending vowel.
 * 3. If a contraction exists, call `ReplaceLastSyllableVowel` to recompose
 *    the syllable with the new vowel.
 * 4. If no contraction, fall back to plain concatenation.
 *
 * @typeParam Stem - The verb stem (must end in an open syllable).
 * @typeParam EndingVowel - The vowel jamo of the ending ("ㅏ" or "ㅓ").
 *
 * @example
 * ```ts
 * type R1 = ApplyContraction<"가", "ㅏ">;  // "가" (ㅏ+ㅏ merge)
 * type R2 = ApplyContraction<"오", "ㅏ">;  // "와" (ㅗ+ㅏ -> ㅘ)
 * type R3 = ApplyContraction<"쓰", "ㅓ">;  // "써" (ㅡ drop -> ㅓ)
 * ```
 */
export type ApplyContraction<
  Stem extends string,
  EndingVowel extends string,
> = ApplyContractionBase<Stem, EndingVowel, null, `${Stem}${EndingVowel}`>;

/**
 * Apply vowel contraction for past tense, inserting jongseong ㅆ into the
 * contracted syllable.
 *
 * Works like {@link ApplyContraction} but passes `"ㅆ"` as the final
 * consonant, producing the past-tense base (e.g. "봤", "왔") in a single step.
 *
 * @typeParam Stem - The verb stem (must end in an open syllable).
 * @typeParam EndingVowel - The vowel jamo of the ending ("ㅏ" or "ㅓ").
 *
 * @example
 * ```ts
 * type R1 = ApplyPastContraction<"보", "ㅏ">;  // "봤" (ㅗ+ㅏ->ㅘ + ㅆ)
 * type R2 = ApplyPastContraction<"오", "ㅏ">;  // "왔" (ㅗ+ㅏ->ㅘ + ㅆ)
 * type R3 = ApplyPastContraction<"쓰", "ㅓ">;  // "썼" (ㅡ drop->ㅓ + ㅆ)
 * ```
 */
export type ApplyPastContraction<
  Stem extends string,
  EndingVowel extends string,
> = ApplyContractionBase<
  Stem,
  EndingVowel,
  "ㅆ",
  `${Stem}${EndingVowel extends "ㅏ" ? "았" : "었"}`
>;

/**
 * Insert a jongseong (final consonant) into the last open syllable of a stem.
 *
 * Used by 합쇼체 (ㅂ insertion: "가" -> "갑") and 평서_현재 (ㄴ insertion:
 * "가" -> "간"). The stem's last syllable must be open (no existing batchim).
 *
 * @typeParam Stem - The verb stem ending in an open syllable.
 * @typeParam Jong - The jongseong jamo to insert (e.g. `"ㅂ"`, `"ㄴ"`).
 *
 * @example
 * ```ts
 * type R1 = InsertFinalJong<"가", "ㅂ">;  // "갑" (for 합쇼체: 갑니다)
 * type R2 = InsertFinalJong<"가", "ㄴ">;  // "간" (for 평서_현재: 간다)
 * ```
 */
export type InsertFinalJong<Stem extends string, Jong extends string> =
  DecomposeLastChar<Stem> extends infer D extends { 초: string; 중: string }
    ? `${DropLast<Stem>}${Compose<D["초"], D["중"], Jong>}`
    : never;
