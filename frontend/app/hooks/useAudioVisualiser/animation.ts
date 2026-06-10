import * as THREE from "three";
import { VisualiserMode } from "./useAudioVisualiser";

type AnimateCubeParams = {
  cube: THREE.Mesh;
  base: THREE.Vector3;
  index: number;
  velocity: THREE.Vector3;
  fadeAmount: number;
  fadeOffset: THREE.Vector3;

  elapsed: number;

  xLayer: number;
  yLayer: number;
  zLayer: number;

  layerStrength: number;

  beatPulse: number;
  bandEnergy: number;
  rms: number;
  onset: number;
  mode: VisualiserMode;
};

export function animateCube({
  cube,
  base,
  index,
  velocity,
  fadeAmount,
  fadeOffset,
  elapsed,
  xLayer,
  yLayer,
  zLayer,
  layerStrength,
  beatPulse,
  bandEnergy,
  rms,
  onset,
  mode,
}: AnimateCubeParams) {
  const uniqueA = Math.sin(index * 12.9898) * 0.5 + 0.5;
  const uniqueB = Math.sin(index * 78.233) * 0.5 + 0.5;
  const uniqueC = Math.cos(index * 37.719) * 0.5 + 0.5;

  if (mode === "header") {
    const cubesPerBar = 25;
    const barIndex = Math.floor(index / cubesPerBar);
    const cubeInBar = index % cubesPerBar;

    const isVisibleBar = cubeInBar === 12;

    if (!isVisibleBar || barIndex > 4) {
      cube.visible = false;
      return;
    }

    cube.visible = true;

    const energy = THREE.MathUtils.clamp(
      bandEnergy * 0.8 + rms * 0.5 + onset * 0.35,
      0,
      1,
    );

    const baseHeight = 2.4;
    const reactiveHeight = energy * 3.4;
    const barHeight = baseHeight + reactiveHeight;

    const barSpacing = 0.42;
    const x = (barIndex - 2) * barSpacing;

    const y = barHeight / 2 - 1.2;

    cube.position.lerp(new THREE.Vector3(x, y, 0), 0.14);

    cube.scale.lerp(new THREE.Vector3(0.72, barHeight, 0.72), 0.16);

    cube.rotation.set(0, 0, 0);

    return;
  }

  cube.visible = true;

  const mainDirection = new THREE.Vector3(
    xLayer === 0 ? 0 : Math.sign(xLayer),
    yLayer === 0 ? 0 : Math.sign(yLayer),
    zLayer === 0 ? 0 : Math.sign(zLayer),
  );

  if (mainDirection.length() > 0) {
    mainDirection.normalize();
  }

  const personalDelay = THREE.MathUtils.lerp(0.65, 1.18, uniqueA);
  const personalStrength = THREE.MathUtils.lerp(0.75, 1.35, uniqueB);

  const musicActive = beatPulse > 0.02 || bandEnergy > 0.03 || rms > 0.02;

  const personalWave = musicActive
    ? Math.sin(
        elapsed * THREE.MathUtils.lerp(1.1, 2.8, uniqueC) + index * 0.37,
      ) * 0.07
    : 0;

  const audioAmount =
    beatPulse * layerStrength * personalDelay +
    bandEnergy * 0.38 +
    rms * 0.16 +
    personalWave;

  const rawDistance =
    Math.max(0, audioAmount) * layerStrength * personalStrength * 1.08;

  const maxOutwardDistance =
    layerStrength < 0.35 ? 0.12 : layerStrength < 0.8 ? 0.42 : 0.86;

  const outwardDistance = Math.min(rawDistance, maxOutwardDistance);

  const wiggleStrength = musicActive
    ? (0.015 + beatPulse * 0.08 + bandEnergy * 0.05) * (0.4 + layerStrength)
    : 0;

  const wiggleX = Math.sin(elapsed * 1.7 + index * 0.41) * wiggleStrength;

  const wiggleY = Math.cos(elapsed * 1.4 + index * 0.33) * wiggleStrength;

  const targetPosition = base
    .clone()
    .add(mainDirection.clone().multiplyScalar(outwardDistance));

  targetPosition.x += wiggleX;
  targetPosition.y += wiggleY;

  targetPosition.add(fadeOffset.clone().multiplyScalar(fadeAmount));

  if (xLayer > 0) targetPosition.x = Math.max(targetPosition.x, base.x);
  if (xLayer < 0) targetPosition.x = Math.min(targetPosition.x, base.x);

  if (yLayer > 0) targetPosition.y = Math.max(targetPosition.y, base.y);
  if (yLayer < 0) targetPosition.y = Math.min(targetPosition.y, base.y);

  if (zLayer > 0) targetPosition.z = Math.max(targetPosition.z, base.z);
  if (zLayer < 0) targetPosition.z = Math.min(targetPosition.z, base.z);

  const springStrength = musicActive ? 0.045 : 0.012;
  const damping = musicActive ? 0.88 : 0.94;

  const force = targetPosition
    .clone()
    .sub(cube.position)
    .multiplyScalar(springStrength);

  velocity.add(force);
  velocity.multiplyScalar(damping);
  cube.position.add(velocity);

  const targetScale =
    0.78 +
    bandEnergy * 0.35 +
    rms * 0.18 +
    onset * 0.2 +
    Math.sin(elapsed * 1.2 + index * 0.09) * 0.015;

  const fadeScale = THREE.MathUtils.lerp(1, 0.65, fadeAmount);

  cube.scale.lerp(
    new THREE.Vector3(
      targetScale * fadeScale,
      targetScale * fadeScale,
      targetScale * fadeScale,
    ),
    0.18,
  );

  cube.rotation.set(0, 0, 0);
}

