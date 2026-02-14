import type { LastVowel } from "../hangul-unicode/jamo.js";

/**
 * Yangseong (bright) vowels.
 */
export type 양성모음 = "ㅏ" | "ㅗ" | "ㅑ" | "ㅛ";

/**
 * Select the connective vowel for a stem: "ㅏ" or "ㅓ".
 */
export type 아어Vowel<Stem extends string> =
  LastVowel<Stem> extends 양성모음 ? "ㅏ" : "ㅓ";

/**
 * Select the connective syllable for a stem: "아" or "어".
 */
export type 아어<Stem extends string> =
  아어Vowel<Stem> extends "ㅏ" ? "아" : "어";
