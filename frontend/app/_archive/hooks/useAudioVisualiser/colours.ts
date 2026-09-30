import * as THREE from "three";

export const COLOURS = {
  background: new THREE.Color(0xf7f4ee),
  // background: new THREE.Color(0xf7faf7), pale green

  base: new THREE.Color(0xcfe3c7),

  glowSoft: new THREE.Color(0x8fcf86),
  glowWarm: new THREE.Color(0x6dbd6d),
  glowHot: new THREE.Color(0x4cae4c),
};

export function createCubeMaterial() {
  return new THREE.MeshStandardMaterial({
    color: COLOURS.base,
    emissive: COLOURS.glowSoft,
    emissiveIntensity: 0.04,
    roughness: 0.08,
    metalness: 0.02,
    transparent: true,
    opacity: 1,
  });
}

export function updateCubeColour(
  material: THREE.MeshStandardMaterial,
  bandEnergy: number,
  onset: number,
  opacity: number,
) {
  const warmth = THREE.MathUtils.clamp(bandEnergy * 0.65 + onset * 0.25, 0, 1);
  const heat = THREE.MathUtils.clamp(onset * 0.8 + bandEnergy * 0.35, 0, 1);

  material.color.copy(COLOURS.base).lerp(COLOURS.glowWarm, warmth);
  material.emissive.copy(COLOURS.glowSoft).lerp(COLOURS.glowHot, heat);

  material.opacity = opacity;
  material.emissiveIntensity =
    opacity * (0.06 + bandEnergy * 0.65 + onset * 0.85);
}
