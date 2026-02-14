import type { RegularVerb } from "./verb.js";

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
export type 오다 = RegularVerb & { stem: "오" };
export type 주다 = RegularVerb & { stem: "주" };
export type 쓰다 = RegularVerb & { stem: "쓰" };
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
