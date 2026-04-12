import type { Noun } from "../src/vocabulary/noun.js";
import type {
  NounPhrase,
  NounWithParticle,
} from "../src/phrase/noun-phrase.js";
import type { AssertAll, Test, TestNot } from "./test-utils.js";

type _NounWithParticle = AssertAll<
  [
    Test<NounWithParticle<Noun<"나">, "topic">, "나는">,
    Test<NounWithParticle<Noun<"밥">, "object">, "밥을">,
    Test<NounWithParticle<Noun<"학교">, "direction">, "학교로">,
    Test<NounWithParticle<Noun<"서울">, "instrument">, "서울로">,
    Test<NounWithParticle<Noun<"친구">, "with">, "친구와">,
    Test<NounWithParticle<Noun<"집">, "with">, "집과">,
  ]
>;

type _고정형 = AssertAll<
  [
    Test<NounWithParticle<Noun<"학교">, "location">, "학교에">,
    Test<NounWithParticle<Noun<"서울">, "from">, "서울에서">,
    Test<NounWithParticle<Noun<"월요일">, "since">, "월요일부터">,
    Test<NounWithParticle<Noun<"금요일">, "until">, "금요일까지">,
    Test<NounWithParticle<Noun<"사과">, "comparison">, "사과보다">,
  ]
>;

// ---- NounPhrase — 문자열 직접 입력 단축형 ----

type _NounPhrase = AssertAll<
  [
    Test<NounPhrase<"나", "topic">, "나는">,
    Test<NounPhrase<"밥", "object">, "밥을">,
    Test<NounPhrase<"서울", "instrument">, "서울로">,
    Test<NounPhrase<"학교", "location">, "학교에">,
  ]
>;

// ---- 리터럴 게이트 — broad string → never 전파 ----

type _literal_gate = AssertAll<
  [
    Test<NounPhrase<string, "topic">, `${string}${never}`>,
    Test<NounWithParticle<Noun, "topic">, `${string}${never}`>,
  ]
>;

// ---- 실패 케이스 — 반대 조사가 선택되지 않는지 검증 ----

type _반대조사 = AssertAll<
  [
    TestNot<NounWithParticle<Noun<"나">, "topic">, "나은">,
    TestNot<NounWithParticle<Noun<"밥">, "topic">, "밥는">,
    TestNot<NounWithParticle<Noun<"밥">, "object">, "밥를">,
    TestNot<NounWithParticle<Noun<"친구">, "object">, "친구을">,
    TestNot<NounWithParticle<Noun<"친구">, "with">, "친구과">,
    TestNot<NounWithParticle<Noun<"집">, "with">, "집와">,
    TestNot<NounWithParticle<Noun<"밥">, "subject">, "밥가">,
    TestNot<NounWithParticle<Noun<"사과">, "subject">, "사과이">,
  ]
>;

// ---- 실패 케이스 — 으로/로 경계 ----

type _으로로_반대 = AssertAll<
  [
    TestNot<NounWithParticle<Noun<"서울">, "instrument">, "서울으로">,
    TestNot<NounWithParticle<Noun<"부산">, "instrument">, "부산로">,
    TestNot<NounPhrase<"서울", "direction">, "서울으로">,
    TestNot<NounPhrase<"부산", "direction">, "부산로">,
  ]
>;

// ---- 실패 케이스 — 명사구와 단순 명사가 다름 ----

type _명사구_불일치 = AssertAll<
  [
    TestNot<NounWithParticle<Noun<"밥">, "topic">, "밥">,
    TestNot<NounPhrase<"사과", "object">, "사과">,
  ]
>;
