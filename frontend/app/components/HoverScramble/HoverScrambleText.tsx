"use client";

import { Span, type HTMLChakraProps } from "@chakra-ui/react";
import { useHoverScramble, type UseHoverScrambleOptions } from "@/hooks/HoverScramble/useHoverScramble";

export type HoverScrambleTextProps = HTMLChakraProps<"span"> &
  UseHoverScrambleOptions & {
    restingText: string;
    revealedText: string;
  };

export function HoverScrambleText({
  restingText,
  revealedText,
  charset,
  random,
  stepMs,
  settleStepMs,
  ...rest
}: HoverScrambleTextProps) {
  const { displayText, onMouseEnter, onMouseLeave } = useHoverScramble(restingText, revealedText, {
    charset,
    random,
    stepMs,
    settleStepMs,
  });

  return (
    <Span
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whiteSpace="nowrap"
      cursor="pointer"
      {...rest}
    >
      {displayText}
    </Span>
  );
}
