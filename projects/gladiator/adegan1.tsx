import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { Karakter } from "../_pustaka/Karakter";
import { Set3D, KAMAR, LORONG, GERBANG } from "./set3d";
import { Pose, mixPose, placeCharacter } from "./kamera";
import { k, clamp, Vignette } from "./efek";
import { TeksKomik } from "./teks";

// Bagian 1 (shot 1–7, 0–22,62 s): kamar → dinding rebah, kamu di tengah Colosseum → barak (sarapan, rontgen
// tulang) → lorong: gerbang terangkat, retiarius masuk → kamu memakai helm → pandangan dari dalam helm.

const gerakPose = (t: number, t0: number, t1: number, a: Pose, b: Pose, e = Easing.inOut(Easing.cubic)) => mixPose(a, b, k(t, [t0, t1], [0, 1], e));

type KarProps = Omit<React.ComponentProps<typeof Karakter>, "x" | "groundY" | "width">;
// Karakter diletakkan dari posisi dunia 3D; `lantai` = tinggi pijakan (mis. di atas kasur).
export const Di: React.FC<{ kam: Pose; x: number; z: number; tinggi?: number; lantai?: number } & KarProps> = ({ kam, x, z, tinggi = 1.7, lantai = 0, ...rest }) => {
  const c = placeCharacter(kam, x, z, tinggi, lantai);
  if (!c.visible) return null;
  return <Karakter {...rest} x={c.x} groundY={c.groundY} width={c.width} />;
};

const KASUR_ATAS = 0.57;
const DI_KASUR = { x: KAMAR.kasur.x, z: KAMAR.kasur.z + 0.95 }; // berdiri/berbaring dari ujung kaki kasur

