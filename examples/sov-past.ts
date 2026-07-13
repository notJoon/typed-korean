import type { Noun } from "../src/vocabulary/noun.js";
import type { 먹다 } from "../src/vocabulary/entries.js";
import type { NounWithParticle } from "../src/phrase/noun-phrase.js";
import type { VerbPhrase } from "../src/phrase/verb-phrase.js";
import type { Statement } from "../src/sentence/sentence.js";

export type 나는_밥을_먹었다 = Statement<
  NounWithParticle<Noun<"나">, "topic">,
  NounWithParticle<Noun<"밥">, "object">,
  VerbPhrase<먹다, "과거_평서">
>;
