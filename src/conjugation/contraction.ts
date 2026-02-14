import type { JamoTable } from "../generated/jamo-table.gen.js";
import type { Compose } from "../hangul-unicode/jamo.js";
import type { DropLast, LastChar } from "../hangul-unicode/string-utils.js";

type LastCharInTable<S extends string> = LastChar<S> & keyof JamoTable;

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
  LastChar<Stem> extends keyof JamoTable
    ? `${DropLast<Stem>}${Compose<JamoTable[LastCharInTable<Stem>]["초"], NewVowel, NewJong>}`
    : never;

/**
 * Vowel contraction rules (moeum chuknyak, 모음 축약).
 *
 * When a stem-final vowel meets an ending-initial vowel, they contract into
 * a single vowel. The `type` field documents the linguistic category:
 *
 * - `"merge"`: both vowels combine into a compound vowel or one absorbs
 *   the other (e.g. ㅗ + ㅏ -> ㅘ, ㅏ + ㅏ -> ㅏ).
 * - `"replace"`: the stem vowel is dropped and replaced by the contracted
 *   result (e.g. ㅡ + ㅓ -> ㅓ where ㅡ drops entirely).
 * - `"none"`: no contraction rule applies; the ending is appended as-is.
 *
 * | Stem vowel | Ending vowel | Result | Type    | Example           |
 * | ---------- | ------------ | ------ | ------- | ----------------- |
 * | ㅏ         | ㅏ           | ㅏ     | merge   | 가 + 아 -> 가     |
 * | ㅗ         | ㅏ           | ㅘ     | merge   | 오 + 아 -> 와     |
 * | ㅜ         | ㅓ           | ㅝ     | merge   | 주 + 어 -> 줘     |
 * | ㅡ         | ㅓ           | ㅓ     | replace | 쓰 + 어 -> 써     |
 * | ㅣ         | ㅓ           | ㅕ     | replace | 마시 + 어 -> 마셔 |
 * | ㅐ         | ㅓ           | ㅐ     | merge   | 보내 + 어 -> 보내 |
 */
export type Contract<StemVowel extends string, EndingVowel extends string> = [
  StemVowel,
  EndingVowel,
] extends ["ㅏ", "ㅏ"]
  ? { result: "ㅏ"; type: "merge" }
  : [StemVowel, EndingVowel] extends ["ㅗ", "ㅏ"]
    ? { result: "ㅘ"; type: "merge" }
    : [StemVowel, EndingVowel] extends ["ㅜ", "ㅓ"]
      ? { result: "ㅝ"; type: "merge" }
      : [StemVowel, EndingVowel] extends ["ㅡ", "ㅓ"]
        ? { result: "ㅓ"; type: "replace" }
        : [StemVowel, EndingVowel] extends ["ㅣ", "ㅓ"]
          ? { result: "ㅕ"; type: "replace" }
          : [StemVowel, EndingVowel] extends ["ㅐ", "ㅓ"]
            ? { result: "ㅐ"; type: "merge" }
            : { result: null; type: "none" };

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
export type ApplyContraction<Stem extends string, EndingVowel extends string> =
  Contract<JamoTable[LastCharInTable<Stem>]["중"], EndingVowel> extends {
    result: infer Result;
  }
    ? Result extends string
      ? ReplaceLastSyllableVowel<Stem, Result>
      : `${Stem}${EndingVowel}`
    : `${Stem}${EndingVowel}`;

/**
 * Apply vowel contraction for past tense, inserting jongseong ㅆ into the
 * contracted syllable.
 *
 * Works like {@link ApplyContraction} but passes `"ㅆ"` as the final
 * consonant to `ReplaceLastSyllableVowel`, producing the past-tense base
 * (e.g. "봤", "왔") in a single step.
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
> =
  Contract<JamoTable[LastCharInTable<Stem>]["중"], EndingVowel> extends {
    result: infer Result;
  }
    ? Result extends string
      ? ReplaceLastSyllableVowel<Stem, Result, "ㅆ">
      : `${Stem}${EndingVowel extends "ㅏ" ? "았" : "었"}`
    : `${Stem}${EndingVowel extends "ㅏ" ? "았" : "었"}`;

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
  LastChar<Stem> extends keyof JamoTable
    ? `${DropLast<Stem>}${Compose<
        JamoTable[LastCharInTable<Stem>]["초"],
        JamoTable[LastCharInTable<Stem>]["중"],
        Jong
      >}`
    : never;