// Gelombang bunyi alarm HP (2D) di dekat nakas.
const Alarm: React.FC<{ kam: Pose; t: number }> = ({ kam, t }) => {
  const c = placeCharacter(kam, KAMAR.nakas.x + 0.05, KAMAR.nakas.z + 0.05, 0.1, 0.62);
  const g = (t * 3) % 1;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2].map((i) => {
        const r = 30 + ((g + i / 3) % 1) * 90;
        return <circle key={i} cx={c.x} cy={c.groundY - 20} r={r} fill="none" stroke="#7fd0ff" strokeWidth={6} opacity={1 - ((g + i / 3) % 1)} />;
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Shot 1 (0–3,02): kamar modern. Alarm berbunyi, kamu terbangun… bajumu berubah jadi tunik gladiator.
// ---------------------------------------------------------------------------
export const Shot1Kamar: React.FC<{ t: number }> = ({ t }) => {
  // Kamera di samping kasur: kasur memanjang ke kanan layar, bantal di kanan → tokoh bisa terbaring utuh.
  const pose = gerakPose(t, 0, 3.02, { pos: [1.98, 1.45, -0.6], look: [0.2, 0.85, -0.6], fov: 90 }, { pos: [1.98, 1.6, -0.2], look: [0.2, 1.3, -0.2], fov: 86 });
  const bangun = Math.max(0, 1.2 - Math.max(0, t - 1.05) * 1.9); // 1,2 = terbaring, 0 = berdiri
  const tidur = t < 0.55; // masih tidur pulas (Zzz)
  const ganti = t >= 2.0; // baju berubah jadi tunik gladiator
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={{ t, kamar: { hp: t > 0.45 && t < 1.6 ? 1 : 0 }, siang: false }} />
      {t > 0.45 && t < 1.6 && <Alarm kam={pose} t={t} />}
      <Di
        kam={pose}
        x={DI_KASUR.x}
        z={DI_KASUR.z}
        lantai={KASUR_ATAS + 0.04}
        tinggi={1.55}
        outfit={ganti ? "gladiator" : "biasa"}
        expression={ganti ? "kaget" : tidur ? "ngantuk" : bangun > 0.6 ? "datar" : "bingung"}
        tEkspresi={ganti ? t - 2.0 : tidur ? undefined : t - 0.55}
        pose={ganti ? "angkat_tangan" : "idle"}
        motion={bangun > 0.02 ? "pingsan" : ganti ? "muncul" : "napas"}
        tAksi={bangun > 0.02 ? bangun : t - 2.0}
        dir={-1}
        efek={tidur ? ["zzz"] : ganti ? ["garis_kaget"] : undefined}
        t={t}
        nama="kamu"
      />
      <Vignette kuat={0.45} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 2 (3,02–7,32): dinding kamar rebah seperti kardus → ternyata di tengah Colosseum; kamera naik.
// ---------------------------------------------------------------------------
export const Shot2Rebah: React.FC<{ t: number }> = ({ t }) => {
  const rebah = interpolate(t, [3.15, 3.85], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }) + (t > 3.85 ? 0 : 0);
  const naik = Easing.inOut(Easing.cubic)(interpolate(t, [3.9, 7.32], [0, 1], clamp));
  const A0: Pose = { pos: [1.98, 1.6, -0.2], look: [0.2, 1.3, -0.2], fov: 86 };
  // Kamera tetap di dalam kamar lalu naik di atas kasur: keempat dinding terlihat rebah ke luar.
  const A1: Pose = { pos: [0.4, 5.4, 1.6], look: [0.2, 0.6, 0.1], fov: 62 };
  const A2: Pose = { pos: [8, 78, 70], look: [0, 0, -8], fov: 48 };
  const pose = t < 3.9 ? mixPose(A0, A1, k(t, [3.1, 3.9], [0, 1])) : mixPose(A1, A2, naik);
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={{ t, arena: { t, sorak: 1, jeruji: 0 }, kamar: { rebah, plafon: false }, kota: naik > 0.3, siang: true }} />
      <Di kam={pose} x={DI_KASUR.x} z={DI_KASUR.z} lantai={KASUR_ATAS} outfit="gladiator" expression="syok" tEkspresi={t - 3.2} pose="tutup_mulut" motion="gemetar" tAksi={t} t={t} nama="kamu" />
      <Vignette kuat={0.3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 3 (7,32–9,68): barak — sarapan bubur gandum dan kacang.
// ---------------------------------------------------------------------------
const KAMU_BARAK = { x: -0.45, z: 0.35 };
const FLAMMA_BARAK = { x: 0.55, z: 0.25 };
export const Shot3Sarapan: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 7.32, 9.68, { pos: [0.9, 1.6, 5.0], look: [0.05, 1.0, -0.2], fov: 44 }, { pos: [0.6, 1.55, 4.6], look: [0.05, 1.0, -0.2], fov: 44 });
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={{ t, barak: true, siang: false }} />
      <Di kam={pose} x={FLAMMA_BARAK.x} z={FLAMMA_BARAK.z} outfit="flamma" expression="kalem" pose="pegang_benda" pegang="mangkuk" t={t} nama="flamma" />
      <Di kam={pose} x={KAMU_BARAK.x} z={KAMU_BARAK.z} outfit="gladiator" expression="curiga" tEkspresi={t - 7.5} pose="pegang_benda" pegang="mangkuk" t={t} nama="kamu" />
      <Vignette kuat={0.55} />
    </AbsoluteFill>
  );
};

// Rontgen: badan Flamma tampak tembus, tulangnya menyala makin terang (efek 2D di atas karakter).
const Rontgen: React.FC<{ kam: Pose; x: number; z: number; terang: number; t: number }> = ({ kam, x, z, terang, t }) => {
  const c = placeCharacter(kam, x, z, 1.7);
  const u = c.width / 240;
  const P = (rx: number, ry: number) => `${(c.x + rx * u).toFixed(1)} ${(c.groundY + (ry - 128) * u).toFixed(1)}`;
  const tebal = (3 + terang * 3) * u;
  const warna = `rgba(190, 240, 255, ${0.55 + terang * 0.45})`;
  const tulang = [
    `M ${P(0, -42)} L ${P(0, 38)}`, // tulang belakang
    ...[-26, -16, -6, 4].map((y) => `M ${P(-4, y)} Q ${P(-26, y + 4)} ${P(-24, y + 12)} M ${P(4, y)} Q ${P(26, y + 4)} ${P(24, y + 12)}`), // rusuk
    `M ${P(-30, -34)} L ${P(30, -34)}`, // bahu
    `M ${P(-30, -34)} L ${P(-38, 8)} L ${P(-36, 44)}`, // lengan kiri
    `M ${P(30, -34)} L ${P(38, 8)} L ${P(36, 44)}`, // lengan kanan
    `M ${P(-16, 38)} Q ${P(0, 50)} ${P(16, 38)}`, // panggul
    `M ${P(-12, 44)} L ${P(-14, 86)} L ${P(-15, 124)}`, // kaki kiri
    `M ${P(12, 44)} L ${P(14, 86)} L ${P(15, 124)}`, // kaki kanan
  ];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="pendar" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={6 + terang * 10} result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* layar rontgen biru gelap + garis pindai */}
      <rect width={1080} height={1920} fill="#04122a" opacity={0.78} />
      {Array.from({ length: 60 }, (_, i) => <rect key={i} y={(i * 32 + t * 120) % 1920} width={1080} height={3} fill="#5fd0ff" opacity={0.06} />)}
      {/* bayangan badan tembus pandang */}
      <ellipse cx={c.x} cy={c.groundY + (-79 - 128) * u} rx={44 * u} ry={44 * u} fill="rgba(120,200,255,0.12)" stroke="rgba(150,220,255,0.35)" strokeWidth={2 * u} />
      <rect x={c.x - 33 * u} y={c.groundY + (-32 - 128) * u} width={66 * u} height={80 * u} rx={12 * u} fill="rgba(120,200,255,0.1)" stroke="rgba(150,220,255,0.3)" strokeWidth={2 * u} />
      <g filter="url(#pendar)" stroke={warna} strokeWidth={tebal} strokeLinecap="round" fill="none">
        {tulang.map((d, i) => <path key={i} d={d} />)}
        <circle cx={c.x} cy={c.groundY + (-82 - 128) * u} r={34 * u} />
        <circle cx={c.x - 13 * u} cy={c.groundY + (-84 - 128) * u} r={7 * u} fill={warna} />
        <circle cx={c.x + 13 * u} cy={c.groundY + (-84 - 128) * u} r={7 * u} fill={warna} />
        <path d={`M ${P(-14, -64)} L ${P(14, -64)}`} />
      </g>
      <TeksKomik x={540} y={330} teks="KALSIUM +" ukuran={96} atas="#E8FBFF" bawah="#5FD0FF" sisi="#0B3A5C" />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Shot 4 (9,68–13,06): minuman abu. Kamu merem jijik; Flamma meneguk habis → rontgen tulang bersinar → sendawa.
// ---------------------------------------------------------------------------
export const Shot4Abu: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 9.68, 13.06, { pos: [0.1, 1.45, 3.9], look: [0.05, 1.05, 0.2], fov: 46 }, { pos: [0.15, 1.42, 3.5], look: [0.08, 1.07, 0.2], fov: 46 });
  const kamuMinum = t < 10.35;
  const flammaMinum = t >= 10.5 && t < 11.15;
  const rontgen = t >= 11.15 && t < 12.55;
  const sendawa = t >= 12.55;
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={{ t, barak: true, siang: false }} />
      <Di kam={pose} x={FLAMMA_BARAK.x} z={FLAMMA_BARAK.z} outfit="flamma" expression={sendawa ? "ketawa" : flammaMinum ? "merem" : "kalem"} tEkspresi={sendawa ? t - 12.55 : flammaMinum ? t - 10.5 : undefined} pose={flammaMinum || rontgen ? "minum" : "idle"} motion={sendawa ? "bicara" : "napas"} t={t} nama="flamma" />
      <Di kam={pose} x={KAMU_BARAK.x} z={KAMU_BARAK.z} outfit="gladiator" expression={kamuMinum ? "fokus" : sendawa ? "datar" : "merem"} tEkspresi={kamuMinum ? undefined : t - 10.35} pose={kamuMinum ? "minum" : "pegang_benda"} pegang="cangkir" motion={kamuMinum ? "napas" : "gemetar"} tAksi={t} t={t} nama="kamu" />
      {rontgen && <Rontgen kam={pose} x={FLAMMA_BARAK.x} z={FLAMMA_BARAK.z} terang={k(t, [11.15, 12.4], [0, 1])} t={t} />}
      <Vignette kuat={0.55} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 5 (13,06–17,5): dari lorong, gerbang berjeruji terangkat; retiarius masuk arena memutar jaring.
