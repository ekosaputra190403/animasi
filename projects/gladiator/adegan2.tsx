import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { Set3D, B, BALKON, PATUNG_DUEL } from "./set3d";
import { Pose, mixPose, placeCharacter, project } from "./kamera";
import { k, clamp, guncang, Vignette } from "./efek";
import { Di } from "./adegan1";
import { LabelPerunggu } from "./teks";

// Bagian 2 (shot 8–14, 22,62–42,68 s): duel → waktu membeku → mengunci lawan → wasit → label harga + lanista →
// lawan menyerah → diampuni (dari balkon penyelenggara).

const gerakPose = (t: number, t0: number, t1: number, a: Pose, b: Pose, e = Easing.inOut(Easing.cubic)) => mixPose(a, b, k(t, [t0, t1], [0, 1], e));
const ARENA = (t: number, sorak = 1) => ({ t, arena: { t, sorak, jeruji: 1, luar: false }, siang: true });

// Lokasi duel: dekat patung di tepi arena (patung ke-1 di set3d: x = -0.75A).
const PATUNG = PATUNG_DUEL;
const FX = -4.1, FZ = 2.0; // pusat lokasi duel (dekat tengah arena)
const KAMU = { x: FX - 1.5, z: FZ };
const LAWAN = { x: FX + 1.5, z: FZ };
const KONTAK = { x: FX, y: 1.15, z: FZ }; // titik trisula mengenai perisai

const Guncang: React.FC<{ dt: number; kuat?: number; children: React.ReactNode }> = ({ dt, kuat, children }) => {
  const g = guncang(dt, kuat);
  return <AbsoluteFill style={{ transform: `translate(${g.x}px, ${g.y}px) rotate(${g.r}deg) scale(1.04)` }}>{children}</AbsoluteFill>;
};

// Jaring 2D yang melayang lalu menyangkut di patung.
const JaringTerbang: React.FC<{ kam: Pose; p: number }> = ({ kam, p }) => {
  const a = project(kam, LAWAN.x - 0.4, 2.2, LAWAN.z);
  const b = project(kam, PATUNG.x, 2.6, PATUNG.z);
  const x = a.x + (b.x - a.x) * p, y = a.y + (b.y - a.y) * p - Math.sin(p * Math.PI) * 220;
  const s = 1 - p * 0.35;
  const rot = p * 540;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        <ellipse rx={120} ry={70} fill="rgba(222,205,160,0.3)" stroke="#9C7B4F" strokeWidth={6} />
        <ellipse rx={74} ry={44} fill="none" stroke="#9C7B4F" strokeWidth={4} />
        {Array.from({ length: 10 }, (_, i) => { const t = (i / 10) * Math.PI * 2; return <line key={i} x1={0} y1={0} x2={Math.cos(t) * 120} y2={Math.sin(t) * 70} stroke="#9C7B4F" strokeWidth={3} />; })}
        {Array.from({ length: 10 }, (_, i) => { const t = (i / 10) * Math.PI * 2 + 0.3; return <circle key={i} cx={Math.cos(t) * 120} cy={Math.sin(t) * 70} r={8} fill="#4A4A4A" stroke="#141414" strokeWidth={2} />; })}
      </g>
    </svg>
  );
};

