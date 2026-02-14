/**
 * Base shape of a Korean verb (dongsa, 동사).
 *
 * Every Korean verb consists of a stem (eogan, 어간) and the dictionary
 * ending "다". The stem carries the core meaning while "다" marks the
 * dictionary (citation) form.
 *
 * @example
 * ```ts
 * // "먹다" (to eat): stem = "먹", ending = "다"
 * type 먹다 = RegularVerb & { stem: "먹" };
 * ```
 */
export interface Verb {
  stem: string;
  ending: "다";
}

/**
 * Regular verb (gyuchik dongsa, 규칙 동사).
 *
 * Regular verbs follow predictable conjugation patterns without any stem
 * alternation. The `irregularType` field is set to `never` so that
 * `RegularVerb` and `IrregularVerb` are mutually exclusive at the type level.
 *
 * @example
 * ```ts
 * type 먹다 = RegularVerb & { stem: "먹" };
 * type 가다 = RegularVerb & { stem: "가" };
 * ```
 */
export interface RegularVerb extends Verb {
  irregularType?: never;
}

/**
 * Korean irregular conjugation types (bulgyuchik hwaryong, 불규칙 활용).
 *
 * Each member names the consonant or pattern that triggers the irregularity:
 *
 * | Type | Description                    | Example            |
 * | ---- | ------------------------------ | ------------------ |
 * | ㅂ   | ㅂ drops, 우 inserted          | 덥다 -> 더워요     |
 * | ㄷ   | ㄷ becomes ㄹ before vowels    | 듣다 -> 들어요     |
 * | ㅅ   | ㅅ drops before vowels         | 짓다 -> 지어요     |
 * | ㅎ   | ㅎ drops before vowels         | 그렇다 -> 그래요   |
 * | 르   | 르 becomes ㄹ라/ㄹ러           | 모르다 -> 몰라요   |
 * | ㅡ   | ㅡ drops before vowels         | 쓰다 -> 써요       |
 * | 러   | 어 becomes 러                  | 이르다 -> 이르러요 |
 */
export type IrregularType = "ㅂ" | "ㄷ" | "ㅅ" | "ㅎ" | "르" | "ㅡ" | "러";

/**
 * Irregular verb (bulgyuchik dongsa, 불규칙 동사).
 *
 * Irregular verbs use an alternate stem (`altStem`) before vowel-starting
 * endings (e.g. 아/어, 았/었). Before consonant-starting endings (e.g. 고,
 * 지만), the base `stem` is used unchanged.
 *
 * The `altStem` approach moves the complexity of stem alternation into the
 * vocabulary definition, so the conjugation engine only needs to decide
 * "which stem to use" rather than computing the transformation.
 *
 * @example
 * ```ts
 * // ㅂ irregular: 덥 -> 더우 before vowel endings
 * type 덥다 = IrregularVerb<"ㅂ"> & { stem: "덥"; altStem: "더우" };
 *
 * // ㄷ irregular: 듣 -> 들 before vowel endings
 * type 듣다 = IrregularVerb<"ㄷ"> & { stem: "듣"; altStem: "들" };
 * ```
 */
export interface IrregularVerb<Type extends IrregularType> extends Verb {
  irregularType: Type;
  altStem: string;
}

/**
 * Hada-family verb (하다 dongsa, 하다 동사).
 *
 * "하다" is the most productive verb in Korean. Any Sino-Korean noun or
 * loanword can combine with "하다" to form a verb (e.g. 공부 + 하다 = 공부하다).
 * The stem is always "하", and the `prefix` holds the noun component.
 *
 * The 하 + 여 -> 해 contraction is handled by the conjugation engine as a
 * special case rather than through `altStem`, because the prefix must be
 * re-attached after contraction.
 *
 * @example
 * ```ts
 * type 공부하다 = 하다Verb & { prefix: "공부" };
 * // Conjugate<공부하다, "해요체"> -> "공부해요"
 * // Conjugate<공부하다, "고">     -> "공부하고"
 * ```
 */
export interface 하다Verb extends Verb {
  prefix: string;
  stem: "하";
}
