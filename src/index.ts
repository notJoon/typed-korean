export type { ComposeTable } from "./generated/compose-table.gen.js";
export type { JamoTable, OpenSyllable } from "./generated/jamo-table.gen.js";

export type {
  Compose,
  DecomposeLastChar,
  HasBatchim,
  LastJong,
  LastVowel,
  SecondToLastVowel,
} from "./hangul-unicode/jamo.js";
export type {
  DropLast,
  IfLiteral,
  LastChar,
} from "./hangul-unicode/string-utils.js";

export type {
  IrregularType,
  IrregularVerb,
  RegularVerb,
  Verb,
  하다Verb,
} from "./vocabulary/verb.js";
export type { Adjective } from "./vocabulary/adjective.js";
export type { Noun, ProperNoun } from "./vocabulary/noun.js";
export type {
  RegularVerbEntry,
  가다,
  마시다,
  먹다,
  보다,
  살다,
  쓰다,
  오다,
  읽다,
  잡다,
  주다,
} from "./vocabulary/entries.js";

export type {
  ConsonantStartingEnding,
  EndingType,
  VowelStartingEnding,
} from "./conjugation/ending-types.js";
export type { Conjugate, EffectiveStem } from "./conjugation/conjugate.js";
export type {
  ApplyContraction,
  Contract,
  ContractionTable,
  InsertFinalJong,
} from "./conjugation/contraction.js";
export type { 아어, 아어Vowel, 양성모음 } from "./conjugation/vowel-harmony.js";
