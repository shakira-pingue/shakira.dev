import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { createCubeMaterial } from "./colours";

type CreateCubeGridParams = {
  group: THREE.Group;
  grid: number;
  spacing: number;
};

export function createCubeGrid({ group, grid, spacing }: CreateCubeGridParams) {
  const geometry = new RoundedBoxGeometry(0.48, 0.48, 0.48, 4, 0.08);

  const cubes: THREE.Mesh[] = [];
  const basePositions: THREE.Vector3[] = [];

  const offset = ((grid - 1) * spacing) / 2;

  for (let x = 0; x < grid; x++) {
    for (let y = 0; y < grid; y++) {
      for (let z = 0; z < grid; z++) {
        const cube = new THREE.Mesh(geometry, createCubeMaterial());

        const position = new THREE.Vector3(
          x * spacing - offset,
          y * spacing - offset,
          z * spacing - offset,
        );

        cube.position.copy(position);

        group.add(cube);
        cubes.push(cube);
        basePositions.push(position);
      }
    }
  }

  const velocities: THREE.Vector3[] = cubes.map(() => new THREE.Vector3());

  return {
    geometry,
    cubes,
    basePositions,
    velocities,
    offset,
  };
}
