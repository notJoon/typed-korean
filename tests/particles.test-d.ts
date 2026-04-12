import type {
  SelectAlternating,
  SelectParticle,
} from "../src/particles/select-particle.js";
import type { Equal, Expect } from "./test-utils.js";

// ---- 은/는 (topic) ----

type _은는_밥 = Expect<Equal<SelectAlternating<"밥", "topic">, "은">>;
type _은는_사과 = Expect<Equal<SelectAlternating<"사과", "topic">, "는">>;

// ---- 이/가 (subject) ----

type _이가_밥 = Expect<Equal<SelectAlternating<"밥", "subject">, "이">>;
type _이가_사과 = Expect<Equal<SelectAlternating<"사과", "subject">, "가">>;

// ---- 을/를 (object) ----

type _을를_밥 = Expect<Equal<SelectAlternating<"밥", "object">, "을">>;
type _을를_사과 = Expect<Equal<SelectAlternating<"사과", "object">, "를">>;

// ---- 과/와 (with) ----

type _과와_밥 = Expect<Equal<SelectAlternating<"밥", "with">, "과">>;
type _과와_사과 = Expect<Equal<SelectAlternating<"사과", "with">, "와">>;

// ---- 으로/로 (3-way) ----

type _으로로_서울 = Expect<Equal<SelectParticle<"서울", "instrument">, "로">>; // ㄹ exception
type _으로로_부산 = Expect<Equal<SelectParticle<"부산", "instrument">, "으로">>; // general batchim
type _으로로_제주 = Expect<Equal<SelectParticle<"제주", "instrument">, "로">>; // no batchim

// ---- SelectParticle — alternating ----

type _SP_topic_밥 = Expect<Equal<SelectParticle<"밥", "topic">, "은">>;
type _SP_topic_사과 = Expect<Equal<SelectParticle<"사과", "topic">, "는">>;
type _SP_subject_밥 = Expect<Equal<SelectParticle<"밥", "subject">, "이">>;
type _SP_object_사과 = Expect<Equal<SelectParticle<"사과", "object">, "를">>;
type _SP_with_밥 = Expect<Equal<SelectParticle<"밥", "with">, "과">>;
type _SP_with_친구 = Expect<Equal<SelectParticle<"친구", "with">, "와">>;

// ---- SelectParticle — euro ----

type _SP_instrument_서울 = Expect<Equal<SelectParticle<"서울", "instrument">, "로">>;
type _SP_direction_학교 = Expect<Equal<SelectParticle<"학교", "direction">, "로">>;
type _SP_direction_부산 = Expect<Equal<SelectParticle<"부산", "direction">, "으로">>;

// ---- SelectParticle — fixed ----

type _SP_location = Expect<Equal<SelectParticle<"학교", "location">, "에">>;
type _SP_from = Expect<Equal<SelectParticle<"서울", "from">, "에서">>;
type _SP_since = Expect<Equal<SelectParticle<"서울", "since">, "부터">>;
type _SP_until = Expect<Equal<SelectParticle<"밥", "until">, "까지">>;
type _SP_comparison = Expect<Equal<SelectParticle<"사과", "comparison">, "보다">>;

// ---- 겹받침 (double jongseong) ----

type _겹받침_을를_닭 = Expect<Equal<SelectParticle<"닭", "object">, "을">>;
type _겹받침_으로로_흙 = Expect<Equal<SelectParticle<"흙", "instrument">, "으로">>; // ㄺ is not ㄹ

// ---- 리터럴 게이트 (broad string → never) ----

type _gate_은는 = Expect<Equal<SelectAlternating<string, "topic">, never>>;
type _gate_으로로 = Expect<Equal<SelectParticle<string, "instrument">, never>>;
type _gate_SP = Expect<Equal<SelectParticle<string, "topic">, never>>;
