import React, { useLayoutEffect, useRef } from "react";
import { getInputProps, useCurrentFrame } from "remotion";
// Pustaka karakter (sumber asli: D:\projeck\pustaka-karakter\karakter-rig.js).
// File .js ini mengisi window.EjooverseCharacter saat dimuat.
import "./karakter-rig.js";

type Rig = {
  renderCharacterSVG: (opts: Record<string, unknown>) => string;
};
const rig = (): Rig => (window as unknown as { EjooverseCharacter: Rig }).EjooverseCharacter;

// Kotak gambar rig: viewBox -120 -165 240 315, lantai di y = 128.
const VB_W = 240;
const VB_H = 315;
const GROUND_FROM_TOP = 128 + 165; // 293

// Ukuran layar komposisi (9:16). Dipakai pengecek framing.
const FRAME_W = 1080;
const FRAME_H = 1920;

// Mode pemeriksaan framing: aktif kalau render dijalankan dengan --props='{"periksaFraming":true}'.
// Setiap karakter mengukur gambar dirinya di layar (sudah termasuk zoom/geser kamera)
// dan mencetak satu baris "FRAMING|..." ke log render. Dibaca oleh periksa_framing.py.
const periksa = (() => {
  try {
    return Boolean((getInputProps() as { periksaFraming?: boolean }).periksaFraming);
  } catch {
    return false;
  }
})();

export type KarakterProps = {
  outfit: string;
  expression?: string;
  pose?: string;
  // Floor actions: rebah, telentang, duduk_dari_rebah, bangun_dari_rebah, jatuh, jatuh_tersungkur, berguling, merangkak, merayap.
  motion?: string;
  sit?: string;
  dir?: 1 | -1;
  t: number; // detik, untuk napas/kedip/jalan/melayang
  x: number; // posisi tengah karakter di layar (px)
  groundY: number; // garis lantai di layar (px): kaki menapak di sini
  width?: number; // lebar kotak karakter (px). 600 ≈ tinggi badan 700 px
  opacity?: number;
  style?: React.CSSProperties;
  nama?: string; // nama untuk laporan pengecek framing (default: nama kostum)
  // v3 (gerak lincah gaya referensi)
  tAksi?: number; // detik sejak aksi dimulai (kaget, pingsan, muncul, lompat). Default = t
  atribut?: string[]; // jenggot, ikat_kepala, topi_satpam, kacamata, tali_id
  efek?: string[]; // keringat, garis_kaget, seru, tanya, pusing, debu
  pegang?: string; // benda di tangan kanan (pose "pegang_benda"): senter, gunting, tongkat, palu, kartu_absen, kain
  lirik?: number; // -1 (lirik kiri) .. 1 (lirik kanan)
  wajah?: string; // warna wajah khusus, mis. "#F8B9B4" (memerah)
  reaksi?: string; // reaksi kepala tanpa mengubah gerak badan, mis. "kaget" sambil duduk (pakai tAksi)
  angguk?: number; // kepala miring/menunduk (derajat)
  warnaKain?: string; // warna kain di pose "menjahit" (default biru)
  pegangKiri?: string; // benda di tangan kiri (perisai, trisula, kantong_koin, …)
  datar?: boolean; // true = gaya datar lama (tanpa efek 3D mengkilap)
  tEkspresi?: number; // detik sejak ekspresi berganti → kepala memantul ke bentuk barunya
  kepala?: { sx?: number; sy?: number; telur?: number }; // bentuk kepala sendiri
  kepalaEkspresif?: boolean; // false = kepala selalu bulat
  miring?: number; // kepala miring (derajat, + kanan, - kiri), memantul bersama tEkspresi
  miringBalik?: boolean; // balik arah miring bawaan ekspresi
  // v8 (gerak luwes + benturan)
  poseDari?: string; // pose sebelumnya → tangan beralih luwes (ancang-ancang + lewat sedikit)
  tPose?: number; // detik sejak pose berganti
  durPose?: number; // lama peralihan pose (default 0,24 detik)
  seedEfek?: number; // variasi bentuk efek benturan (hantam, benturan, serpihan, retak)
  mataBesar?: boolean; // true = mata kaget/syok/takut tetap besar (default: hanya 0,5 detik)
  cerminTangan?: boolean; // false = tangan tidak dibalik saat dir = -1
};

export const Karakter: React.FC<KarakterProps> = ({ outfit, expression = "pede", pose = "idle", motion = "napas", sit, dir = 1, t, x, groundY, width = 600, opacity = 1, style, nama, tAksi, atribut, efek, pegang, lirik, wajah, reaksi, angguk, warnaKain, pegangKiri, datar, tEkspresi, kepala, kepalaEkspresif, miring, miringBalik, ...v8 }) => {
  const height = (width * VB_H) / VB_W;
  const top = groundY - (GROUND_FROM_TOP / VB_H) * height;
  const svg = rig().renderCharacterSVG({ outfit, expression, pose, motion, sit, dir, time: t, tAksi, atribut, efek, pegang, lirik, wajah, reaksi, angguk, warnaKain, pegangKiri, datar, tEkspresi, kepala, kepalaEkspresif, miring, miringBalik, ...v8 });
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();

  useLayoutEffect(() => {
    if (!periksa || !ref.current || opacity < 0.05) return;
    // Grup gambar karakter (tanpa bayangan lantai) = <g> pertama langsung di bawah <svg>.
    const g = ref.current.querySelector("svg > g");
    if (!g) return;
    // Posisi relatif terhadap layar video. Saat render, Remotion menaruh wadah komposisi jauh
    // di luar halaman (y ≈ -999999), jadi titik acuannya = wadah terluar tepat di bawah <body>.
    let root: HTMLElement = ref.current;
    while (root.parentElement && root.parentElement.tagName !== "BODY") root = root.parentElement;
    const o = root.getBoundingClientRect();
    const b = (g as SVGGElement).getBoundingClientRect();
    const r = { left: b.left - o.left, right: b.right - o.left, top: b.top - o.top, bottom: b.bottom - o.top, width: b.width, height: b.height };
    if (r.width < 2 || r.height < 2) return;
    const visW = Math.max(0, Math.min(r.right, FRAME_W) - Math.max(r.left, 0));
    const visH = Math.max(0, Math.min(r.bottom, FRAME_H) - Math.max(r.top, 0));
    console.log(
      `FRAMING|${frame}|${nama ?? outfit}|${r.left.toFixed(0)}|${r.right.toFixed(0)}|${r.top.toFixed(0)}|${r.bottom.toFixed(0)}|${(visW / r.width).toFixed(3)}|${(visH / r.height).toFixed(3)}`,
    );
  });

  return (
    <div
      ref={ref}
      style={{ ...style, position: "absolute", left: x - width / 2, top, width, height, opacity }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};
