/**
 * Korean particle (josa, 조사) role and form definitions.
 *
 * Korean particles attach to nouns and indicate grammatical role.
 * Some particles alternate form based on whether the preceding noun
 * ends with batchim (final consonant) — these are "alternating" particles.
 * Others have a fixed form regardless of batchim — these are "fixed" particles.
 */

/**
 * Alternating particle pairs — form changes based on batchim.
 *
 * Each entry maps a role to `[withBatchim, withoutBatchim]`.
 */
export interface AlternatingParticleMap {
  topic: ["은", "는"];
  subject: ["이", "가"];
  object: ["을", "를"];
  with: ["과", "와"];
}

/**
 * Roles that use alternating particles.
 */
export type AlternatingParticleRole = keyof AlternatingParticleMap;

/**
 * The 으로/로 particle pair — has a special ㄹ-batchim exception.
 *
 * The tuple is `[withBatchim, withoutBatchim]` for documentation purposes,
 * but the actual selection logic is 3-way (batchim → "으로", ㄹ batchim → "로",
 * no batchim → "로") and is implemented in `select-particle.ts`, not derived
 * from this tuple directly.
 *
 * - No batchim → 로
 * - ㄹ batchim → 로 (exception)
 * - Other batchim → 으로
 */
export interface EuroParticleMap {
  instrument: ["으로", "로"];
  direction: ["으로", "로"];
}

/**
 * Roles that use the 으로/로 particle.
 */
export type EuroParticleRole = keyof EuroParticleMap;

/**
 * Fixed particles — form does not change regardless of batchim.
 */
export interface FixedParticleMap {
  location: "에";
  from: "에서";
  since: "부터";
  until: "까지";
  comparison: "보다";
}

/**
 * Roles that use fixed particles.
 */
export type FixedParticleRole = keyof FixedParticleMap;

/**
 * All supported particle roles.
 *
 * Derived from the three particle maps so that adding/removing a role in any
 * map automatically updates this union — no manual synchronization needed.
 *
 * - `"topic"` — 은/는 (topic marker)
 * - `"subject"` — 이/가 (subject marker)
 * - `"object"` — 을/를 (object marker)
 * - `"with"` — 과/와 (comitative, "with")
 * - `"instrument"` — 으로/로 (instrumental/directional, special ㄹ exception)
 * - `"direction"` — 으로/로 (same form as instrument, directional sense)
 * - `"location"` — 에 (location, fixed)
 * - `"from"` — 에서 (source, fixed)
 * - `"since"` — 부터 (starting point, fixed)
 * - `"until"` — 까지 (endpoint, fixed)
 * - `"comparison"` — 보다 (comparison, fixed)
 */
export type ParticleRole =
  | AlternatingParticleRole
  | EuroParticleRole
  | FixedParticleRole;
