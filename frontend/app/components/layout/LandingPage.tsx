"use client";

import HeroVisualiser from "@/components/Hero/HeroVisualizer";
import { Box, Button, VStack } from "@chakra-ui/react/";
import { useState } from "react";

const LandingPage = () => {
  const [isCompact, setIsCompact] = useState(false);
  return (
    <Box>
      <Box
        as="header"
        position="fixed"
        h={isCompact ? "var(--navHeight)" : "100vh"}
        zIndex={20}
        w="100vw"
        overflow="hidden"
        transition="height 1600ms cubic-bezier(0.16, 1, 0.3, 1)"
      >
        <HeroVisualiser isCompact={isCompact} setIsCompact={setIsCompact} />

        {!isCompact && (
          <VStack
            position="absolute"
            inset={0}
            zIndex={2}
            justify="center"
            pointerEvents="none"
            px={6}
            textAlign="center"
          >
            <Button
              mt={8}
              pointerEvents="auto"
              onClick={() => setIsCompact(true)}
              borderRadius="full"
              bg="#31572C"
              color="#F8FAF6"
            >
              Swipe to enter
            </Button>
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default LandingPage;
