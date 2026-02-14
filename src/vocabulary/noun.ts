/**
 * Noun.
 */
export interface Noun<W extends string = string> {
  word: W;
}

/**
 * Proper noun.
 */
export type ProperNoun<W extends string> = Noun<W> & { proper: true };
