import type {
  가다,
  마시다,
  먹다,
  보다,
  쓰다,
  오다,
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
