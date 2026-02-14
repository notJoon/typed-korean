/**
 * !!! Test-only runtime helpers. !!!
 *
 * This project is primarily type-level, and these functions exist only to
 * validate Hangul decomposition/composition behavior in unit tests.
 */
const S_BASE = 0xac00;
const L_COUNT = 19;
const V_COUNT = 21;
const T_COUNT = 28;
const N_COUNT = V_COUNT * T_COUNT;

const CHOSEONG = [
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
] as const;

const JUNGSEONG = [
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
] as const;

const JONGSEONG = [
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
] as const;

type Cho = (typeof CHOSEONG)[number];
type Jung = (typeof JUNGSEONG)[number];
type Jong = (typeof JONGSEONG)[number];

export type DecomposedSyllable = {
  초: Cho;
  중: Jung;
  종: Jong;
};

function isSingleCharacter(ch: string): boolean {
  return [...ch].length === 1;
}

export function isHangulSyllable(ch: string): boolean {
  if (!isSingleCharacter(ch)) return false;
  const code = ch.codePointAt(0);
  if (code === undefined) return false;
  return code >= S_BASE && code <= 0xd7a3;
}

export function decomposeSyllable(ch: string): DecomposedSyllable {
  if (!isHangulSyllable(ch)) {
    throw new Error(`Not a Hangul syllable: ${ch}`);
  }

  const code = ch.codePointAt(0)!;
  const sIndex = code - S_BASE;
  const lIndex = Math.floor(sIndex / N_COUNT);
  const vIndex = Math.floor((sIndex % N_COUNT) / T_COUNT);
  const tIndex = sIndex % T_COUNT;

  return {
    초: CHOSEONG[lIndex],
    중: JUNGSEONG[vIndex],
    종: JONGSEONG[tIndex],
  };
}

export function composeSyllable(
  cho: Cho,
  jung: Jung,
  jong: Jong = null,
): string {
  const choIdx = CHOSEONG.indexOf(cho);
  const jungIdx = JUNGSEONG.indexOf(jung);
  const jongIdx = jong === null ? 0 : JONGSEONG.indexOf(jong);

  if (choIdx < 0 || jungIdx < 0 || jongIdx < 0) {
    throw new Error("Invalid jamo for composition");
  }

  const code = S_BASE + choIdx * N_COUNT + jungIdx * T_COUNT + jongIdx;
  return String.fromCharCode(code);
}

export function hasBatchim(word: string): boolean {
  if (word.length === 0) {
    throw new Error("Empty string is not allowed");
  }

  const last = [...word].at(-1)!;
  const decomposed = decomposeSyllable(last);
  return decomposed.종 !== null;
}
