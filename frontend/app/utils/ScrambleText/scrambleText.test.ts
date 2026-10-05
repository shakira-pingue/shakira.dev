import { describe, expect, it } from "vitest";
import { scrambleText, revealStep, initialTextScramble } from "./scrambleText";

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