import type { Noun } from "../src/vocabulary/noun.js";
import type { 덥다 } from "../src/vocabulary/entries.js";
import type { NounWithParticle } from "../src/phrase/noun-phrase.js";
import type { AdjectivePhrase } from "../src/phrase/adjective-phrase.js";
import type { DescriptiveStatement } from "../src/sentence/sentence.js";

export type 날씨가_더워요 = DescriptiveStatement<
  NounWithParticle<Noun<"날씨">, "subject">,
  AdjectivePhrase<덥다, "해요체">
>;
