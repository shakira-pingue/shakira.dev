"use client";

import { Box } from "@chakra-ui/react";
import { Provider } from "@/components/ui/provider";
import { ColorModeButton } from "@/components/ui/color-mode";
import { fontVariables } from "@/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body>
        <Provider>
          <Box position="fixed" top="5" right="5" zIndex={30}>
            <ColorModeButton />
          </Box>
          {children}
        </Provider>
      </body>
    </html>
  );
}
