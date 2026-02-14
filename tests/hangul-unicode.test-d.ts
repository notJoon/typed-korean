import type {
  Compose,
  HasBatchim,
  LastJong,
  LastVowel,
  SecondToLastVowel,
} from "../src/hangul-unicode/jamo.js";
import type { DropLast, LastChar } from "../src/hangul-unicode/string-utils.js";
import type { Equal, Expect } from "./test-utils.js";

type _HasBatchim1 = Expect<Equal<HasBatchim<"밥">, true>>;
type _HasBatchim2 = Expect<Equal<HasBatchim<"사과">, false>>;

type _LastVowel1 = Expect<Equal<LastVowel<"먹">, "ㅓ">>;
type _LastVowel2 = Expect<Equal<LastVowel<"가">, "ㅏ">>;

type _Compose1 = Expect<Equal<Compose<"ㅇ", "ㅘ", null>, "와">>;
type _Compose2 = Expect<Equal<Compose<"ㅆ", "ㅓ", null>, "써">>;
type _Compose3 = Expect<Equal<Compose<"ㄱ", "ㅏ", "ㄴ">, "간">>;

type _LastChar = Expect<Equal<LastChar<"먹다">, "다">>;
type _DropLast = Expect<Equal<DropLast<"먹다">, "먹">>;

type _LastJong = Expect<Equal<LastJong<"먹">, "ㄱ">>;
type _SecondToLastVowel = Expect<Equal<SecondToLastVowel<"모르">, "ㅗ">>;

type _LiteralGate1 = Expect<Equal<HasBatchim<string>, never>>;
type _LiteralGate2 = Expect<Equal<LastVowel<string>, never>>;
