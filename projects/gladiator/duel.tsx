import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { Set3D } from "./set3d";
import { Pose, mixPose, project } from "./kamera";
import { k, clamp, guncang, Vignette } from "./efek";
import { Di } from "./adegan1";

// Sekuens duel aksi (sisipan 4,1 detik tanpa narasi, permintaan pemilik 2026-11-10: "benar-benar berkelahi
// lincah, seperti drama action"). Disisipkan setelah "...tombaknya menghantam perisaimu," dan sebelum
// "...sampai kamu berhasil menguncinya di pasir." d = detik sejak sisipan dimulai (0..4,11).
// Gaya: potongan cepat (0,6–1,4 s), sudut rendah, kamera mengitari, satu gerak lambat, guncangan tiap benturan,
// jejak tebasan + kilat benturan gaya komik (tanpa darah).

export const DUEL_PANJANG = 4.11;
const FX = -4.1, FZ = 2.0;
const ARENA = (t: number) => ({ t, arena: { t, sorak: 1.6, jeruji: 1, luar: false }, siang: true });

// Kilat benturan di titik pertemuan senjata.
const Percik: React.FC<{ kam: Pose; x: number; y: number; z: number; s: number }> = ({ kam, x, y, z, s }) => {
  if (s <= 0.01) return null;
  const c = project(kam, x, y, z);
  const pts = (r1: number, r2: number, n: number, put: number) => Array.from({ length: n * 2 }, (_, i) => { const a = (i / (n * 2)) * Math.PI * 2 + put; const r = i % 2 ? r1 : r2; return `${(c.x + Math.cos(a) * r * s).toFixed(1)},${(c.y + Math.sin(a) * r * s).toFixed(1)}`; }).join(" ");
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <polygon points={pts(34, 120, 8, s)} fill="#FFD54F" stroke="#141414" strokeWidth={6} strokeLinejoin="round" />
      <polygon points={pts(18, 64, 8, s + 0.3)} fill="#FFFFFF" />
      {Array.from({ length: 8 }, (_, i) => { const a = i * 0.8 + s; return <line key={i} x1={c.x + Math.cos(a) * 70 * s} y1={c.y + Math.sin(a) * 70 * s} x2={c.x + Math.cos(a) * 150 * s} y2={c.y + Math.sin(a) * 150 * s} stroke="#FFF3A6" strokeWidth={6} strokeLinecap="round" />; })}
    </svg>
  );
};
// Kekuatan percik: menyala sebentar di sekitar waktu benturan.
const kilat = (d: number, tb: number) => interpolate(d - tb, [-0.02, 0, 0.08, 0.22], [0, 1.25, 1, 0], clamp);

const Guncang: React.FC<{ g: { x: number; y: number; r: number }; children: React.ReactNode }> = ({ g, children }) => (
  <AbsoluteFill style={{ transform: `translate(${g.x}px, ${g.y}px) rotate(${g.r}deg) scale(1.05)` }}>{children}</AbsoluteFill>
);
const gabung = (...gs: { x: number; y: number; r: number }[]) => gs.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y, r: a.r + b.r }), { x: 0, y: 0, r: 0 });

