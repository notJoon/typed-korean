import type {
  가깝다,
  덥다,
  아름답다,
  춥다,
  그렇다,
  빠르다,
  푸르다,
} from "../src/vocabulary/entries.js";
import type { AdjectivePhrase } from "../src/phrase/adjective-phrase.js";
import type { AssertAll, Test, TestNot } from "./test-utils.js";

// ---- TODO 4.6 통과 기준 ----

type _통과기준 = AssertAll<
  [
    Test<AdjectivePhrase<가깝다, "해요체">, "가까워요">,
    Test<AdjectivePhrase<덥다, "평서_현재">, "덥다">,
  ]
>;

// ---- ㅂ 불규칙 형용사 ----

type _ㅂ불규칙 = AssertAll<
  [
    Test<AdjectivePhrase<덥다, "해요체">, "더워요">,
    Test<AdjectivePhrase<덥다, "과거_평서">, "더웠다">,
    Test<AdjectivePhrase<춥다, "해요체">, "추워요">,
    Test<AdjectivePhrase<아름답다, "해요체">, "아름다워요">,
    Test<AdjectivePhrase<가깝다, "과거_평서">, "가까웠다">,
  ]
>;

// ---- 자음 어미 ----

type _자음어미 = AssertAll<
  [
    Test<AdjectivePhrase<덥다, "고">, "덥고">,
    Test<AdjectivePhrase<덥다, "지만">, "덥지만">,
    Test<AdjectivePhrase<가깝다, "합쇼체">, "가깝습니다">,
  ]
>;

// ---- 평서_현재 — 형용사는 "~다" (동사의 "~는다"와 다름) ----

type _평서현재 = AssertAll<
  [
    Test<AdjectivePhrase<덥다, "평서_현재">, "덥다">,
    Test<AdjectivePhrase<춥다, "평서_현재">, "춥다">,
    Test<AdjectivePhrase<가깝다, "평서_현재">, "가깝다">,
    Test<AdjectivePhrase<아름답다, "평서_현재">, "아름답다">,
  ]
>;

// ---- ㅎ 불규칙 형용사 ----

type _ㅎ불규칙 = AssertAll<
  [
    Test<AdjectivePhrase<그렇다, "해요체">, "그래요">,
    Test<AdjectivePhrase<그렇다, "고">, "그렇고">,
  ]
>;

// ---- 르 불규칙 형용사 ----

type _르불규칙 = AssertAll<
  [
    Test<AdjectivePhrase<빠르다, "해요체">, "빨라요">,
    Test<AdjectivePhrase<빠르다, "고">, "빠르고">,
  ]
>;

// ---- 러 불규칙 형용사 ----

type _러불규칙 = AssertAll<
  [
    Test<AdjectivePhrase<푸르다, "해요체">, "푸르러요">,
    Test<AdjectivePhrase<푸르다, "고">, "푸르고">,
  ]
>;

// ---- 실패 케이스 ----

type _실패 = AssertAll<
  [
    TestNot<AdjectivePhrase<덥다, "해요체">, "덥어요">,
    TestNot<AdjectivePhrase<덥다, "평서_현재">, "덥는다">,
    TestNot<AdjectivePhrase<가깝다, "해요체">, "가깝어요">,
  ]
>;
