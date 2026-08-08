/**
 * 주체 높임 선어말어미 -(으)시- 타입 테스트
 *
 * `Honorific<V>` 는 시-어간을 만들어 `Conjugate` 에 다시 넣는 구조이므로,
 * 어미 8종이 기존 파이프라인에서 그대로 나오는지 확인한다.
 */

import type { Conjugate, Honorific } from "../src/conjugation/conjugate.js";
import type {
  가다,
  공부하다,
  그렇다,
  덥다,
  듣다,
  만들다,
  먹다,
  모르다,
  살다,
  쓰다,
  이르다,
  짓다,
} from "../src/vocabulary/entries.js";
import type { AssertAll, ConjugateTest, TestNot } from "./test-utils.js";

// 규칙 동사 — 받침 있음(으시)
type _먹다 = AssertAll<
  ConjugateTest<
    Honorific<먹다>,
    [
      ["해요체", "먹으셔요"],
      ["과거_평서", "먹으셨다"],
      ["합쇼체", "먹으십니다"],
      ["평서_현재", "먹으신다"],
      ["고", "먹으시고"],
      ["아서", "먹으셔서"],
      ["면", "먹으시면"],
      ["지만", "먹으시지만"],
    ]
  >
>;

// 규칙 동사 — 받침 없음(시)
type _가다 = AssertAll<
  ConjugateTest<
    Honorific<가다>,
    [
      ["해요체", "가셔요"],
      ["과거_평서", "가셨다"],
      ["합쇼체", "가십니다"],
      ["평서_현재", "가신다"],
      ["고", "가시고"],
      ["아서", "가셔서"],
      ["면", "가시면"],
      ["지만", "가시지만"],
    ]
  >
>;

// ㄹ탈락 — -(으)면 과 달리 ㄹ 이 떨어진다 (살면 vs 사시다)
type _살다 = AssertAll<
  ConjugateTest<
    Honorific<살다>,
    [
      ["해요체", "사셔요"],
      ["과거_평서", "사셨다"],
      ["합쇼체", "사십니다"],
      ["평서_현재", "사신다"],
      ["면", "사시면"],
    ]
  >
>;

type _만들다 = AssertAll<
  ConjugateTest<
    Honorific<만들다>,
    [
      ["해요체", "만드셔요"],
      ["합쇼체", "만드십니다"],
      ["평서_현재", "만드신다"],
    ]
  >
>;

// ㅂ 불규칙 형용사 — 평서_현재 는 형용사 분기를 타야 한다
type _덥다 = AssertAll<
  ConjugateTest<
    Honorific<덥다>,
    [
      ["해요체", "더우셔요"],
      ["과거_평서", "더우셨다"],
      ["합쇼체", "더우십니다"],
      ["평서_현재", "더우시다"],
      ["고", "더우시고"],
      ["아서", "더우셔서"],
      ["면", "더우시면"],
      ["지만", "더우시지만"],
    ]
  >
>;

// ㄷ 불규칙 — altStem 에 받침이 남아 으 가 삽입된다
type _듣다 = AssertAll<
  ConjugateTest<
    Honorific<듣다>,
    [
      ["해요체", "들으셔요"],
      ["과거_평서", "들으셨다"],
      ["합쇼체", "들으십니다"],
      ["평서_현재", "들으신다"],
    ]
  >
>;

// ㅅ 불규칙 — altStem 이 개음절이어도 으 가 강제된다
type _짓다 = AssertAll<
  ConjugateTest<
    Honorific<짓다>,
    [
      ["해요체", "지으셔요"],
      ["과거_평서", "지으셨다"],
      ["합쇼체", "지으십니다"],
      ["평서_현재", "지으신다"],
    ]
  >
>;

// ㅎ 불규칙 — ㅎ 탈락 후 시
type _그렇다 = AssertAll<
  ConjugateTest<
    Honorific<그렇다>,
    [
      ["해요체", "그러셔요"],
      ["합쇼체", "그러십니다"],
      ["평서_현재", "그러시다"],
    ]
  >
>;

// 하다 — prefix 가 유지되고 여 축약 경로는 타지 않는다
type _공부하다 = AssertAll<
  ConjugateTest<
    Honorific<공부하다>,
    [
      ["해요체", "공부하셔요"],
      ["과거_평서", "공부하셨다"],
      ["합쇼체", "공부하십니다"],
      ["평서_현재", "공부하신다"],
      ["고", "공부하시고"],
      ["아서", "공부하셔서"],
    ]
  >
>;

// 르/러/ㅡ — 시-어간은 규칙 어간이므로 원래 불규칙이 재적용되면 안 된다
type _모르다 = AssertAll<
  ConjugateTest<
    Honorific<모르다>,
    [
      ["해요체", "모르셔요"],
      ["과거_평서", "모르셨다"],
      ["평서_현재", "모르신다"],
    ]
  >
>;

type _이르다 = AssertAll<
  ConjugateTest<
    Honorific<이르다>,
    [["해요체", "이르셔요"], ["평서_현재", "이르신다"]]
  >
>;

type _쓰다 = AssertAll<
  ConjugateTest<
    Honorific<쓰다>,
    [["해요체", "쓰셔요"], ["과거_평서", "쓰셨다"]]
  >
>;

type _오류_케이스 = AssertAll<
  [
    // ㄹ 이 유지되면 안 됨
    TestNot<Conjugate<Honorific<살다>, "해요체">, "살으셔요">,
    // 형용사 자질이 소실되면 안 됨
    TestNot<Conjugate<Honorific<덥다>, "평서_현재">, "더우신다">,
    // 불규칙 altStem 이 아닌 기본 어간이 쓰이면 안 됨
    TestNot<Conjugate<Honorific<듣다>, "해요체">, "듣으셔요">,
    // 시-어간에 원래 불규칙이 재적용되면 안 됨
    TestNot<Conjugate<Honorific<모르다>, "해요체">, "몰라셔요">,
    TestNot<Conjugate<Honorific<쓰다>, "해요체">, "써요">,
  ]
>;
