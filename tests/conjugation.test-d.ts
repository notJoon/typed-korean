import type {
  가다,
  가깝다,
  공부하다,
  그렇다,
  덥다,
  듣다,
  마시다,
  먹다,
  모르다,
  보다,
  쓰다,
  오다,
  짓다,
  주다,
} from "../src/vocabulary/entries.js";
import type { Conjugate } from "../src/conjugation/conjugate.js";
import type { Equal, Expect } from "./test-utils.js";

type _해요체1 = Expect<Equal<Conjugate<먹다, "해요체">, "먹어요">>;
type _해요체2 = Expect<Equal<Conjugate<가다, "해요체">, "가요">>;
type _해요체3 = Expect<Equal<Conjugate<오다, "해요체">, "와요">>;
type _해요체4 = Expect<Equal<Conjugate<주다, "해요체">, "줘요">>;
type _해요체5 = Expect<Equal<Conjugate<쓰다, "해요체">, "써요">>;
type _해요체6 = Expect<Equal<Conjugate<마시다, "해요체">, "마셔요">>;

type _과거평서1 = Expect<Equal<Conjugate<보다, "과거_평서">, "봤다">>;
type _과거평서2 = Expect<Equal<Conjugate<오다, "과거_평서">, "왔다">>;
type _과거평서3 = Expect<Equal<Conjugate<먹다, "과거_평서">, "먹었다">>;

type _합쇼체1 = Expect<Equal<Conjugate<먹다, "합쇼체">, "먹습니다">>;
type _합쇼체2 = Expect<Equal<Conjugate<가다, "합쇼체">, "갑니다">>;

type _연결1 = Expect<Equal<Conjugate<먹다, "고">, "먹고">>;
type _연결2 = Expect<Equal<Conjugate<먹다, "아서">, "먹어서">>;
type _연결3 = Expect<Equal<Conjugate<가다, "아서">, "가서">>;
type _대조1 = Expect<Equal<Conjugate<먹다, "지만">, "먹지만">>;

type _조건1 = Expect<Equal<Conjugate<먹다, "면">, "먹으면">>;
type _조건2 = Expect<Equal<Conjugate<가다, "면">, "가면">>;

type _평서현재1 = Expect<Equal<Conjugate<먹다, "평서_현재">, "먹는다">>;
type _평서현재2 = Expect<Equal<Conjugate<가다, "평서_현재">, "간다">>;

// irregular verbs
type _ㅂ해요 = Expect<Equal<Conjugate<덥다, "해요체">, "더워요">>;
type _ㅂ과거 = Expect<Equal<Conjugate<덥다, "과거_평서">, "더웠다">>;
type _ㅂ고 = Expect<Equal<Conjugate<덥다, "고">, "덥고">>;

type _ㄷ해요 = Expect<Equal<Conjugate<듣다, "해요체">, "들어요">>;
type _ㄷ과거 = Expect<Equal<Conjugate<듣다, "과거_평서">, "들었다">>;
type _ㄷ고 = Expect<Equal<Conjugate<듣다, "고">, "듣고">>;

type _ㅅ해요 = Expect<Equal<Conjugate<짓다, "해요체">, "지어요">>;
type _ㅅ과거 = Expect<Equal<Conjugate<짓다, "과거_평서">, "지었다">>;
type _ㅅ고 = Expect<Equal<Conjugate<짓다, "고">, "짓고">>;

type _르해요 = Expect<Equal<Conjugate<모르다, "해요체">, "몰라요">>;
type _르과거 = Expect<Equal<Conjugate<모르다, "과거_평서">, "몰랐다">>;
type _르고 = Expect<Equal<Conjugate<모르다, "고">, "모르고">>;

type _ㅎ해요 = Expect<Equal<Conjugate<그렇다, "해요체">, "그래요">>;
type _ㅎ과거 = Expect<Equal<Conjugate<그렇다, "과거_평서">, "그랬다">>;
type _ㅎ고 = Expect<Equal<Conjugate<그렇다, "고">, "그렇고">>;

// 하다 verbs
type _하다해요 = Expect<Equal<Conjugate<공부하다, "해요체">, "공부해요">>;
type _하다과거 = Expect<Equal<Conjugate<공부하다, "과거_평서">, "공부했다">>;
type _하다합쇼 = Expect<Equal<Conjugate<공부하다, "합쇼체">, "공부합니다">>;
type _하다평서 = Expect<Equal<Conjugate<공부하다, "평서_현재">, "공부한다">>;
type _하다고 = Expect<Equal<Conjugate<공부하다, "고">, "공부하고">>;
type _하다아서 = Expect<Equal<Conjugate<공부하다, "아서">, "공부해서">>;
type _하다면 = Expect<Equal<Conjugate<공부하다, "면">, "공부하면">>;
type _하다지만 = Expect<Equal<Conjugate<공부하다, "지만">, "공부하지만">>;

// Irregular adjective sample
type _가깝 = Expect<Equal<Conjugate<가깝다, "해요체">, "가까워요">>;

// Adjective 평서_현재: stem + "다" (not "는다"/"ㄴ다")
type _형용사평서1 = Expect<Equal<Conjugate<가깝다, "평서_현재">, "가깝다">>;
type _형용사평서2 = Expect<Equal<Conjugate<덥다, "평서_현재">, "덥다">>;
