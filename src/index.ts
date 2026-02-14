export type { ComposeTable } from "./generated/compose-table.gen.js";
export type { JamoTable, OpenSyllable } from "./generated/jamo-table.gen.js";

export type {
  Compose,
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
