import { describe, expect, it } from "vitest";
import {
  composeSyllable,
  decomposeSyllable,
  hasBatchim,
  isHangulSyllable,
} from "../src/hangul-unicode/runtime.js";

describe("hangul-unicode runtime", () => {
  it("decomposes Hangul syllables", () => {
    expect(decomposeSyllable("먹")).toEqual({ 초: "ㅁ", 중: "ㅓ", 종: "ㄱ" });
    expect(decomposeSyllable("가")).toEqual({ 초: "ㄱ", 중: "ㅏ", 종: null });
  });

  it("composes Hangul syllables", () => {
    expect(composeSyllable("ㅇ", "ㅘ", null)).toBe("와");
    expect(composeSyllable("ㅆ", "ㅓ", null)).toBe("써");
    expect(composeSyllable("ㄱ", "ㅏ", "ㄴ")).toBe("간");
  });

  it("checks batchim", () => {
    expect(hasBatchim("밥")).toBe(true);
    expect(hasBatchim("사과")).toBe(false);
  });

  it("checks syllable range", () => {
    expect(isHangulSyllable("가")).toBe(true);
    expect(isHangulSyllable("A")).toBe(false);
  });

  it("throws on invalid inputs", () => {
    expect(() => decomposeSyllable("A")).toThrow();
    expect(() => hasBatchim("")).toThrow();
  });
});
