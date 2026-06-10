"use client";

import { Box, Button, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { getTracks } from "@/api";
import { Track } from "@/types/tracks";
import { useAudioVisualiser } from "@/hooks/useAudioVisualiser/useAudioVisualiser";

export default function HeroVisualiser() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    getTracks().then(setTracks).catch(console.error);
  }, []);

  const { isPlaying, isLoading, togglePlay } = useAudioVisualiser(
    mountRef,
    tracks,
  );

  return (
    <Box
      ref={mountRef}
      position="absolute"
      inset={0}
      zIndex={1}
      w="100vw"
      h="100vh"
      overflow="hidden"
    />
  );
}
