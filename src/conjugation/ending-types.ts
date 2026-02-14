/**
 * Conjugation ending types (eomi yuhyeong, 어미 유형) supported in Phase 2.
 *
 * Each member represents a specific speech level or connective ending:
 *
 * | EndingType   | Description                             | Example          |
 * | ------------ | --------------------------------------- | ---------------- |
 * | "해요체"     | Polite informal (haeyoche)              | 먹어요, 가요     |
 * | "과거_평서"  | Past declarative plain (gwageo pyeongseo)| 먹었다, 봤다    |
 * | "합쇼체"     | Polite formal (hapsyoche)               | 먹습니다, 갑니다 |
 * | "평서_현재"  | Present declarative plain               | 먹는다, 간다     |
 * | "고"         | Conjunctive "and" (-go)                 | 먹고             |
 * | "아서"       | Causal/sequential (-aseo/-eoseo)        | 먹어서, 가서     |
 * | "면"         | Conditional "if" (-myeon)               | 먹으면, 가면     |
 * | "지만"       | Contrastive "but" (-jiman)              | 먹지만           |
 */
export type EndingType =
  | "해요체"
  | "과거_평서"
  | "합쇼체"
  | "평서_현재"
  | "고"
  | "아서"
  | "면"
  | "지만";

/**
 * Endings that begin with a vowel (moeum eomi, 모음 어미).
 *
 * These endings trigger the use of `altStem` for irregular verbs via
 * {@link EffectiveStem}. They also trigger vowel contraction when the stem
 * ends in an open syllable (no batchim).
 *
 * @example
 * ```ts
 * // Regular: EffectiveStem<먹다, "해요체"> -> "먹" (base stem)
 * // Irregular: EffectiveStem<덥다, "해요체"> -> "더우" (altStem)
 * ```
 */
export type VowelStartingEnding = "해요체" | "과거_평서" | "아서";

/**
 * Endings that begin with a consonant (jaeum eomi, 자음 어미).
 *
 * These endings always attach to the base `stem`, even for irregular verbs.
 * No vowel contraction occurs.
 *
 * @example
 * ```ts
 * // Regular: Conjugate<먹다, "고"> -> "먹고"
 * // Irregular: Conjugate<덥다, "고"> -> "덥고" (base stem, not altStem)
 * ```
 */
export type ConsonantStartingEnding =
  | "합쇼체"
  | "평서_현재"
  | "고"
  | "면"
  | "지만";
