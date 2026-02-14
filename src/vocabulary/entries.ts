import type { RegularVerb } from "./verb.js";

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