// Jaring yang sudah tersangkut, menjuntai di patung.
const JaringDiPatung: React.FC<{ kam: Pose }> = ({ kam }) => {
  const a = project(kam, PATUNG.x, 3.1, PATUNG.z);
  const u = Math.abs(project(kam, PATUNG.x + 1, 3.1, PATUNG.z).x - a.x); // px per meter
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path d={`M ${a.x - 0.5 * u} ${a.y} Q ${a.x} ${a.y - 0.25 * u} ${a.x + 0.5 * u} ${a.y} L ${a.x + 0.7 * u} ${a.y + 1.4 * u} Q ${a.x} ${a.y + 1.6 * u} ${a.x - 0.7 * u} ${a.y + 1.4 * u} Z`} fill="rgba(222,205,160,0.35)" stroke="#9C7B4F" strokeWidth={Math.max(2, 0.05 * u)} />
      {[0.3, 0.6, 0.9, 1.2].map((f) => <path key={f} d={`M ${a.x - (0.5 + f * 0.15) * u} ${a.y + f * u} Q ${a.x} ${a.y + (f + 0.1) * u} ${a.x + (0.5 + f * 0.15) * u} ${a.y + f * u}`} stroke="#9C7B4F" strokeWidth={Math.max(1.5, 0.03 * u)} fill="none" />)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Shot 8 (22,62–23,84): jaring dilempar, kamu menunduk, jaring menyangkut di patung.
// ---------------------------------------------------------------------------
export const Shot8Jaring: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 22.62, 23.84, { pos: [FX + 0.1, 1.35, FZ + 8.8], look: [FX + 0.1, 1.3, FZ + 0.8], fov: 54 }, { pos: [FX, 1.3, FZ + 8.3], look: [FX, 1.3, FZ + 0.8], fov: 54 });
  const p = k(t, [22.75, 23.45], [0, 1], Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={ARENA(t)} />
      {t > 23.45 && <JaringDiPatung kam={pose} />}
      <Di kam={pose} x={LAWAN.x} z={LAWAN.z} outfit="retiarius" expression="teriak" pose={t < 22.8 ? "lempar_jaring" : "tusuk_trisula"} t={t} dir={-1} nama="retiarius" />
      <Di kam={pose} x={KAMU.x} z={KAMU.z} outfit="gladiator" expression="takut" tEkspresi={t - 22.7} pose="kuda_kuda" motion="menghindar" tAksi={t - 22.8} atribut={["helm_gladiator"]} t={t} nama="kamu" />
      {t >= 22.75 && t <= 23.45 && <JaringTerbang kam={pose} p={p} />}
      <Vignette kuat={0.35} />
    </AbsoluteFill>
  );
};

// Kilat benturan 2D di titik kontak (membeku saat waktu berhenti).
const Benturan: React.FC<{ kam: Pose; s: number }> = ({ kam, s }) => {
  const c = project(kam, KONTAK.x, KONTAK.y, KONTAK.z);
  const pts = (r1: number, r2: number, n: number) => Array.from({ length: n * 2 }, (_, i) => { const a = (i / (n * 2)) * Math.PI * 2; const r = i % 2 ? r1 : r2; return `${(c.x + Math.cos(a) * r * s).toFixed(1)},${(c.y + Math.sin(a) * r * s).toFixed(1)}`; }).join(" ");
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <polygon points={pts(50, 150, 9)} fill="#FFD54F" stroke="#141414" strokeWidth={6} strokeLinejoin="round" />
      <polygon points={pts(26, 80, 9)} fill="#FFFFFF" />
    </svg>
  );
};

// Debu & pasir yang melayang diam saat waktu membeku.
const DebuBeku: React.FC<{ kam: Pose; jalan: number }> = ({ kam, jalan }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: 40 }, (_, i) => {
      const r = (n: number) => { const x = Math.sin((i + n) * 91.7) * 43758.5; return x - Math.floor(x); };
      const p = project(kam, KONTAK.x + (r(1) - 0.5) * 2.6, 0.2 + r(2) * 1.6 + jalan * r(4) * 0.6, KONTAK.z + (r(3) - 0.5) * 2.0);
      return p.visible ? <circle key={i} cx={p.x} cy={p.y} r={6 + r(5) * 14} fill="#D9C08C" stroke="#8a6a3a" strokeWidth={2} opacity={0.85} /> : null;
    })}
  </svg>
);

