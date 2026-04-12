/**
 * Noun phrase construction — combines a noun with its particle.
 *
 * Two entry points:
 * - `NounWithParticle<N, R>` takes a `Noun` object and a particle role
 * - `NounPhrase<W, R>` takes a raw string word (shortcut)
 */

import type { Noun } from "../vocabulary/noun.js";
import type { ParticleRole } from "../particles/particle-types.js";
import type { SelectParticle } from "../particles/select-particle.js";

/**
 * Attach a particle to a `Noun` by role.
 *
 * @example
 * NounWithParticle<Noun<"밥">, "object"> // "밥을"
 * NounWithParticle<Noun<"사과">, "topic"> // "사과는"
 */
export type NounWithParticle<
  N extends Noun,
  R extends ParticleRole,
> = `${N["word"]}${SelectParticle<N["word"], R>}`;

/**
 * Shortcut — build a noun phrase directly from a string word.
 *
 * @example
 * NounPhrase<"밥", "object"> // "밥을"
 * NounPhrase<"사과", "topic"> // "사과는"
 */
export type NounPhrase<
  W extends string,
  R extends ParticleRole,
> = `${W}${SelectParticle<W, R>}`;
