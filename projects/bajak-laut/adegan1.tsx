import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { Set3D } from "./set3d";
import { Pose, mixPose } from "./kamera";
import { k, Vignette } from "./efek";
import { TeksKomik } from "./teks";
import { SHOT } from "./timing";
import { DiBajak } from "./KostumBajakLaut";

const gerakPose = (t: number, t0: number, t1: number, a: Pose, b: Pose, e = Easing.inOut(Easing.cubic)) =>
  mixPose(a, b, k(t, [t0, t1], [0, 1], e));

// SHOT 1: Dikepung di Dek Malam, Kapten Todong Pedang (Semua Karakter Utuh di Tengah Layar!)
export const Shot1Hook: React.FC<{ t: number }> = ({ t }) => {
  const [t0, t1] = SHOT[0];
  const kam = gerakPose(
    t, t0, t1,
    { pos: [0.0, 1.95, 5.4], look: [0.0, 0.95, 0.0], fov: 40 },
    { pos: [0.0, 1.85, 4.8], look: [0.0, 0.95, 0.0], fov: 38 }
  );
  return (
    <AbsoluteFill>
      <Set3D kam={kam} latar="dek_malam" t={t} papanTerjun={true} petiTerbuka={-1} />
      {/* Awak berkumis (eyepatch) & awak berjenggot mengepung di belakang */}
      <DiBajak peran="awak_kumis" kam={kam} x={-0.62} z={-0.9} expression="marah" pose="kuda_kuda" t={t} dir={1} />
      <DiBajak peran="awak_tato" kam={kam} x={0.62} z={-0.9} expression="fokus" pose="pegang_benda" pegang="tongkat" t={t} dir={-1} />
      {/* Kapten Bertopi Tricorn & Jubah Merah menodongkan pedang */}
      <DiBajak peran="kapten" kam={kam} x={0.44} z={0.1} tinggi={1.74} expression="marah" pose="tusuk" dir={-1} t={t} />
      {/* Kamu (Jaket Kulit Bajak Laut + Kaos Ruang Pikir) gemetar di dekat papan terjun */}
      <DiBajak peran="kamu" kam={kam} x={-0.46} z={0.15} expression="takut" motion="siaga" efek={["keringat", "seru"]} dir={1} lirik={-1} t={t} />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <TeksKomik x={540} y={240} teks="BERGABUNG ATAU LAUT?!" ukuran={58} atas="#FFE680" bawah="#FF8C00" rot={-2} />
      </svg>
      <Vignette kuat={0.55} />
    </AbsoluteFill>
  );
};

// SHOT 2: Pilih Bergabung (Angkat Tangan)
export const Shot2Gabung: React.FC<{ t: number }> = ({ t }) => {
  const [t0, t1] = SHOT[1];
  const kam = gerakPose(
    t, t0, t1,
    { pos: [0.0, 1.85, 4.8], look: [0.0, 0.95, 0.0], fov: 38 },
    { pos: [0.0, 1.8, 4.4], look: [0.0, 0.95, 0.0], fov: 36 }
  );
  return (
    <AbsoluteFill>
      <Set3D kam={kam} latar="dek_malam" t={t} petiTerbuka={-1} />
      <DiBajak peran="kapten" kam={kam} x={0.44} z={0.0} tinggi={1.74} expression="pede" pose="idle" dir={-1} t={t} />
      <DiBajak peran="kamu" kam={kam} x={-0.44} z={0.0} expression="kaget" pose="angkat_tangan" efek={["keringat"]} dir={1} t={t} />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <TeksKomik x={540} y={240} teks="PILIH BERGABUNG!" ukuran={58} atas="#A8FF9E" bawah="#22B573" />
      </svg>
      <Vignette kuat={0.45} />
    </AbsoluteFill>
  );
};