// ---------------------------------------------------------------------------
export const Shot5Lawan: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 13.06, 17.5, { pos: [LORONG.x0 - 7.5, 1.0, 0.7], look: [GERBANG.x + 10, 1.6, 0], fov: 46 }, { pos: [LORONG.x0 - 5.2, 1.05, 0.45], look: [GERBANG.x + 10, 1.6, 0], fov: 44 });
  const jeruji = k(t, [13.3, 14.4], [0, 1], Easing.inOut(Easing.quad));
  const xRet = interpolate(t, [13.8, 17.5], [GERBANG.x + 9, GERBANG.x + 12], clamp);
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={{ t, arena: { t, sorak: 1, jeruji, luar: false }, lorong: true, siang: true }} />
      <Di kam={pose} x={xRet} z={-0.3} outfit="retiarius" expression="pede" pose="lempar_jaring" motion="siaga" t={t} tAksi={t} nama="retiarius" />
      <Vignette kuat={0.6} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 6 (17,5–20,2): kamu di lorong memegang pedang + perisai, gemetar, lalu memakai helm secutor.
// ---------------------------------------------------------------------------
const KAMU_LORONG = { x: LORONG.x0 - 3.2, z: -0.3 };
export const Shot6Helm: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 17.5, 20.2, { pos: [KAMU_LORONG.x - 3.4, 1.45, 1.2], look: [KAMU_LORONG.x, 1.1, KAMU_LORONG.z], fov: 46 }, { pos: [KAMU_LORONG.x - 2.8, 1.45, 0.95], look: [KAMU_LORONG.x, 1.15, KAMU_LORONG.z], fov: 44 });
  const helm = t >= 19.0;
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={{ t, arena: { t, sorak: 1, jeruji: 1, luar: false, penonton: false }, lorong: true, siang: true }} />
      <Di kam={pose} x={KAMU_LORONG.x} z={KAMU_LORONG.z} outfit="gladiator" expression={helm ? "fokus" : "takut"} tEkspresi={helm ? t - 19.0 : t - 17.6} pose="kuda_kuda" motion={helm ? "muncul" : "gemetar"} tAksi={helm ? t - 19.0 : t} atribut={helm ? ["helm_secutor"] : undefined} efek={helm ? undefined : ["keringat"]} t={t} nama="kamu" />
      <Vignette kuat={0.6} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 7 (20,2–22,62): pandangan dari dalam helm — dua lubang kecil. Menoleh kiri-kanan mencari lawan…
