import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { Pabrik3D, MESIN_TUA, PINTU } from "./pabrik3d";
import { LuarPabrik3D, PintuLuar3D, PINTU_LUAR, JENDELA_NYALA } from "./luar3d";
import { Pose, mixPose, placeCharacter, project } from "./kamera";
import { k, clamp, guncang, Vignette } from "./efek";
import { Di } from "./adegan1";

// Bagian 3 (shot 14–23, 40,28–72 s): hantu penjahit muncul, karyawan pingsan, hantu menyuruhnya
// pulang, absen pulang, satpam BobEjoo membalas lambaian hantu lalu membanting pintu.

const gerakPose = (t: number, t0: number, t1: number, a: Pose, b: Pose, e = Easing.inOut(Easing.cubic)) => mixPose(a, b, k(t, [t0, t1], [0, 1], e));
const lerp2 = (a: { x: number; z: number }, b: { x: number; z: number }, p: number) => ({ x: a.x + (b.x - a.x) * p, z: a.z + (b.z - a.z) * p });

const DEKAT_MESIN = { x: 4.72, z: -9.95 }; // posisi karyawan (sama dengan bagian 2)
const HANTU_DUDUK = { x: MESIN_TUA.x - 0.56, z: MESIN_TUA.z + 0.36 }; // hantu duduk di mesin tua
const SET = { mesinTuaNyala: 1, lampuKaryawan: 1, jam: { h: 0, m: 2 }, radio: 0, tumpukanTua: 0.75 };
const pucat = "rgb(205, 222, 232)";

// Guncangan kamera: bungkus adegan.
const Guncang: React.FC<{ dt: number; kuat?: number; children: React.ReactNode }> = ({ dt, kuat, children }) => {
  const g = guncang(dt, kuat);
  return <AbsoluteFill style={{ transform: `translate(${g.x}px, ${g.y}px) rotate(${g.r}deg) scale(1.04)` }}>{children}</AbsoluteFill>;
};

// Kilat neon putih (efek cahaya, bukan karakter).
const Kilat: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const o = interpolate(t, [at - 0.02, at, at + 0.06, at + 0.12, at + 0.3], [0, 0.85, 0.2, 0.6, 0], clamp);
  return o > 0.001 ? <AbsoluteFill style={{ backgroundColor: "#e8f4ff", opacity: o }} /> : null;
};

// Hantu penjahit duduk di mesin tua.
const Hantu: React.FC<{ kam: Pose; t: number; cepat?: number; expression?: string; pose?: string; motion?: string }> = ({ kam, t, cepat = 1, expression = "seram", pose = "menjahit", motion = "duduk_samping" }) => (
  <Di kam={kam} x={HANTU_DUDUK.x} z={HANTU_DUDUK.z} outfit="hantu" expression={expression} pose={pose} motion={motion} sit="kantor" dir={1} t={t * cepat} warnaKain="#7b6f8f" nama="hantu" />
);

