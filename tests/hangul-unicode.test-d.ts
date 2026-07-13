import type {
  Compose,
  DecomposeLastChar,
  HasBatchim,
  LastJong,
  LastVowel,
  SecondToLastVowel,
} from "../src/hangul-unicode/jamo.js";
import type {
  ChoTable,
  JongTable,
  JungTable,
} from "../src/generated/jamo-table.gen.js";
import type { DropLast, LastChar } from "../src/hangul-unicode/string-utils.js";
import type { AssertAll, Test } from "./test-utils.js";

type _HasBatchim = AssertAll<
  [
    Test<HasBatchim<"밥">, true>,
    Test<HasBatchim<"사과">, false>,
    Test<HasBatchim<"A">, never>,
  ]
>;

type _DecomposeLastChar = AssertAll<
  [Test<DecomposeLastChar<"밟">, { 초: "ㅂ"; 중: "ㅏ"; 종: "ㄼ" }>]
>;

type _ReverseJamoTables = AssertAll<
  [
    Test<"먹" extends ChoTable["ㅁ"] ? true : false, true>,
    Test<"먹" extends JungTable["ㅓ"] ? true : false, true>,
    Test<"먹" extends JongTable["ㄱ"] ? true : false, true>,
  ]
>;

type _DecomposeSpotCheck = AssertAll<
  [
    Test<DecomposeLastChar<"흊">, { 초: "ㅎ"; 중: "ㅠ"; 종: "ㅈ" }>,
    Test<DecomposeLastChar<"왰">, { 초: "ㅇ"; 중: "ㅙ"; 종: "ㅆ" }>,
    Test<DecomposeLastChar<"뀌">, { 초: "ㄲ"; 중: "ㅟ"; 종: null }>,
    Test<DecomposeLastChar<"썼">, { 초: "ㅆ"; 중: "ㅓ"; 종: "ㅆ" }>,
    Test<DecomposeLastChar<"귘">, { 초: "ㄱ"; 중: "ㅟ"; 종: "ㅋ" }>,
    Test<DecomposeLastChar<"픬">, { 초: "ㅍ"; 중: "ㅢ"; 종: "ㄽ" }>,
    Test<DecomposeLastChar<"의">, { 초: "ㅇ"; 중: "ㅢ"; 종: null }>,
    Test<DecomposeLastChar<"훘">, { 초: "ㅎ"; 중: "ㅜ"; 종: "ㅆ" }>,
    Test<DecomposeLastChar<"퐀">, { 초: "ㅍ"; 중: "ㅗ"; 종: "ㅆ" }>,
    Test<DecomposeLastChar<"놨">, { 초: "ㄴ"; 중: "ㅘ"; 종: "ㅆ" }>,
    Test<DecomposeLastChar<"냔">, { 초: "ㄴ"; 중: "ㅑ"; 종: "ㄴ" }>,
    Test<DecomposeLastChar<"좨">, { 초: "ㅈ"; 중: "ㅙ"; 종: null }>,
    Test<DecomposeLastChar<"풬">, { 초: "ㅍ"; 중: "ㅝ"; 종: "ㅋ" }>,
    Test<DecomposeLastChar<"몼">, { 초: "ㅁ"; 중: "ㅗ"; 종: "ㅆ" }>,
    Test<DecomposeLastChar<"밤">, { 초: "ㅂ"; 중: "ㅏ"; 종: "ㅁ" }>,
    Test<DecomposeLastChar<"볌">, { 초: "ㅂ"; 중: "ㅕ"; 종: "ㅁ" }>,
    Test<DecomposeLastChar<"슘">, { 초: "ㅅ"; 중: "ㅠ"; 종: "ㅁ" }>,
    Test<DecomposeLastChar<"퓰">, { 초: "ㅍ"; 중: "ㅠ"; 종: "ㄹ" }>,
    Test<DecomposeLastChar<"땰">, { 초: "ㄸ"; 중: "ㅑ"; 종: "ㄹ" }>,
    Test<DecomposeLastChar<"콬">, { 초: "ㅋ"; 중: "ㅗ"; 종: "ㅋ" }>,
    Test<DecomposeLastChar<"캨">, { 초: "ㅋ"; 중: "ㅐ"; 종: "ㅋ" }>,
    Test<DecomposeLastChar<"츼">, { 초: "ㅊ"; 중: "ㅢ"; 종: null }>,
    Test<DecomposeLastChar<"힔">, { 초: "ㅎ"; 중: "ㅣ"; 종: "ㄽ" }>,
    Test<DecomposeLastChar<"탴">, { 초: "ㅌ"; 중: "ㅐ"; 종: "ㅋ" }>,
    Test<DecomposeLastChar<"쿄">, { 초: "ㅋ"; 중: "ㅛ"; 종: null }>,
    Test<DecomposeLastChar<"폌">, { 초: "ㅍ"; 중: "ㅕ"; 종: "ㅋ" }>,
    Test<DecomposeLastChar<"쁈">, { 초: "ㅃ"; 중: "ㅠ"; 종: "ㄽ" }>,
    Test<DecomposeLastChar<"옔">, { 초: "ㅇ"; 중: "ㅖ"; 종: "ㄽ" }>,
    Test<DecomposeLastChar<"볘">, { 초: "ㅂ"; 중: "ㅖ"; 종: null }>,
    Test<DecomposeLastChar<"쬐">, { 초: "ㅉ"; 중: "ㅚ"; 종: null }>,
    Test<DecomposeLastChar<"섰">, { 초: "ㅅ"; 중: "ㅓ"; 종: "ㅆ" }>,
    Test<DecomposeLastChar<"과">, { 초: "ㄱ"; 중: "ㅘ"; 종: null }>,
  ]
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
