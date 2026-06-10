import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Track, AnalysisData } from "@/types/tracks";
import { animateCube, enforceCubeOrdering } from "./animation";
import { updateCubeColour } from "./colours";
import { createScene } from "./createScene";
import { createCubeGrid } from "./createCubeGrid";

const N_BANDS = 6;
const GRID = 5;
const SPACING = 0.48;

export function useAudioVisualiser(
  mountRef: React.RefObject<HTMLDivElement | null>,
  tracks: Track[],
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analysisRef = useRef<AnalysisData | null>(null);

  const cubesRef = useRef<THREE.Mesh[]>([]);
  const basePositionsRef = useRef<THREE.Vector3[]>([]);
  const velocityRef = useRef<THREE.Vector3[]>([]);

  const fadeRef = useRef<number[]>([]);
  const fadeTargetRef = useRef<number[]>([]);
  const fadeTimerRef = useRef<number[]>([]);
  const fadeOffsetRef = useRef<THREE.Vector3[]>([]);

  const beatPulseRef = useRef(0);
  const previousOnsetRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const track = tracks[trackIndex];

  useEffect(() => {
    if (!mountRef.current || tracks.length === 0) return;

    const el = mountRef.current;
    const width = el.offsetWidth;
    const height = el.offsetHeight;

    const { scene, camera, renderer, cubeGroup } = createScene(width, height);
    el.appendChild(renderer.domElement);

    const { geometry, cubes, basePositions, offset, velocities } =
      createCubeGrid({
        group: cubeGroup,
        grid: GRID,
        spacing: SPACING,
      });

    cubesRef.current = cubes;
    basePositionsRef.current = basePositions;
    velocityRef.current = velocities;

    fadeRef.current = cubes.map(() => 0);
    fadeTargetRef.current = cubes.map(() => 0);
    fadeTimerRef.current = cubes.map(() => 1 + Math.random() * 3);
    fadeOffsetRef.current = cubes.map(() => new THREE.Vector3());

    const getFrameIndex = (analysis: AnalysisData, time: number) => {
      const index = analysis.times.findIndex((t) => t > time) - 1;
      return Math.max(0, Math.min(index, analysis.times.length - 1));
    };

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      const audio = audioRef.current;
      const analysis = analysisRef.current;

      const cubes = cubesRef.current;
      const basePositions = basePositionsRef.current;
      const fade = fadeRef.current;
      const fadeTarget = fadeTargetRef.current;
      const fadeTimer = fadeTimerRef.current;
      const fadeOffset = fadeOffsetRef.current;

      const elapsed = performance.now() * 0.001;
      const isAudioPlaying = Boolean(audio && analysis && !audio.paused);

      let frame = 0;
      let rms = 0;
      let onset = 0;

      if (audio && analysis && !audio.paused) {
        const audioTime = audio.currentTime;
        setCurrentTime(audioTime);

        frame = getFrameIndex(analysis, audioTime);
        rms = analysis.rms[frame] ?? 0;
        onset = analysis.onset[frame] ?? 0;
      }

      const beatStarted = onset > 0.35 && previousOnsetRef.current <= 0.35;

      if (beatStarted) {
        beatPulseRef.current = Math.max(beatPulseRef.current, onset);
      }

      beatPulseRef.current *= 0.88;
      previousOnsetRef.current = onset;

      const beatPulse = beatPulseRef.current;
      const center = (GRID - 1) / 2;

      cubes.forEach((cube, i) => {
        const base = basePositions[i];

        const xIndex = Math.round((base.x + offset) / SPACING);
        const yIndex = Math.round((base.y + offset) / SPACING);
        const zIndex = Math.round((base.z + offset) / SPACING);

        const xLayer = xIndex - center;
        const yLayer = yIndex - center;
        const zLayer = zIndex - center;

        const layerDepth = Math.max(
          Math.abs(xLayer),
          Math.abs(yLayer),
          Math.abs(zLayer),
        );

        const layerStrength = center === 0 ? 0 : layerDepth / center;

        const xNorm = xIndex / Math.max(1, GRID - 1);
        const bandIndex = Math.min(N_BANDS - 1, Math.floor(xNorm * N_BANDS));

        const bandEnergy =
          isAudioPlaying && analysis
            ? (analysis.freq_bands[bandIndex]?.[frame] ?? 0)
            : 0;

        fadeTimer[i] -= 0.016;

        const isOuterLayer = layerStrength > 0.8;

        const shouldLeave =
          isAudioPlaying &&
          isOuterLayer &&
          onset > 0.48 &&
          bandEnergy > 0.18 &&
          fadeTimer[i] <= 0;

        if (shouldLeave) {
          const cubeSeed = Math.sin(i * 19.19) * 0.5 + 0.5;

          const musicIntensity = onset * 0.55 + bandEnergy * 0.35 + rms * 0.1;

          const musicGate = THREE.MathUtils.clamp(musicIntensity, 0, 1);

          const shouldThisCubeLeave = musicGate > cubeSeed + 0.15;

          if (shouldThisCubeLeave) {
            fadeTarget[i] = 1;

            const direction = base.clone();

            if (direction.length() === 0) {
              direction.set(0, 1, 0);
            }

            direction.normalize();

            fadeOffset[i].copy(
              direction.multiplyScalar(0.65 + musicGate * 0.8),
            );

            fadeTimer[i] = THREE.MathUtils.lerp(0.9, 0.35, musicGate);
          }
        }

        if (fadeTarget[i] === 1 && fadeTimer[i] <= 0) {
          fadeTarget[i] = 0;
          const recoveryTime = THREE.MathUtils.lerp(1.4, 0.45, rms + onset);

          fadeTimer[i] = recoveryTime;
        }

        fade[i] += (fadeTarget[i] - fade[i]) * 0.075;

        const fadeAmount = THREE.MathUtils.clamp(fade[i], 0, 1);
        const cubeOpacity = THREE.MathUtils.lerp(1, 0.18, fadeAmount);

        animateCube({
          cube,
          base,
          index: i,
          velocity: velocityRef.current[i],
          elapsed,
          xLayer,
          yLayer,
          zLayer,
          layerStrength,
          beatPulse,
          bandEnergy,
          rms,
          onset,
          fadeAmount,
          fadeOffset: fadeOffset[i],
        });

        updateCubeColour(
          cube.material as THREE.MeshStandardMaterial,
          bandEnergy,
          onset,
          cubeOpacity,
        );
      });

      enforceCubeOrdering({
        cubes,
        grid: GRID,
        spacing: SPACING,
      });

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const nextWidth = el.offsetWidth;
      const nextHeight = el.offsetHeight;

      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(nextWidth, nextHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);

      geometry.dispose();

      cubes.forEach((cube) => {
        const material = cube.material as THREE.Material;
        material.dispose();
      });

      renderer.dispose();

      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [tracks, mountRef]);

  useEffect(() => {
    if (!track || tracks.length === 0) return;

    setIsLoading(true);
    setIsPlaying(false);
    setCurrentTime(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    fetch(track.analysisUrl)
      .then((res) => res.json())
      .then((data: AnalysisData) => {
        analysisRef.current = data;

        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.src = track.audioUrl;
        audio.preload = "auto";

        audio.oncanplaythrough = () => setIsLoading(false);
        audio.onloadedmetadata = () => setIsLoading(false);

        audio.onended = () => {
          setIsPlaying(false);
        };

        audio.onerror = (error) => {
          console.error("Audio error:", error);
          setIsLoading(false);
        };

        audio.load();
        audioRef.current = audio;
      })
      .catch((error) => {
        console.error("Failed to load track:", error);
        setIsLoading(false);
      });
  }, [track, tracks.length]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error("Play failed:", error);
          setIsPlaying(false);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const prevTrack = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setTrackIndex((i) => (i - 1 + tracks.length) % tracks.length);
  };

  const nextTrack = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
    setTrackIndex((i) => (i + 1) % tracks.length);
  };

  return {
    track,
    trackIndex,
    isPlaying,
    isLoading,
    currentTime,
    togglePlay,
    prevTrack,
    nextTrack,
  };
}
