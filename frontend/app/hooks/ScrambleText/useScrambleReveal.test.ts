import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useScrambleReveal } from "./useScrambleReveal";

function dispatchWheel() {
  const event = new Event("wheel", { cancelable: true });
  window.dispatchEvent(event);
  return event;
}

describe("useScrambleReveal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Starts with scrambled displayed text on load", () => {
    const { result } = renderHook(() =>
      useScrambleReveal("abc", { random: () => 0, charset: "X" })
    );

    expect(result.current.displayText).toBe("XXX");
    expect(result.current.revealed).toBe(false);
  });

  it("Re-scrambles on a set interval", () => {
    let calls = 0;
    const random = () => (calls++ % 2 === 0 ? 0 : 0.99);

    const { result } = renderHook(() =>
      useScrambleReveal("a", { random, charset: "AB", scrambleIntervalMs: 100 })
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });
    const afterFirstTick = result.current.displayText;

    act(() => {
      vi.advanceTimersByTime(100);
    });
    const afterSecondTick = result.current.displayText;

    expect(afterFirstTick).not.toBe(afterSecondTick);
    expect([afterFirstTick, afterSecondTick].sort()).toEqual(["A", "B"]);
  });

  it("Reveals the real text on scroll, decoding one character at a time", () => {
    const { result } = renderHook(() =>
      useScrambleReveal("ab", {
        random: () => 0,
        charset: "X",
        scrambleIntervalMs: 100,
        decodeStepMs: 50,
        revealDelayMs: 0,
      })
    );

    expect(result.current.displayText).toBe("XX");

    act(() => {
      dispatchWheel();
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.revealed).toBe(true);

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.displayText).toBe("aX");

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.displayText).toBe("ab");
  });

  it("Stays revealed and does not re-scramble on later scroll events", () => {
    const { result } = renderHook(() =>
      useScrambleReveal("ab", {
        random: () => 0,
        charset: "X",
        decodeStepMs: 50,
        revealDelayMs: 0,
      })
    );

    act(() => {
      dispatchWheel();
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.displayText).toBe("ab");

    act(() => {
      dispatchWheel();
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.revealed).toBe(true);
    expect(result.current.displayText).toBe("ab");
  });

  it("Pauses for revealDelayMs after the first scroll before revealing or decoding", () => {
    const { result } = renderHook(() =>
      useScrambleReveal("ab", {
        random: () => 0,
        charset: "X",
        decodeStepMs: 10,
        revealDelayMs: 1500,
      })
    );

    act(() => {
      dispatchWheel();
    });
    expect(result.current.revealed).toBe(false);
    expect(result.current.displayText).toBe("XX");

    act(() => {
      vi.advanceTimersByTime(1499);
    });
    expect(result.current.revealed).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.revealed).toBe(true);
  });

  it("Prevents the page from actually scrolling on the first scroll attempt", () => {
    renderHook(() =>
      useScrambleReveal("ab", { random: () => 0, charset: "X", decodeStepMs: 10 })
    );

    let event: Event;
    act(() => {
      event = dispatchWheel();
    });

    expect(event!.defaultPrevented).toBe(true);
  });

  it("Prevents scroll while the text is still decoding", () => {
    renderHook(() =>
      useScrambleReveal("abcd", { random: () => 0, charset: "X", decodeStepMs: 50 })
    );

    act(() => {
      dispatchWheel();
    });
    act(() => {
      vi.advanceTimersByTime(50);
    });

    let event: Event;
    act(() => {
      event = dispatchWheel();
    });

    expect(event!.defaultPrevented).toBe(true);
  });

  it("Releases the scroll lock scrollLockDelayMs after decoding finishes", () => {
    renderHook(() =>
      useScrambleReveal("ab", {
        random: () => 0,
        charset: "X",
        decodeStepMs: 10,
        scrollLockDelayMs: 3000,
      })
    );

    act(() => {
      dispatchWheel();
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    act(() => {
      vi.advanceTimersByTime(20);
    });
    act(() => {
      vi.advanceTimersByTime(2999);
    });

    let stillLocked: Event;
    act(() => {
      stillLocked = dispatchWheel();
    });
    expect(stillLocked!.defaultPrevented).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    let unlocked: Event;
    act(() => {
      unlocked = dispatchWheel();
    });
    expect(unlocked!.defaultPrevented).toBe(false);
  });
});
