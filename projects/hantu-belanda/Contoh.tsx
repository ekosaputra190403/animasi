import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { Karakter } from "../_pustaka/Karakter";
import { GedungMalam, GEDUNG_GROUND, Lobi, LOBI_GROUND } from "./latar";

// Contoh 8 detik untuk dicek terhadap pedoman: beat 1 (aksi aneh) + awal beat 2 (tertawaan).
// Shot A 0–2.5   : gedung malam, kamera maju pelan, pintu terbuka sendiri, hantu keluar.
// Shot B 2.5–5   : CLOSE-UP wajah hantu, "LAGI-LAGI / KAMU" (kilatan lampu saat pindah shot).
// Shot C 5–6.5   : lobi lebar, turis masuk berjalan sambil memegang HP, hantu di belakang.
// Shot D 6.5–8   : CLOSE-UP turis tertawa meremehkan, "CUMA CERITA / FOTO".

export const CONTOH_DURATION = 8 * 30;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const k = (t: number, a: number[], b: number[]) => interpolate(t, a, b, { ...clamp, easing: ease });

// Kamera: titik fokus (fx, fy) dipindah ke posisi layar (sx, sy) lalu diperbesar s kali.
// Skala selalu >= 1 dan fokus di dalam latar, supaya tidak ada pinggir kosong. Tidak pernah diam.
const Camera: React.FC<{ fx: number; fy: number; sx: number; sy: number; s: number; children: React.ReactNode }> = ({ fx, fy, sx, sy, s, children }) => (
  <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${s}) translate(${-fx}px, ${-fy}px)`, transformOrigin: "0 0" }}>
    {children}
  </AbsoluteFill>
);

// Posisi pusat kepala karakter di layar (dihitung dari ukuran kotak rig), untuk close-up.
const headCenter = (x: number, groundY: number, width: number, headFromTop: number) => {
  const height = (width * 315) / 240;
  const top = groundY - (293 / 315) * height;
  return { x, y: top + headFromTop * height };
};

// Caption 1–2 kata, sekitar 70% tinggi layar, seperti video referensi.
const CAPTION_Y = 1350;
const WORDS: { text: string; start: number; end: number }[] = [
  { text: "LAGI-LAGI", start: 2.7, end: 3.6 },
  { text: "KAMU", start: 3.6, end: 4.8 },
  { text: "CUMA CERITA", start: 6.6, end: 7.3 },
  { text: "FOTO", start: 7.3, end: 8.0 },
];

const Caption: React.FC<{ t: number }> = ({ t }) => {
  const w = WORDS.find((x) => t >= x.start && t < x.end);
  if (!w) return null;
  const pop = interpolate(t - w.start, [0, 0.12, 0.22], [0.7, 1.08, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(540 ${CAPTION_Y}) scale(${pop}) translate(-540 ${-CAPTION_Y})`}>
        <text x={540} y={CAPTION_Y} textAnchor="middle" fontFamily="'Arial Black', 'Segoe UI', sans-serif" fontWeight={900} fontSize={70} fill="#FFFFFF" stroke="#141414" strokeWidth={13} paintOrder="stroke" strokeLinejoin="round">
          {w.text}
        </text>
      </g>
    </svg>
  );
};

// Efek: cahaya samar kebiruan di sekitar hantu.
const GhostGlow: React.FC<{ x: number; y: number; r: number; opacity: number; t: number }> = ({ x, y, r, opacity, t }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="auraHantu">
        <stop offset="0" stopColor="#BFF0FF" stopOpacity="0.55" />
        <stop offset="1" stopColor="#BFF0FF" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={x} cy={y} rx={r * (1 + Math.sin(t * 3) * 0.04)} ry={r * 1.35} fill="url(#auraHantu)" opacity={opacity} />
  </svg>
);

