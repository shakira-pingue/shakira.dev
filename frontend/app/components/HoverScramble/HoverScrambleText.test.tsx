import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/theme";
import { HoverScrambleText } from "./HoverScrambleText";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={system}>{ui}</ChakraProvider>);
}

describe("HoverScrambleText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the resting text and nothing else at rest", () => {
    renderWithChakra(<HoverScrambleText restingText="S:/" revealedText="SHAKIRA.DEV" />);

    expect(screen.getByText("S:/")).toBeInTheDocument();
  });

  it("reveals the full text on hover", () => {
    renderWithChakra(
      <HoverScrambleText
        restingText="S:/"
        revealedText="SHAKIRA.DEV"
        stepMs={10}
        random={() => 0}
        charset="Z"
      />
    );

    act(() => {
      fireEvent.mouseEnter(screen.getByText("S:/"));
    });
    act(() => {
      vi.advanceTimersByTime(10 * 30);
    });

    expect(screen.getByText("SHAKIRA.DEV")).toBeInTheDocument();
  });

  it("returns to the resting text on mouse leave", () => {
    renderWithChakra(
      <HoverScrambleText
        restingText="S:/"
        revealedText="SHAKIRA.DEV"
        stepMs={10}
        random={() => 0}
        charset="Z"
      />
    );

    const element = screen.getByText("S:/");
    act(() => {
      fireEvent.mouseEnter(element);
    });
    act(() => {
      vi.advanceTimersByTime(10 * 30);
    });
    expect(screen.getByText("SHAKIRA.DEV")).toBeInTheDocument();

    act(() => {
      fireEvent.mouseLeave(screen.getByText("SHAKIRA.DEV"));
    });
    act(() => {
      vi.advanceTimersByTime(10 * 30);
    });

    expect(screen.getByText("S:/")).toBeInTheDocument();
  });
});
