"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ReactNode } from "react";
import { system } from "@/theme";
import { ColorModeProvider } from "@/context/ColorMode";

export function Provider({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  );
}
