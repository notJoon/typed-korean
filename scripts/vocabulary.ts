/**
 * Vocabulary list used as input for codegen.
 *
 * Each entry is `[stem, irregularType, altStem?]`.
 * The codegen script simulates conjugation for each entry to determine
 * which ComposeTable entries are actually needed.
 */

export type IrregularTag =
  | null
  | "ㅂ"
  | "ㄷ"
  | "ㅅ"
  | "ㅎ"
  | "르"
  | "ㅡ"
  | "러"
  | "하";

export type VocabEntry = readonly [
  stem: string,
  irregularType: IrregularTag,
  altStem?: string,
];

export const VERBS: readonly VocabEntry[] = [
  // Regular verbs
  ["먹", null],
  ["가", null],
  ["오", null],
  ["보", null],
  ["주", null],
  ["쓰", null],
  ["뜨", null],
  ["마시", null],
  ["살", null],
  ["읽", null],
  ["잡", null],

  // ㅂ irregular
  ["덥", "ㅂ", "더우"],
  ["춥", "ㅂ", "추우"],
  ["아름답", "ㅂ", "아름다우"],

  // ㄷ irregular
  ["듣", "ㄷ", "들"],
  ["걷", "ㄷ", "걸"],

  // ㅅ irregular
  ["짓", "ㅅ", "지"],
  ["낫", "ㅅ", "나"],

  // 르 irregular
  ["모르", "르", "몰"],
  ["빠르", "르", "빨"],

  // ㅎ irregular
  ["그렇", "ㅎ", "그레"],
  ["어떻", "ㅎ", "어떠"],

  // 하다 verbs
  ["하", "하"],

  // Adjectives (regular)
  ["크", null],
  ["작", null],

  // Adjectives (ㅂ irregular)
  ["가깝", "ㅂ", "가까우"],
];
