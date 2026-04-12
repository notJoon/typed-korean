/**
 * Verb phrase construction — wraps conjugation results as phrase-level types.
 *
 * - `VerbPhrase<V, F>` accepts any ending type
 * - `ConnectiveVerbPhrase<V, F>` is restricted to connective endings (고, 아서, 면, 지만)
 */

import type { Conjugate } from "../conjugation/conjugate.js";
import type {
  ConnectiveEnding,
  EndingType,
} from "../conjugation/ending-types.js";
import type { Verb } from "../vocabulary/verb.js";

/**
 * Conjugated verb as a phrase unit.
 *
 * @example
 * VerbPhrase<먹다, "해요체">   // "먹어요"
 * VerbPhrase<먹다, "과거_평서"> // "먹었다"
 */
export type VerbPhrase<V extends Verb, F extends EndingType> = Conjugate<V, F>;

/**
 * Connective verb phrase — restricted to clause-joining endings.
 *
 * @example
 * ConnectiveVerbPhrase<먹다, "고">   // "먹고"
 * ConnectiveVerbPhrase<먹다, "아서"> // "먹어서"
 * ConnectiveVerbPhrase<먹다, "면">   // "먹으면"
 * ConnectiveVerbPhrase<먹다, "지만"> // "먹지만"
 */
export type ConnectiveVerbPhrase<
  V extends Verb,
  F extends ConnectiveEnding,
> = Conjugate<V, F>;
