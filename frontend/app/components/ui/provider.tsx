"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import { system } from "@/theme";
import { ColorModeProvider } from "@/context/ColorMode";
import { HeroRevealProvider } from "@/context/HeroReveal";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>
        <HeroRevealProvider>
          {children}
        </HeroRevealProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}
