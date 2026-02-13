/**
 * Codegen script for Hangul syllable decomposition/composition tables.
 *
 * Generates:
 *   - `src/generated/jamo-table.gen.ts`   — JamoTable (syllable to jamo (자모) breakdown)
 *   - `src/generated/compose-table.gen.ts` — ComposeTable (jamo triple to syllable)
 *
 * ComposeTable is vocabulary-driven: it simulates conjugation for each vocabulary
 * entry and only generates entries that are actually needed. This keeps the table
 * minimal (~50-100 entries instead of 11,172).
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { VERBS } from "./vocabulary.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Unicode constants for Hangul syllable block

const S_BASE = 0xac00; // '가' (first syllable)
const L_COUNT = 19; // choseong (initial consonant) count
const V_COUNT = 21; // jungseong (medial vowel) count
const T_COUNT = 28; // jongseong (final consonant) count, including none
const N_COUNT = V_COUNT * T_COUNT; // 588

/** Compatibility jamo — the user-facing forms mapped from algorithmic indices. */
const CHOSEONG: string[] = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const JUNGSEONG: string[] = [
  "ㅏ",
  "ㅐ",
  "ㅑ",
  "ㅒ",
  "ㅓ",
  "ㅔ",
  "ㅕ",
  "ㅖ",
  "ㅗ",
  "ㅘ",
  "ㅙ",
  "ㅚ",
  "ㅛ",
  "ㅜ",
  "ㅝ",
  "ㅞ",
  "ㅟ",
  "ㅠ",
  "ㅡ",
  "ㅢ",
  "ㅣ",
];

