import { createSystem, defaultConfig, defineConfig, defineTextStyles } from "@chakra-ui/react";

export const paletteRaw = {
  bg: { light: "#F4F1E8", dark: "#1A1A1A" },
  fg: { light: "#2D3A1F", dark: "#201f1f" },
  primary: { light: "#2D3A1F", dark: "#F4F1E8" },
  secondary: { light: "#B8A678", dark: "#22C55E" },
  surface: { light: "#E8E2D0", dark: "#FFD84D" },
} as const;

const textStyles = defineTextStyles({
  jumbo: {
    description: "Oversized hero display text",
    value: {
      fontFamily: "jumbo",
      fontWeight: "400",
      fontSize: { base: "6xl", md: "8xl", lg: "jumbo" },
      lineHeight: "0.95",
      letterSpacing: "-0.01em",
    },
  },
  jumboBody: {
    description: "Body copy paired with the jumbo display style",
    value: {
      fontFamily: "jumboBody",
      fontWeight: "400",
      fontSize: { base: "lg", md: "xl" },
      lineHeight: "1.5",
    },
  },
  h1: {
    value: {
      fontFamily: "heading",
      fontWeight: "600",
      fontSize: { base: "4xl", md: "6xl" },
      lineHeight: "1.05",
      letterSpacing: "-0.01em",
    },
  },
  h2: {
    value: {
      fontFamily: "heading",
      fontWeight: "600",
      fontSize: { base: "3xl", md: "4xl" },
      lineHeight: "1.1",
    },
  },
  h3: {
    value: {
      fontFamily: "heading",
      fontWeight: "600",
      fontSize: { base: "xl", md: "2xl" },
      lineHeight: "1.25",
    },
  },
  h4: {
    value: {
      fontFamily: "heading",
      fontWeight: "600",
      fontSize: "lg",
      lineHeight: "1.35",
    },
  },
  bodyLg: {
    value: { fontFamily: "body", fontWeight: "400", fontSize: "lg", lineHeight: "1.6" },
  },
  body: {
    value: { fontFamily: "body", fontWeight: "400", fontSize: "md", lineHeight: "1.6" },
  },
  bodySm: {
    value: { fontFamily: "body", fontWeight: "400", fontSize: "sm", lineHeight: "1.55" },
  },
  caption: {
    value: {
      fontFamily: "body",
      fontWeight: "500",
      fontSize: "xs",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
    },
  },
});

const themeConfig = defineConfig({
  globalCss: {
    "*": {
      transitionProperty: "color, background-color, border-color, fill, stroke",
      transitionDuration: "0.6s",
      transitionTimingFunction: "ease",
    },
    "@media (prefers-reduced-motion: reduce)": {
      "& *": { transition: "none !important" },
    },
  },
  theme: {
    tokens: {
      fonts: {
        jumbo: { value: "var(--font-special-gothic), 'Arial Narrow', sans-serif" },
        jumboBody: { value: "var(--font-inter), sans-serif" },
      },
      fontSizes: {
        jumbo: { value: "10rem" },
      },
    },
    semanticTokens: {
      colors: {
        bg: { value: { _light: paletteRaw.bg.light, _dark: paletteRaw.bg.dark } },
        fg: { value: { _light: paletteRaw.fg.light, _dark: paletteRaw.fg.dark } },
        primary: { value: { _light: paletteRaw.primary.light, _dark: paletteRaw.primary.dark } },
        secondary: { value: { _light: paletteRaw.secondary.light, _dark: paletteRaw.secondary.dark } },
        surface: { value: { _light: paletteRaw.surface.light, _dark: paletteRaw.surface.dark } },
      },
      fonts: {
        heading: {
          value: {
            _light: "var(--font-fraunces), serif",
            _dark: "var(--font-space-grotesk), sans-serif",
          },
        },
        body: {
          value: {
            _light: "var(--font-sora), sans-serif",
            _dark: "var(--font-dm-sans), sans-serif",
          },
        },
      },
    },
    textStyles,
  },
});

export const system = createSystem(defaultConfig, themeConfig);
