import type { Noun } from "../src/vocabulary/noun.js";
import type { 오다 } from "../src/vocabulary/entries.js";
import type { NounWithParticle } from "../src/phrase/noun-phrase.js";
import type { VerbPhrase } from "../src/phrase/verb-phrase.js";
import type { IntransitiveStatement } from "../src/sentence/sentence.js";
import type { Render } from "../src/sentence/render.js";

export type 비가_와요 = Render<
  IntransitiveStatement<
    NounWithParticle<Noun<"비">, "subject">,
    VerbPhrase<오다, "해요체">
  >
>;
