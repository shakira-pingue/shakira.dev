import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useHoverScramble } from "./useHoverScramble";

describe("useHoverScramble", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts showing the literal resting text, not animating", () => {
    const { result } = renderHook(() => useHoverScramble("AB", "XYZWQ", { stepMs: 50 }));
    expect(result.current.displayText).toBe("AB");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current.displayText).toBe("AB");
  });

  it("animates toward the revealed text once onMouseEnter fires, and gets there", () => {
    const { result } = renderHook(() =>
      useHoverScramble("AB", "XYZWQ", { stepMs: 10, random: () => 0, charset: "Z" })
    );

    act(() => {
      result.current.onMouseEnter();
    });
    act(() => {
      vi.advanceTimersByTime(10 * 20);
    });

    expect(result.current.displayText).toBe("XYZWQ");
  });

  it("animates back to the resting text once onMouseLeave fires after being revealed", () => {
    const { result } = renderHook(() =>
      useHoverScramble("AB", "XYZWQ", { stepMs: 10, settleStepMs: 10, random: () => 0, charset: "Z" })
    );

    act(() => {
      result.current.onMouseEnter();
    });
    act(() => {
      vi.advanceTimersByTime(10 * 20);
    });
    expect(result.current.displayText).toBe("XYZWQ");

    act(() => {
      result.current.onMouseLeave();
    });
    act(() => {
      vi.advanceTimersByTime(10 * 20);
    });

    expect(result.current.displayText).toBe("AB");
  });

  it("uses a separate, slower interval specifically while settling, so the head-settle is perceptible", () => {
    const { result } = renderHook(() =>
      useHoverScramble("AB", "XYZWQ", { stepMs: 10, settleStepMs: 100, random: () => 0, charset: "Z" })
    );

    act(() => {
      result.current.onMouseEnter();
    });
    act(() => {
      vi.advanceTimersByTime(10 * 20);
    });
    expect(result.current.displayText).toBe("XYZWQ");

    act(() => {
      result.current.onMouseLeave();
    });
    act(() => {
      vi.advanceTimersByTime(10 * 6);
    });
    expect(result.current.displayText).toBe("XY");

    act(() => {
      vi.advanceTimersByTime(99); // just under one settle step -> no change yet
    });
    expect(result.current.displayText).toBe("XY");

    act(() => {
      vi.advanceTimersByTime(1); // completes the first settle step (100ms) -> starts scrambling
    });
    expect(result.current.displayText).toBe("XZ");

    act(() => {
      vi.advanceTimersByTime(100 * 2);
    });
    expect(result.current.displayText).toBe("XZ");

    act(() => {
      vi.advanceTimersByTime(100); // 4th settle step -> settles to 'B'
    });
    expect(result.current.displayText).toBe("XB");
  });
});
