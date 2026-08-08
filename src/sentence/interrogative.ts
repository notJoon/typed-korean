import type { Render } from "./render.js";
import type { SentenceShape } from "./shape.js";

/**
 * Appends a question mark to a rendered sentence.
 *
 * @example
 * ```ts
 * type Result = Question<"밥을 먹었어요">;
 * //   ^? "밥을 먹었어요?"
 * ```
 */
export type Question<Body extends string> = `${Body}?`;

/**
 * A wh-word may claim a slot only when it already carries its
 * own particle or is adverbial(부사).
 *
 * Bare forms such as "누구", "무엇" and "어디" drop their particle,
 * so their slot is ambiguous and they stay out of this table.
 */
interface WhSlotMap {
  누가: "subject";
  무엇을: "object";
  뭘: "object";
  언제: "time";
  어디서: "locFrom";
  어디로: "locTo";
  어떻게: "manner";
  왜: "cause";
}

/**
 * A wh-word accepted by {@link WhQuestion}.
 *
 * @example
 * ```ts
 * type QuestionWord = Extract<WhWord, "누가" | "언제">;
 * ```
 */
export type WhWord = keyof WhSlotMap;

type SlotValue<Shape, Slot extends PropertyKey> = Slot extends keyof Shape
  ? Shape[Slot]
  : undefined;

/**
 * A slot counts as free while `undefined` is still part of its value.
 *
 * An optional slot declared as `time?: string` evaluates to
 * `string | undefined` even when absent, so `extends undefined`
 * would misread it as filled.
 */
type StructuredWhQuestion<QWord extends WhWord, Shape extends SentenceShape> =
  undefined extends SlotValue<Shape, WhSlotMap[QWord]>
    ? Question<
        Render<
          Omit<Shape, WhSlotMap[QWord]> & {
            [Slot in WhSlotMap[QWord]]: QWord;
          } & { predicate: Shape["predicate"] }
        >
      >
    : {
        error: "slot conflict";
        slot: WhSlotMap[QWord];
        existing: SlotValue<Shape, WhSlotMap[QWord]>;
      };

/**
 * Builds a wh-question and rejects bodies whose forget slot is already filled.
 *
 * @example
 * ```ts
 * type Result = WhQuestion<"언제", { subject: "비가"; predicate: "와요" }>;
 * //   ^? "비가 언제 와요?"
 *
 * type Conflict = WhQuestion<"언제", { time: "어제"; predicate: "왔어요" }>;
 * //   ^? { error: "slot conflict"; slot: "time"; existing: "어제" }
 * ```
 */
export type WhQuestion<
  QWord extends WhWord,
  Body extends SentenceShape,
> = QWord extends WhWord ? StructuredWhQuestion<QWord, Body> : never;
