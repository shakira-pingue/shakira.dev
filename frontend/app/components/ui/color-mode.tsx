"use client";

import { Button, ClientOnly, Skeleton, type HTMLChakraProps } from "@chakra-ui/react";
import { paletteRaw } from "@/theme";
import { ColorMode, useColorMode } from "@/context/ColorMode";

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
  const colorModeText = colorMode === ColorMode.DARK ? "Dark" : "Light";
  return (
    <Button
      aria-label={`Switch to ${colorModeText} mode`}
      onClick={toggleColorMode}
      boxSize="4"
      borderRadius="full"
      borderWidth="1px"
      borderColor={colorMode === ColorMode.DARK ? "primary" : "fg"}
      cursor="pointer"
      p="0"
      shape="circle"
      overflow="hidden"
      transition="transform 0.2s ease"
      _hover={{ transform: "scale(1.08)" }}
      backgroundImage={`linear-gradient(90deg, ${paletteRaw.fg[colorMode]} 50%, ${"#FFF"} 50%)`}
      {...props}
    />
  );
}
