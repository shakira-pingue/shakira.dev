import { useEffect, useRef, useState } from "react";
import { scrambleText, revealStep, initialTextScramble } from "@/utils/ScrambleText/scrambleText";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useScrollLock } from "./useScrollLock";

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>?/[]{}()_+-=";
const DEFAULT_SCRAMBLE_INTERVAL_MS = 120;
const DEFAULT_DECODE_STEP_MS = 100;
const DEFAULT_REVEAL_DELAY_MS = 0;
const DEFAULT_SCROLL_LOCK_DELAY_MS = 500;

export type UseScrambleRevealOptions = {
  charset?: string;
  random?: () => number;
  scrambleIntervalMs?: number;
  decodeStepMs?: number;
  revealDelayMs?: number;
  scrollLockDelayMs?: number;
};

export function useScrambleReveal(text: string, options: UseScrambleRevealOptions = {}) {
  const {
    charset = DEFAULT_CHARSET,
    random = Math.random,
    scrambleIntervalMs = DEFAULT_SCRAMBLE_INTERVAL_MS,
    decodeStepMs = DEFAULT_DECODE_STEP_MS,
    revealDelayMs = DEFAULT_REVEAL_DELAY_MS,
    scrollLockDelayMs = DEFAULT_SCROLL_LOCK_DELAY_MS,
  } = options;

  const [displayText, setDisplayText] = useState(() => initialTextScramble(text, charset));
  const [revealed, setRevealed] = useState(false);
  const [decoded, setDecoded] = useState(false);

  const textRef = useLatestRef(text);
  const charsetRef = useLatestRef(charset);
  const randomRef = useLatestRef(random);
  const decodeStepMsRef = useLatestRef(decodeStepMs);
  const revealDelayMsRef = useLatestRef(revealDelayMs);
  const scrollLockDelayMsRef = useLatestRef(scrollLockDelayMs);

  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(revealTimeoutRef.current), []);
  const { release } = useScrollLock(() => {
    revealTimeoutRef.current = setTimeout(() => setRevealed(true), revealDelayMsRef.current);
  });

  useEffect(() => {
    if (revealed) return;
    const id = setInterval(() => {
      setDisplayText(scrambleText(textRef.current, charsetRef.current, randomRef.current));
    }, scrambleIntervalMs);
    return () => clearInterval(id);
  }, [scrambleIntervalMs, revealed, textRef, charsetRef, randomRef]);

  useEffect(() => {
    if (!revealed) return;
    let lockedCount = 0;
    const id = setInterval(() => {
      lockedCount += 1;
      const target = textRef.current;
      setDisplayText(
        lockedCount >= target.length
          ? target
          : revealStep(target, lockedCount, charsetRef.current, randomRef.current)
      );
      if (lockedCount >= target.length) {
        clearInterval(id);
        setDecoded(true);
      }
    }, decodeStepMsRef.current);
    return () => clearInterval(id);
  }, [revealed, textRef, charsetRef, randomRef, decodeStepMsRef]);

  useEffect(() => {
    if (!decoded) return;
    const id = setTimeout(release, scrollLockDelayMsRef.current);
    return () => clearTimeout(id);
  }, [decoded, release, scrollLockDelayMsRef]);

  return { displayText, revealed, decoded };
}
