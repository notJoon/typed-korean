/**
 * Particle selection engine — chooses the correct Korean particle form
 * based on whether the preceding word ends with batchim.
 *
 * Broad `string` inputs are blocked via `HasBatchim`'s `IfLiteral` gate,
 * which propagates `never` through all selectors.
 */

import type { HasBatchim, LastJong } from "../hangul-unicode/jamo.js";
import type {
  AlternatingParticleMap,
  AlternatingParticleRole,
  EuroParticleRole,
  FixedParticleMap,
  FixedParticleRole,
  ParticleRole,
} from "./particle-types.js";

/**
 * Select alternating particle by role — dispatches to the map tuple.
 *
 * Batchim branching logic lives here only; individual helpers delegate to this.
 */
export type SelectAlternating<
  W extends string,
  R extends AlternatingParticleRole,
> =
  HasBatchim<W> extends true
    ? AlternatingParticleMap[R][0]
    : HasBatchim<W> extends false
      ? AlternatingParticleMap[R][1]
      : never;

/**
 * Select 은 or 는 based on batchim.
 * @example 은는<"밥"> // "은"
 * @example 은는<"사과"> // "는"
 */
export type 은는<W extends string> = SelectAlternating<W, "topic">;

/**
 * Select 이 or 가 based on batchim.
 * @example 이가<"밥"> // "이"
 * @example 이가<"사과"> // "가"
 */
export type 이가<W extends string> = SelectAlternating<W, "subject">;

/**
 * Select 을 or 를 based on batchim.
 * @example 을를<"밥"> // "을"
 * @example 을를<"사과"> // "를"
 */
export type 을를<W extends string> = SelectAlternating<W, "object">;

/**
 * Select 과 or 와 based on batchim.
 * @example 과와<"밥"> // "과"
 * @example 과와<"사과"> // "와"
 */
export type 과와<W extends string> = SelectAlternating<W, "with">;

/**
 * Select 으로 or 로 with ㄹ-batchim exception.
 *
 * - No batchim → "로"
 * - ㄹ batchim → "로" (exception)
 * - Other batchim → "으로"
 *
 * @example 으로로<"서울"> // "로" (ㄹ batchim exception)
 * @example 으로로<"부산"> // "으로" (general batchim)
 * @example 으로로<"제주"> // "로" (no batchim)
 */
export type 으로로<W extends string> =
  HasBatchim<W> extends false
    ? "로"
    : LastJong<W> extends "ㄹ"
      ? "로"
      : HasBatchim<W> extends true
        ? "으로"
        : never;

/**
 * Unified particle selector — picks the correct particle form for any role.
 *
 * - Alternating roles (topic, subject, object, with): batchim-based binary choice
 * - Euro roles (instrument, direction): 3-way with ㄹ exception
 * - Fixed roles (location, from, since, until, comparison): constant form
 *
 * Returns `never` for broad `string` input (literal gate).
 *
 * @example SelectParticle<"밥", "topic"> // "은"
 * @example SelectParticle<"서울", "instrument"> // "로"
 * @example SelectParticle<"밥", "until"> // "까지"
 */
export type SelectParticle<
  W extends string,
  R extends ParticleRole,
> = R extends AlternatingParticleRole
  ? SelectAlternating<W, R>
  : R extends EuroParticleRole
    ? 으로로<W>
    : R extends FixedParticleRole
      ? FixedParticleMap[R]
      : never;
