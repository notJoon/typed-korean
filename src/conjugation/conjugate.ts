import type { Compose, HasBatchim } from "../hangul-unicode/jamo.js";
import type { Adjective } from "../vocabulary/adjective.js";
import type { IrregularType, IrregularVerb, Verb } from "../vocabulary/verb.js";
import type { 하다Verb } from "../vocabulary/verb.js";
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
import type { 르아어Vowel, 아어, 아어Vowel } from "./vowel-harmony.js";

/**
 * Choose the effective stem (silhyo eogan, 실효 어간) based on ending class.
 *
 * For vowel-starting endings, irregular verbs switch to their `altStem`
 * (e.g. 덥 -> 더우). For all other endings, the base `stem` is always used.
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
  ? V extends IrregularVerb<IrregularType>
    ? V["altStem"]
    : V["stem"]
  : F extends ConsonantStartingEnding
    ? V["stem"]
    : never;

/**
 * Present-tense vowel base (e.g. "먹어", "가", "와").
 *
 * - Closed stem (has batchim): append 아/어 as a separate syllable.
 *   "먹" + "어" -> "먹어"
 * - Open stem (no batchim): apply vowel contraction.
 *   "가" + "ㅏ" -> "가", "오" + "ㅏ" -> "와"
 */
type PresentVowelBase<V extends Verb, Stem extends string> =
  V extends IrregularVerb<"ㅅ">
    ? `${Stem}${아어<Stem>}`
    : HasBatchim<Stem> extends true
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
type PastBase<V extends Verb, Stem extends string> =
  V extends IrregularVerb<"ㅅ">
    ? `${Stem}${아어Vowel<Stem> extends "ㅏ" ? "았" : "었"}`
    : HasBatchim<Stem> extends true
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
 * Conjugation rule table for 하다 verbs.
 *
 * 하다 uses "여" as the connective and contracts to "해". Since 하다 verbs
 * are prefix + 하다 compounds (e.g. 공부 + 하다), the prefix is prepended to
 * every conjugated form.
 */
type 하다ConjugationMap<Prefix extends string> = {
  해요체: `${Prefix}해요`;
  과거_평서: `${Prefix}했다`;
  합쇼체: `${Prefix}합니다`;
  평서_현재: `${Prefix}한다`;
  고: `${Prefix}하고`;
  아서: `${Prefix}해서`;
  면: `${Prefix}하면`;
  지만: `${Prefix}하지만`;
};

/**
 * Present-tense vowel base for 르 irregular verbs.
 *
 * 르 irregular verbs use "라/러" rather than "아/어". The choice between
 * "라" and "러" is decided by vowel harmony on the original stem.
 */
type 르PresentVowelBase<
  OrigStem extends string,
  AltStem extends string,
> = `${AltStem}${Compose<"ㄹ", 르아어Vowel<OrigStem>, null>}`;

/** Past-tense base for 르 irregular verbs. */
type 르PastBase<
  OrigStem extends string,
  AltStem extends string,
> = `${AltStem}${Compose<"ㄹ", 르아어Vowel<OrigStem>, "ㅆ">}`;

/** Vowel-starting endings for 르 irregular verbs. */
type 르VowelConjugationMap<OrigStem extends string, AltStem extends string> = {
  해요체: `${르PresentVowelBase<OrigStem, AltStem>}요`;
  과거_평서: `${르PastBase<OrigStem, AltStem>}다`;
  아서: `${르PresentVowelBase<OrigStem, AltStem>}서`;
};

/**
 * Conjugation rule table mapping each {@link EndingType} to its result.
 *
 * This mapped type replaces a deep conditional chain with a single object
 * lookup, making it easy to add new endings and reducing the compiler's
 * branching depth.
 *
 * @typeParam S - The effective stem, pre-computed once by {@link Conjugate}.
 */
type ConjugationMap<V extends Verb, S extends string> = {
  해요체: `${PresentVowelBase<V, S>}요`;
  과거_평서: `${PastBase<V, S>}다`;
  합쇼체: PoliteFormal<S>;
  평서_현재: V extends Adjective ? `${V["stem"]}다` : PlainPresent<S>;
  고: `${S}고`;
  아서: `${PresentVowelBase<V, S>}서`;
  면: Conditional<S>;
  지만: `${S}지만`;
};

/**
 * Conjugate a verb into a selected ending type.
 *
 * This is the main entry point of the conjugation engine. It computes the
 * effective stem once via `infer S`, then indexes into
 * {@link ConjugationMap} to produce the result. This avoids redundant
 * `EffectiveStem` evaluations and keeps the branching depth shallow.
 *
 * The pipeline combines stem selection ({@link EffectiveStem}), vowel
 * harmony ({@link 아어}), contraction ({@link ApplyContraction}), and
 * syllable recomposition ({@link InsertFinalJong}).
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
export type Conjugate<V extends Verb, F extends EndingType> = V extends 하다Verb
  ? F extends keyof 하다ConjugationMap<V["prefix"]>
    ? 하다ConjugationMap<V["prefix"]>[F]
    : never
  : V extends IrregularVerb<"르">
    ? F extends VowelStartingEnding
      ? F extends keyof 르VowelConjugationMap<V["stem"], V["altStem"]>
        ? 르VowelConjugationMap<V["stem"], V["altStem"]>[F]
        : never
      : ConjugationMap<V, V["stem"]>[F & keyof ConjugationMap<V, V["stem"]>]
    : EffectiveStem<V, F> extends infer S extends string
      ? F extends keyof ConjugationMap<V, S>
        ? ConjugationMap<V, S>[F]
        : never
      : never;
