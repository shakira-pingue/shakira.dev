"use client";

import { Box, Text } from "@chakra-ui/react/";
import { ScrambleText } from "@/components/ScrambleText/ScrambleText";

const LandingPage = () => {
  return (
    <Box >
      <Box
        position="relative"
        height="80vh"
        width="100%"
        bg="bg"
        overflow="hidden"
        display="flex"
        px={6}
        py={12}
        whiteSpace="nowrap"
      >
        <ScrambleText
          text="Shakira Pingue"
          fontFamily="heading"
          fontWeight="600"
          lineHeight="1.05"
          letterSpacing="-0.01em"
          fontSize="clamp(1.75rem, 7vw, 4.5rem)"
          display="flex"
          alignSelf="center"
          width="100%"
          revealedStyle={{
            width: "50%",
            flexWrap: "wrap",
            textStyle: "jumbo",
            display: "flex",
            lineHeight: "0.8",
            textWrap: "balance",
          }}
        />
      </Box>
      <Box minH="90vh" w="100%" bg="fg"></Box>
    </Box>
  );
};

export default LandingPage;