// ---------------------------------------------------------------------------
// Shot 9 (23,84–25,66): trisula mengenai perisai → waktu membeku, kamera mengitari, lalu jalan lagi:
// kamu terpental, kamera berguncang.
// ---------------------------------------------------------------------------
const T_BEKU = 24.05, T_JALAN = 25.05;
export const Shot9Beku: React.FC<{ t: number }> = ({ t }) => {
  const beku = t >= T_BEKU && t < T_JALAN;
  const tk = beku ? T_BEKU : t; // waktu karakter berhenti saat beku
  const sudut = interpolate(t, [T_BEKU, T_JALAN], [0, 2.2], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const r = 8.0;
  const pose: Pose = t < T_BEKU
    ? gerakPose(t, 23.84, T_BEKU, { pos: [FX, 1.3, FZ + 8.4], look: [KONTAK.x, 1.1, KONTAK.z], fov: 46 }, { pos: [FX, 1.3, FZ + 8.0], look: [KONTAK.x, 1.1, KONTAK.z], fov: 46 })
    : { pos: [KONTAK.x + Math.sin(sudut) * r, 1.3 + Math.sin(sudut) * 0.6, KONTAK.z + Math.cos(sudut) * r], look: [KONTAK.x, 1.1, KONTAK.z], fov: 46 };
  const kena = t >= T_BEKU;
  return (
    <Guncang dt={t - T_JALAN} kuat={30}>
      <AbsoluteFill style={{ filter: beku ? "saturate(0.55) contrast(1.1)" : undefined }}>
        <Set3D pose={pose} p={ARENA(tk, beku ? 0 : 1)} />
        <JaringDiPatung kam={pose} />
        <Di kam={pose} x={LAWAN.x} z={LAWAN.z} outfit="retiarius" expression="teriak" pose="tusuk_trisula" t={tk} dir={-1} nama="retiarius" />
        <Di kam={pose} x={KAMU.x} z={KAMU.z} outfit="gladiator" expression={kena ? "merem" : "takut"} tEkspresi={kena ? (beku ? 0.15 : t - T_JALAN + 0.15) : undefined} pose="tangkis" motion={t >= T_JALAN ? "terpental" : "napas"} tAksi={t - T_JALAN} atribut={["helm_gladiator"]} t={tk} nama="kamu" />
        {kena && t < T_JALAN + 0.35 && <Benturan kam={pose} s={beku ? 1 : 1 + (t - T_JALAN) * 2} />}
        {kena && <DebuBeku kam={pose} jalan={beku ? 0 : (t - T_JALAN) * 3} />}
        <Vignette kuat={beku ? 0.6 : 0.35} />
      </AbsoluteFill>
    </Guncang>
  );
};

// ---------------------------------------------------------------------------
// Shot 10 (25,66–27,88): kamu menyeruduk dengan perisai, lawan jatuh, kamu menahannya di pasir.
// ---------------------------------------------------------------------------
export const Shot10Kunci: React.FC<{ t: number }> = ({ t }) => {
  const maju = k(t, [25.72, 26.35], [0, 1], Easing.in(Easing.quad));
  const xKamu = KAMU.x + maju * 2.4;
  const pose = gerakPose(t, 25.66, 27.88, { pos: [xKamu - 0.2, 1.3, FZ + 7.6], look: [xKamu + 1.2, 1.0, FZ], fov: 50 }, { pos: [FX + 1.6, 1.7, FZ + 8.0], look: [FX + 1.7, 0.8, FZ], fov: 52 });
  const jatuh = t >= 26.35;
  const menang = t >= 26.9;
  return (
    <Guncang dt={t - 26.35} kuat={18}>
      <Set3D pose={pose} p={ARENA(t, menang ? 1.4 : 1)} />
      <JaringDiPatung kam={pose} />
      <Di kam={pose} x={LAWAN.x} z={LAWAN.z} outfit="retiarius" expression={jatuh ? "pingsan" : "kaget"} tEkspresi={t - 26.2} pose="idle" motion={jatuh ? "pingsan" : "napas"} tAksi={jatuh ? 0.25 + (t - 26.35) : 0} dir={-1} efek={jatuh ? ["debu"] : undefined} t={t} nama="retiarius" />
      <Di kam={pose} x={xKamu} z={KAMU.z} outfit="gladiator" expression={menang ? "syok" : "teriak"} tEkspresi={menang ? t - 26.9 : t - 25.7} pose="tangkis" motion={maju < 1 ? "seruduk" : "napas"} efek={maju < 1 && maju > 0 ? ["garis_cepat"] : menang ? ["seru"] : undefined} atribut={["helm_gladiator"]} dir={1} t={t} nama="kamu" />
      <Vignette kuat={0.35} />
    </Guncang>
  );
};

// ---------------------------------------------------------------------------
// Shot 11 (27,88–30,9): wasit bertongkat menyela; kalian berdiri tegak seperti dimarahi guru.
// ---------------------------------------------------------------------------
export const Shot11Wasit: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 27.88, 30.9, { pos: [FX, 1.5, FZ + 7.6], look: [FX, 1.1, FZ + 0.2], fov: 50 }, { pos: [FX, 1.45, FZ + 7.0], look: [FX, 1.1, FZ + 0.2], fov: 50 });
  const masuk = t >= 28.0;
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={ARENA(t, 0.6)} />
      <Di kam={pose} x={FX + 1.25} z={FZ} outfit="retiarius" expression="datar" tEkspresi={t - 28.3} pose="idle" t={t} nama="retiarius" />
      <Di kam={pose} x={FX - 1.25} z={FZ} outfit="gladiator" expression="datar" tEkspresi={t - 28.3} pose="idle" atribut={["helm_gladiator"]} t={t} nama="kamu" />
      {masuk && <Di kam={pose} x={FX} z={FZ + 0.4} tinggi={1.72} outfit="wasit" expression={t < 29.4 ? "teriak" : "marah"} tEkspresi={t - 28.0} pose={t < 29.4 ? "tunjuk_jelaskan" : "pegang_benda"} pegang="tongkat" motion={t < 28.4 ? "muncul" : "bicara"} tAksi={t - 28.0} t={t} nama="wasit" />}
      <Vignette kuat={0.35} />
    </AbsoluteFill>
  );
};

