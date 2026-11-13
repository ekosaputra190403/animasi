import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { Karakter } from "../_pustaka/Karakter";
import { Pabrik3D, MEJA_KARYAWAN, MESIN_TUA } from "./pabrik3d";
import { LuarPabrik3D, PosSatpam3D, MONITOR_UTAMA, SATPAM_BERDIRI, JENDELA_NYALA } from "./luar3d";
import { Pose, mixPose, placeCharacter, project } from "./kamera";
import { k, Vignette } from "./efek";

// Bagian 1 (shot 1–7, 0–16,84 s). Setiap shot menerima t = detik dari awal video.

// Posisi duduk karyawan (sama dengan still UjiB yang disetujui).
export const DUDUK = { x: MEJA_KARYAWAN.x - 0.56, z: MEJA_KARYAWAN.z + 0.36 };
const SATPAM = SATPAM_BERDIRI;

const gerakPose = (t: number, t0: number, t1: number, a: Pose, b: Pose, e = Easing.inOut(Easing.cubic)) => mixPose(a, b, k(t, [t0, t1], [0, 1], e));

// Karakter yang diletakkan dari posisi dunia 3D (kaki tepat di lantai).
type KarProps = Omit<React.ComponentProps<typeof Karakter>, "x" | "groundY" | "width">;
export const Di: React.FC<{ kam: Pose; x: number; z: number; tinggi?: number } & KarProps> = ({ kam, x, z, tinggi = 1.65, ...rest }) => {
  const c = placeCharacter(kam, x, z, tinggi);
  if (!c.visible) return null;
  return <Karakter {...rest} x={c.x} groundY={c.groundY} width={c.width} />;
};

