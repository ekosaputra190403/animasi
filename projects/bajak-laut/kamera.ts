import * as THREE from "three";

// Kamera bersama untuk set 3D dan karakter 2D.
// Set 3D dirender dari pose ini, dan posisi karakter 2D dihitung dari pose yang sama
// (proyeksi titik dunia → piksel layar), jadi karakter selalu menapak di lantai 3D.

export const W = 1080;
export const H = 1920;

export type Pose = {
  pos: [number, number, number]; // posisi kamera (meter)
  look: [number, number, number]; // titik yang dilihat
  fov: number; // sudut pandang vertikal (derajat)
};

export const makeCamera = (p: Pose) => {
  const cam = new THREE.PerspectiveCamera(p.fov, W / H, 0.1, 200);
  cam.position.set(...p.pos);
  cam.lookAt(...p.look);
  cam.updateMatrixWorld(true);
  cam.updateProjectionMatrix();
  return cam;
};

// Titik dunia → piksel layar. visible=false kalau titik ada di belakang kamera.
export const project = (p: Pose, x: number, y: number, z: number) => {
  const cam = makeCamera(p);
  const v = new THREE.Vector3(x, y, z).project(cam);
  const behind = new THREE.Vector3(x, y, z).applyMatrix4(cam.matrixWorldInverse).z > 0;
  return { x: ((v.x + 1) / 2) * W, y: ((1 - v.y) / 2) * H, visible: !behind };
};

// Ukuran karakter rig di layar untuk karakter setinggi `tinggi` meter yang berdiri di (x, z).
// Kotak rig: lebar 240 / tinggi 315 unit; tinggi badan (kaki → atas kepala) ≈ 0,88 tinggi kotak.
export const placeCharacter = (p: Pose, x: number, z: number, tinggi = 1.7, lantai = 0) => {
  const kaki = project(p, x, lantai, z);
  const kepala = project(p, x, lantai + tinggi, z);
  const tinggiPx = Math.max(1, kaki.y - kepala.y);
  const width = (tinggiPx / 0.88) * (240 / 315);
  return { x: kaki.x, groundY: kaki.y, width, visible: kaki.visible };
};

// Interpolasi pose kamera (untuk gerak kamera halus seperti dolly/crane).
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
  pos: [lerp(a.pos[0], b.pos[0], t), lerp(a.pos[1], b.pos[1], t), lerp(a.pos[2], b.pos[2], t)],
  look: [lerp(a.look[0], b.look[0], t), lerp(a.look[1], b.look[1], t), lerp(a.look[2], b.look[2], t)],
  fov: lerp(a.fov, b.fov, t),
});
