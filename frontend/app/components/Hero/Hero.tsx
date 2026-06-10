"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import AudioVisualiser from "@/components/sections/AudioVisualiser";
import HeroVisualiser from "./HeroVisualizer";

export default function Hero() {
  return (
    <Box position="relative">
      <HeroVisualiser />
    </Box>
  );
}
