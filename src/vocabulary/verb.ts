/**
 * Base shape of a Korean verb.
 */
export interface Verb {
  stem: string;
  ending: "다";
}

/**
 * Regular verb.
 *
 * `irregularType` is intentionally disallowed to keep this distinct from
 * irregular verbs.
 */
export interface RegularVerb extends Verb {
  irregularType?: never;
}

/**
 * Korean irregular conjugation types.
 */
export type IrregularType = "ㅂ" | "ㄷ" | "ㅅ" | "ㅎ" | "르" | "ㅡ" | "러";

/**
 * Irregular verb.
 *
 * `altStem` is the alternate stem used before vowel-leading endings.
 */
export interface IrregularVerb<Type extends IrregularType> extends Verb {
  irregularType: Type;
  altStem: string;
}

/**
 * `하다`-family verb.
 */
export interface 하다Verb extends Verb {
  prefix: string;
  stem: "하";
}