// Efek: tepi layar menggelap (adegan malam).
const Vignette: React.FC<{ strength: number }> = ({ strength }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(10,4,6,${strength}) 100%)` }} />
);

const ShotGedung: React.FC<{ t: number; closeUp: boolean }> = ({ t, closeUp }) => {
  const doorOpen = k(t, [0.2, 1.4], [0, 1]);
  const ghostIn = k(t, [0.8, 2.2], [0, 1]);
  const ghostW = 300 + ghostIn * 260;
  const ghostG = 1400 + ghostIn * (GEDUNG_GROUND - 1400);
  const expr = t < 2.5 ? "seram" : "fokus";
  // Kepala hantu kira-kira 18,7% dari atas kotak rig (termasuk melayang).
  const head = headCenter(540, ghostG, ghostW, 0.187);
  const cam = closeUp
    ? { fx: head.x, fy: head.y, sx: 540, sy: 700, s: k(t, [2.5, 5], [2.5, 2.75]) }
    : { fx: 540, fy: 1250, sx: 540, sy: 1250, s: k(t, [0, 2.5], [1.0, 1.12]) };
  return (
    <>
      <Camera {...cam}>
        <GedungMalam t={t} doorOpen={doorOpen} />
        <GhostGlow x={540} y={ghostG - ghostW * 0.55} r={ghostW * 0.42} opacity={ghostIn} t={t} />
        <Karakter outfit="hantu" expression={expr} motion="melayang" t={t} x={540} groundY={ghostG} width={ghostW} opacity={Math.min(1, ghostIn * 1.6)} />
      </Camera>
      <Vignette strength={closeUp ? 0.55 : 0.4} />
    </>
  );
};

const ShotLobi: React.FC<{ t: number; closeUp: boolean }> = ({ t, closeUp }) => {
  const lt = t - 5;
  const walking = lt < 1.4;
  const x = k(lt, [0, 1.4], [1180, 660]);
  // Kepala turis (kostum biasa) kira-kira 25% dari atas kotak rig.
  const head = headCenter(660, LOBI_GROUND, 600, 0.25);
  const cam = closeUp
    // Kepala agak tinggi supaya tulisan @BobEjoo di dada ada di atas caption (tidak tertimpa).
    ? { fx: head.x, fy: head.y, sx: 540, sy: 520, s: k(lt, [1.5, 3], [2.3, 2.5]) }
    : { fx: 540 + k(lt, [0, 1.5], [40, -10]), fy: 1250, sx: 540, sy: 1250, s: k(lt, [0, 1.5], [1.06, 1.1]) };
  return (
    <Camera {...cam}>
      <Lobi />
      <Karakter outfit="hantu" expression="seram" motion="melayang" t={t} x={240} groundY={LOBI_GROUND - 40} width={520} />
      <Karakter
        outfit="biasa"
        expression={closeUp ? "ketawa" : "pede"}
        pose="pegang_hp"
        motion={walking ? "jalan" : "napas"}
        dir={-1}
        t={lt}
        x={x}
        groundY={LOBI_GROUND}
        width={600}
      />
    </Camera>
  );
};

// Efek: kilatan lampu singkat saat pindah ke close-up hantu.
const Flash: React.FC<{ t: number }> = ({ t }) => {
  const o = interpolate(t, [2.5, 2.56, 2.75], [0, 0.75, 0], clamp);
  return o > 0 ? <AbsoluteFill style={{ backgroundColor: `rgba(255,248,230,${o})` }} /> : null;
};

// Suara seram (dibuat dengan ffmpeg, gratis): public/hantu-belanda/sfx/
// Puncak suara dijaga di bawah 0 dB; dengung di bawah, efek di atasnya.
const sfx = (f: string) => staticFile(`hantu-belanda/sfx/${f}`);
const SuaraSeram: React.FC = () => (
  <>
    {/* dengung rendah + angin malam sepanjang adegan gedung, lebih pelan di lobi */}
    <Sequence from={0} durationInFrames={150}><Audio src={sfx("dengung.wav")} volume={0.9} /></Sequence>
    <Sequence from={150} durationInFrames={90}><Audio src={sfx("dengung.wav")} trimBefore={150} volume={0.4} /></Sequence>
    {/* pintu berderit terbuka sendiri */}
    <Sequence from={6} durationInFrames={45}><Audio src={sfx("derit-pintu.wav")} volume={0.8} /></Sequence>
    {/* desir saat hantu melayang keluar */}
    <Sequence from={27} durationInFrames={42}><Audio src={sfx("whoosh.wav")} volume={0.7} /></Sequence>
    {/* sting seram tepat saat kilatan lampu + close-up "LAGI-LAGI" */}
    <Sequence from={75} durationInFrames={72}><Audio src={sfx("sting.wav")} volume={0.75} /></Sequence>
  </>
);

export const Contoh: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return (
    <AbsoluteFill style={{ backgroundColor: "#24161B", overflow: "hidden" }}>
      {t < 5 ? <ShotGedung t={t} closeUp={t >= 2.5} /> : <ShotLobi t={t} closeUp={t >= 6.5} />}
      <Flash t={t} />
      <Caption t={t} />
      <SuaraSeram />
    </AbsoluteFill>
  );
};
