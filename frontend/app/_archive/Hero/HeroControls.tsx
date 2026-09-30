"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { Track } from "@/types/tracks";

type HeroControlsProps = {
  track: Track | undefined;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  togglePlay: () => void;
  prevTrack: () => void;
  nextTrack: () => void;
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const HeroControls = ({
  track,
  isPlaying,
  isLoading,
  currentTime,
  togglePlay,
  prevTrack,
  nextTrack,
}: HeroControlsProps) => {
  return (
    <Flex
      position="absolute"
      bottom={6}
      left="50%"
      transform="translateX(-50%)"
      align="center"
      gap={4}
      px={5}
      py={3}
      borderRadius="full"
      bg="whiteAlpha.600"
      backdropFilter="blur(12px)"
      border="1px solid"
      borderColor="blackAlpha.100"
      zIndex={10}
    >
      <Button onClick={prevTrack} variant="ghost" size="sm">
        ‹
      </Button>

      <Button
        onClick={togglePlay}
        size="sm"
        rounded="full"
        bg="#A7BFA5"
        color="#1F2A1D"
        _hover={{ bg: "#95B293" }}
        disabled={isLoading}
      >
        {isLoading ? "..." : isPlaying ? "⏸" : "▶"}
      </Button>

      <Button onClick={nextTrack} variant="ghost" size="sm">
        ›
      </Button>

      <Box flex={1} minW="120px">
        <Text fontSize="sm" fontWeight="semibold" maxLines={1}>
          {track?.title ?? "—"}
        </Text>
        <Text fontSize="xs" color="gray.500" maxLines={1}>
          {track?.artist ?? "—"}
        </Text>
      </Box>

      <Text
        fontSize="xs"
        fontFamily="mono"
        color="gray.500"
        whiteSpace="nowrap"
      >
        {formatTime(currentTime)}
      </Text>
    </Flex>
  );
};

export default HeroControls;
