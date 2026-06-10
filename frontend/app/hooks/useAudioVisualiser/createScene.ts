import * as THREE from "three";
import { COLOURS } from "./colours";

export function createScene(width: number, height: number) {
  const scene = new THREE.Scene();
  scene.background = COLOURS.background;

  const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
  camera.position.set(5.8, 6, 6.2);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(COLOURS.background);

  scene.add(new THREE.AmbientLight(0xffffff, 0.58));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.3);
  keyLight.position.set(5, 8, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xa8c5a0, 1.5);
  fillLight.position.set(-5, 3, -5);
  scene.add(fillLight);

  const cubeGroup = new THREE.Group();
  scene.add(cubeGroup);

  return {
    scene,
    camera,
    renderer,
    cubeGroup,
  };
}
