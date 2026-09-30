"use client";

import { chakra, ClientOnly, Skeleton, type HTMLChakraProps } from "@chakra-ui/react";
import { ThemeProvider, useTheme, type ThemeProviderProps } from "next-themes";
import * as React from "react";
import { paletteRaw } from "@/theme";

export const ColorMode = {
  LIGHT: "light",
  DARK: "dark",
} as const;
export type ColorMode = (typeof ColorMode)[keyof typeof ColorMode];

export function ColorModeProvider(props: ThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={ColorMode.DARK}
      enableSystem={false}
      {...props}
    />
  );
}

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const colorMode = (resolvedTheme ?? ColorMode.DARK) as ColorMode;
  const toggleColorMode = () =>
    setTheme(colorMode === ColorMode.DARK ? ColorMode.LIGHT : ColorMode.DARK);
  return { colorMode, setColorMode: setTheme, toggleColorMode };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === ColorMode.DARK ? dark : light;
}

type ColorModeButtonProps = HTMLChakraProps<"button">;

export function ColorModeButton(props: ColorModeButtonProps) {
  return (
    <ClientOnly fallback={<Skeleton boxSize="4" borderRadius="full" />}>
      <ColorModeButtonInner {...props} />
    </ClientOnly>
  );
}

function ColorModeButtonInner(props: ColorModeButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <chakra.button
      type="button"
      aria-label={`Switch to ${colorMode === ColorMode.DARK ? ColorMode.LIGHT : ColorMode.DARK} mode`}
      onClick={toggleColorMode}
      boxSize="4"
      borderRadius="full"
      borderWidth="1px"
      borderColor="primary"
      cursor="pointer"
      p="0"
      overflow="hidden"
      transition="transform 0.2s ease"
      _hover={{ transform: "scale(1.08)" }}
      backgroundImage={`linear-gradient(90deg, ${paletteRaw.bg.dark} 50%, ${paletteRaw.bg.light} 50%)`}
      {...props}
    />
  );
}
