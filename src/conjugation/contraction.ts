import type { JamoTable } from "../generated/jamo-table.gen.js";
import type { Compose } from "../hangul-unicode/jamo.js";
import type { DropLast, LastChar } from "../hangul-unicode/string-utils.js";

type LastCharInTable<S extends string> = LastChar<S> & keyof JamoTable;

type ReplaceLastSyllableVowel<
  Stem extends string,
  NewVowel extends string,
  NewJong extends string | null = null,
> =
  LastChar<Stem> extends keyof JamoTable
    ? `${DropLast<Stem>}${Compose<JamoTable[LastCharInTable<Stem>]["초"], NewVowel, NewJong>}`
    : never;

/**
 * Contract stem-final vowel + ending vowel.
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
 * Apply vowel contraction by replacing the final syllable vowel.
 *
 * If no contraction rule exists, fallback to plain concatenation.
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
 * Apply contraction and attach final consonant ㅆ for past tense open stems.
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
 * Insert a jongseong into the final open syllable.
 */
export type InsertFinalJong<Stem extends string, Jong extends string> =
  LastChar<Stem> extends keyof JamoTable
    ? `${DropLast<Stem>}${Compose<
        JamoTable[LastCharInTable<Stem>]["초"],
        JamoTable[LastCharInTable<Stem>]["중"],
        Jong
      >}`
    : never;
