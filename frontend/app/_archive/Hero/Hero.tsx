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

const Hero = () => {
  return (
    <Box position="relative">
      <HeroVisualiser isCompact={false} setIsCompact={() => false} />
    </Box>
  );
};

export default Hero;
