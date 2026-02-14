import type { HasBatchim } from "../hangul-unicode/jamo.js";
import type { IrregularVerb, Verb } from "../vocabulary/verb.js";
import type {
  ApplyContraction,
  ApplyPastContraction,
  InsertFinalJong,
} from "./contraction.js";
import type {
  ConsonantStartingEnding,
  EndingType,
  VowelStartingEnding,
} from "./ending-types.js";
import type { 아어, 아어Vowel } from "./vowel-harmony.js";

/**
 * Choose effective stem by ending class.
 *
 * Irregular verbs may switch to `altStem` for vowel-starting endings.
 */
export type EffectiveStem<V extends Verb, F extends EndingType> =
  F extends VowelStartingEnding
    ? V extends IrregularVerb<any>
      ? V["altStem"]
      : V["stem"]
    : F extends ConsonantStartingEnding
      ? V["stem"]
      : V["stem"];

type PresentVowelBase<Stem extends string> = HasBatchim<Stem> extends true
  ? `${Stem}${아어<Stem>}`
  : ApplyContraction<Stem, 아어Vowel<Stem>>;

type PastBase<Stem extends string> = HasBatchim<Stem> extends true
  ? `${Stem}${아어Vowel<Stem> extends "ㅏ" ? "았" : "었"}`
  : ApplyPastContraction<Stem, 아어Vowel<Stem>>;

type PoliteFormal<Stem extends string> = HasBatchim<Stem> extends true
  ? `${Stem}습니다`
  : `${InsertFinalJong<Stem, "ㅂ">}니다`;

type PlainPresent<Stem extends string> = HasBatchim<Stem> extends true
  ? `${Stem}는다`
  : `${InsertFinalJong<Stem, "ㄴ">}다`;

type Conditional<Stem extends string> = HasBatchim<Stem> extends true
  ? `${Stem}으면`
  : `${Stem}면`;

/**
 * Conjugate a verb into a selected ending type.
 */
export type Conjugate<V extends Verb, F extends EndingType> = F extends "해요체"
  ? `${PresentVowelBase<EffectiveStem<V, F>>}요`
  : F extends "과거_평서"
    ? `${PastBase<EffectiveStem<V, F>>}다`
    : F extends "합쇼체"
      ? PoliteFormal<EffectiveStem<V, F>>
      : F extends "평서_현재"
        ? PlainPresent<EffectiveStem<V, F>>
        : F extends "고"
          ? `${EffectiveStem<V, F>}고`
          : F extends "아서"
            ? `${PresentVowelBase<EffectiveStem<V, F>>}서`
            : F extends "면"
              ? Conditional<EffectiveStem<V, F>>
              : F extends "지만"
                ? `${EffectiveStem<V, F>}지만`
                : never;
