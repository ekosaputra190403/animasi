import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { Pabrik3D, MEJA_KARYAWAN, MESIN_TUA } from "./pabrik3d";
import { Pose, mixPose } from "./kamera";
import { k, clamp, Vignette } from "./efek";
import { Di, DUDUK } from "./adegan1";
import { KartuAbsen } from "./kartu";

// Bagian 2 (shot 8–13, 16,84–40,28 s). Mesin tua terus berbunyi di latar sejak shot 7.

const gerakPose = (t: number, t0: number, t1: number, a: Pose, b: Pose, e = Easing.inOut(Easing.cubic)) => mixPose(a, b, k(t, [t0, t1], [0, 1], e));
const lerp2 = (a: { x: number; z: number }, b: { x: number; z: number }, p: number) => ({ x: a.x + (b.x - a.x) * p, z: a.z + (b.z - a.z) * p });

// Warna wajah memucat (putih → biru pucat).
const pucat = (p: number) => {
  const c = (a: number, b: number) => Math.round(a + (b - a) * p);
  return `rgb(${c(255, 205)}, ${c(255, 222)}, ${c(255, 232)})`;
};

const MANEKIN_A = { x: -3.6, z: 1.6 }; // di kanan karyawan (yang dipeluk)
const SEMBUNYI = { x: -4.05, z: 1.62 }; // di antara dua manekin
const BERDIRI_MEJA = { x: -1.8, z: 0.75 }; // depan meja jahit karyawan
const DEKAT_MESIN = { x: 4.72, z: -9.95 }; // di depan tumpukan baju samping mesin tua
const SET_MALAM = { mesinTuaNyala: 1, lampuKaryawan: 1, jam: { h: 0, m: 1 } };

// ---------------------------------------------------------------------------
// Shot 8 (16,84–20,34): mematikan radio, lari ke deretan manekin, lalu berdiri kaku
// meniru manekin.
// ---------------------------------------------------------------------------
export const Shot8Radio: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 17.5, 19.2, { pos: [-0.6, 0.95, 5.4], look: [-2.4, 0.95, 1.0], fov: 44 }, { pos: [-1.5, 0.95, 5.1], look: [-3.7, 0.9, 1.4], fov: 42 });
  const radio = t < 17.3 ? 1 : 0;
  const lari = k(t, [17.6, 19.0], [0, 1], Easing.inOut(Easing.quad));
  const pos = lerp2(BERDIRI_MEJA, SEMBUNYI, lari);
  let c: Record<string, unknown>;
  if (t < 17.6) c = { expression: "takut", pose: "bicara", motion: "gemetar", tAksi: t };
  else if (t < 19.0) c = { expression: "takut", pose: "idle", motion: "lari", dir: -1, efek: ["debu"], tAksi: t };
  else c = { expression: "datar", pose: "idle", motion: "gemetar", efek: ["keringat"], tAksi: t - 19.0 };
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, ...SET_MALAM, mesinTuaT: t, radio }} />
      <Di kam={pose} x={pos.x} z={pos.z} outfit="cewek" t={t} nama="karyawan" {...(c as object)} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 9 (20,34–24,52): memeluk "orang" di sebelahnya → ternyata manekin; mundur → manekin
// lain di belakangnya. Kaget dua kali.
// ---------------------------------------------------------------------------
export const Shot9Manekin: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 20.34, 24.52, { pos: [-3.3, 1.05, 5.2], look: [-4.0, 0.85, 1.5], fov: 38 }, { pos: [-3.4, 1.05, 4.8], look: [-4.05, 0.86, 1.5], fov: 37 });
  // Saat kaget pertama dia melompat ke kiri sedikit (menjauh dari manekin yang dipeluk).
  const geser = k(t, [22.5, 22.8], [0, -0.22]);
  let c: Record<string, unknown>;
  if (t < 21.5) c = { expression: "takut", pose: "idle", motion: "gemetar", lirik: 0.6, tAksi: t };
  else if (t < 22.3) c = { expression: "kalem", pose: "peluk", motion: "napas", tAksi: t };
  else if (t < 22.5) c = { expression: "datar", pose: "peluk", lirik: 1, tAksi: t };
  else if (t < 23.3) c = { expression: "kaget", pose: "angkat_tangan", motion: "kaget", efek: ["garis_kaget"], tAksi: t - 22.5 };
  else if (t < 23.5) c = { expression: "takut", pose: "idle", lirik: -1, tAksi: t };
  else c = { expression: "syok", pose: "angkat_tangan", motion: "kaget", efek: ["garis_kaget", "keringat"], lirik: -1, tAksi: t - 23.5 };
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, ...SET_MALAM, mesinTuaT: t, radio: 0 }} />
      <Di kam={pose} x={SEMBUNYI.x + geser} z={SEMBUNYI.z} outfit="cewek" t={t} nama="karyawan" {...(c as object)} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 10 (24,52–26,14): tracking dari samping. Mengendap di lorong sambil memegang gunting