// ternyata dia tepat di depanmu. Lubang membesar jadi transisi ke shot berikutnya.
// ---------------------------------------------------------------------------
export const Shot7POV: React.FC<{ t: number }> = ({ t }) => {
  const yaw = t < 21.75 ? Math.sin((t - 20.2) * 4.2) * 0.65 : 0;
  const kepala = { x: -5.6, y: 1.55, z: 2.0 };
  const pose: Pose = { pos: [kepala.x, kepala.y, kepala.z], look: [kepala.x + Math.cos(yaw) * 5, 1.45, kepala.z + Math.sin(yaw) * 5], fov: 58 };
  const buka = k(t, [22.25, 22.62], [0, 1], Easing.in(Easing.quad));
  const r = 170 + buka * 1100;
  const napas = 1 + Math.sin(t * 6) * 0.02;
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={{ t, arena: { t, sorak: 1, jeruji: 1, luar: false }, siang: true }} />
      <Di kam={pose} x={-2.8} z={2.1} outfit="retiarius" expression="pede" pose="lempar_jaring" t={t} nama="retiarius" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <mask id="lubangHelm">
            <rect width={1080} height={1920} fill="white" />
            <circle cx={540 - 190 * (1 - buka)} cy={900} r={r * napas} fill="black" />
            <circle cx={540 + 190 * (1 - buka)} cy={900} r={r * napas} fill="black" />
          </mask>
          <radialGradient id="tepiLubang">
            <stop offset="0.75" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.7" />
          </radialGradient>
        </defs>
        <rect width={1080} height={1920} fill="#0d0d0f" mask="url(#lubangHelm)" />
        {buka < 0.5 && [540 - 190, 540 + 190].map((cx) => <circle key={cx} cx={cx} cy={900} r={r * napas} fill="url(#tepiLubang)" />)}
      </svg>
    </AbsoluteFill>
  );
};