// SHOT 3: Disodori Kontrak Konstitusi Tertulis Rapi (Gulungan di Atas, Karakter Utuh Kiri-Kanan)
export const Shot3Kontrak: React.FC<{ t: number }> = ({ t }) => {
  const [t0, t1] = SHOT[2];
  const kam = gerakPose(
    t, t0, t1,
    { pos: [0.0, 1.85, 5.0], look: [0.0, 0.95, 0.0], fov: 39 },
    { pos: [0.0, 1.8, 4.6], look: [0.0, 0.95, 0.0], fov: 37 }
  );
  const panjangGulungan = k(t, [t0, t0 + 1.6], [120, 440]);
  return (
    <AbsoluteFill>
      <Set3D kam={kam} latar="dek_malam" t={t} petiTerbuka={-1} />
      <DiBajak peran="kapten" kam={kam} x={0.5} z={0.0} tinggi={1.74} expression="pede" pose="serahkan" dir={-1} t={t} />
      <DiBajak peran="kamu" kam={kam} x={-0.5} z={0.0} expression="fokus" pose="idle" efek={["tanya"]} dir={1} angguk={8} t={t} />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <g transform="translate(540, 180)">
          <rect x={-160} y={0} width={320} height={panjangGulungan} rx={14} fill="#F7E7C4" stroke="#141414" strokeWidth={9} />
          <rect x={-180} y={-18} width={360} height={32} rx={16} fill="#C8963E" stroke="#141414" strokeWidth={8} />
          <rect x={-180} y={panjangGulungan - 14} width={360} height={32} rx={16} fill="#C8963E" stroke="#141414" strokeWidth={8} />
          <TeksKomik x={0} y={52} teks="KONSTITUSI KAPAL" ukuran={28} atas="#FFF3A6" bawah="#E5A000" />
          {Array.from({ length: 6 }).map((_, i) => {
            const yBaris = 95 + i * 48;
            if (yBaris > panjangGulungan - 35) return null;
            return (
              <g key={i}>
                <line x1={-120} y1={yBaris} x2={120} y2={yBaris} stroke="#5C4028" strokeWidth={7} strokeLinecap="round" />
                <line x1={-120} y1={yBaris + 18} x2={75} y2={yBaris + 18} stroke="#8C6848" strokeWidth={5} strokeLinecap="round" />
              </g>
            );
          })}
          {panjangGulungan > 330 && (
            <circle cx={75} cy={panjangGulungan - 65} r={32} fill="#D92B2B" stroke="#141414" strokeWidth={7} />
          )}
        </g>
      </svg>
      <Vignette kuat={0.45} />
    </AbsoluteFill>
  );
};

// SHOT 4: Voting Demokrasi (5 Bajak Laut Berbeda Variasi Kumis/Jenggot/Topi Utuh di Layar)
export const Shot4Voting: React.FC<{ t: number }> = ({ t }) => {
  const [t0, t1] = SHOT[3];
  const kam = gerakPose(
    t, t0, t1,
    { pos: [0.0, 2.05, 5.6], look: [0.0, 0.95, 0.0], fov: 42 },
    { pos: [0.0, 1.9, 5.0], look: [0.0, 0.95, 0.0], fov: 39 }
  );
  return (
    <AbsoluteFill>
      <Set3D kam={kam} latar="dek_siang" t={t} petiTerbuka={-1} />
      <DiBajak peran="awak_kumis" kam={kam} x={-0.66} z={-0.5} expression="girang" pose="angkat_tangan" t={t} />
      <DiBajak peran="kamu" kam={kam} x={-0.34} z={0.1} expression="girang" pose="angkat_tangan" t={t} />
      <DiBajak peran="kapten" kam={kam} x={0.0} z={-0.2} tinggi={1.74} expression="pede" pose="angkat_tangan" t={t} />
      <DiBajak peran="awak_kurus" kam={kam} x={0.34} z={0.1} expression="girang" pose="angkat_tangan" t={t} />
      <DiBajak peran="awak_tato" kam={kam} x={0.66} z={-0.5} expression="marah" pose="idle" dir={-1} t={t} />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <TeksKomik x={540} y={230} teks="VOTING DEMOKRASI!" ukuran={62} atas="#A8FF9E" bawah="#22B573" />
      </svg>
      <Vignette kuat={0.3} />
    </AbsoluteFill>
  );
};
