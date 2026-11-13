import React from "react";
import { AbsoluteFill } from "remotion";
import { Set3D } from "./set3d";
import { Pose, mixPose } from "./kamera";
import { k, Vignette } from "./efek";
import { TeksKomik } from "./teks";
import { SHOT } from "./timing";
import { DiBajak } from "./KostumBajakLaut";

// SHOT 9: Bendera Merah Diangkat, Kapal Dagang Musuh Langsung Ciut & Menyerah
export const Shot9Mangsa: React.FC<{ t: number }> = ({ t }) => {
  const [t0, t1] = SHOT[8];
  const kam: Pose = mixPose(
    { pos: [0.0, 1.95, 5.1], look: [0.0, 0.95, 0.0], fov: 39 },
    { pos: [0.0, 1.85, 4.7], look: [0.0, 0.95, 0.0], fov: 37 },
    k(t, [t0, t1], [0, 1])
  );
  return (
    <AbsoluteFill>
      <Set3D kam={kam} latar="dek_siang" t={t} kapalJauhZ={-12} petiTerbuka={-1} />
      <DiBajak peran="kapten" kam={kam} x={-0.44} z={0.1} tinggi={1.74} expression="girang" pose="pegang_benda" pegang="daun_palem" dir={1} t={t} />
      <DiBajak peran="kamu" kam={kam} x={0.44} z={0.1} expression="girang" pose="angkat_tangan" dir={-1} t={t} />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <g transform="translate(540, 270)">
          <rect x={-165} y={-70} width={330} height={130} rx={14} fill="#FFFFFF" stroke="#141414" strokeWidth={9} />
          <TeksKomik x={0} y={14} teks="LANGSUNG CIUT!" ukuran={38} atas="#FFE680" bawah="#FFA000" />
        </g>
      </svg>
      <Vignette kuat={0.3} />
    </AbsoluteFill>
  );
};

// SHOT 10: Peti Besar Dibuka -> Isinya Tumpukan Dokumen Akuntansi (Pop-up di Atas, Tidak Tutupi Wajah!)
export const Shot10Peti: React.FC<{ t: number }> = ({ t }) => {
  const [t0, t1] = SHOT[9];
  const buka = k(t, [t0 + 0.4, t0 + 1.8], [0, 1]);
  const kecewa = t > t0 + 1.9;
  const kam: Pose = mixPose(
    { pos: [0.0, 1.95, 5.3], look: [0.0, 0.9, 0.0], fov: 40 },
    { pos: [0.0, 1.85, 4.8], look: [0.0, 0.9, 0.0], fov: 38 },
    k(t, [t0, t1], [0, 1])
  );
  return (
    <AbsoluteFill>
      <Set3D kam={kam} latar="dek_siang" t={t} petiTerbuka={buka} />
      {/* Kapten di kiri, Kamu di tengah belakang peti, Awak berkacamata di kanan */}
      <DiBajak
        peran="kapten"
        kam={kam}
        x={-0.55}
        z={0.0}
        tinggi={1.74}
        expression={kecewa ? "syok" : "girang"}
        efek={kecewa ? ["tanya", "keringat"] : []}
        dir={1}
        t={t}
      />
      <DiBajak
        peran="kamu"
        kam={kam}
        x={0.0}
        z={-0.45}
        expression={kecewa ? "kaget" : "fokus"}
        pose="pegang_benda"
        t={t}
      />
      <DiBajak
        peran="awak_kurus"
        kam={kam}
        x={0.55}
        z={0.0}
        expression={kecewa ? "takut" : "girang"}
        efek={kecewa ? ["keringat"] : []}
        dir={-1}
        t={t}
      />
      {buka > 0.45 && (
        <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <g transform={`translate(540, ${310 - buka * 50})`}>
            <rect x={-250} y={-110} width={500} height={210} rx={16} fill="#FFF8E7" stroke="#141414" strokeWidth={10} />
            <TeksKomik x={0} y={-25} teks="DOKUMEN AKUNTANSI" ukuran={38} atas="#FFE680" bawah="#E08B00" />
            <TeksKomik x={0} y={48} teks="& KUITANSI REMPAH" ukuran={34} atas="#FFFFFF" bawah="#999999" />
          </g>
        </svg>
      )}
      <Vignette kuat={0.38} />
    </AbsoluteFill>
  );
};

