/**
 * Adjective phrase construction — wraps adjective conjugation results
 * as phrase-level types.
 *
 * Korean adjectives (`Adjective`) extend `Verb` and share the conjugation
 * engine, so this is a thin specialization of `Conjugate` constrained to
 * the adjective tag.
 */

import type { Conjugate } from "../conjugation/conjugate.js";
import type { EndingType } from "../conjugation/ending-types.js";
import type { Adjective } from "../vocabulary/adjective.js";

/**
 * Conjugated adjective as a phrase unit.
 *
 * @example
 * AdjectivePhrase<가깝다, "해요체">    // "가까워요"
 * AdjectivePhrase<덥다, "평서_현재">  // "덥다"
 */
export type AdjectivePhrase<
  A extends Adjective,
  F extends EndingType,
> = Conjugate<A, F>;
