import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { Set3D, KAMAR } from "./set3d";
import { Pose, mixPose } from "./kamera";
import { k, clamp, Vignette } from "./efek";
import { Di } from "./adegan1";
import { TeksKomik, PapanPensiun, PerisaiDuel, DaunSalam } from "./teks";

// Bagian 3 (shot 15–20, 42,68–64,6 s): hadiah daun palem → Flamma diberi pedang kayu → 4 jump cut (jenggot
// makin panjang, siang–malam berganti) → pilihan PENSIUN / DUEL LAGI → Colosseum ternyata miniatur di meja
// kamarmu, kamu tidur lagi, alarm berbunyi (video bersambung ke awal).

const gerakPose = (t: number, t0: number, t1: number, a: Pose, b: Pose, e = Easing.inOut(Easing.cubic)) => mixPose(a, b, k(t, [t0, t1], [0, 1], e));
const ARENA = (t: number, sorak = 1, malam = false) => ({ t, arena: { t, sorak, jeruji: 1, luar: false }, siang: !malam, malam });
const FX = -4.1, FZ = 2.0;

// ---------------------------------------------------------------------------
// Shot 15 (42,68–45,88): kamu menerima daun palem + kantong uang, mengibas-ngibaskan daun ke wajah berkeringat.
// ---------------------------------------------------------------------------
export const Shot15Hadiah: React.FC<{ t: number }> = ({ t }) => {
  const sudut = interpolate(t, [42.68, 45.88], [-0.35, 0.35], clamp);
  const pose: Pose = { pos: [FX + Math.sin(sudut) * 5, 1.5, FZ + Math.cos(sudut) * 5], look: [FX, 1.15, FZ], fov: 46 };
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={ARENA(t, 1.3)} />
      <Di kam={pose} x={FX} z={FZ} outfit="gladiator" expression="girang" tEkspresi={t - 42.75} miring={8} pose="pegang_benda" pegang="daun_palem" pegangKiri="kantong_koin" motion="lompat" tAksi={t - 42.7} efek={["keringat"]} atribut={["helm_gladiator"]} t={t} nama="kamu" />
      <Vignette kuat={0.3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 16 (45,88–49,14): Flamma menerima pedang kayu (tanda bebas) dari wasit di tengah arena.
// ---------------------------------------------------------------------------
export const Shot16Rudis: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 45.88, 49.14, { pos: [0.4, 1.5, 7.0], look: [0, 1.15, 0], fov: 46 }, { pos: [0.3, 1.45, 6.2], look: [0, 1.15, 0], fov: 46 });
  const terima = t >= 46.9;
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={ARENA(t, 1.2)} />
      <Di kam={pose} x={-0.9} z={0} outfit="wasit" expression="kalem" tEkspresi={t - 46} pose={terima ? "idle" : "serahkan"} pegang={terima ? undefined : "pedang_kayu"} t={t} nama="wasit" />
      <Di kam={pose} x={0.9} z={0} outfit="flamma" expression={terima ? "girang" : "kalem"} tEkspresi={t - 46.9} pose={terima ? "pegang_benda" : "idle"} pegang="pedang_kayu" motion={terima ? "lompat" : "napas"} tAksi={t - 46.9} t={t} nama="flamma" />
      <Vignette kuat={0.3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 17 (49,14–55,48): 4 jump cut sangat cepat. Tiap potongan: Flamma menerima pedang kayu lalu langsung
// lari balik ke arena; jenggotnya makin panjang, siang–malam bergantian, angka 1×–4× muncul.
// ---------------------------------------------------------------------------
const T17 = 49.14, D17 = (55.48 - 49.14) / 4;
export const Shot17EmpatKali: React.FC<{ t: number }> = ({ t }) => {
  const n = Math.min(3, Math.floor((t - T17) / D17)); // 0..3
  const tl = t - T17 - n * D17; // waktu di dalam potongan
  const malam = n % 2 === 1;
  const pose: Pose = { pos: [0.2 + n * 0.3, 1.5, 6.6 - tl * 0.3], look: [0, 1.15, 0], fov: 46 };
  const lari = tl > D17 * 0.45;
  const xF = lari ? 0.9 - (tl - D17 * 0.45) * 4.5 : 0.9;
  const jenggot = ["jenggot", "jenggot_2", "jenggot_3", "jenggot_4"][n];
  const pop = interpolate(tl, [0, 0.08, 0.18], [0.4, 1.2, 1], clamp);
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={ARENA(t, 1.4, malam)} />
      {!lari && <Di kam={pose} x={-0.9} z={0} outfit="wasit" expression="datar" tEkspresi={tl} pose="serahkan" pegang="pedang_kayu" t={t} nama="wasit" />}
      <Di kam={pose} x={xF} z={0} outfit="flamma" expression={lari ? "teriak" : "datar"} tEkspresi={tl} pose={lari ? "pegang_benda" : "serahkan"} pegang="pedang_kayu" motion={lari ? "lari" : "napas"} dir={-1} atribut={[jenggot]} efek={lari ? ["debu"] : undefined} t={t} nama="flamma" />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(540 330) scale(${pop * 1.25})`}>
          <DaunSalam x={0} y={-60} r={150} />
          <TeksKomik x={0} y={20} teks={`${n + 1}×`} ukuran={190} />
        </g>
      </svg>
      <Vignette kuat={malam ? 0.55 : 0.3} />
    </AbsoluteFill>
  );
};

// Papan pilihan (papan kayu PENSIUN di kiri, perisai DUEL LAGI di kanan): muncul memantul, berayun pelan,
// dan papan PENSIUN bisa dilempar keluar layar (terbang 0..1).
const Pilihan: React.FC<{ t: number; t0: number; jenis: "pensiun" | "duel"; terbang?: number }> = ({ t, t0, jenis, terbang = 0 }) => {
  if (t < t0) return null;
  const pop = interpolate(t - t0, [0, 0.12, 0.22, 0.32], [0, 1.18, 0.94, 1], clamp);
  const ayun = Math.sin((t - t0) * 2.6 + (jenis === "duel" ? 1.3 : 0)) * 4;
  const x0 = jenis === "pensiun" ? 285 : 800;
  const x = x0 - terbang * 900, y = 560 - terbang * 520 - Math.sin(terbang * Math.PI) * 120;
  const s = pop * 1.22 * (1 - terbang * 0.3);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {jenis === "pensiun"
        ? <PapanPensiun x={x} y={y} s={s} rot={ayun - 4 - terbang * 300} />
        : <PerisaiDuel x={x} y={y} s={s} rot={ayun + 4} />}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Shot 18 (55,48–61,0): close-up kamu memegang pedang kayu, kepala miring bingung. Dua pilihan muncul:
// papan kayu PENSIUN dan perisai DUEL LAGI; mata melirik bolak-balik.
// ---------------------------------------------------------------------------
export const Shot18Pilih: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 55.48, 61.0, { pos: [FX, 1.55, FZ + 4.4], look: [FX, 1.35, FZ], fov: 44 }, { pos: [FX, 1.52, FZ + 3.8], look: [FX, 1.38, FZ], fov: 44 });
  const lirik = t < 58.3 ? 0 : t < 60.2 ? -1 : 1; // melirik ke papan yang sedang disebut
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={ARENA(t, 0.7)} />
      <Di kam={pose} x={FX} z={FZ} outfit="gladiator" expression="bingung" tEkspresi={t - 55.6} miring={t < 58.3 ? 12 : lirik * 10} lirik={lirik} pose="pegang_benda" pegang="pedang_kayu" atribut={["helm_gladiator"]} t={t} nama="kamu" />
      <Pilihan t={t} t0={58.3} jenis="pensiun" />
      <Pilihan t={t} t0={60.2} jenis="duel" />
      <Vignette kuat={0.35} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 19 (61,0–62,6): penonton meneriakkan namamu; kamu nyengir, membuang kartu PENSIUN, mengangkat pedang.
// ---------------------------------------------------------------------------
export const Shot19Duel: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 61.0, 62.6, { pos: [FX, 1.5, FZ + 4.2], look: [FX, 1.3, FZ], fov: 46 }, { pos: [FX + 0.6, 1.9, FZ + 7.5], look: [FX, 1.4, FZ], fov: 50 });
  const buang = k(t, [61.1, 61.6], [0, 1], Easing.in(Easing.quad));
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={ARENA(t, 1.6)} />
      <Di kam={pose} x={FX} z={FZ} outfit="gladiator" expression="girang" tEkspresi={t - 61.0} pose="ayun" pegang="pedang_kayu" motion="lompat" tAksi={t - 61.2} atribut={["helm_gladiator"]} t={t} nama="kamu" />
      {buang < 1 && <Pilihan t={t} t0={55} jenis="pensiun" terbang={buang} />}
      <Pilihan t={t} t0={55} jenis="duel" />
      <Vignette kuat={0.3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 20 (62,6–64,6): kamera terus mundur dari Colosseum… ternyata miniatur di meja kamarmu; kamu tidur
// lagi di kasur dan alarm HP mulai berbunyi (bersambung ke detik 0).
// ---------------------------------------------------------------------------
const T_MINIATUR = 63.45;
export const Shot20Miniatur: React.FC<{ t: number }> = ({ t }) => {
  if (t < T_MINIATUR) {
    const pose = gerakPose(t, 62.6, T_MINIATUR, { pos: [8, 78, 70], look: [0, 0, -6], fov: 48 }, { pos: [10, 175, 150], look: [0, 0, -6], fov: 48 }, Easing.in(Easing.quad));
    return (
      <AbsoluteFill>
        <Set3D pose={pose} p={{ t, arena: { t, sorak: 1.3, jeruji: 1 }, kota: true, siang: true }} />
      </AbsoluteFill>
    );
  }
  // Ukuran miniatur di layar sama dengan Colosseum di akhir potongan sebelumnya (match cut), lalu kamera mundur.
  const m = KAMAR.meja;
  const pose = gerakPose(t, T_MINIATUR, 64.6, { pos: [m.x - 0.07, 1.62, m.z + 0.62], look: [m.x - 0.1, 0.77, m.z + 0.02], fov: 48 }, { pos: [0.05, 2.35, 1.9], look: [-0.2, 0.7, -0.9], fov: 72 }, Easing.inOut(Easing.cubic));
  const alarm = t > 64.15;
  return (
    <AbsoluteFill>
      <Set3D pose={pose} p={{ t, kamar: { miniatur: true, hp: alarm ? 1 : 0 }, siang: false }} />
      <Di kam={pose} x={KAMAR.kasur.x + 0.75} z={KAMAR.kasur.z + 0.15} lantai={0.57} outfit="biasa" expression="ngantuk" pose="idle" motion="pingsan" tAksi={1.2} dir={1} t={t} nama="kamu" />
      <Vignette kuat={0.45} />
    </AbsoluteFill>
  );
};
