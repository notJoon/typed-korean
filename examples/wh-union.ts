import type { ProperNoun } from "../src/vocabulary/noun.js";
import type { 먹다 } from "../src/vocabulary/entries.js";
import type { NounWithParticle } from "../src/phrase/noun-phrase.js";
import type { VerbPhrase } from "../src/phrase/verb-phrase.js";
import type { WhQuestion } from "../src/sentence/interrogative.js";

export type 의문사 = WhQuestion<
  "누가" | "언제" | "왜",
  `${NounWithParticle<ProperNoun<"서울">, "from">} ${VerbPhrase<먹다, "해요체">}`
>;


