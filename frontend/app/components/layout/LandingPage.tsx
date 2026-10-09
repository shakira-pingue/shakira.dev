"use client";

import { Box, Card, Text } from "@chakra-ui/react/";
import { ScrambleText } from "@/components/ScrambleText/ScrambleText";
import { useState } from "react";
import { ArrowDown } from "lucide-react";

const LandingPage = () => {
  const [revealed, setRevealed] = useState(false);

  return (
    <Box width="100%" height="100%">
      <Box
        width="100%"
        maxW="100%"
        height="90vh"
        bg="bg"
        display="grid"
        gridTemplateRows={revealed ? "1fr" : "1fr auto"}
        gridTemplateColumns={revealed ? "1fr auto" : "1fr"}
        px={6}
        py={12}
        gap={4}
        overflow="hidden"
      >
        <Box
          gridColumn="1"
          gridRow="1"
          minW={0}
          display="flex"
          alignItems="center"
        >
        </Box>
        <Box
          gridColumn={revealed ? "2" : "1"}
          gridRow={revealed ? "1" : "2"}
          display="flex"
          flexDirection={revealed ? { base: "column", md: "row" } : "row"}
          alignItems={revealed ? { base: "center", md: "flex-end" } : "flex-end"}
          justifyContent={revealed ? "flex-end" : "center"}
          alignContent="center"
          gap={2}
        >
          <Text
            color="primary"
            width={revealed ? "auto" : "auto"}
            height="auto"
            whiteSpace="nowrap"
            writingMode={revealed ? { base: "vertical-rl", md: "horizontal-tb" } : "horizontal-tb"}
            justifyContent={revealed ? "flex-end" : "center"}
            rotate={revealed ? { base: "180deg", md: "0deg" } : "0deg"}
            textAlign={revealed ? "right" : "center"}
          >
            Scroll to explore
          </Text>
          <ArrowDown className="bounce" aria-hidden="true" />
        </Box>
      </Box>
      <Box minH="100vh" w="100vw" bg="fg"></Box>
    </Box>
  );
};

export default LandingPage;