// seperti pedang; neon di atas berkedip.
// ---------------------------------------------------------------------------
export const Shot10Lorong: React.FC<{ t: number }> = ({ t }) => {
  const z = interpolate(t, [24.52, 26.14], [-3.2, -4.5], clamp);
  const pose: Pose = { pos: [7.7, 1.25, z - 0.4], look: [4.5, 0.95, z - 0.2], fov: 40 };
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, ...SET_MALAM, mesinTuaT: t, radio: 0, kedip: 1 }} />
      <Di kam={pose} x={4.5} z={z} outfit="cewek" expression="takut" pose="pegang_benda" pegang="gunting" motion="jalan" dir={1} t={t * 0.7} efek={["keringat"]} nama="karyawan" />
      <Vignette kuat={0.7} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 11 (26,14–30,64): push-in ke tumpukan baju jadi di samping mesin tua. Menghitung,
// tersenyum senang, lalu sadar ada yang aneh.
// ---------------------------------------------------------------------------
export const Shot11Baju: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 26.14, 30.64, { pos: [6.4, 1.35, -6.9], look: [4.85, 0.85, -10.4], fov: 46 }, { pos: [6.0, 1.25, -7.6], look: [4.85, 0.82, -10.4], fov: 44 });
  let c: Record<string, unknown>;
  if (t < 27.6) c = { expression: "fokus", pose: "bicara", motion: "napas", lirik: 0.8, tAksi: t };
  else if (t < 29.2) c = { expression: "girang", pose: "angkat_tangan", motion: "lompat", tAksi: t - 27.6 };
  else c = { expression: "syok", pose: "idle", reaksi: "kaget", efek: ["keringat"], lirik: -1, tAksi: t - 29.2 };
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, ...SET_MALAM, mesinTuaT: t, radio: 0, tumpukanTua: 0.75 }} />
      <Di kam={pose} x={DEKAT_MESIN.x} z={DEKAT_MESIN.z} outfit="cewek" pose="idle" t={t} nama="karyawan" {...(c as object)} />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Latar kabur untuk sisipan kartu: mesin tua dari dekat, diburamkan.
// ---------------------------------------------------------------------------
const POSE_DEKAT_MESIN: Pose = { pos: [MESIN_TUA.x - 0.1, 0.95, MESIN_TUA.z + 0.9], look: [MESIN_TUA.x - 0.15, 0.75, MESIN_TUA.z], fov: 40 };
const LatarKabur: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ filter: "blur(14px) brightness(0.75)" }}>
    <Pabrik3D pose={POSE_DEKAT_MESIN} s={{ t, ...SET_MALAM, mesinTuaT: t, radio: 0 }} />
  </AbsoluteFill>
);

// Tangan 2D (gaya rig) memegang bawah kartu.
const Tangan: React.FC<{ x: number; y: number; dariKanan?: boolean }> = ({ x, y, dariKanan }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <path d={`M ${dariKanan ? 1200 : -120} 2050 Q ${x + (dariKanan ? 160 : -160)} ${y + 260} ${x} ${y}`} stroke="#141414" strokeWidth={26} strokeLinecap="round" fill="none" />
    <circle cx={x} cy={y} r={32} fill="#141414" />
  </svg>
);

