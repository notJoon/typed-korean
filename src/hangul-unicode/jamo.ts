import type { ComposeTable } from "../generated/compose-table.gen.js";
import type { JamoTable, OpenSyllable } from "../generated/jamo-table.gen.js";
import type { DropLast, IfLiteral, LastChar } from "./string-utils.js";

type LastCharInJamo<S extends string> = LastChar<S> & keyof JamoTable;

type ComposeKey<
  Cho extends string,
  Jung extends string,
  Jong extends string | null,
> = Jong extends null ? `${Cho}_${Jung}` : `${Cho}_${Jung}_${Jong}`;

/**
 * Determine whether the last syllable of `S` has batchim (jongseong).
 *
 * Uses `OpenSyllable` (all Hangul syllables without jongseong) so this works
 * for arbitrary Hangul nouns, not only vocabulary entries in `JamoTable`.
 *
 * Returns:
 * - `true`  if the last syllable is closed (has jongseong)
 * - `false` if the last syllable is open (no jongseong)
 *
 * Known issue:
 * - Non-Hangul literals (e.g. "A") currently evaluate to `true`.
 *   This module intentionally avoids generating an exhaustive closed-syllable
 *   union (10,773 entries) to keep type footprint smaller.
 *
 * @example
 * type A = HasBatchim<"밥">;   // true
 * type B = HasBatchim<"사과">; // false
 * type C = HasBatchim<string>; // never
 */
export type HasBatchim<S extends string> = IfLiteral<
  S,
  LastChar<S> extends OpenSyllable ? false : true,
  never
>;

/**
 * Extract the jungseong (medial vowel) of the last syllable in `S`.
 *
 * The last character must exist in generated `JamoTable`; otherwise `never`.
 * Broad `string` is blocked by the literal gate.
 *
 * @example
 * type A = LastVowel<"먹">; // "ㅓ"
 * type B = LastVowel<"가">; // "ㅏ"
 * type C = LastVowel<string>; // never
 */
export type LastVowel<S extends string> = IfLiteral<
  S,
  LastChar<S> extends keyof JamoTable
    ? JamoTable[LastCharInJamo<S>]["중"]
    : never,
  never
>;

/**
 * Extract the jongseong (final consonant) of the last syllable in `S`.
 *
 * Returns `null` when the syllable is open (no batchim).
 * The last character must exist in generated `JamoTable`; otherwise `never`.
 *
 * @example
 * type A = LastJong<"먹">; // "ㄱ"
 * type B = LastJong<"가">; // null
 * type C = LastJong<string>; // never
 */
export type LastJong<S extends string> = IfLiteral<
  S,
  LastChar<S> extends keyof JamoTable
    ? JamoTable[LastCharInJamo<S>]["종"]
    : never,
  never
>;

/**
 * Extract the jungseong of the second-to-last syllable in `S`.
 *
 * This is mainly used for 르 irregular handling, where harmony depends on
 * the vowel before "르" (e.g., "모르" -> second-to-last vowel is "ㅗ").
 *
 * @example
 * type A = SecondToLastVowel<"모르">; // "ㅗ"
 * type B = SecondToLastVowel<"빠르">; // "ㅏ"
 */
export type SecondToLastVowel<S extends string> = IfLiteral<
  S,
  LastVowel<DropLast<S>>,
  never
>;

/**
 * Compose a Hangul syllable from compatibility jamo.
 *
 * This is a type-level lookup into generated `ComposeTable`.
 * Returns `never` when the combination is not generated for current vocabulary.
 *
 * @example
 * type A = Compose<"ㅇ", "ㅘ", null>; // "와"
 * type B = Compose<"ㅆ", "ㅓ", null>; // "써"
 * type C = Compose<"ㄱ", "ㅏ", "ㄴ">; // "간"
 */
export type Compose<
  Cho extends string,
  Jung extends string,
  Jong extends string | null,
> =
  ComposeKey<Cho, Jung, Jong> extends keyof ComposeTable
    ? ComposeTable[ComposeKey<Cho, Jung, Jong>]
    : never;
