"use client";

import { Box } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { getTracks } from "@/api";
import { Track } from "@/types/tracks";
import useAudioVisualiser from "@/hooks/useAudioVisualiser/useAudioVisualiser";
import HeroControls from "./HeroControls";

type HeroVisualiserProps = {
  isCompact: boolean;
  setIsCompact: Dispatch<SetStateAction<boolean>>;
};

const HeroVisualiser = ({ isCompact, setIsCompact }: HeroVisualiserProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    getTracks().then(setTracks).catch(console.error);
  }, []);

  const {
    track,
    isPlaying,
    isLoading,
    currentTime,
    togglePlay,
    prevTrack,
    nextTrack,
  } = useAudioVisualiser(mountRef, tracks, {
    mode: isCompact ? "header" : "hero",
  });

  return (
    <Box
      position="absolute"
      top="0"
      width="100%"
      height="100%"
      overflow="hidden"
      bg="var(--background)"
    >
      <Box
        position="absolute"
        w="100vw"
        h="100vh"
        overflow="hidden"
        transform={
          isCompact
            ? "translate3d(0, 0, 0) scale(0.1)"
            : "translate3d(0, 0, 0) scale(1)"
        }
        transformOrigin="top left"
        transition="transform 1600ms cubic-bezier(0.16, 1, 0.3, 1)"
        display="flex"
      >
        <Box
          ref={mountRef}
          w="100%"
          h="100%"
          onClick={() => setIsCompact(!isCompact)}
        />
      </Box>

      <HeroControls
        track={track}
        isPlaying={isPlaying}
        isLoading={isLoading}
        currentTime={currentTime}
        togglePlay={togglePlay}
        prevTrack={prevTrack}
        nextTrack={nextTrack}
      />
    </Box>
  );
};

export default HeroVisualiser;