// Baju jadi beterbangan dari mesin tua (2D, ikut posisi mesin di layar).
const BajuTerbang: React.FC<{ kam: Pose; t: number; t0: number; n?: number }> = ({ kam, t, t0, n = 7 }) => {
  if (t < t0) return null;
  const m = project(kam, MESIN_TUA.x - 0.1, 0.75, MESIN_TUA.z + 0.1);
  const skala = Math.abs(project(kam, MESIN_TUA.x + 0.4, 0.75, MESIN_TUA.z + 0.1).x - m.x) / 0.5; // px per meter
  const warna = ["#3a6fb0", "#c9504a", "#e3c35a", "#4f8f6b", "#f2efe8", "#7b6f8f"];
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: n }, (_, i) => {
        const p = ((t - t0) * 1.3 + i / n) % 1;
        const arah = i % 2 ? 1 : -1;
        const x = m.x + arah * (0.25 + (i % 3) * 0.2) * skala * p * 2.2;
        const y = m.y - Math.sin(p * Math.PI) * (0.9 + (i % 4) * 0.2) * skala - p * 0.2 * skala;
        const w = 0.32 * skala, h = 0.24 * skala;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${(p * 540 + i * 40) * arah})`}>
            <path d={`M ${-w / 2} ${-h / 2} L ${-w / 4} ${-h / 2 - h * 0.15} L ${w / 4} ${-h / 2 - h * 0.15} L ${w / 2} ${-h / 2} L ${w / 2} ${h / 2} L ${-w / 2} ${h / 2} Z`} fill={warna[i % warna.length]} stroke="#141414" strokeWidth={Math.max(2, skala * 0.012)} strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
};

// Selimut baju di atas badan karyawan yang pingsan (jatuh ke kiri layar).
const Selimut: React.FC<{ kam: Pose; jatuh: number }> = ({ kam, jatuh }) => {
  const c = placeCharacter(kam, DEKAT_MESIN.x, DEKAT_MESIN.z, 1.65);
  const u = c.width / 240; // px per unit rig
  const L = 253 * u;
  const y = c.groundY - 34 * u - (1 - jatuh) * 160 * u;
  const x0 = c.x - L * 0.88, x1 = c.x - L * 0.3;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <path d={`M ${x0} ${y - 14 * u} Q ${(x0 + x1) / 2} ${y - 28 * u} ${x1} ${y - 12 * u} L ${x1 + 6 * u} ${y + 22 * u} Q ${(x0 + x1) / 2} ${y + 30 * u} ${x0 - 6 * u} ${y + 24 * u} Z`} fill="#3a6fb0" stroke="#141414" strokeWidth={3.5 * u} strokeLinejoin="round" />
      <path d={`M ${x0 + 20 * u} ${y + 6 * u} L ${x1 - 20 * u} ${y + 4 * u}`} stroke="#f6ecd0" strokeWidth={1.6 * u} strokeDasharray={`${6 * u} ${4 * u}`} />
    </svg>
  );
};

// ---------------------------------------------------------------------------
// Shot 14 (40,28–42,98): mesin di belakangnya berbunyi lagi; kilat neon → hantu terlihat
// menjahit secepat kilat, baju beterbangan. Kamera berguncang.
// ---------------------------------------------------------------------------
const T_MUNCUL = 40.78;
export const Shot14Hantu: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 40.28, 42.98, { pos: [5.05, 1.45, -6.0], look: [4.42, 1.0, -10.4], fov: 47 }, { pos: [4.95, 1.4, -6.5], look: [4.42, 1.0, -10.4], fov: 46 });
  const ada = t >= T_MUNCUL;
  return (
    <Guncang dt={t - T_MUNCUL}>
      <Pabrik3D pose={pose} s={{ t, ...SET, mesinTuaT: t * 3, kedip: ada ? 1 : 0, lampuKaryawan: ada ? 1 : 0.35 }} />
      {ada && <Hantu kam={pose} t={t} cepat={4} />}
      <BajuTerbang kam={pose} t={t} t0={T_MUNCUL + 0.05} />
      <Di kam={pose} x={DEKAT_MESIN.x} z={DEKAT_MESIN.z} outfit="cewek" expression={ada ? "syok" : "takut"} pose="pegang_benda" pegang="kartu_absen" motion="gemetar" reaksi={ada ? "kaget" : undefined} tAksi={t - T_MUNCUL} wajah={pucat} efek={["keringat"]} t={t} nama="karyawan" />
      <Kilat t={t} at={T_MUNCUL} />
      <Vignette kuat={0.7} />
    </Guncang>
  );
};

// ---------------------------------------------------------------------------
// Shot 15 (42,98–46,54): menoleh pelan lalu pingsan; hantu tetap menjahit lalu melempar baju
// yang baru jadi untuk menyelimutinya.
// ---------------------------------------------------------------------------
const T_PINGSAN = 44.0;
export const Shot15Pingsan: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 42.98, 46.54, { pos: [2.75, 2.2, -5.0], look: [4.2, 0.8, -10.3], fov: 50 }, { pos: [2.8, 2.15, -5.3], look: [4.2, 0.8, -10.3], fov: 50 });
  const pingsan = t >= T_PINGSAN;
  const lempar = k(t, [45.2, 45.8], [0, 1], Easing.out(Easing.quad));
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, ...SET, mesinTuaT: t * 3, kedip: 0.6 }} />
      <Hantu kam={pose} t={t} cepat={4} />
      <BajuTerbang kam={pose} t={t} t0={42.98} n={4} />
      <Di
        kam={pose}
        x={DEKAT_MESIN.x}
        z={DEKAT_MESIN.z}
        outfit="cewek"
        expression={pingsan ? "pingsan" : "takut"}
        pose="idle"
        motion={pingsan ? "pingsan" : "gemetar"}
        lirik={pingsan ? 0 : k(t, [42.98, 43.9], [0, -1])}
        tAksi={pingsan ? t - T_PINGSAN : t}
        wajah={pucat}
        efek={pingsan && t > 44.7 ? ["pusing"] : ["keringat"]}
        t={t}
        nama="karyawan"
      />
      {t > 45.2 && <Selimut kam={pose} jatuh={lempar} />}
      <Vignette kuat={0.65} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 16 (46,54–50,82): close-up hantu yang tenang dan lelah; papan target "300 / 300" di belakang.
// ---------------------------------------------------------------------------
export const Shot16CloseHantu: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 46.54, 50.82, { pos: [4.25, 1.2, -6.6], look: [3.92, 1.02, -10.64], fov: 33 }, { pos: [4.2, 1.18, -7.1], look: [3.92, 1.02, -10.64], fov: 32 });
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, ...SET, mesinTuaT: t, papanDua: 300 }} />
      <Hantu kam={pose} t={t} cepat={1} />
      <Vignette kuat={0.6} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 17 (50,82–53,94): karyawan siuman (berdiri lagi); hantu menunjuk papan target, jam,
// lalu ke arah pintu: "pulang sana".
// ---------------------------------------------------------------------------
export const Shot17Tunjuk: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 50.82, 53.94, { pos: [2.9, 1.75, -5.6], look: [4.25, 0.9, -10.3], fov: 48 }, { pos: [3.0, 1.7, -6.0], look: [4.25, 0.9, -10.3], fov: 46 });
  const bangun = Math.max(0, 0.66 - (t - 50.82) * 1.1); // aksi pingsan diputar mundur = bangun
  let hp = "menjahit", he = "seram";
  if (t >= 51.3 && t < 52.4) { hp = "tunjuk_jelaskan"; he = "datar"; }
  else if (t >= 52.4) { hp = "bicara"; he = "datar"; }
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, ...SET, mesinTuaT: t < 51.3 ? t : undefined, papanDua: 300 }} />
      <Hantu kam={pose} t={t} expression={he} pose={hp} />
      <Di kam={pose} x={DEKAT_MESIN.x} z={DEKAT_MESIN.z} outfit="cewek" expression={bangun > 0.3 ? "pingsan" : "bingung"} pose="idle" motion="pingsan" tAksi={bangun} lirik={bangun > 0.3 ? 0 : -1} efek={bangun > 0.3 ? ["pusing"] : ["tanya"]} t={t} nama="karyawan" />
      {bangun > 0.6 && <Selimut kam={pose} jatuh={1} />}
      <Vignette kuat={0.6} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 18 (53,94–55,48): lari ke arah kamera di dekat pintu, memasukkan kartu ke mesin absen lama.
// ---------------------------------------------------------------------------
export const Shot18Absen: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 53.94, 55.48, { pos: [8.35, 1.35, 4.8], look: [9.35, 1.1, -0.4], fov: 46 }, { pos: [8.45, 1.3, 4.1], look: [9.4, 1.15, -0.2], fov: 44 });
  const p = k(t, [53.94, 54.95], [0, 1], Easing.out(Easing.quad));
  const pos = lerp2({ x: 9.05, z: -2.2 }, { x: 9.32, z: PINTU.z - 1.15 }, p);
  const tiba = t >= 54.95;
  const cekrek = interpolate(t, [55.1, 55.15, 55.35], [0, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, ...SET, lampuKaryawan: 0.3, cekrek }} />
      <Di kam={pose} x={pos.x} z={pos.z} outfit="cewek" expression={tiba ? "fokus" : "takut"} pose={tiba ? "pegang_benda" : "idle"} pegang="kartu_absen" motion={tiba ? "napas" : "lari"} efek={tiba ? undefined : ["debu"]} dir={1} t={t} nama="karyawan" />
      <Vignette kuat={0.6} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 19 (55,48–59,28): lebar dari pintu ke dalam. Jauh di ujung, hantu melambai lalu kembali
// menjahit sendirian di bawah satu lampu.
// ---------------------------------------------------------------------------
export const Shot19Lambai: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 55.48, 59.28, { pos: [9.3, 1.75, 2.7], look: [4.2, 0.9, -10.5], fov: 34 }, { pos: [9.2, 1.7, 2.4], look: [4.0, 0.95, -10.6], fov: 22 });
  const lambai = t < 57.4;
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, ...SET, lampuKaryawan: 0.15, mesinTuaT: lambai ? undefined : t, papanDua: 300 }} />
      <Hantu kam={pose} t={t} expression={lambai ? "kalem" : "seram"} pose={lambai ? "lambai" : "menjahit"} />
      <Vignette kuat={0.75} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 20 (59,28–64,0): kamera menembus pintu ke luar; satpam BobEjoo yang menunggu di luar
// membukakan pintu sambil tersenyum.
// ---------------------------------------------------------------------------
const T_TEMBUS = 59.85;
const SAT = PINTU_LUAR.satpam;
const satpamDasar = { outfit: "biasa", atribut: ["topi_satpam"] } as const;
export const Shot20Satpam: React.FC<{ t: number }> = ({ t }) => {
  if (t < T_TEMBUS) {
    const pose = gerakPose(t, 59.28, T_TEMBUS, { pos: [7.9, 1.4, 2.0], look: [9.9, 1.15, 2.0], fov: 50 }, { pos: [9.55, 1.15, 2.0], look: [9.95, 1.12, 2.0], fov: 50 }, Easing.in(Easing.cubic));
    const blur = k(t, [59.6, T_TEMBUS], [0, 16]);
    return (
      <AbsoluteFill style={{ filter: blur > 0.1 ? `blur(${blur}px)` : undefined }}>
        <Pabrik3D pose={pose} s={{ t, ...SET, lampuKaryawan: 0.15 }} />
      </AbsoluteFill>
    );
  }
  const pose = gerakPose(t, T_TEMBUS, 60.3, { pos: [0.05, 1.15, 0.35], look: [0.05, 1.12, -1], fov: 50 }, { pos: [0.8, 1.35, 4.3], look: [0.6, 1.05, 0], fov: 46 }, Easing.out(Easing.cubic));
  const blur = k(t, [T_TEMBUS, T_TEMBUS + 0.25], [16, 0]);
  const terbuka = k(t, [61.7, 62.4], [0, 1], Easing.out(Easing.back(1.2)));
  const buka = t >= 61.5;
  return (
    <AbsoluteFill style={{ filter: blur > 0.1 ? `blur(${blur}px)` : undefined }}>
      <PintuLuar3D pose={pose} s={{ t, terbuka }} />
      <Di kam={pose} x={SAT.x} z={SAT.z} tinggi={1.7} {...satpamDasar} expression={buka ? "kalem" : "ngantuk"} pose={buka ? "bicara" : "idle"} dir={-1} t={t} nama="satpam" />
      <Vignette kuat={0.55} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 21 (64,0–66,0): dari luar, karyawan lari keluar melewati satpam.
// ---------------------------------------------------------------------------
export const Shot21Kabur: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 64.0, 66.0, { pos: [2.6, 1.4, 5.4], look: [0.7, 1.0, 0.3], fov: 46 }, { pos: [2.8, 1.4, 5.0], look: [0.9, 1.0, 0.3], fov: 46 });
  const p = k(t, [64.15, 65.5], [0, 1], Easing.in(Easing.quad));
  const pos = lerp2({ x: 0.0, z: -0.3 }, { x: 4.6, z: 3.2 }, p);
  const c = placeCharacter(pose, pos.x, pos.z, 1.65);
  return (
    <AbsoluteFill>
      <PintuLuar3D pose={pose} s={{ t, terbuka: 1 }} />
      <Di kam={pose} x={SAT.x} z={SAT.z} tinggi={1.7} {...satpamDasar} expression="kalem" pose="bicara" lirik={p > 0.3 ? 1 : 0} dir={-1} t={t} nama="satpam" />
      {c.x < 1300 && <Di kam={pose} x={pos.x} z={pos.z} outfit="cewek" expression="takut" pose="idle" motion="lari" efek={["debu"]} dir={1} t={t} nama="karyawan" />}
      <Vignette kuat={0.55} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 22 (66,0–70,0): satpam menoleh ke dalam; hantu melambai dari lorong. Satpam membalas
// melambai dengan bingung, lalu sadar, matanya melotot, dan pintu dibanting. Kamera berguncang.
// ---------------------------------------------------------------------------
const T_BANTING = 68.95;
export const Shot22Banting: React.FC<{ t: number }> = ({ t }) => {
  const pose = t < 68.15
    ? gerakPose(t, 66.0, 68.15, { pos: [1.25, 1.35, 3.6], look: [0.45, 1.15, 0], fov: 46 }, { pos: [1.2, 1.35, 3.3], look: [0.45, 1.15, 0], fov: 45 })
    : gerakPose(t, 68.15, 68.5, { pos: [1.2, 1.35, 3.3], look: [0.45, 1.15, 0], fov: 45 }, { pos: [0.97, 1.45, 2.45], look: [0.67, 1.35, 0.6], fov: 42 }, Easing.out(Easing.cubic));
  const terbuka = k(t, [68.7, T_BANTING], [1, 0], Easing.in(Easing.quad));
  // Lubang pintu di layar → hantu hanya terlihat di dalam lubang pintu.
  const sudut = [project(pose, -0.52, 2.1, 0), project(pose, 0.52, 2.1, 0), project(pose, 0.52, 0, 0), project(pose, -0.52, 0, 0)];
  const clip = `polygon(${sudut.map((p) => `${p.x}px ${p.y}px`).join(", ")})`;
  let s: Record<string, unknown> = { expression: "kalem", pose: "bicara", lirik: -1 };
  if (t >= 66.8 && t < 68.1) s = { expression: "bingung", pose: "lambai", lirik: -1, efek: ["tanya"] };
  else if (t >= 68.1 && t < T_BANTING) s = { expression: "syok", pose: "lambai", reaksi: "kaget", tAksi: t - 68.1, efek: ["garis_kaget"] };
  else if (t >= T_BANTING) s = { expression: "takut", pose: "angkat_tangan", motion: "gemetar", efek: ["keringat"], tAksi: t - T_BANTING };
  return (
    <Guncang dt={t - T_BANTING} kuat={30}>
      <PintuLuar3D pose={pose} s={{ t, terbuka }} />
      {terbuka > 0.35 && t >= 66.35 && t < 68.3 && (
        <div style={{ position: "absolute", inset: 0, clipPath: clip }}>
          <Di kam={pose} x={PINTU_LUAR.dalam.x} z={PINTU_LUAR.dalam.z} tinggi={1.6} outfit="hantu" expression="kalem" pose="lambai" motion="melayang" t={t} nama="hantu" />
        </div>
      )}
      <Di kam={pose} x={SAT.x - 0.18} z={SAT.z} tinggi={1.7} {...satpamDasar} dir={-1} t={t} nama="satpam" {...(s as object)} />
      <Vignette kuat={0.55} />
    </Guncang>
  );
};

// ---------------------------------------------------------------------------
// Shot 23 (70,0–72,0): dari udara, kamera mundur menjauh. Jendela tadi padam… lalu menyala lagi.
// ---------------------------------------------------------------------------
export const Shot23Penutup: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 70.0, 72.0, { pos: [-3.4, 8.5, 26], look: [JENDELA_NYALA[0], JENDELA_NYALA[1] - 0.6, JENDELA_NYALA[2]], fov: 36 }, { pos: [-8, 19, 56], look: [-1, 5, 0], fov: 42 }, Easing.inOut(Easing.quad));
  const jendela = t < 70.55 ? 1 : t < 71.25 ? 0 : 1;
  return (
    <AbsoluteFill>
      <LuarPabrik3D pose={pose} s={{ t, jendela }} />
      <Vignette kuat={0.6} />
    </AbsoluteFill>
  );
};
