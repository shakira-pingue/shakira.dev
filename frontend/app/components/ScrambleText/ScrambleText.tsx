"use client";

import { Span, type HTMLChakraProps } from "@chakra-ui/react";
import { useScrambleReveal, type UseScrambleRevealOptions } from "@/hooks/ScrambleText/useScrambleReveal";

export type ScrambleTextProps = HTMLChakraProps<"span"> &
  UseScrambleRevealOptions & {
    text: string;
    revealedStyle?: HTMLChakraProps<"span">;
  };

export function ScrambleText({
  text,
  charset,
  random,
  scrambleIntervalMs,
  decodeStepMs,
  revealDelayMs,
  scrollLockDelayMs,
  revealedStyle,
  ...rest
}: ScrambleTextProps) {
  const { displayText, revealed } = useScrambleReveal(text, {
    charset,
    random,
    scrambleIntervalMs,
    decodeStepMs,
    revealDelayMs,
    scrollLockDelayMs,
  });

  const stateStyle: HTMLChakraProps<"span"> = revealed
    ? { justifyContent: "flex-start", alignSelf: "end", ...revealedStyle }
    : { justifyContent: "center", alignContent: "center" };

  return (
    <Span
      as="p"
      transition="all 1.4s cubic-bezier(0.16, 1, 0.3, 1)"
      {...rest}
      {...stateStyle}
    >
      {displayText}
    </Span>
  );
}
