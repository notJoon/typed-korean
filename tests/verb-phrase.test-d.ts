import type {
  가다,
  먹다,
  살다,
  오다,
  덥다,
} from "../src/vocabulary/entries.js";
import type {
  ConnectiveVerbPhrase,
  VerbPhrase,
} from "../src/phrase/verb-phrase.js";
import type { AssertAll, Test, TestNot } from "./test-utils.js";

type _VerbPhrase = AssertAll<
  [
    Test<VerbPhrase<먹다, "해요체">, "먹어요">,
    Test<VerbPhrase<먹다, "과거_평서">, "먹었다">,
    Test<VerbPhrase<먹다, "합쇼체">, "먹습니다">,
    Test<VerbPhrase<먹다, "평서_현재">, "먹는다">,
  ]
>;

type _ConnectiveVerbPhrase = AssertAll<
  [
    Test<ConnectiveVerbPhrase<먹다, "고">, "먹고">,
    Test<ConnectiveVerbPhrase<먹다, "아서">, "먹어서">,
    Test<ConnectiveVerbPhrase<먹다, "면">, "먹으면">,
    Test<ConnectiveVerbPhrase<먹다, "지만">, "먹지만">,
  ]
>;

type _다양한동사 = AssertAll<
  [
    Test<VerbPhrase<가다, "해요체">, "가요">,
    Test<VerbPhrase<오다, "과거_평서">, "왔다">,
    Test<VerbPhrase<살다, "합쇼체">, "삽니다">,
    Test<ConnectiveVerbPhrase<가다, "고">, "가고">,
    Test<ConnectiveVerbPhrase<오다, "면">, "오면">,
    Test<ConnectiveVerbPhrase<덥다, "지만">, "덥지만">,
  ]
>;

type _실패 = AssertAll<
  [
    TestNot<VerbPhrase<먹다, "해요체">, "먹어">,
    TestNot<VerbPhrase<먹다, "과거_평서">, "먹었다고">,
    TestNot<ConnectiveVerbPhrase<먹다, "고">, "먹어고">,
    TestNot<ConnectiveVerbPhrase<가다, "면">, "가으면">,
  ]
>;
