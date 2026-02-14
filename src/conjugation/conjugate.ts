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
 * Choose the effective stem (silhyo eogan, 실효 어간) based on ending class.
 *
 * For vowel-starting endings, irregular verbs switch to their `altStem`
 * (e.g. 덥 -> 더우). For consonant-starting endings, the base `stem` is
 * always used, even for irregular verbs.
 *
 * @typeParam V - The verb type.
 * @typeParam F - The ending type being conjugated.
 *
 * @example
 * ```ts
 * // Regular verb: always returns base stem
 * type R1 = EffectiveStem<먹다, "해요체">;  // "먹"
 * type R2 = EffectiveStem<먹다, "고">;      // "먹"
 *
 * // Irregular verb: altStem for vowel endings, base stem for consonant endings
 * type R3 = EffectiveStem<덥다, "해요체">;  // "더우" (altStem)
 * type R4 = EffectiveStem<덥다, "고">;      // "덥"  (base stem)
 * ```
 */
export type EffectiveStem<
  V extends Verb,
  F extends EndingType,
> = F extends VowelStartingEnding
  ? V extends IrregularVerb<any>
    ? V["altStem"]
    : V["stem"]
  : F extends ConsonantStartingEnding
    ? V["stem"]
    : V["stem"];

/**
 * Present-tense vowel base (e.g. "먹어", "가", "와").
 *
 * - Closed stem (has batchim): append 아/어 as a separate syllable.
 *   "먹" + "어" -> "먹어"
 * - Open stem (no batchim): apply vowel contraction.
 *   "가" + "ㅏ" -> "가", "오" + "ㅏ" -> "와"
 */
type PresentVowelBase<Stem extends string> =
  HasBatchim<Stem> extends true
    ? `${Stem}${아어<Stem>}`
    : ApplyContraction<Stem, 아어Vowel<Stem>>;

/**
 * Past-tense base (e.g. "먹었", "봤", "왔").
 *
 * - Closed stem: append 았/었 as a separate syllable.
 *   "먹" + "었" -> "먹었"
 * - Open stem: apply contraction with ㅆ insertion.
 *   "보" + ㅏ + ㅆ -> "봤"
 */
type PastBase<Stem extends string> =
  HasBatchim<Stem> extends true
    ? `${Stem}${아어Vowel<Stem> extends "ㅏ" ? "았" : "었"}`
    : ApplyPastContraction<Stem, 아어Vowel<Stem>>;

/**
 * Polite formal ending, hapsyoche (합쇼체): "습니다" / "ㅂ니다".
 *
 * - Closed stem: append "습니다".
 *   "먹" -> "먹습니다"
 * - Open stem: insert ㅂ as jongseong, then append "니다".
 *   "가" -> "갑" + "니다" -> "갑니다"
 */
type PoliteFormal<Stem extends string> =
  HasBatchim<Stem> extends true
    ? `${Stem}습니다`
    : `${InsertFinalJong<Stem, "ㅂ">}니다`;

/**
 * Plain present declarative (pyeongseo hyeonjae, 평서 현재): "는다" / "ㄴ다".
 *
 * - Closed stem: append "는다".
 *   "먹" -> "먹는다"
 * - Open stem: insert ㄴ as jongseong, then append "다".
 *   "가" -> "간" + "다" -> "간다"
 */
type PlainPresent<Stem extends string> =
  HasBatchim<Stem> extends true
    ? `${Stem}는다`
    : `${InsertFinalJong<Stem, "ㄴ">}다`;

/**
 * Conditional ending (jogeon, 조건): "으면" / "면".
 *
 * - Closed stem: insert epenthetic "으" before "면".
 *   "먹" -> "먹으면"
 * - Open stem: append "면" directly.
 *   "가" -> "가면"
 */
type Conditional<Stem extends string> =
  HasBatchim<Stem> extends true ? `${Stem}으면` : `${Stem}면`;

/**
 * Conjugate a verb into a selected ending type.
 *
 * This is the main entry point of the conjugation engine. It combines
 * stem selection ({@link EffectiveStem}), vowel harmony ({@link 아어}),
 * contraction ({@link ApplyContraction}), and syllable recomposition
 * ({@link InsertFinalJong}) into a single type-level pipeline.
 *
 * @typeParam V - The verb to conjugate.
 * @typeParam F - The target ending type.
 *
 * @example
 * ```ts
 * // Polite informal (해요체)
 * type R1 = Conjugate<먹다, "해요체">;     // "먹어요"
 * type R2 = Conjugate<가다, "해요체">;     // "가요"   (ㅏ+ㅏ contraction)
 * type R3 = Conjugate<오다, "해요체">;     // "와요"   (ㅗ+ㅏ->ㅘ)
 *
 * // Past declarative
 * type R4 = Conjugate<보다, "과거_평서">;  // "봤다"   (ㅗ+ㅏ->ㅘ+ㅆ)
 * type R5 = Conjugate<먹다, "과거_평서">;  // "먹었다"
 *
 * // Polite formal (합쇼체)
 * type R6 = Conjugate<먹다, "합쇼체">;     // "먹습니다"
 * type R7 = Conjugate<가다, "합쇼체">;     // "갑니다" (ㅂ insertion)
 *
 * // Connective / conditional
 * type R8 = Conjugate<먹다, "고">;         // "먹고"
 * type R9 = Conjugate<먹다, "면">;         // "먹으면" (으 epenthesis)
 * ```
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
