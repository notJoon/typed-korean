import type { Adjective } from "../src/vocabulary/adjective.js";
import type {
  가다,
  마시다,
  먹다,
  보다,
  살다,
  쓰다,
  오다,
  읽다,
  잡다,
  주다,
} from "../src/vocabulary/entries.js";
import type { Noun, ProperNoun } from "../src/vocabulary/noun.js";
import type {
  IrregularType,
  IrregularVerb,
  RegularVerb,
  Verb,
  하다Verb,
} from "../src/vocabulary/verb.js";
import type { AssertAll, Equal, Expect, Test } from "./test-utils.js";

// ---- 타입 구조 ----

type _VerbShape = Expect<Equal<Verb["ending"], "다">>;
type _RegularVerbNoIrregular = Expect<
  Equal<RegularVerb["irregularType"], undefined>
>;
type _IrregularType = Expect<
  Equal<IrregularType, "ㅂ" | "ㄷ" | "ㅅ" | "ㅎ" | "르" | "러">
>;
type _IrregularVerb = Expect<Equal<IrregularVerb<"ㅂ">["irregularType"], "ㅂ">>;
type _하다Verb = Expect<Equal<하다Verb["stem"], "하">>;

type _Adjective = Expect<Equal<Adjective["partOfSpeech"], "adjective">>;

type _Noun = Expect<Equal<Noun<"사과">["word"], "사과">>;
type _ProperNoun = Expect<Equal<ProperNoun<"서울">["proper"], true>>;

// ---- 어휘 항목 stem ----

type _stems = AssertAll<
  [
    Test<먹다["stem"], "먹">,
    Test<가다["stem"], "가">,
    Test<보다["stem"], "보">,
    Test<살다["stem"], "살">,
    Test<오다["stem"], "오">,
    Test<주다["stem"], "주">,
    Test<쓰다["stem"], "쓰">,
    Test<마시다["stem"], "마시">,
    Test<읽다["stem"], "읽">,
    Test<잡다["stem"], "잡">,
  ]
>;

type _AllEntriesEnding = Expect<
  Equal<
    | 먹다["ending"]
    | 가다["ending"]
    | 보다["ending"]
    | 살다["ending"]
    | 오다["ending"]
    | 주다["ending"]
    | 쓰다["ending"]
    | 마시다["ending"]
    | 읽다["ending"]
    | 잡다["ending"],
    "다"
  >
>;
