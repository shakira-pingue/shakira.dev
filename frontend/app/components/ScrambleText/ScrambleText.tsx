"use client";

import { Span, type HTMLChakraProps } from "@chakra-ui/react";
import { useScrambleReveal, type UseScrambleRevealOptions } from "@/hooks/ScrambleText/useScrambleReveal";
import { Dispatch, SetStateAction, useEffect } from "react";

export type ScrambleTextProps = HTMLChakraProps<"span"> &
  UseScrambleRevealOptions & {
    text: string;
    revealedStyle?: HTMLChakraProps<"span">;
    setRevealed: Dispatch<SetStateAction<boolean>>;
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
  setRevealed,
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

  useEffect(() => {
    setRevealed(revealed);
  }, [revealed]);

  const stateStyle: HTMLChakraProps<"span"> = revealed
    ? { justifyContent: "flex-start", alignSelf: "end", ...revealedStyle }
    : { justifyContent: "center", alignContent: "center", whiteSpace: "nowrap" };

  const spaceIndex = revealed ? text.indexOf(" ") : -1;
  const content =
    spaceIndex === -1 ? (
      displayText
    ) : (
      <>
        {displayText.slice(0, spaceIndex)}
        <br />
        {displayText.slice(spaceIndex + 1)}
      </>
    );

  return (
    <Span
      as="p"
      transition="all 1.4s cubic-bezier(0.16, 1, 0.3, 1)"
      {...rest}
      {...stateStyle}
    >
      {content}
    </Span>
  );
}
