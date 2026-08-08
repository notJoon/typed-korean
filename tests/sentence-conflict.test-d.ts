import type { WhQuestion } from "../src/sentence/interrogative.js";
import type { SentenceShape } from "../src/sentence/shape.js";
import type { AssertAll, Test } from "./test-utils.js";

type _structured_wh_questions = AssertAll<
  [
    Test<WhQuestion<"누가", { predicate: "갔어요" }>, "누가 갔어요?">,
    Test<
      WhQuestion<"언제" | "왜", { predicate: "왔어요" }>,
      "언제 왔어요?" | "왜 왔어요?"
    >,
    Test<
      WhQuestion<"어디로", { subject: "너는"; predicate: "가요" }>,
      "너는 어디로 가요?"
    >,
    // A declared but value-less optional slot is treated as an empty slot.
    Test<
      WhQuestion<"언제", { time?: string; predicate: "왔어요" }>,
      "언제 왔어요?"
    >,
  ]
>;

type _slot_conflicts = AssertAll<
  [
    Test<
      WhQuestion<"어디서", { locFrom: "서울에서"; predicate: "먹어요" }>,
      { error: "slot conflict"; slot: "locFrom"; existing: "서울에서" }
    >,
    Test<
      WhQuestion<"언제", { time: "어제"; predicate: "왔어요" }>,
      { error: "slot conflict"; slot: "time"; existing: "어제" }
    >,
    Test<
      WhQuestion<"누가", { subject: "나는"; predicate: "갔어요" }>,
      { error: "slot conflict"; slot: "subject"; existing: "나는" }
    >,
  ]
>;

type _shape_contract = AssertAll<
  [Test<{ predicate: "가요" } extends SentenceShape ? true : false, true>]
>;
