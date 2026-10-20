"use client";

import { useEffect, useRef } from "react";
import { Box } from "@chakra-ui/react";
import gsap from "gsap";
import { useColorModeValue } from "@/context/ColorMode";

const DOT_SIZE = 6;

export function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const dotFill = useColorModeValue("#22bc3e", "#FFFFFF");

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const setX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3" });
    const setY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3" });

    const handleMove = (e: MouseEvent) => {
      setX(e.clientX - DOT_SIZE / 2);
      setY(e.clientY - DOT_SIZE / 2);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <Box
      ref={dotRef}
      className="cursor-dot"
      position="fixed"
      top={0}
      left={0}
      boxSize={`${DOT_SIZE}px`}
      borderRadius="full"
      bg={dotFill}
      pointerEvents="none"
      zIndex={9999}
      style={{ mixBlendMode: "difference" }}
    />
  );
}