// SHOT 11: Twist! Kamu Dapat Porsi Terbesar (1,5x) Karena Bisa Baca-Tulis
export const Shot11Twist: React.FC<{ t: number }> = ({ t }) => {
  const [t0, t1] = SHOT[10];
  const kam: Pose = mixPose(
    { pos: [0.0, 1.95, 5.2], look: [0.0, 0.95, 0.0], fov: 39 },
    { pos: [0.0, 1.85, 4.7], look: [0.0, 0.95, 0.0], fov: 37 },
    k(t, [t0, t1], [0, 1])
  );
  const tinggiEmas = k(t, [t0 + 0.4, t1 - 0.5], [50, 175]);
  return (
    <AbsoluteFill>
      <Set3D kam={kam} latar="dek_siang" t={t} petiTerbuka={-1} />
      <DiBajak peran="kapten" kam={kam} x={-0.55} z={0.0} tinggi={1.74} expression="pede" pose="serahkan" pegang="kantong_koin" dir={1} t={t} />
      <DiBajak peran="kamu" kam={kam} x={0.0} z={0.15} atribut={["kacamata"]} expression="girang" pose="pegang_benda" pegang="kantong_koin" t={t} />
      <DiBajak peran="awak_tato" kam={kam} x={0.55} z={0.0} expression="marah" lirik={-1} dir={-1} t={t} />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <TeksKomik x={540} y={240} teks="JURU TULIS: 1,5x PORSI!" ukuran={52} atas="#FFF59D" bawah="#F57F17" />
        {/* Tumpukan Emas di Bawah Kaki, Tidak Menutupi Badan */}
        <g transform="translate(540, 1300)">
          <rect x={-140} y={-tinggiEmas} width={280} height={tinggiEmas} rx={22} fill="#FFD700" stroke="#141414" strokeWidth={9} />
        </g>
      </svg>
      <Vignette kuat={0.35} />
    </AbsoluteFill>
  );
};

// SHOT 12: Ending + CTA di Kabin Kapten (Papan Pilihan di Atas Kepala, Wajah Utuh Terlihat Jelas!)
export const Shot12Pilih: React.FC<{ t: number }> = ({ t }) => {
  const [t0, t1] = SHOT[11];
  const kam: Pose = mixPose(
    { pos: [0.0, 1.85, 4.7], look: [0.0, 0.95, 0.0], fov: 38 },
    { pos: [0.0, 1.9, 5.1], look: [0.0, 0.95, 0.0], fov: 40 },
    k(t, [t0, t1], [0, 1])
  );
  const lirikArah = Math.sin(t * 4) > 0 ? 1 : -1;
  return (
    <AbsoluteFill>
      <Set3D kam={kam} latar="kabin" t={t} petiTerbuka={-1} />
      <DiBajak
        peran="kamu"
        kam={kam}
        x={0.0}
        z={0.1}
        atribut={["kacamata"]}
        expression="pede"
        pose="pegang_benda"
        pegang="kantong_koin"
        lirik={lirikArah}
        miring={lirikArah * 5}
        t={t}
      />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <g transform={`translate(275, 250) rotate(${-3 + Math.sin(t * 3) * 2})`}>
          <rect x={-205} y={-75} width={410} height={150} rx={20} fill="#2ECC71" stroke="#141414" strokeWidth={10} />
          <TeksKomik x={0} y={14} teks="PENSIUN KAYA" ukuran={42} atas="#FFFFFF" bawah="#D4FFDF" />
        </g>
        <g transform={`translate(805, 250) rotate(${3 - Math.sin(t * 3) * 2})`}>
          <rect x={-205} y={-75} width={410} height={150} rx={20} fill="#E74C3C" stroke="#141414" strokeWidth={10} />
          <TeksKomik x={0} y={14} teks="GAS BERLAYAR!" ukuran={42} atas="#FFF3A6" bawah="#FFB300" />
        </g>
        <TeksKomik x={540} y={1820} teks="RUANG PIKIR" ukuran={42} atas="#FFF3A6" bawah="#F5B800" />
      </svg>
      <Vignette kuat={0.42} />
    </AbsoluteFill>
  );
};
