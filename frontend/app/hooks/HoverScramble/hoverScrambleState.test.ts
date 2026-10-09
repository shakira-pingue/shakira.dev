import { describe, expect, it } from "vitest";
import {
  createHoverScrambleState,
  hoverScrambleEnter,
  hoverScrambleLeave,
  hoverScrambleTick,
  type HoverScrambleContext,
} from "./hoverScrambleState";

const ctx: HoverScrambleContext = {
  restingText: "AB",
  revealedText: "XYZWQ",
  charset: "Z",
  random: () => 0,
};

describe("hoverScrambleState", () => {
  it("starts resting, showing the literal resting text", () => {
    const state = createHoverScrambleState(ctx);
    expect(state.mode).toBe("resting");
    expect(state.displayText).toBe("AB");
  });

  it("walks the full hover-in sequence: unsettle -> grow -> decode -> revealed", () => {
    let state = createHoverScrambleState(ctx);
    state = hoverScrambleEnter(state, ctx);
    expect(state.mode).toBe("unsettling");

    state = hoverScrambleTick(state, ctx);
    expect(state.displayText).toBe("ZB");

    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("resizing");
    expect(state.displayText).toBe("ZZ");

    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("resizing");
    expect(state.displayText).toBe("ZZZ");

    state = hoverScrambleTick(state, ctx);
    expect(state.displayText).toBe("ZZZZ");

    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("revealing");
    expect(state.displayText).toBe("ZZZZZ");

    state = hoverScrambleTick(state, ctx);
    expect(state.displayText).toBe("XZZZZ");
    state = hoverScrambleTick(state, ctx);
    expect(state.displayText).toBe("XYZZZ");
    state = hoverScrambleTick(state, ctx);
    expect(state.displayText).toBe("XYZZZ");
    state = hoverScrambleTick(state, ctx);
    expect(state.displayText).toBe("XYZWZ");
    expect(state.mode).toBe("revealing");
    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("revealed");
    expect(state.displayText).toBe("XYZWQ");
  });

  it("walks the full hover-out sequence: fast tail-scramble -> shrink away -> dedicated head-settle -> resting", () => {
    let state = createHoverScrambleState(ctx);
    state = { ...state, mode: "revealed", displayText: ctx.revealedText };

    state = hoverScrambleLeave(state, ctx);
    expect(state.mode).toBe("unrevealing");
    expect(state.displayText).toBe("XYZWQ");

    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("unrevealing");
    expect(state.displayText).toBe("XYZWZ");
    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("unrevealing");
    expect(state.displayText).toBe("XYZZZ");
    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("resizing");
    expect(state.displayText).toBe("XYZZZ");

    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("resizing");
    expect(state.displayText).toBe("XYZZ");
    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("resizing");
    expect(state.displayText).toBe("XYZ");
    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("settling");
    expect(state.displayText).toBe("XY");

    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("settling");
    expect(state.displayText).toBe("XZ");
    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("settling");
    expect(state.displayText).toBe("XZ");
    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("settling");
    expect(state.displayText).toBe("XZ");
    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("settling");
    expect(state.displayText).toBe("XB");

    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("settling");
    expect(state.displayText).toBe("ZB");
    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("settling");
    expect(state.displayText).toBe("ZB");
    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("settling");
    expect(state.displayText).toBe("ZB");
    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("resting");
    expect(state.displayText).toBe("AB");
  });

  it("reverses mid-grow when the mouse leaves before it finishes", () => {
    let state = createHoverScrambleState(ctx);
    state = hoverScrambleEnter(state, ctx);
    state = hoverScrambleTick(state, ctx);
    state = hoverScrambleTick(state, ctx);
    state = hoverScrambleTick(state, ctx);

    state = hoverScrambleLeave(state, ctx);
    expect(state.mode).toBe("resizing");

    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("resting");
    expect(state.displayText).toBe("AB");
  });

  it("reverses mid-reveal when the mouse leaves before it finishes, always via unrevealing first", () => {
    let state = createHoverScrambleState(ctx);
    state = { ...state, mode: "revealing", count: 2, displayText: "XYZZZ" };

    state = hoverScrambleLeave(state, ctx);
    expect(state.mode).toBe("unrevealing");

    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("resizing");
  });

  it("reverses mid-reveal (above the settle boundary) when the mouse leaves before it finishes", () => {
    let state = createHoverScrambleState(ctx);
    state = { ...state, mode: "revealing", count: 3, displayText: "XYZZZ" };

    state = hoverScrambleLeave(state, ctx);
    expect(state.mode).toBe("unrevealing");

    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("resizing");
  });

  it("resumes revealing when the mouse re-enters during unrevealing", () => {
    let state = createHoverScrambleState(ctx);
    state = { ...state, mode: "unrevealing", count: 3, displayText: "XYZZZ" };

    state = hoverScrambleEnter(state, ctx);
    expect(state.mode).toBe("revealing");

    state = hoverScrambleTick(state, ctx);
    expect(state.displayText).toBe("XYZWZ");
  });

  it("resumes growing (not revealing directly) when the mouse re-enters during settling", () => {
    let state = createHoverScrambleState(ctx);
    state = { ...state, mode: "settling", count: 1, displayText: "XB" };

    state = hoverScrambleEnter(state, ctx);
    expect(state.mode).toBe("resizing");
    expect(state.displayText.length).toBe(2);

    state = hoverScrambleTick(state, ctx);
    expect(state.mode).toBe("resizing");
    expect(state.displayText.length).toBe(3);
  });
});
