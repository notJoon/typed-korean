import type { Noun } from "../src/vocabulary/noun.js";
import type { 오다 } from "../src/vocabulary/entries.js";
import type { NounWithParticle } from "../src/phrase/noun-phrase.js";
import type { ConnectiveVerbPhrase } from "../src/phrase/verb-phrase.js";
import type { IntransitiveStatement } from "../src/sentence/sentence.js";
import type { ConnectedSentence } from "../src/sentence/compound.js";
import type { Render } from "../src/sentence/render.js";

export type 비가_오고_바람이_분다 = ConnectedSentence<
  `${NounWithParticle<Noun<"비">, "subject">} ${ConnectiveVerbPhrase<오다, "고">}`,
  Render<
    IntransitiveStatement<NounWithParticle<Noun<"바람">, "subject">, "분다">
  >
>;
