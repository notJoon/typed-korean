/**
 * Conjugation forms supported in Phase 2.
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
 * Endings that begin with a vowel and may trigger irregular alt stems.
 */
export type VowelStartingEnding = "해요체" | "과거_평서" | "아서";

/**
 * Endings that begin with a consonant and keep the base stem.
 */
export type ConsonantStartingEnding =
  | "합쇼체"
  | "평서_현재"
  | "고"
  | "면"
  | "지만";
