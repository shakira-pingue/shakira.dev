"use client";

import { Box } from "@chakra-ui/react";
import { Provider } from "@/components/ui/provider";
import { ColorModeButton } from "@/components/ui/color-mode";
import { fontVariables } from "@/fonts";
import { HoverScrambleText } from "@/components/HoverScramble/HoverScrambleText";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body>
        <Provider>
          <Box position="fixed" padding={6} zIndex={30} display="flex" width="100vw">
            <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
              <HoverScrambleText restingText="S:/" revealedText="SHAKIRA.DEV" fontWeight="400" />
              <ColorModeButton />
            </Box>
          </Box>
          {children}
        </Provider>
      </body>
    </html>
  );
}