// Label harga raksasa berkilau yang berayun di atas kepala.
const LabelHarga: React.FC<{ kam: Pose; x: number; z: number; t: number; t0: number }> = ({ kam, x, z, t, t0 }) => {
  const a = project(kam, x, 2.35, z);
  const pop = interpolate(t - t0, [0, 0.15, 0.3], [0, 1.15, 1], clamp);
  const ayun = Math.sin((t - t0) * 4) * 8;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(${a.x} ${a.y - 120}) rotate(${ayun}) scale(${pop * 0.9})`}>
        <LabelPerunggu />
      </g>
      {[0, 1, 2].map((i) => {
        const g = ((t - t0) * 1.5 + i / 3) % 1;
        return <path key={i} transform={`translate(${a.x + 110 - i * 60} ${a.y - 250 + g * -40}) scale(${0.6 + g * 0.5})`} d="M 0 -14 L 4 -4 L 14 0 L 4 4 L 0 14 L -4 4 L -14 0 L -4 -4 Z" fill="#FFF59D" opacity={1 - g} />;
      })}
    </svg>
  );
};

// Koin melompat dari kantong (2D).
const Koin: React.FC<{ kam: Pose; x: number; y: number; z: number; t: number; t0: number }> = ({ kam, x, y, z, t, t0 }) => {
  const a = project(kam, x, y, z);
  if (t < t0) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 6 }, (_, i) => {
        const p = Math.min(1, (t - t0 - i * 0.07) / 0.6);
        if (p <= 0) return null;
        const dx = (i - 2.5) * 40 * p, dy = -Math.sin(p * Math.PI) * 220;
        return <ellipse key={i} cx={a.x + dx} cy={a.y + dy} rx={22} ry={22 * Math.abs(Math.cos(p * 9))} fill="#E0B400" stroke="#141414" strokeWidth={4} />;
      })}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Shot 12 (30,9–36,24): label harga raksasa di atas kepala kalian → tribun: lanista memeluk kantong koin
// dengan cemas, lalu menghitung koin dengan lega (KACHING!).
// ---------------------------------------------------------------------------
const LANISTA = { x: 5, z: B + 0.9 + 2 * 1.3 + 0.55, lantai: 3.6 + 3 * 1.3 };
export const Shot12Mahal: React.FC<{ t: number }> = ({ t }) => {
  // 30,9–33,02 "Tidak semua laga berakhir mati." → lanista cemas; 33,02–35,4 "Gladiator terlalu mahal…" →
  // label MAHAL muncul tepat di kata "mahal" (33,88); 35,4–36,24 lanista lega + KACHING.
  if (t >= 33.02 && t < 35.4) {
    const pose = gerakPose(t, 33.02, 35.4, { pos: [FX, 1.5, FZ + 8.4], look: [FX, 1.8, FZ], fov: 50 }, { pos: [FX, 1.5, FZ + 7.8], look: [FX, 1.85, FZ], fov: 50 });
    return (
      <AbsoluteFill>
        <Set3D pose={pose} p={ARENA(t, 0.6)} />
        <Di kam={pose} x={FX + 1.25} z={FZ} outfit="retiarius" expression="bingung" tEkspresi={t - 33.9} pose="garuk_kepala" t={t} nama="retiarius" />
        <Di kam={pose} x={FX - 1.25} z={FZ} outfit="gladiator" expression="curiga" tEkspresi={t - 34.0} pose="idle" lirik={0.8} atribut={["helm_gladiator"]} t={t} nama="kamu" />
        <LabelHarga kam={pose} x={FX - 1.25} z={FZ} t={t} t0={33.88} />
        <LabelHarga kam={pose} x={FX + 1.25} z={FZ} t={t} t0={33.98} />
        <Vignette kuat={0.35} />
      </AbsoluteFill>
    );
  }
  const pose = gerakPose(t, 30.9, 36.24, { pos: [LANISTA.x + 0.3, LANISTA.lantai + 1.7, LANISTA.z - 5.6], look: [LANISTA.x, LANISTA.lantai + 1.3, LANISTA.z], fov: 46 }, { pos: [LANISTA.x + 0.2, LANISTA.lantai + 1.65, LANISTA.z - 4.9], look: [LANISTA.x, LANISTA.lantai + 1.3, LANISTA.z], fov: 46 });
  const lega = t >= 35.4;
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={{ t, arena: { t, sorak: 0.8, jeruji: 1, luar: false, penonton: false }, siang: true }} />
      {/* penonton 2D di sekitar lanista (dari dekat, balok penonton 3D terlihat kasar) */}
      {[[-0.75, 2, "rakyat_romawi", "girang"], [0.75, 2, "romawi", "teriak"]].map(([dx, baris, o, e], i) => (
        <Di key={i} kam={pose} x={LANISTA.x + (dx as number)} z={LANISTA.z + ((baris as number) - 1) * 1.3} lantai={LANISTA.lantai + ((baris as number) - 1) * 1.3} tinggi={1.62} outfit={o as string} expression={e as string} pose="angkat_tangan" motion="lompat" tAksi={t + i * 0.13} t={t + i * 0.2} nama={`penonton${i}`} />
      ))}
      <Di kam={pose} x={LANISTA.x} z={LANISTA.z} lantai={LANISTA.lantai} tinggi={1.6} outfit="lanista" expression={lega ? "girang" : "takut"} tEkspresi={lega ? t - 35.4 : t - 31.0} pose="pegang_benda" pegang="kantong_koin" motion={lega ? "lompat" : "gemetar"} tAksi={t - 35.4} efek={lega ? undefined : ["keringat"]} t={t} nama="lanista" />
      <Koin kam={pose} x={LANISTA.x + 0.35} y={LANISTA.lantai + 0.9} z={LANISTA.z} t={t} t0={35.45} />
      <Vignette kuat={0.35} />
    </AbsoluteFill>
  );
};

// Jaring menutupi badan lawan (2D di atas karakter).
const JaringMenutup: React.FC<{ kam: Pose; x: number; z: number }> = ({ kam, x, z }) => {
  const c = placeCharacter(kam, x, z, 1.7);
  const u = c.width / 240;
  const cx = c.x, cy = c.groundY - 150 * u;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path d={`M ${cx - 70 * u} ${cy - 120 * u} Q ${cx} ${cy - 170 * u} ${cx + 70 * u} ${cy - 120 * u} L ${cx + 80 * u} ${cy + 70 * u} Q ${cx} ${cy + 100 * u} ${cx - 80 * u} ${cy + 70 * u} Z`} fill="rgba(222,205,160,0.22)" stroke="#9C7B4F" strokeWidth={4 * u} />
      {[-120, -80, -40, 0, 40].map((dy) => <path key={dy} d={`M ${cx - 78 * u} ${cy + dy * u} Q ${cx} ${cy + (dy + 18) * u} ${cx + 78 * u} ${cy + dy * u}`} stroke="#9C7B4F" strokeWidth={2.5 * u} fill="none" />)}
      {[-50, -20, 10, 40].map((dx) => <path key={dx} d={`M ${cx + dx * u} ${cy - 150 * u} L ${cx + dx * 1.15 * u} ${cy + 85 * u}`} stroke="#9C7B4F" strokeWidth={2.5 * u} fill="none" />)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Shot 13 (36,24–39,34): lawan terjepit jaringnya sendiri, cemberut mengangkat satu jari.
// ---------------------------------------------------------------------------
export const Shot13Menyerah: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 36.24, 39.34, { pos: [LAWAN.x, 1.45, FZ + 4.2], look: [LAWAN.x, 1.15, FZ], fov: 44 }, { pos: [LAWAN.x, 1.42, FZ + 3.7], look: [LAWAN.x, 1.18, FZ], fov: 44 });
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={ARENA(t, 0.4)} />
      <Di kam={pose} x={LAWAN.x} z={FZ} outfit="retiarius" expression="datar" tEkspresi={t - 36.5} miring={-10} pose="angkat_jari" motion="gemetar" tAksi={t} t={t} nama="retiarius" />
      <JaringMenutup kam={pose} x={LAWAN.x} z={FZ} />
      <Vignette kuat={0.35} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 14 (39,34–42,68): dari balkon penyelenggara (sudut tinggi): penonton bersorak, penyelenggara
// mengangguk; di bawah, kamu membantu lawan berdiri dan bersalaman.
// ---------------------------------------------------------------------------
const PENYELENGGARA = { x: BALKON.x + 3.9, z: BALKON.z - 0.1, lantai: 3.6 + 4.8 + 0.25 };
export const Shot14Ampun: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 39.34, 42.68, { pos: [BALKON.x + 4.4, 11.6, BALKON.z - 4.6], look: [FX + 1.5, 0.5, FZ], fov: 52 }, { pos: [BALKON.x + 4.2, 11.4, BALKON.z - 4.0], look: [FX + 1.2, 0.5, FZ], fov: 50 });
  const angguk = t > 40.2 ? Math.max(0, Math.sin((t - 40.2) * 9)) * 14 : 0;
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={ARENA(t, 1.5)} />
      <Di kam={pose} x={FX - 0.8} z={FZ} outfit="gladiator" expression="girang" tEkspresi={t - 40.8} pose="serahkan" atribut={["helm_gladiator"]} t={t} nama="kamu" />
      <Di kam={pose} x={FX + 0.8} z={FZ} outfit="retiarius" expression="kalem" tEkspresi={t - 41} pose="lambai" t={t} nama="retiarius" />
      <Di kam={pose} x={PENYELENGGARA.x} z={PENYELENGGARA.z} lantai={PENYELENGGARA.lantai} outfit="romawi" expression="kalem" tEkspresi={t - 39.5} angguk={angguk} pose="angkat_tangan" atribut={["mahkota_daun"]} t={t} nama="penyelenggara" />
      <Vignette kuat={0.3} />
    </AbsoluteFill>
  );
};