type EnforceCubeOrderingParams = {
  cubes: THREE.Mesh[];
  grid: number;
  spacing: number;
};

export function enforceCubeOrdering({
  cubes,
  grid,
  spacing,
}: EnforceCubeOrderingParams) {
  const minSeparation = spacing * 0.92;

  const getIndex = (x: number, y: number, z: number) =>
    x * grid * grid + y * grid + z;

  const leftCenter = Math.floor((grid - 1) / 2);
  const rightCenter = Math.ceil((grid - 1) / 2);

  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < grid; y++) {
      for (let z = 0; z < grid; z++) {
        for (let x = leftCenter; x > 0; x--) {
          const inner = cubes[getIndex(x, y, z)];
          const outer = cubes[getIndex(x - 1, y, z)];
          outer.position.x = Math.min(
            outer.position.x,
            inner.position.x - minSeparation,
          );
        }

        for (let x = rightCenter; x < grid - 1; x++) {
          const inner = cubes[getIndex(x, y, z)];
          const outer = cubes[getIndex(x + 1, y, z)];
          outer.position.x = Math.max(
            outer.position.x,
            inner.position.x + minSeparation,
          );
        }
      }
    }

    for (let x = 0; x < grid; x++) {
      for (let z = 0; z < grid; z++) {
        for (let y = leftCenter; y > 0; y--) {
          const inner = cubes[getIndex(x, y, z)];
          const outer = cubes[getIndex(x, y - 1, z)];
          outer.position.y = Math.min(
            outer.position.y,
            inner.position.y - minSeparation,
          );
        }

        for (let y = rightCenter; y < grid - 1; y++) {
          const inner = cubes[getIndex(x, y, z)];
          const outer = cubes[getIndex(x, y + 1, z)];
          outer.position.y = Math.max(
            outer.position.y,
            inner.position.y + minSeparation,
          );
        }
      }
    }

    for (let x = 0; x < grid; x++) {
      for (let y = 0; y < grid; y++) {
        for (let z = leftCenter; z > 0; z--) {
          const inner = cubes[getIndex(x, y, z)];
          const outer = cubes[getIndex(x, y, z - 1)];
          outer.position.z = Math.min(
            outer.position.z,
            inner.position.z - minSeparation,
          );
        }

        for (let z = rightCenter; z < grid - 1; z++) {
          const inner = cubes[getIndex(x, y, z)];
          const outer = cubes[getIndex(x, y, z + 1)];
          outer.position.z = Math.max(
            outer.position.z,
            inner.position.z + minSeparation,
          );
        }
      }
    }
  }
}
