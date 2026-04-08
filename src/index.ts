export type { ComposeTable } from "./generated/compose-table.gen.js";
export type { JamoTable, OpenSyllable } from "./generated/jamo-table.gen.js";

export type {
  Compose,
  DecomposeLastChar,
  DropFinalJong,
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

export type { RegularVerb, Verb } from "./vocabulary/verb.js";
export type {
  IrregularType,
  IrregularVerb,
  하다Verb,
} from "./vocabulary/irregular.js";
export type { Adjective } from "./vocabulary/adjective.js";
export type { Noun, ProperNoun } from "./vocabulary/noun.js";
export type {
  RegularVerbEntry,
  가깝다,
  가다,
  걷다,
  공부하다,
  그렇다,
  낫다,
  덥다,
  듣다,
  모르다,
  마시다,
  먹다,
  보다,
  빠르다,
  살다,
  알다,
  만들다,
  쓰다,
  끄다,
  세다,
  되다,
  아름답다,
  어떻다,
  오다,
  읽다,
  잡다,
  주다,
  짓다,
  춥다,
  이르다,
  푸르다,
  운동하다,
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
export type {
  르아어Vowel,
  아어,
  아어Vowel,
  양성모음,
} from "./conjugation/vowel-harmony.js";
