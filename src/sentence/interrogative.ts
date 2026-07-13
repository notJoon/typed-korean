import type { Join } from "./sentence.js";

/**
 * Interrogative sentences.
 *
 * - `Question<Body>` appends `"?"` to any statement body
 * - `WhQuestion<QWord, Body>` prepends a wh-word and appends `"?"`
 */

export type WhWord =
  | "누가"
  | "누구"
  | "무엇"
  | "무엇을"
  | "뭘"
  | "어디"
  | "어디서"
  | "언제"
  | "왜"
  | "어떻게";

export type Question<Body extends string> = `${Body}?`;

export type WhQuestion<
  QWord extends WhWord,
  Body extends string,
> = Question<Join<QWord, Body>>;
