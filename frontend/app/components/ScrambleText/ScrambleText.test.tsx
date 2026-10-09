import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/theme";
import { ScrambleText } from "./ScrambleText";

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={system}>{ui}</ChakraProvider>);
}

describe("ScrambleText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Renders scrambled placeholder text", () => {
    renderWithChakra(<ScrambleText text="ab" charset="X" random={() => 0} setRevealed={vi.fn()} />);

    expect(screen.getByText("XX")).toBeInTheDocument();
    expect(screen.queryByText("ab")).not.toBeInTheDocument();
  });

  it("Reveals the text once the user scrolls", () => {
    renderWithChakra(
      <ScrambleText text="ab" charset="X" random={() => 0} decodeStepMs={10} revealDelayMs={0} setRevealed={vi.fn()} />
    );

    act(() => {
      window.dispatchEvent(new Event("wheel", { cancelable: true }));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByText("ab")).toBeInTheDocument();
  });

  it("keeps multi-word scrambled text on a single line (no forced break) before it's revealed", () => {
    const { container } = renderWithChakra(
      <ScrambleText text="ab cd" charset="X" random={() => 0} setRevealed={vi.fn()} />
    );

    expect(screen.getByText("XX XX")).toBeInTheDocument();
    expect(container.querySelector("br")).not.toBeInTheDocument();
  });

  it("forces multi-word text onto two lines once revealed", () => {
    const { container } = renderWithChakra(
      <ScrambleText
        text="ab cd"
        charset="X"
        random={() => 0}
        decodeStepMs={10}
        revealDelayMs={0}
        setRevealed={vi.fn()}
      />
    );

    act(() => {
      window.dispatchEvent(new Event("wheel", { cancelable: true }));
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(container.querySelector("p")).toHaveTextContent("abcd");
    expect(container.querySelector("br")).toBeInTheDocument();
  });
});
