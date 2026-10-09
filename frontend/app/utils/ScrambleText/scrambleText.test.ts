import { describe, expect, it } from "vitest";
import { scrambleText, revealStep, initialTextScramble, unrevealStep, settleStep } from "./scrambleText";

describe("scrambleText", () => {
  it("replaces every non-space character using the provided random source", () => {
    const result = scrambleText("abc", "XYZ", () => 0);
    expect(result).toBe("XXX");
  });

  it("preserves spaces at their original positions", () => {
    const result = scrambleText("a b", "X", () => 0);
    expect(result).toBe("X X");
  });
});

describe("initialTextScramble", () => {
  it("produces the exact same output every call for the same inputs (SSR/client parity)", () => {
    const first = initialTextScramble("Shakira Pingue", "ABCXYZ");
    const second = initialTextScramble("Shakira Pingue", "ABCXYZ");
    expect(first).toBe(second);
  });

  it("preserves spaces and the original length", () => {
    const result = initialTextScramble("ab cd", "X");
    expect(result).toBe("XX XX");
  });

  it("does not return the original text", () => {
    const result = initialTextScramble("abc", "XYZ");
    expect(result).not.toBe("abc");
  });
});

describe("revealStep", () => {
  it("reveals the real characters up to lockedCount and scrambles the rest, preserving spaces", () => {
    const result = revealStep("ab cd", 2, "X", () => 0);
    expect(result).toBe("ab XX");
  });

  it("returns exactly the target text once lockedCount reaches the text length", () => {
    const result = revealStep("abcd", 4, "X", () => 0);
    expect(result).toBe("abcd");
  });
});

describe("unrevealStep", () => {
  it("shows the revealed text in full when lockedCount equals its length", () => {
    const result = unrevealStep("ABCDE", "XY", 5, "Z", () => 0);
    expect(result).toBe("ABCDE");
  });

  it("keeps the real prefix until it unlocks, scrambling the tail first", () => {
    const result = unrevealStep("ABCDE", "XY", 3, "Z", () => 0);
    expect(result).toBe("ABCZZ");
  });

  it("scrambles the rest of the tail as more of the prefix unlocks", () => {
    const result = unrevealStep("ABCDE", "XY", 2, "Z", () => 0);
    expect(result).toBe("ABZZZ");
  });

  it("settles the leading characters to restingText once they unlock, keeping the scrambled tail", () => {
    const result = unrevealStep("ABCDE", "XY", 0, "Z", () => 0);
    expect(result).toBe("XYZZZ");
  });
});

describe("settleStep", () => {
  it("leaves the about-to-settle character untouched (still real) until it starts scrambling", () => {
    const result = settleStep("ABCDE", "XY", 2, false, "Z", () => 0);
    expect(result).toBe("ABZZZ");
  });

  it("scrambles the about-to-settle character instead of revealing restingText directly", () => {
    const result = settleStep("ABCDE", "XY", 2, true, "Z", () => 0);
    expect(result).toBe("AZZZZ");
  });

  it("keeps already-settled characters locked to restingText while the next one is untouched", () => {
    const result = settleStep("ABCDE", "XY", 1, false, "Z", () => 0);
    expect(result).toBe("AYZZZ");
  });

  it("scrambles the next character while earlier ones stay settled", () => {
    const result = settleStep("ABCDE", "XY", 1, true, "Z", () => 0);
    expect(result).toBe("ZYZZZ");
  });

  it("matches unrevealStep's fully-settled output once lockedCount reaches 0", () => {
    const result = settleStep("ABCDE", "XY", 0, false, "Z", () => 0);
    expect(result).toBe("XYZZZ");
  });
});