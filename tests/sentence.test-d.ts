import type { Noun } from "../src/vocabulary/noun.js";
import type { NounWithParticle } from "../src/phrase/noun-phrase.js";
import type {
  ConnectiveVerbPhrase,
  VerbPhrase,
} from "../src/phrase/verb-phrase.js";
import type { AdjectivePhrase } from "../src/phrase/adjective-phrase.js";
import type {
  DescriptiveStatement,
  IntransitiveStatement,
  Statement,
} from "../src/sentence/sentence.js";
import type {
  ConditionalSentence,
  ConnectedSentence,
  ContrastSentence,
} from "../src/sentence/compound.js";
import type { Question, WhQuestion } from "../src/sentence/interrogative.js";
import type { 먹다, 오다, 덥다, 공부하다 } from "../src/vocabulary/entries.js";
import type { AssertAll, Test, TestNot } from "./test-utils.js";

type _statement_basic = AssertAll<
  [
    Test<Statement<"나는", "밥을", "먹었다">, "나는 밥을 먹었다">,
    Test<IntransitiveStatement<"비가", "온다">, "비가 온다">,
    Test<DescriptiveStatement<"날씨가", "덥다">, "날씨가 덥다">,
  ]
>;

type _compound = AssertAll<
  [
    Test<
      ConnectedSentence<"비가 오고", "바람이 분다">,
      "비가 오고 바람이 분다"
    >,
    Test<
      ConditionalSentence<"비가 오면", "우산을 쓴다">,
      "비가 오면 우산을 쓴다"
    >,
    Test<ContrastSentence<"덥지만", "참을 만하다">, "덥지만 참을 만하다">,
  ]
>;

// ---- 4.9 의문문 ----

type _question = AssertAll<
  [
    Test<Question<"밥을 먹었어요">, "밥을 먹었어요?">,
    Test<WhQuestion<"어디서", "밥을 먹었어요">, "어디서 밥을 먹었어요?">,
    Test<WhQuestion<"왜", "공부해요">, "왜 공부해요?">,
  ]
>;

type _sov = Statement<
  NounWithParticle<Noun<"나">, "topic">,
  NounWithParticle<Noun<"밥">, "object">,
  VerbPhrase<먹다, "과거_평서">
>;

type _intrans = IntransitiveStatement<
  NounWithParticle<Noun<"비">, "subject">,
  VerbPhrase<오다, "해요체">
>;

type _desc = DescriptiveStatement<
  NounWithParticle<Noun<"날씨">, "subject">,
  AdjectivePhrase<덥다, "해요체">
>;

type _connected = ConnectedSentence<
  `${NounWithParticle<Noun<"비">, "subject">} ${ConnectiveVerbPhrase<오다, "고">}`,
  IntransitiveStatement<NounWithParticle<Noun<"바람">, "subject">, "분다">
>;

type _conditional = ConditionalSentence<
  `${NounWithParticle<Noun<"비">, "subject">} ${ConnectiveVerbPhrase<오다, "면">}`,
  IntransitiveStatement<NounWithParticle<Noun<"우산">, "object">, "쓴다">
>;

type _wh = WhQuestion<
  "뭘",
  IntransitiveStatement<
    NounWithParticle<Noun<"너">, "topic">,
    VerbPhrase<공부하다, "해요체">
  >
>;

type _integration = AssertAll<
  [
    Test<_sov, "나는 밥을 먹었다">,
    Test<_intrans, "비가 와요">,
    Test<_desc, "날씨가 더워요">,
    Test<_connected, "비가 오고 바람이 분다">,
    Test<_conditional, "비가 오면 우산을 쓴다">,
    Test<_wh, "뭘 너는 공부해요?">,
  ]
>;

// ---- 실패 케이스 — 기본 문장: 어순/공백 ----

type _statement_fail = AssertAll<
  [
    // SOV가 아닌 다른 어순(SVO 등) 거부
    TestNot<Statement<"나는", "밥을", "먹었다">, "나는 먹었다 밥을">,
    // 공백 누락 거부
    TestNot<Statement<"나는", "밥을", "먹었다">, "나는밥을먹었다">,
    TestNot<IntransitiveStatement<"비가", "온다">, "비가온다">,
    TestNot<DescriptiveStatement<"날씨가", "덥다">, "날씨가덥다">,
    // 서술어 누락 거부
    TestNot<Statement<"나는", "밥을", "먹었다">, "나는 밥을">,
  ]
>;

// ---- 실패 케이스 — 복합문: 잘못된 결합 ----

type _compound_fail = AssertAll<
  [
    // 절 순서가 바뀌면 다른 문장
    TestNot<
      ConnectedSentence<"비가 오고", "바람이 분다">,
      "바람이 분다 비가 오고"
    >,
    // 공백 누락
    TestNot<
      ConditionalSentence<"비가 오면", "우산을 쓴다">,
      "비가 오면우산을 쓴다"
    >,
    // 다른 연결어미는 동일 문자열이 아님
    TestNot<ContrastSentence<"덥지만", "참을 만하다">, "덥고 참을 만하다">,
  ]
>;

// ---- 실패 케이스 — 의문문: 물음표/의문사 ----

type _question_fail = AssertAll<
  [
    // 물음표 누락 거부
    TestNot<Question<"밥을 먹었어요">, "밥을 먹었어요">,
    // 의문사 누락 거부
    TestNot<WhQuestion<"어디서", "밥을 먹었어요">, "밥을 먹었어요?">,
    // 의문사와 본문 사이 공백 누락 거부
    TestNot<WhQuestion<"왜", "공부해요">, "왜공부해요?">,
    // 물음표 두 번 거부
    TestNot<Question<"밥을 먹었어요">, "밥을 먹었어요??">,
  ]
>;

// ---- 실패 케이스 — 통합: 조사/활용 잘못 결합 거부 ----

type _integration_fail = AssertAll<
  [
    // 받침 있는 "밥"은 "밥을"이어야 하며, "밥를"은 거부
    TestNot<_sov, "나는 밥를 먹었다">,
    // "비가" (주격)여야 하며, "비는"은 거부
    TestNot<_intrans, "비는 와요">,
    // "덥다"의 해요체는 "더워요"여야 하며, 평서형 "덥다"는 거부
    TestNot<_desc, "날씨가 덥다">,
    // 연결어미 "고"가 아닌 다른 형태는 거부
    TestNot<_connected, "비가 와고 바람이 분다">,
    // "면" 조건절이 다른 어미로 바뀌면 거부
    TestNot<_conditional, "비가 오지만 우산을 쓴다">,
    // 물음표 누락 거부
    TestNot<_wh, "뭘 너는 공부해요">,
  ]
>;
