"use client";

import { ThemeProvider, useTheme, type ThemeProviderProps } from "next-themes";

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
