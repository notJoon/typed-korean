import type {
  SelectAlternating,
  SelectParticle,
} from "../src/particles/select-particle.js";
import type { AssertAll, Test } from "./test-utils.js";

// ---- SelectAlternating — 받침 유무에 따른 교체 ----

type _받침있음 = AssertAll<
  [
    Test<SelectAlternating<"밥", "topic">, "은">,
    Test<SelectAlternating<"밥", "subject">, "이">,
    Test<SelectAlternating<"밥", "object">, "을">,
    Test<SelectAlternating<"밥", "with">, "과">,
  ]
>;

type _받침없음 = AssertAll<
  [
    Test<SelectAlternating<"사과", "topic">, "는">,
    Test<SelectAlternating<"사과", "subject">, "가">,
    Test<SelectAlternating<"사과", "object">, "를">,
    Test<SelectAlternating<"사과", "with">, "와">,
  ]
>;

// ---- 으로/로 (3-way) ----

type _으로로 = AssertAll<
  [
    Test<SelectParticle<"서울", "instrument">, "로">, // ㄹ exception
    Test<SelectParticle<"부산", "instrument">, "으로">, // general batchim
    Test<SelectParticle<"제주", "instrument">, "로">, // no batchim
  ]
>;

// ---- SelectParticle — alternating ----

type _SP_alternating = AssertAll<
  [
    Test<SelectParticle<"밥", "topic">, "은">,
    Test<SelectParticle<"사과", "topic">, "는">,
    Test<SelectParticle<"밥", "subject">, "이">,
    Test<SelectParticle<"사과", "object">, "를">,
    Test<SelectParticle<"밥", "with">, "과">,
    Test<SelectParticle<"친구", "with">, "와">,
  ]
>;

// ---- SelectParticle — euro ----

type _SP_euro = AssertAll<
  [
    Test<SelectParticle<"서울", "instrument">, "로">,
    Test<SelectParticle<"학교", "direction">, "로">,
    Test<SelectParticle<"부산", "direction">, "으로">,
  ]
>;

// ---- SelectParticle — fixed ----

type _SP_fixed = AssertAll<
  [
    Test<SelectParticle<"학교", "location">, "에">,
    Test<SelectParticle<"서울", "from">, "에서">,
    Test<SelectParticle<"서울", "since">, "부터">,
    Test<SelectParticle<"밥", "until">, "까지">,
    Test<SelectParticle<"사과", "comparison">, "보다">,
  ]
>;

// ---- 겹받침 (double jongseong) ----

type _겹받침 = AssertAll<
  [
    Test<SelectParticle<"닭", "object">, "을">,
    Test<SelectParticle<"흙", "instrument">, "으로">, // ㄺ is not ㄹ
  ]
>;

// ---- 리터럴 게이트 (broad string → never) ----

type _literal_gate = AssertAll<
  [
    Test<SelectAlternating<string, "topic">, never>,
    Test<SelectParticle<string, "instrument">, never>,
    Test<SelectParticle<string, "topic">, never>,
  ]
>;
