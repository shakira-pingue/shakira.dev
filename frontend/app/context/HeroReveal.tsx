"use client";

import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

type HeroRevealContextValue = {
  heroRevealed: boolean;
  setHeroRevealed: Dispatch<SetStateAction<boolean>>;
};

const HeroRevealContext = createContext<HeroRevealContextValue | null>(null);

export function HeroRevealProvider({ children }: { children: ReactNode }) {
  const [heroRevealed, setHeroRevealed] = useState(false);
  return (
    <HeroRevealContext.Provider value={{ heroRevealed, setHeroRevealed }}>
      {children}
    </HeroRevealContext.Provider>
  );
}

export function useHeroReveal() {
  const ctx = useContext(HeroRevealContext);
  if (!ctx) throw new Error("useHeroReveal must be used within a HeroRevealProvider");
  return ctx;
}
