"use client";

import { useRef } from "react";
import { Box, ClientOnly } from "@chakra-ui/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Provider } from "@/components/ui/provider";
import { ColorModeButton } from "@/components/ui/color-mode";
import { fontVariables } from "@/fonts";
import { HoverScrambleText } from "@/components/HoverScramble/HoverScrambleText";
import { CursorDot } from "@/components/CursorDot/CursorDot";
import { useHeroReveal } from "@/context/HeroReveal";

gsap.registerPlugin(useGSAP);

function HeaderBar() {
  const { heroRevealed } = useHeroReveal();
  const logoRef = useRef<HTMLDivElement>(null);
  const colorModeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.set([logoRef.current, colorModeRef.current], { transformPerspective: 800 });
    gsap.set(logoRef.current, { x: -60, rotationY: -810, autoAlpha: 0 });
    gsap.set(colorModeRef.current, { x: 60, rotationY: 810, autoAlpha: 0 });
  }, []);

  useGSAP(() => {
    if (!heroRevealed) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to([logoRef.current, colorModeRef.current], {
      x: 0,
      rotationY: 0,
      autoAlpha: 1,
      duration: reduceMotion ? 0 : 2,
      ease: "none",
    });
  }, [heroRevealed]);

  return (
    <Box position="fixed" padding={6} zIndex={30} display="flex" width="100vw">
      <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
        <Box ref={logoRef}>
          <HoverScrambleText restingText="S:/" revealedText="SHAKIRA.DEV" fontWeight="400" />
        </Box>
        <Box ref={colorModeRef}>
          <ColorModeButton />
        </Box>
      </Box>
    </Box>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body>
        <Provider>
          <ClientOnly fallback={null}>
            <CursorDot />
          </ClientOnly>
          <HeaderBar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