export const ShotDuel: React.FC<{ d: number; t: number }> = ({ d, t }) => {
  const kamu = { outfit: "gladiator", atribut: ["helm_gladiator"] } as const;
  // ---------------- A (0–0,7): trisula menusuk, kamu menangkis dengan pedang — sudut rendah dari kiri
  if (d < 0.7) {
    const pose = mixPose({ pos: [FX - 0.7, 0.6, FZ + 5.6], look: [FX, 1.3, FZ], fov: 58 }, { pos: [FX - 0.5, 0.65, FZ + 5.2], look: [FX, 1.3, FZ], fov: 56 }, d / 0.7);
    const g = guncang(d - 0.33, 26);
    return (
      <Guncang g={g}>
        <Set3D pose={pose} p={ARENA(t)} />
        <Di kam={pose} x={FX + 0.95} z={FZ} outfit="retiarius" expression="teriak" tEkspresi={d} pose="tusuk_trisula" motion="seruduk" dir={-1} t={t} nama="retiarius" />
        <Di kam={pose} x={FX - 0.95} z={FZ} {...kamu} expression="merem" tEkspresi={d - 0.33} pose="tangkis_pedang" motion={d > 0.33 ? "terpental" : "siaga"} tAksi={d - 0.33} t={t} nama="kamu" />
        <Percik kam={pose} x={FX} y={1.75} z={FZ} s={kilat(d, 0.33)} />
        <Vignette kuat={0.4} />
      </Guncang>
    );
  }
  // ---------------- B (0,7–1,4): kamu menebas, dia menangkis dengan gagang trisula — dari kanan atas
  if (d < 1.4) {
    const p = (d - 0.7) / 0.7;
    const pose = mixPose({ pos: [FX + 2.4, 2.3, FZ + 5.4], look: [FX, 1.15, FZ], fov: 54 }, { pos: [FX + 2.0, 2.0, FZ + 5.0], look: [FX, 1.2, FZ], fov: 52 }, p);
    const g = guncang(d - 1.02, 24);
    return (
      <Guncang g={g}>
        <Set3D pose={pose} p={ARENA(t)} />
        <Di kam={pose} x={FX + 0.95} z={FZ} outfit="retiarius" expression={d > 1.02 ? "merem" : "kaget"} tEkspresi={d - 0.75} pose="tangkis_trisula" motion={d > 1.02 ? "terpental" : "siaga"} tAksi={d - 1.02} dir={-1} t={t} nama="retiarius" />
        <Di kam={pose} x={FX - 0.95} z={FZ} {...kamu} expression="teriak" tEkspresi={d - 0.7} pose="ayun" motion="seruduk" efek={d < 1.08 ? ["jejak_tebasan"] : undefined} dir={1} t={0.12 + (d - 0.7) * 0.5} nama="kamu" />
        <Percik kam={pose} x={FX + 0.2} y={1.55} z={FZ} s={kilat(d, 1.02)} />
        <Vignette kuat={0.4} />
      </Guncang>
    );
  }
  // ---------------- C (1,4–2,15): dia menyapu kaki, kamu melompat — kamera di tanah, GERAK LAMBAT
  if (d < 2.15) {
    const lambat = d < 1.55 ? d : d < 2.05 ? 1.55 + (d - 1.55) * 0.35 : 1.725 + (d - 2.05);
    const pose = mixPose({ pos: [FX + 0.3, 0.3, FZ + 4.8], look: [FX, 1.1, FZ], fov: 62 }, { pos: [FX + 0.1, 0.35, FZ + 4.5], look: [FX, 1.15, FZ], fov: 60 }, (d - 1.4) / 0.75);
    return (
      <AbsoluteFill style={{ filter: d > 1.55 && d < 2.05 ? "contrast(1.08) saturate(1.15)" : undefined }}>
        <Set3D pose={pose} p={ARENA(t)} />
        <Di kam={pose} x={FX + 0.95} z={FZ} outfit="retiarius" expression="teriak" tEkspresi={lambat - 1.4} pose="sapu_trisula" efek={["debu"]} dir={-1} t={lambat} tAksi={lambat} nama="retiarius" />
        <Di kam={pose} x={FX - 0.95} z={FZ} {...kamu} expression="kaget" tEkspresi={lambat - 1.45} pose="kuda_kuda" motion="lompat" tAksi={0.14 + (lambat - 1.45) * 0.9} efek={["garis_kaget"]} t={lambat} nama="kamu" />
        {/* garis gerak lambat di tepi layar */}
        {d > 1.55 && d < 2.05 && <AbsoluteFill style={{ boxShadow: "inset 0 0 140px 40px rgba(255,255,255,0.35)" }} />}
        <Vignette kuat={0.45} />
      </AbsoluteFill>
    );
  }
  // ---------------- D (2,15–2,75): kamu menebas lagi, dia meliuk ke belakang — kamera mengitari cepat
  if (d < 2.75) {
    const p = (d - 2.15) / 0.6;
    const a = -0.55 + p * 1.0;
    const pose: Pose = { pos: [FX + Math.sin(a) * 5.6, 1.4, FZ + Math.cos(a) * 5.6], look: [FX, 1.2, FZ], fov: 54 };
    return (
      <AbsoluteFill style={{ filter: `blur(${Math.max(0, 1 - p * 3) * 3}px)` }}>
        <Set3D pose={pose} p={ARENA(t)} />
        <Di kam={pose} x={FX + 0.95} z={FZ} outfit="retiarius" expression="syok" tEkspresi={d - 2.2} pose="tangkis_trisula" motion="meliuk" tAksi={d - 2.25} dir={-1} t={t} nama="retiarius" />
        <Di kam={pose} x={FX - 0.95} z={FZ} {...kamu} expression="teriak" tEkspresi={d - 2.15} pose="ayun" motion="seruduk" efek={d > 2.2 && d < 2.5 ? ["jejak_tebasan", "garis_cepat"] : undefined} dir={1} t={0.12 + (d - 2.15) * 0.6} nama="kamu" />
        <Vignette kuat={0.4} />
      </AbsoluteFill>
    );
  }
  // ---------------- E (2,75–4,11): adu kunci senjata — wajah berhadapan, ngeden, kamera mendorong masuk
  const p = (d - 2.75) / (DUEL_PANJANG - 2.75);
  const pose = mixPose({ pos: [FX, 1.5, FZ + 4.8], look: [FX, 1.3, FZ], fov: 50 }, { pos: [FX, 1.5, FZ + 4.0], look: [FX, 1.35, FZ], fov: 50 }, Easing.inOut(Easing.cubic)(p));
  const percik = [2.85, 3.15, 3.5, 3.85].reduce((m, tb) => Math.max(m, kilat(d, tb) * 0.6), 0);
  const g = gabung(guncang(d - 2.8, 22), { x: Math.sin(d * 50) * 2.5, y: Math.cos(d * 43) * 2, r: 0 });
  return (
    <Guncang g={g}>
      <Set3D pose={pose} p={ARENA(t)} />
      <Di kam={pose} x={FX + 0.55} z={FZ} outfit="retiarius" expression="merem" tEkspresi={d - 2.75} pose="tangkis_trisula" motion="gemetar" tAksi={d} efek={["keringat"]} dir={-1} t={t} nama="retiarius" />
      <Di kam={pose} x={FX - 0.55} z={FZ} {...kamu} expression="merem" tEkspresi={d - 2.75} pose="adu_pedang" motion="gemetar" tAksi={d} efek={["keringat"]} t={t} nama="kamu" />
      <Percik kam={pose} x={FX} y={1.45} z={FZ} s={percik} />
      <Vignette kuat={0.5} />
    </Guncang>
  );
};

export { k };
