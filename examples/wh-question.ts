import type { Noun } from "../src/vocabulary/noun.js";
import type { 공부하다 } from "../src/vocabulary/entries.js";
import type { NounWithParticle } from "../src/phrase/noun-phrase.js";
import type { VerbPhrase } from "../src/phrase/verb-phrase.js";
import type { IntransitiveStatement } from "../src/sentence/sentence.js";
import type { WhQuestion } from "../src/sentence/interrogative.js";

export type 왜_너는_공부해요 = WhQuestion<
  "왜",
  IntransitiveStatement<
    NounWithParticle<Noun<"너">, "topic">,
    VerbPhrase<공부하다, "해요체">
  >
>;