// ---------------------------------------------------------------------------
// Shot 12 (30,64–34,66): kamera melesat masuk ke celah mesin → kartu absen tua terselip,
// ditarik keluar, debunya ditiup (lalu terbatuk).
// ---------------------------------------------------------------------------
export const Shot12Kartu: React.FC<{ t: number }> = ({ t }) => {
  if (t < 31.15) {
    // Dorongan cepat dari posisi shot 11 ke celah mesin.
    const pose = gerakPose(t, 30.64, 31.15, { pos: [6.0, 1.25, -7.6], look: [4.85, 0.82, -10.4], fov: 44 }, { pos: [MESIN_TUA.x - 0.15, 0.82, MESIN_TUA.z + 0.35], look: [MESIN_TUA.x - 0.15, 0.75, MESIN_TUA.z], fov: 40 }, Easing.in(Easing.cubic));
    const blur = k(t, [30.85, 31.15], [0, 16]);
    return (
      <AbsoluteFill style={{ filter: blur > 0.1 ? `blur(${blur}px)` : undefined }}>
        <Pabrik3D pose={pose} s={{ t, ...SET_MALAM, mesinTuaT: t, radio: 0, tumpukanTua: 0.75 }} />
        <Di kam={pose} x={DEKAT_MESIN.x} z={DEKAT_MESIN.z} outfit="cewek" expression="curiga" pose="idle" t={t} nama="karyawan" />
      </AbsoluteFill>
    );
  }
  const tarik = k(t, [31.15, 31.9], [520, 0], Easing.out(Easing.back(1.4)));
  const debu = k(t, [32.55, 33.0], [1, 0]);
  const blurMasuk = k(t, [31.15, 31.4], [16, 0]);
  const goyang = Math.sin(t * 3) * 1.2 + (t > 32.55 && t < 33.4 ? Math.sin(t * 40) * 2 : 0);
  return (
    <AbsoluteFill style={{ filter: blurMasuk > 0.1 ? `blur(${blurMasuk}px)` : undefined }}>
      <LatarKabur t={t} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `translateY(${tarik - 60}px) rotate(${goyang - 3}deg)`, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.6))" }}>
          <KartuAbsen nama="SUMARNI" bulan="NOV 1997" tua debu={debu} lebar={720} />
        </div>
      </AbsoluteFill>
      {/* debu beterbangan saat ditiup */}
      {t > 32.55 && t < 33.6 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 40 }, (_, i) => {
            const p = (t - 32.55) / 1.05;
            const x = 220 + ((i * 97) % 640) + p * (300 + (i % 7) * 60);
            const y = 500 + ((i * 173) % 900) - p * (200 + (i % 5) * 80);
            return <circle key={i} cx={x} cy={y} r={6 + (i % 5) * 3} fill="#B7B09C" opacity={0.8 * (1 - p)} />;
          })}
        </svg>
      )}
      <Tangan x={420} y={1500 + tarik * 0.9} />
      <Vignette kuat={0.65} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 13 (34,66–40,28): dua kartu berdampingan — kolom KELUAR lembur malam ini sama-sama
// kosong. Lalu wajahnya pelan-pelan pucat.
// ---------------------------------------------------------------------------
export const Shot13DuaKartu: React.FC<{ t: number }> = ({ t }) => {
  if (t < 39.2) {
    const geserTua = k(t, [36.1, 36.6], [0, -200]);
    const masukBaru = k(t, [36.28, 36.9], [900, 0], Easing.out(Easing.back(1.2)));
    const zoom = k(t, [34.66, 39.2], [1.0, 1.06]);
    return (
      <AbsoluteFill>
        <LatarKabur t={t} />
        <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
          <div style={{ position: "absolute", left: 540 - 300 + geserTua, top: 960 - 640, transform: "rotate(-4deg)" }}>
            <KartuAbsen nama="SUMARNI" bulan="NOV 1997" tua sorot={k(t, [34.75, 35.4], [0, 1])} lebar={600} />
          </div>
          {t > 36.28 && (
            <div style={{ position: "absolute", left: 540 + 10 + masukBaru, top: 960 - 590, transform: "rotate(3deg)" }}>
              <KartuAbsen nama="RINA" bulan="NOV 2026" sorot={k(t, [38.15, 38.8], [0, 1])} lebar={520} />
            </div>
          )}
        </AbsoluteFill>
        {t > 36.28 && <Tangan x={860 + masukBaru} y={1560} dariKanan />}
        {/* label tahun */}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {[{ x: 340 + geserTua, s: "1997", on: 1 }, { x: 810 + masukBaru, s: "2026", on: t > 36.28 ? 1 : 0 }].map((l) => l.on ? (
            <text key={l.s} x={l.x} y={250} textAnchor="middle" fontFamily="'Segoe UI', Arial" fontWeight={800} fontSize={80} fill="#FFFFFF" stroke="#141414" strokeWidth={12} paintOrder="stroke">{l.s}</text>
          ) : null)}
        </svg>
        <Vignette kuat={0.65} />
      </AbsoluteFill>
    );
  }
  // Wajah memucat; di belakangnya (jauh) mesin tua masih menyala.
  const pose = gerakPose(t, 39.2, 40.28, { pos: [DEKAT_MESIN.x + 0.25, 1.3, DEKAT_MESIN.z + 3.0], look: [DEKAT_MESIN.x, 1.2, DEKAT_MESIN.z], fov: 30 }, { pos: [DEKAT_MESIN.x + 0.2, 1.3, DEKAT_MESIN.z + 2.6], look: [DEKAT_MESIN.x, 1.22, DEKAT_MESIN.z], fov: 30 });
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, ...SET_MALAM, mesinTuaT: t, radio: 0, tumpukanTua: 0.75 }} />
      <Di kam={pose} x={DEKAT_MESIN.x} z={DEKAT_MESIN.z} outfit="cewek" expression="takut" pose="pegang_benda" pegang="kartu_absen" motion="gemetar" t={t} tAksi={t} wajah={pucat(k(t, [39.2, 40.2], [0.2, 1]))} efek={["keringat"]} nama="karyawan" />
      <Vignette kuat={0.75} />
    </AbsoluteFill>
  );
};

export { MEJA_KARYAWAN, DUDUK };
