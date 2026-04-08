import type { Adjective } from "./adjective.js";
import type { IrregularVerb, RegularVerb, 하다Verb } from "./verb.js";

/**
 * Regular verb entries for Phase 2.
 *
 * Each entry is an intersection of `RegularVerb` with a literal `stem`,
 * giving the conjugation engine a concrete string to work with.
 *
 * The verbs are chosen to exercise every major contraction pattern:
 *
 * | Verb   | Stem   | Last vowel | Contraction with 아/어      |
 * | ------ | ------ | ---------- | --------------------------- |
 * | 먹다   | "먹"   | ㅓ         | (batchim) no contraction    |
 * | 가다   | "가"   | ㅏ         | ㅏ + ㅏ -> ㅏ (merge)       |
 * | 보다   | "보"   | ㅗ         | ㅗ + ㅏ -> ㅘ (merge)       |
 * | 오다   | "오"   | ㅗ         | ㅗ + ㅏ -> ㅘ (merge)       |
 * | 주다   | "주"   | ㅜ         | ㅜ + ㅓ -> ㅝ (merge)       |
 * | 쓰다   | "쓰"   | ㅡ         | ㅡ + ㅓ -> ㅓ (ㅡ drop)     |
 * | 마시다 | "마시" | ㅣ         | ㅣ + ㅓ -> ㅕ (replace)     |
 * | 살다   | "살"   | ㅏ         | (batchim) no contraction    |
 * | 읽다   | "읽"   | ㅣ         | (batchim) no contraction    |
 * | 잡다   | "잡"   | ㅏ         | (batchim) no contraction    |
 */

export type 먹다 = RegularVerb & { stem: "먹" };
export type 가다 = RegularVerb & { stem: "가" };
export type 보다 = RegularVerb & { stem: "보" };
export type 살다 = RegularVerb & { stem: "살" };
export type 알다 = RegularVerb & { stem: "알" };
export type 만들다 = RegularVerb & { stem: "만들" };
export type 오다 = RegularVerb & { stem: "오" };
export type 주다 = RegularVerb & { stem: "주" };
export type 쓰다 = RegularVerb & { stem: "쓰" };
export type 끄다 = RegularVerb & { stem: "끄" };
export type 세다 = RegularVerb & { stem: "세" };
export type 되다 = RegularVerb & { stem: "되" };
export type 마시다 = RegularVerb & { stem: "마시" };
export type 읽다 = RegularVerb & { stem: "읽" };
export type 잡다 = RegularVerb & { stem: "잡" };

/** Union of all regular verb entries registered in Phase 2. */
export type RegularVerbEntry =
  | 먹다
  | 가다
  | 보다
  | 살다
  | 오다
  | 주다
  | 쓰다
  | 마시다
  | 읽다
  | 잡다;

// ㅂ irregular verbs
export type 덥다 = Adjective &
  IrregularVerb<"ㅂ"> & { stem: "덥"; altStem: "더우" };
export type 춥다 = Adjective &
  IrregularVerb<"ㅂ"> & { stem: "춥"; altStem: "추우" };
export type 아름답다 = Adjective &
  IrregularVerb<"ㅂ"> & {
    stem: "아름답";
    altStem: "아름다우";
  };

// ㄷ irregular verbs
export type 듣다 = IrregularVerb<"ㄷ"> & { stem: "듣"; altStem: "들" };
export type 걷다 = IrregularVerb<"ㄷ"> & { stem: "걷"; altStem: "걸" };

// ㅅ irregular verbs
export type 짓다 = IrregularVerb<"ㅅ"> & { stem: "짓"; altStem: "지" };
export type 낫다 = IrregularVerb<"ㅅ"> & { stem: "낫"; altStem: "나" };

// 르 irregular verbs
export type 모르다 = IrregularVerb<"르"> & { stem: "모르"; altStem: "몰" };
export type 빠르다 = Adjective &
  IrregularVerb<"르"> & { stem: "빠르"; altStem: "빨" };

// ㅎ irregular verbs
export type 그렇다 = Adjective &
  IrregularVerb<"ㅎ"> & { stem: "그렇"; altStem: "그래" };
export type 어떻다 = Adjective &
  IrregularVerb<"ㅎ"> & { stem: "어떻"; altStem: "어때" };

// 러 irregular verbs
export type 이르다 = IrregularVerb<"러"> & { stem: "이르"; altStem: "이르" };
export type 푸르다 = Adjective &
  IrregularVerb<"러"> & { stem: "푸르"; altStem: "푸르" };

// 하다-family verbs
export type 공부하다 = 하다Verb & { prefix: "공부" };
export type 운동하다 = 하다Verb & { prefix: "운동" };

// Irregular adjective sample (ㅂ irregular)
export type 가깝다 = Adjective &
  IrregularVerb<"ㅂ"> & {
    stem: "가깝";
    altStem: "가까우";
  };