// ---------------------------------------------------------------------------
// Shot 1 (0–3): dari udara, drone maju pelan ke pabrik; hanya satu jendela menyala.
// ---------------------------------------------------------------------------
export const Shot1Luar: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 0, 3.0, { pos: [-9, 22, 64], look: [-1, 5, 0], fov: 42 }, { pos: [-3.4, 8.5, 26], look: [JENDELA_NYALA[0], JENDELA_NYALA[1] - 0.6, JENDELA_NYALA[2]], fov: 36 }, Easing.out(Easing.quad));
  return (
    <AbsoluteFill>
      <LuarPabrik3D pose={pose} s={{ t }} />
      <Vignette kuat={0.55} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Rekaman CCTV (hitam-putih) yang tampil di monitor utama pos satpam.
// ---------------------------------------------------------------------------
// Gambar rekaman CCTV (SVG hitam-putih, 1080x1920): lantai produksi dari sudut atas,
// deretan mesin jahit, dan mesin tua di pojok kanan belakang yang lampunya bisa berkedip.
const RekamanCCTV: React.FC<{ t: number; kedipMesin: number }> = ({ t, kedipMesin }) => {
  const mesin = (x: number, y: number, s: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-70} y={-8} width={140} height={14} fill="#d9d9d9" stroke="#222" strokeWidth={3} />
      <rect x={-60} y={6} width={6} height={60} fill="#555" />
      <rect x={54} y={6} width={6} height={60} fill="#555" />
      <rect x={-40} y={-44} width={70} height={18} rx={4} fill="#f2f2f2" stroke="#222" strokeWidth={3} />
      <rect x={18} y={-44} width={16} height={38} fill="#f2f2f2" stroke="#222" strokeWidth={3} />
      <rect x={-44} y={-34} width={12} height={28} fill="#f2f2f2" stroke="#222" strokeWidth={3} />
    </g>
  );
  const baris = [
    { y: 1500, s: 2.2, xs: [140, 540, 940] },
    { y: 1180, s: 1.6, xs: [200, 540, 880] },
    { y: 960, s: 1.2, xs: [260, 540, 820] },
  ];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#5a5a5a 0%, #7a7a7a 45%, #9a9a9a 100%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {/* dinding belakang + jendela tinggi */}
        <rect x={0} y={0} width={1080} height={760} fill="#4a4a4a" />
        {[120, 420, 720].map((x) => <rect key={x} x={x} y={260} width={240} height={150} fill="#6b6b6b" stroke="#333" strokeWidth={6} />)}
        <polygon points="0,760 1080,760 1080,1920 0,1920" fill="#8c8c8c" />
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={540 + (i - 2) * 150} y1={760} x2={540 + (i - 2) * 520} y2={1920} stroke="#7a7a7a" strokeWidth={5} />)}
        {baris.flatMap((r, j) => r.xs.map((x, i) => mesin(x, r.y, r.s, `${j}-${i}`)))}
        {/* mesin tua di pojok kanan belakang */}
        {mesin(880, 820, 0.95, "tua")}
        <circle cx={858} cy={790} r={60 + kedipMesin * 50} fill="#ffffff" opacity={0.12 + kedipMesin * 0.55} />
        <circle cx={858} cy={792} r={10} fill={kedipMesin > 0.5 ? "#ffffff" : "#555"} />
      </svg>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 4px, rgba(0,0,0,0) 4px, rgba(0,0,0,0) 9px)" }} />
      <div style={{ position: "absolute", left: 70, top: 110, color: "#fff", fontFamily: "Consolas, monospace", fontSize: 92, fontWeight: 700 }}>CAM 03</div>
      <div style={{ position: "absolute", right: 70, top: 110, color: "#fff", fontFamily: "Consolas, monospace", fontSize: 92, fontWeight: 700 }}>
        23:40:{String(12 + Math.floor(t)).padStart(2, "0")}
      </div>
      <div style={{ position: "absolute", left: 70, top: 230, display: "flex", alignItems: "center", gap: 22, color: "#fff", fontFamily: "Consolas, monospace", fontSize: 78 }}>
        <span style={{ width: 52, height: 52, borderRadius: 26, background: Math.floor(t * 2) % 2 ? "#ff3b30" : "transparent", display: "inline-block" }} /> REC
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 2 (3,0–6,08): pos satpam. Lampu mesin tua di monitor berkedip sendiri; satpam mengira
// monitornya rusak dan mengetuknya. Kamera lalu masuk cepat ke monitor.
// ---------------------------------------------------------------------------
export const Shot2Pos: React.FC<{ t: number }> = ({ t }) => {
  const A: Pose = { pos: [-0.12, 1.6, 2.8], look: [-0.12, 1.25, -1.0], fov: 50 };
  const B: Pose = { pos: [-0.1, 1.55, 2.55], look: [-0.08, 1.2, -1.0], fov: 48 };
  const C: Pose = { pos: [MONITOR_UTAMA.x, MONITOR_UTAMA.y, MONITOR_UTAMA.z + 0.2], look: [MONITOR_UTAMA.x, MONITOR_UTAMA.y, MONITOR_UTAMA.z], fov: 46 };
  const pose = t < 5.76 ? gerakPose(t, 3.0, 5.76, A, B) : gerakPose(t, 5.76, 6.08, B, C, Easing.in(Easing.quad));
  // Lampu mesin tua di rekaman berkedip dua kali (4,0–4,5 s), lalu padam lagi.
  const kedip = t > 4.0 && t < 4.5 ? (Math.floor((t - 4.0) * 12) % 2 ? 1 : 0.15) : 0;
  // Sudut layar monitor utama → kotak di layar video.
  const MU = MONITOR_UTAMA;
  const a = project(pose, MU.x - MU.w / 2, MU.y + MU.h / 2, MU.z + 0.002);
  const b = project(pose, MU.x + MU.w / 2, MU.y - MU.h / 2, MU.z + 0.002);
  const rw = b.x - a.x, rh = b.y - a.y;
  const sc = Math.max(rw / 1080, rh / 1920);
  // Satpam: menguap → lampu berkedip, kaget → mengetuk monitor dengan bingung.
  let sat: KarProps = { outfit: "biasa", expression: "ngantuk", pose: "idle", t, atribut: ["topi_satpam"] };
  if (t >= 4.05 && t < 4.6) sat = { ...sat, expression: "syok", reaksi: "kaget", tAksi: t - 4.05 };
  else if (t >= 4.6) sat = { ...sat, expression: "bingung", pose: "bicara", efek: ["tanya"], motion: "bicara", tAksi: t - 4.6 };
  const blur = k(t, [5.85, 6.08], [0, 10]);
  return (
    <AbsoluteFill style={{ filter: blur > 0.1 ? `blur(${blur}px)` : undefined }}>
      <PosSatpam3D pose={pose} s={{ t }} />
      <div style={{ position: "absolute", left: a.x, top: a.y, width: rw, height: rh, overflow: "hidden", background: "#111" }}>
        <div style={{ position: "absolute", left: (rw - 1080 * sc) / 2, top: (rh - 1920 * sc) / 2, width: 1080, height: 1920, transform: `scale(${sc})`, transformOrigin: "0 0" }}>
          <RekamanCCTV t={t} kedipMesin={kedip} />
        </div>
      </div>
      <Di kam={pose} x={SATPAM.x} z={SATPAM.z} tinggi={1.7} dir={1} nama="satpam" {...sat} />
      <Vignette kuat={0.5} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 3 (6,08–9,54): karyawan duduk menjahit serius, kamera tinggi (seperti still UjiB).
// ---------------------------------------------------------------------------
const POSE_JAHIT: Pose = { pos: [DUDUK.x + 1.25, 2.6, DUDUK.z + 2.9], look: [DUDUK.x + 0.34, 0.85, DUDUK.z - 0.12], fov: 40 };
export const Shot3Jahit: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 6.08, 9.54, { pos: [DUDUK.x + 1.9, 3.2, DUDUK.z + 3.6], look: [DUDUK.x + 0.2, 0.9, DUDUK.z - 0.3], fov: 42 }, POSE_JAHIT);
  const blur = k(t, [6.08, 6.3], [10, 0]);
  const zoom = k(t, [6.08, 6.3], [1.08, 1]);
  return (
    <AbsoluteFill style={{ filter: blur > 0.1 ? `blur(${blur}px)` : undefined, transform: `scale(${zoom})` }}>
      <Pabrik3D pose={pose} s={{ t, jahitT: t, lampuKaryawan: 1, jam: { h: 23, m: 40 } }} />
      <Di kam={pose} x={DUDUK.x} z={DUDUK.z} outfit="cewek" expression="fokus" pose="menjahit" motion="duduk_samping" sit="kantor" dir={1} t={t} nama="karyawan" />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 4 (9,54–11,0): lurus dari atas. Meja, mesin, kain, dan karyawan tampak atas
// (kepala berambut + dua tangan menuntun kain ke jarum), digambar dengan gaya rig.
// ---------------------------------------------------------------------------
export const Shot4Atas: React.FC<{ t: number }> = ({ t }) => {
  const MX = MEJA_KARYAWAN.x, MZ = MEJA_KARYAWAN.z;
  const cx = MX - 0.42, cz = MZ + 0.02;
  const putar = k(t, [9.54, 11.0], [0.0, 0.12]);
  const tinggi = k(t, [9.54, 11.0], [4.6, 4.2]);
  const pose: Pose = { pos: [cx, tinggi, cz], look: [cx + Math.sin(putar) * 0.001, 0, cz - Math.cos(putar) * 0.001], fov: 36 };
  const dorong = Math.sin(t * 6) * 0.015;
  const ty = 0.6;
  const kepalaW = { x: DUDUK.x - 0.02, y: 1.0, z: DUDUK.z };
  const kep = project(pose, kepalaW.x, kepalaW.y, kepalaW.z);
  const pxm = Math.abs(project(pose, kepalaW.x + 0.1, kepalaW.y, kepalaW.z).x - kep.x) * 10; // px per meter di tinggi kepala
  const bahu = [project(pose, DUDUK.x + 0.06, 0.85, DUDUK.z - 0.16), project(pose, DUDUK.x + 0.06, 0.85, DUDUK.z + 0.16)];
  const tangan = [project(pose, MX - 0.2 + dorong, ty, MZ + 0.04), project(pose, MX - 0.14 + dorong, ty, MZ + 0.27)];
  const pxt = Math.abs(project(pose, MX + 0.1, ty, MZ).x - project(pose, MX, ty, MZ).x) * 10; // px per meter di meja
  const r = 0.29 * pxm;
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, jahitT: t, lampuKaryawan: 1 }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {/* tangan dari bahu ke kain */}
        {[0, 1].map((i) => (
          <g key={i}>
            <path d={`M ${bahu[i].x} ${bahu[i].y} Q ${(bahu[i].x + tangan[i].x) / 2} ${(bahu[i].y + tangan[i].y) / 2 + (i ? 30 : -30)} ${tangan[i].x} ${tangan[i].y}`} stroke="#141414" strokeWidth={0.04 * pxt} strokeLinecap="round" fill="none" />
            <circle cx={tangan[i].x} cy={tangan[i].y} r={0.045 * pxt} fill="#141414" />
          </g>
        ))}
        {/* bahu (blus koral) mengintip di bawah kepala */}
        <ellipse cx={(bahu[0].x + bahu[1].x) / 2} cy={(bahu[0].y + bahu[1].y) / 2} rx={0.13 * pxm} ry={0.22 * pxm} fill="#E8735A" stroke="#141414" strokeWidth={0.02 * pxm} />
        {/* kepala dari atas: rambut sebahu, belahan, jepit pink */}
        <circle cx={kep.x} cy={kep.y} r={r} fill="#3A2A2E" stroke="#141414" strokeWidth={0.025 * pxm} />
        <path d={`M ${kep.x - r * 0.1} ${kep.y - r * 0.95} Q ${kep.x + r * 0.15} ${kep.y} ${kep.x - r * 0.05} ${kep.y + r * 0.95}`} stroke="#5A4448" strokeWidth={0.012 * pxm} fill="none" />
        <rect x={kep.x + r * 0.35} y={kep.y - r * 0.55} width={r * 0.32} height={r * 0.13} rx={r * 0.05} fill="#F48FB1" stroke="#141414" strokeWidth={0.008 * pxm} transform={`rotate(35 ${kep.x + r * 0.5} ${kep.y - r * 0.5})`} />
      </svg>
      <Vignette kuat={0.5} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 5 (11,0–12,9): close-up wajah. Terkantuk-kantuk, kepala terantuk, lalu tersentak bangun.
// ---------------------------------------------------------------------------
export const Shot5Wajah: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 11.0, 12.9, { pos: [DUDUK.x + 0.1, 1.25, DUDUK.z + 4.1], look: [DUDUK.x - 0.16, 0.98, DUDUK.z], fov: 30 }, { pos: [DUDUK.x + 0.06, 1.22, DUDUK.z + 3.5], look: [DUDUK.x - 0.16, 1.0, DUDUK.z], fov: 30 });
  const bangun = t >= 12.25;
  // Kepala pelan-pelan menunduk (terantuk dua kali), lalu tegak lagi saat tersentak.
  const angguk = bangun ? 0 : Math.max(0, Math.sin((t - 11.0) * 2.6)) * 16 + k(t, [11.0, 12.2], [0, 6]);
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, lampuKaryawan: 1 }} />
      <Di kam={pose} x={DUDUK.x} z={DUDUK.z} outfit="cewek" expression={bangun ? "kaget" : "ngantuk"} pose={bangun ? "tutup_mulut" : "menjahit"} motion="duduk_samping" sit="kantor" dir={1} t={t} angguk={angguk} reaksi={bangun ? "kaget" : undefined} tAksi={t - 12.25} efek={bangun ? ["garis_kaget"] : undefined} nama="karyawan" />
      <Vignette />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 6 (12,9–14,6): sisipan jam dinding. Jarum menit melompat ke angka 12.
