"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import useAudioVisualiser from "@/hooks/useAudioVisualiser/useAudioVisualiser";
import { getTracks } from "@/api";
import { Track } from "@/types/tracks";

const btnStyle: CSSProperties = {
  background: "rgba(168,197,160,0.08)",
  border: "0.5px solid rgba(168,197,160,0.2)",
  borderRadius: "8px",
  color: "#A8C5A0",
  fontSize: "18px",
  width: "36px",
  height: "36px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

export default function AudioVisualiser() {
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
  } = useAudioVisualiser(mountRef, tracks);

  if (tracks.length === 0) return null;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        ref={mountRef}
        style={{
          width: "100%",
          height: "380px",
          borderRadius: "12px",
          overflow: "hidden",
          background: "#ffffff",
          border: "0.5px solid rgba(168,197,160,0.12)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0.75rem 1rem",
          background: "rgba(168,197,160,0.04)",
          border: "0.5px solid rgba(168,197,160,0.12)",
          borderRadius: "12px",
        }}
      >
        <button onClick={prevTrack} style={btnStyle}>
          ‹
        </button>

        <button onClick={togglePlay} disabled={isLoading} style={btnStyle}>
          {isLoading ? "..." : isPlaying ? "⏸" : "▶"}
        </button>

        <button onClick={nextTrack} style={btnStyle}>
          ›
        </button>

        <div style={{ flex: 1 }}>
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              color: "#1a2418",
              fontWeight: 500,
            }}
          >
            {track?.title}
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "rgba(168,197,160,0.8)",
            }}
          >
            {track?.artist}
          </p>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: "11px",
            color: "rgba(168,197,160,0.5)",
            fontFamily: "monospace",
          }}
        >
          {formatTime(currentTime)}
        </p>
      </div>
    </div>
  );
}
