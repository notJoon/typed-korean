import type {
  Compose,
  HasBatchim,
  LastJong,
  LastVowel,
  SecondToLastVowel,
} from "../src/hangul-unicode/jamo.js";
import type { DropLast, LastChar } from "../src/hangul-unicode/string-utils.js";
import type { AssertAll, Test } from "./test-utils.js";

type _HasBatchim = AssertAll<
  [Test<HasBatchim<"밥">, true>, Test<HasBatchim<"사과">, false>]
>;

type _LastVowel = AssertAll<
  [Test<LastVowel<"먹">, "ㅓ">, Test<LastVowel<"가">, "ㅏ">]
>;

type _Compose = AssertAll<
  [
    Test<Compose<"ㅇ", "ㅘ", null>, "와">,
    Test<Compose<"ㅆ", "ㅓ", null>, "써">,
    Test<Compose<"ㄱ", "ㅏ", "ㄴ">, "간">,
  ]
>;

type _StringUtils = AssertAll<
  [Test<LastChar<"먹다">, "다">, Test<DropLast<"먹다">, "먹">]
>;

type _Jamo = AssertAll<
  [Test<LastJong<"먹">, "ㄱ">, Test<SecondToLastVowel<"모르">, "ㅗ">]
>;

type _LiteralGate = AssertAll<
  [Test<HasBatchim<string>, never>, Test<LastVowel<string>, never>]
>;