// ---------------------------------------------------------------------------
export const Shot6Jam: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 12.9, 14.6, { pos: [-7.5, 3.2, 2.6], look: [-7.5, 3.2, 0.27], fov: 40 }, { pos: [-7.5, 3.2, 2.15], look: [-7.5, 3.2, 0.27], fov: 38 });
  // 23:59 → 00:00 dengan sentakan kecil (jarum memantul).
  const p = k(t, [13.55, 13.68], [0, 1], Easing.out(Easing.back(3)));
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, jam: { h: 23, m: 59 + p, s: Math.min(60, 50 + Math.floor((t - 12.9) * 15)) }, lampuKaryawan: 1 }} />
      <Vignette kuat={0.7} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shot 7 (14,6–16,84): setelah whip pan, mesin tua di ujung ruangan menyala sendiri.
// Karyawan (utuh, di depan) membeku.
// ---------------------------------------------------------------------------
export const Shot7Mesin: React.FC<{ t: number }> = ({ t }) => {
  const pose = gerakPose(t, 14.4, 16.84, { pos: [-4.4, 1.9, 4.8], look: [MESIN_TUA.x, 0.8, MESIN_TUA.z], fov: 46 }, { pos: [-3.95, 1.85, 4.0], look: [MESIN_TUA.x, 0.85, MESIN_TUA.z], fov: 44 });
  const nyala = t < 15.15 ? 0 : t < 15.6 ? (Math.floor((t - 15.15) * 14) % 2 ? 1 : 0.2) : 1;
  const kaget = t >= 15.3;
  return (
    <AbsoluteFill>
      <Pabrik3D pose={pose} s={{ t, mesinTuaNyala: nyala, lampuKaryawan: 1, jam: { h: 0, m: 0 } }} />
      <Di kam={pose} x={DUDUK.x} z={DUDUK.z} outfit="cewek" expression={kaget ? "kaget" : "fokus"} pose={kaget ? "tutup_mulut" : "menjahit"} motion="duduk_samping" sit="kantor" dir={1} t={t} reaksi={kaget ? "kaget" : undefined} tAksi={t - 15.3} lirik={kaget ? 1 : 0} nama="karyawan" />
      <Vignette />
    </AbsoluteFill>
  );
};
