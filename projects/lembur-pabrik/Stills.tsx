import React from "react";
import { AbsoluteFill } from "remotion";
import { Karakter } from "../_pustaka/Karakter";
import { Pabrik3D, MEJA_KARYAWAN, MESIN_TUA } from "./pabrik3d";
import { Pose, placeCharacter } from "./kamera";

// Still uji tampilan sinematik (bukan adegan final).
// Karakter 2D diletakkan dari posisi dunia 3D lewat placeCharacter, jadi kakinya tepat di lantai.

const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)" }} />
);

const Char: React.FC<{ pose: Pose; x: number; z: number; outfit: string; expression: string; pose2?: string; tinggi?: number; t: number }> = ({ pose, x, z, outfit, expression, pose2 = "idle", tinggi = 1.65, t }) => {
  const c = placeCharacter(pose, x, z, tinggi);
  if (!c.visible) return null;
  return <Karakter outfit={outfit} expression={expression} pose={pose2} t={t} x={c.x} groundY={c.groundY} width={c.width} />;
};

// A. Hook: mesin tua di ujung belakang menyala sendiri, kamera rendah di lorong antar meja.
export const UjiA: React.FC = () => {
  // Lorong kosong di antara deretan meja x = 3 dan x = 6 → pandangan ke mesin tua tidak terhalang.
  const pose: Pose = { pos: [MESIN_TUA.x, 1.15, -4.2], look: [MESIN_TUA.x, 1.15, MESIN_TUA.z], fov: 34 };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0e14" }}>
      <Pabrik3D pose={pose} s={{ t: 0.4, mesinTuaNyala: 1, lampuKaryawan: 0.6 }} />
      <Vignette />
    </AbsoluteFill>
  );
};

// B. Karyawan (cewek) duduk serius menjahit, menghadap mesin di kanannya (seperti referensi pemilik).
// Kursi digambar oleh rig (duduk_samping "kantor"); tangan menuntun kain di dekat jarum.
const DUDUK = { x: MEJA_KARYAWAN.x - 0.56, z: MEJA_KARYAWAN.z + 0.36 };
export const UjiB: React.FC = () => {
  // Kamera tinggi dari samping depan, menyorot ke bawah ke tangan dan mesin (seperti referensi).
  const pose: Pose = { pos: [DUDUK.x + 1.25, 2.6, DUDUK.z + 2.9], look: [DUDUK.x + 0.34, 0.85, DUDUK.z - 0.12], fov: 40 };
  const c = placeCharacter(pose, DUDUK.x, DUDUK.z, 1.65);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0e14" }}>
      <Pabrik3D pose={pose} s={{ t: 0.4, mesinTuaNyala: 0, lampuKaryawan: 1, jam: { h: 23, m: 40 } }} />
      <Karakter outfit="cewek" expression="fokus" pose="menjahit" motion="duduk_samping" sit="kantor" dir={1} t={0.4} x={c.x} groundY={c.groundY} width={c.width} />
      <Vignette />
    </AbsoluteFill>
  );
};

// C. Bersembunyi di dekat manekin, sudut rendah.
export const UjiC: React.FC = () => {
  const pose: Pose = { pos: [-0.9, 0.95, 4.8], look: [-3.6, 1.15, 1.2], fov: 38 };
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0e14" }}>
      <Pabrik3D pose={pose} s={{ t: 0.4, mesinTuaNyala: 1, lampuKaryawan: 1, kedip: 0 }} />
      <Char pose={pose} x={-3.0} z={1.35} outfit="cewek" expression="takut" t={0.4} />
      <Vignette />
    </AbsoluteFill>
  );
};
