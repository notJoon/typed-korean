import type { ComposeTable } from "../generated/compose-table.gen.js";
import type {
  ChoTable,
  JongTable,
  JungTable,
} from "../generated/jamo-table.gen.js";
import type { DropLast, IfLiteral, LastChar } from "./string-utils.js";

// C must be one character; longer strings could match across adjacent syllables.
type FindContainingKey<T, C extends string> = {
  [K in keyof T]: T[K] extends `${string}${C}${string}` ? K : never;
}[keyof T];

/**
 * Decompose the last character of a string into its jamo components
 * (choseong, jungseong, jongseong) via reverse-table lookup.
 *
 * Returns `never` if the last character is not a modern Hangul syllable.
 *
 * @example
 * ```ts
 * type R1 = DecomposeLastChar<"먹">;  // { 초: "ㅁ"; 중: "ㅓ"; 종: "ㄱ" }
 * type R2 = DecomposeLastChar<"가">;  // { 초: "ㄱ"; 중: "ㅏ"; 종: null }
 * ```
 */
export type DecomposeLastChar<S extends string> =
  LastChar<S> extends infer C extends string
    ? FindContainingKey<ChoTable, C> extends infer Cho extends string
      ? [Cho] extends [never]
        ? never
        : FindContainingKey<JungTable, C> extends infer Jung extends string
          ? FindContainingKey<JongTable, C> extends infer Jong extends string
            ? {
                초: Cho;
                중: Jung;
                종: Jong extends "NULL" ? null : Jong;
              }
            : never
          : never
      : never
    : never;

type ComposeKey<
  Cho extends string,
  Jung extends string,
  Jong extends string | null,
> = Jong extends null ? `${Cho}_${Jung}` : `${Cho}_${Jung}_${Jong}`;

/**
 * Determine whether the last syllable of `S` has batchim (jongseong).
 *
 * Uses the exhaustive reverse tables, so non-Hangul literals return `never`.
 *
 * Returns:
 * - `true`  if the last syllable is closed (has jongseong)
 * - `false` if the last syllable is open (no jongseong)
 *
 * @example
 * type A = HasBatchim<"밥">;   // true
 * type B = HasBatchim<"사과">; // false
 * type C = HasBatchim<string>; // never
 */
export type HasBatchim<S extends string> = IfLiteral<
  S,
  LastChar<S> extends infer C extends string
    ? FindContainingKey<JongTable, C> extends infer Jong extends string
      ? [Jong] extends [never]
        ? never
        : Jong extends "NULL"
          ? false
          : true
      : never
    : never,
  never
>;

/**
 * Extract the jungseong (medial vowel) of the last syllable in `S`.
 *
 * The last character must exist in the generated reverse tables; otherwise `never`.
 * Broad `string` is blocked by the literal gate.
 *
 * @example
 * type A = LastVowel<"먹">; // "ㅓ"
 * type B = LastVowel<"가">; // "ㅏ"
 * type C = LastVowel<string>; // never
 */
export type LastVowel<S extends string> = IfLiteral<
  S,
  DecomposeLastChar<S> extends infer D extends { 중: string } ? D["중"] : never,
  never
>;

/**
 * Extract the jongseong (final consonant) of the last syllable in `S`.
 *
 * Returns `null` when the syllable is open (no batchim).
 * The last character must exist in the generated reverse tables; otherwise `never`.
 *
 * @example
 * type A = LastJong<"먹">; // "ㄱ"
 * type B = LastJong<"가">; // null
 * type C = LastJong<string>; // never
 */
export type LastJong<S extends string> = IfLiteral<
  S,
  DecomposeLastChar<S> extends infer D extends { 종: string | null }
    ? D["종"]
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
 * Remove the jongseong (final consonant) of the last syllable in `S`,
 * producing an open syllable.
 *
 * Used for ㅎ irregular conditional (ㅎ drop) and ㄹ탈락 processing.
 *
 * @example
 * type A = DropFinalJong<"그렇">; // "그러" (ㅎ removed)
 * type B = DropFinalJong<"살">;   // "사"  (ㄹ removed)
 */
export type DropFinalJong<S extends string> =
  DecomposeLastChar<S> extends infer D extends { 초: string; 중: string }
    ? `${DropLast<S>}${Compose<D["초"], D["중"], null>}`
    : never;

/**
 * Compose a Hangul syllable from compatibility jamo.
 *
 * This is a type-level lookup into generated `ComposeTable`.
 * Returns `never` when the combination is outside the generated cross-product.
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
