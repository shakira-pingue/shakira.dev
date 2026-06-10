"use client";

import HeroVisualiser from "@/components/Hero/HeroVisualizer";
import { Box } from "@chakra-ui/react/";
import { useState } from "react";

const LandingPage = () => {
  const [isCompact, setIsCompact] = useState(false);
  return (
    <Box minHeight="100vh" bg="var(--background)">
      <Box
        as="section"
        position="relative"
        minH="100vh"
        w="100%"
        overflow="scroll"
      >
        <HeroVisualiser />

        <Box
          position="absolute"
          inset={0}
          zIndex={2}
          pointerEvents="none"
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          px={6}
        >
          {/* Add your hero text / swipe button here */}
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
