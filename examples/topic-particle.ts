import type { Noun } from "../src/vocabulary/noun.js";
import type { NounWithParticle } from "../src/phrase/noun-phrase.js";

export type 주제_비교 =
  | NounWithParticle<Noun<"나">, "topic">
  | NounWithParticle<Noun<"밥">, "topic">;
