/**
 * Korean noun (myeongsa, 명사).
 *
 * A noun carries a single `word` field containing the surface form. Whether
 * the word ends in a batchim (final consonant) is not stored here; instead,
 * it is computed on demand via `HasBatchim<N["word"]>` from the
 * hangul-unicode layer. This keeps noun declarations minimal and ensures
 * batchim information stays consistent.
 *
 * @typeParam W - The literal string type of the noun (e.g. `"사과"`, `"밥"`).
 *
 * @example
 * ```ts
 * type 사과 = Noun<"사과">;
 * // HasBatchim<사과["word"]> -> false (사과 ends in open syllable)
 *
 * type 밥 = Noun<"밥">;
 * // HasBatchim<밥["word"]>  -> true  (밥 ends in ㅂ batchim)
 * ```
 */
export interface Noun<W extends string = string> {
  word: W;
}

/**
 * Proper noun (goyumyeongsa, 고유명사).
 *
 * Extends `Noun` with a `proper: true` tag for potential future use in
 * formatting or honorific selection.
 *
 * @typeParam W - The literal string type of the proper noun.
 *
 * @example
 * ```ts
 * type 서울 = ProperNoun<"서울">;
 * // 서울["word"]   -> "서울"
 * // 서울["proper"] -> true
 * ```
 */
export type ProperNoun<W extends string> = Noun<W> & { proper: true };