const JONGSEONG: (string | null)[] = [
  null,
  "ㄱ",
  "ㄲ",
  "ㄳ",
  "ㄴ",
  "ㄵ",
  "ㄶ",
  "ㄷ",
  "ㄹ",
  "ㄺ",
  "ㄻ",
  "ㄼ",
  "ㄽ",
  "ㄾ",
  "ㄿ",
  "ㅀ",
  "ㅁ",
  "ㅂ",
  "ㅄ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

const YANGSEONG = new Set(["ㅏ", "ㅗ", "ㅑ", "ㅛ"]);

/**
 * Compose a syllable from jamo indices.
 * Returns the codepoint: SBase + (cho * NCount) + (jung * TCount) + jong
 */
function composeSyllable(
  choIdx: number,
  jungIdx: number,
  jongIdx: number,
): number {
  return S_BASE + choIdx * N_COUNT + jungIdx * T_COUNT + jongIdx;
}

/**
 * Decompose a Hangul syllable codepoint into choseong, jungseong, jongseong indices,
 * then map each to its compatibility jamo character.
 */
function decompose(code: number) {
  const sIndex = code - S_BASE;
  const lIndex = Math.floor(sIndex / N_COUNT);
  const vIndex = Math.floor((sIndex % N_COUNT) / T_COUNT);
  const tIndex = sIndex % T_COUNT;
  return {
    cho: CHOSEONG[lIndex],
    jung: JUNGSEONG[vIndex],
    jong: JONGSEONG[tIndex],
  };
}

/** Decompose a character (by string) into jamo. */
function decomposeChar(ch: string) {
  const code = ch.codePointAt(0)!;
  return decompose(code);
}

const CONTRACTION_TABLE: Record<string, string> = {
  ㅏ_ㅏ: "ㅏ", // 가 + 아 → 가
  ㅗ_ㅏ: "ㅘ", // 오 + 아 → 와
  ㅜ_ㅓ: "ㅝ", // 주 + 어 → 줘
  ㅡ_ㅓ: "ㅓ", // 쓰 + 어 → 써
  ㅣ_ㅓ: "ㅕ", // 마시 + 어 → 마셔
  ㅐ_ㅓ: "ㅐ", // 보내 + 어 → 보내
  ㅏ_ㅕ: "ㅐ", // 하 + 여 → 해
  ㅓ_ㅓ: "ㅓ", // 서 + 어 → 서
  ㅔ_ㅓ: "ㅔ", // ㅎ 불규칙 altStem 처리
};

/**
 * Apply vowel contraction rules. Returns the contracted jungseong, or null if no contraction.
 *
 * @see SPEC.md section 5.3 for the full contraction table.
 */
function contract(stemVowel: string, endingVowel: string): string | null {
  return CONTRACTION_TABLE[`${stemVowel}_${endingVowel}`] ?? null;
}

/**
 * Collect all ComposeTable keys needed by the vocabulary.
 *
 * Simulates conjugation for each stem to determine which
 * `cho_jung_jong` combinations the type-level engine will require.
 */
function collectNeededKeys(): Set<string> {
  const needed = new Set<string>();

  /** Helper: add a compose key. Omits jongseong segment when null. */
  function add(cho: string, jung: string, jong: string | null) {
    const key = jong === null ? `${cho}_${jung}` : `${cho}_${jung}_${jong}`;
    needed.add(key);
  }

  for (const [stem, irregType, altStem] of VERBS) {
    // Stems to process: original stem (for consonant endings) + altStem (for vowel endings)
    const stemsForVowelEnding =
      irregType === "하"
        ? [] // 하다 contraction (하+여→해) is handled entirely in the special block below
        : altStem
          ? [altStem]
          : [stem];

    for (const s of stemsForVowelEnding) {
      const lastCh = s.at(-1)!;
      const { cho, jung, jong } = decomposeChar(lastCh);

      if (jong !== null) {
        // Closed syllable — no contraction or jongseong insertion needed
        continue;
      }

      // Determine connecting vowel via vowel harmony (모음조화)
      const connVowel = YANGSEONG.has(jung) ? "ㅏ" : "ㅓ";

      // Vowel contraction
      const contracted = contract(jung, connVowel);
      if (contracted) {
        add(cho, contracted, null); // 해요체: 와, 줘, 써, etc.
        add(cho, contracted, "ㅆ"); // past tense: 왔, 줬, 썼, etc.
      }

      // Jongseong insertion for open syllables (합쇼체 ㅂ니다, 평서 ㄴ다, 관형 ㄹ)
      add(cho, jung, "ㅂ");
      add(cho, jung, "ㄴ");
      add(cho, jung, "ㄹ");
    }

    // 하다 special: 하 + 여 → 해
    if (irregType === "하") {
      const { cho } = decomposeChar("하");
      add(cho, "ㅐ", null); // 해
      add(cho, "ㅐ", "ㅆ"); // 했
      add(cho, "ㅏ", "ㅂ"); // 합 (합쇼체)
      add(cho, "ㅏ", "ㄴ"); // 한 (평서)
      add(cho, "ㅏ", "ㄹ"); // 할 (관형)
    }
  }

  return needed;
}

// Table generation

/**
 * Generate `JamoTable` — maps each of the 11,172 syllables to
 * `{ 초: choseong; 중: jungseong; 종: jongseong | null }`.
 */
function genJamoTable(): string {
  const lines: string[] = [];
  lines.push("// @generated by scripts/gen-jamo-table.ts — DO NOT EDIT");
  lines.push("");
  lines.push("export type JamoTable = {");

  for (let i = 0; i < L_COUNT * N_COUNT; i++) {
    const code = S_BASE + i;
    const char = String.fromCharCode(code);
    const { cho, jung, jong } = decompose(code);
    const jongValue = jong === null ? "null" : `"${jong}"`;
    lines.push(
      `  "${char}": { 초: "${cho}"; 중: "${jung}"; 종: ${jongValue} };`,
    );
  }

  lines.push("};");
  lines.push("");
  return lines.join("\n");
}

/**
 * Generate vocabulary-driven `ComposeTable`.
 *
 * Only includes `cho_jung_jong → syllable` entries that the conjugation
 * engine actually needs, as determined by simulating conjugation for
 * each vocabulary entry.
 */
function genComposeTable(keys: Set<string>): string {
  const entries: Array<{ key: string; char: string }> = [];

  for (const key of [...keys].sort()) {
    const parts = key.split("_");
    const cho = parts[0];
    const jung = parts[1];
    const jong = parts[2] ?? null; // absent segment means no jongseong
    const choIdx = CHOSEONG.indexOf(cho);
    const jungIdx = JUNGSEONG.indexOf(jung);
    const jongIdx = jong === null ? 0 : JONGSEONG.indexOf(jong);
    const code = composeSyllable(choIdx, jungIdx, jongIdx);
    entries.push({ key, char: String.fromCharCode(code) });
  }

  const lines: string[] = [];
  lines.push("// @generated by scripts/gen-jamo-table.ts — DO NOT EDIT");
  lines.push("");
  lines.push("export type ComposeTable = {");
  for (const { key, char } of entries) {
    lines.push(`  "${key}": "${char}";`);
  }
  lines.push("};");
  lines.push("");
  return lines.join("\n");
}

// Table generation

const outDir = resolve(__dirname, "../src/generated");

writeFileSync(resolve(outDir, "jamo-table.gen.ts"), genJamoTable(), "utf-8");
console.log(
  `Done: src/generated/jamo-table.gen.ts (${L_COUNT * N_COUNT} entries)`,
);

const neededKeys = collectNeededKeys();
const composeContent = genComposeTable(neededKeys);
const composeEntryCount = neededKeys.size;
writeFileSync(resolve(outDir, "compose-table.gen.ts"), composeContent, "utf-8");
console.log(
  `Done: src/generated/compose-table.gen.ts (${composeEntryCount} entries, vocabulary-driven)`,
);
