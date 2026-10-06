import { useCallback, useEffect, useRef } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";

const SCROLL_KEYS = new Set(["ArrowDown", "ArrowUp", " ", "PageDown", "PageUp", "End", "Home"]);


export function useScrollLock(onFirstIntent: () => void) {
  const lockedRef = useRef(false);
  const onFirstIntentRef = useLatestRef(onFirstIntent);

  useEffect(() => {
    let started = false;

    const handleScrollIntent = (e: Event) => {
      if (!started) {
        started = true;
        lockedRef.current = true;
        onFirstIntentRef.current();
      }
      if (lockedRef.current && e.cancelable) e.preventDefault();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) handleScrollIntent(e);
    };

    window.addEventListener("wheel", handleScrollIntent, { passive: false });
    window.addEventListener("touchmove", handleScrollIntent, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleScrollIntent);
      window.removeEventListener("touchmove", handleScrollIntent);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onFirstIntentRef]);

  const release = useCallback(() => {
    lockedRef.current = false;
  }, []);

  return { release };
}
