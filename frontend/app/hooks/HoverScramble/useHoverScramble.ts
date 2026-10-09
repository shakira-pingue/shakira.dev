import { useCallback, useEffect, useState } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import {
  createHoverScrambleState,
  hoverScrambleEnter,
  hoverScrambleLeave,
  hoverScrambleTick,
  isHoverScrambleAnimating,
  type HoverScrambleContext,
} from "./hoverScrambleState";

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>?/[]{}()_+-=";
const DEFAULT_STEP_MS = 70;
const DEFAULT_SETTLE_STEP_MS = 220;

export type UseHoverScrambleOptions = {
  charset?: string;
  random?: () => number;
  stepMs?: number;
  settleStepMs?: number;
};

export function useHoverScramble(
  restingText: string,
  revealedText: string,
  options: UseHoverScrambleOptions = {}
) {
  const {
    charset = DEFAULT_CHARSET,
    random = Math.random,
    stepMs = DEFAULT_STEP_MS,
    settleStepMs = DEFAULT_SETTLE_STEP_MS,
  } = options;

  const ctx: HoverScrambleContext = { restingText, revealedText, charset, random };
  const ctxRef = useLatestRef(ctx);
  const stepMsRef = useLatestRef(stepMs);
  const settleStepMsRef = useLatestRef(settleStepMs);

  const [state, setState] = useState(() => createHoverScrambleState(ctx));

  useEffect(() => {
    if (!isHoverScrambleAnimating(state.mode)) return;
    const delay = state.mode === "settling" ? settleStepMsRef.current : stepMsRef.current;
    const id = setInterval(() => {
      setState((current) => hoverScrambleTick(current, ctxRef.current));
    }, delay);
    return () => clearInterval(id);
  }, [state.mode, ctxRef, stepMsRef, settleStepMsRef]);

  const onMouseEnter = useCallback(() => {
    setState((current) => hoverScrambleEnter(current, ctxRef.current));
  }, [ctxRef]);

  const onMouseLeave = useCallback(() => {
    setState((current) => hoverScrambleLeave(current, ctxRef.current));
  }, [ctxRef]);

  return { displayText: state.displayText, onMouseEnter, onMouseLeave };
}
