import React from "react";
import { AbsoluteFill } from "remotion";
import { Set3D } from "./set3d";
import { Pose, mixPose } from "./kamera";
import { k, guncang, Vignette } from "./efek";
import { TeksKomik } from "./teks";
import { SHOT } from "./timing";
import { DiBajak } from "./KostumBajakLaut";

// SHOT 5: Papan Harga Klaim Asuransi di Tiang Kapal (Papan di Atas, Karakter Utuh di Bawahnya)
export const Shot5Asuransi: React.FC<{ t: number }> = ({ t }) => {
  const [t0, t1] = SHOT[4];
  const kam: Pose = mixPose(
    { pos: [0.0, 1.9, 5.1], look: [0.0, 0.95, 0.0], fov: 39 },
    { pos: [0.0, 1.85, 4.7], look: [0.0, 0.95, 0.0], fov: 37 },
    k(t, [t0, t1], [0, 1])
  );
  return (
    <AbsoluteFill>
      <Set3D kam={kam} latar="dek_siang" t={t} petiTerbuka={-1} />
      <DiBajak peran="awak_tato" kam={kam} x={-0.46} z={0.1} expression="fokus" pose="idle" dir={1} angguk={Math.sin(t * 7) * 7} t={t} />
      <DiBajak peran="kamu" kam={kam} x={0.46} z={0.1} expression="fokus" pose="idle" dir={-1} angguk={Math.sin(t * 7 + 1) * 7} t={t} />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <g transform="translate(540, 310)">
          <rect x={-245} y={-150} width={490} height={350} rx={20} fill="#8C5828" stroke="#141414" strokeWidth={11} />
          <rect x={-224} y={-130} width={448} height={310} rx={14} fill="#F3DFB6" stroke="#141414" strokeWidth={7} />
          <TeksKomik x={0} y={-75} teks="KLAIM ASURANSI" ukuran={40} atas="#FFE885" bawah="#E09000" />
          <TeksKomik x={0} y={0} teks="TANGAN : 600 PERAK" ukuran={34} atas="#FFFFFF" bawah="#FFD040" />
          <TeksKomik x={0} y={72} teks="KAKI : 500 PERAK" ukuran={34} atas="#FFFFFF" bawah="#FFD040" />
          <TeksKomik x={0} y={144} teks="MATA : 100 PERAK" ukuran={34} atas="#FFFFFF" bawah="#FFD040" />
        </g>
      </svg>
      <Vignette kuat={0.3} />
    </AbsoluteFill>
  );
};

// SHOT 6: Bendera Tengkorak Hitam = Peringatan Sopan
export const Shot6BenderaHitam: React.FC<{ t: number }> = ({ t }) => {
  const [t0, t1] = SHOT[5];
  const kam: Pose = mixPose(
    { pos: [0.0, 1.9, 5.1], look: [0.0, 0.95, 0.0], fov: 39 },
    { pos: [0.0, 1.85, 4.7], look: [0.0, 0.95, 0.0], fov: 37 },
    k(t, [t0, t1], [0, 1])
  );
  return (
    <AbsoluteFill>
      <Set3D kam={kam} latar="dek_siang" t={t} kapalJauhZ={-14} petiTerbuka={-1} />
      <DiBajak peran="kapten" kam={kam} x={-0.44} z={0.1} tinggi={1.74} expression="pede" pose="angkat_tangan" dir={1} t={t} />
      <DiBajak peran="kamu" kam={kam} x={0.44} z={0.1} expression="pede" pose="idle" dir={-1} t={t} />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <g transform={`translate(540, 270) rotate(${Math.sin(t * 5) * 3})`}>
          <rect x={-190} y={-100} width={380} height={200} rx={16} fill="#1E1E24" stroke="#141414" strokeWidth={10} />
          <circle cx={0} cy={-15} r={46} fill="#FFFFFF" stroke="#141414" strokeWidth={8} />
          <circle cx={-16} cy={-22} r={8} fill="#141414" />
          <circle cx={16} cy={-22} r={8} fill="#141414" />
          <path d="M -20 10 Q 0 28 20 10" stroke="#141414" strokeWidth={7} fill="none" strokeLinecap="round" />
          <TeksKomik x={0} y={150} teks="PERINGATAN SOPAN" ukuran={44} atas="#B8F2FF" bawah="#29ABE2" />
        </g>
      </svg>
      <Vignette kuat={0.3} />
    </AbsoluteFill>
  );
};

// SHOT 7: Bendera Merah Dikibarkan = Tiada Ampun (Kapal Lawan Putar Balik)
export const Shot7BenderaMerah: React.FC<{ t: number }> = ({ t }) => {
  const [t0, t1] = SHOT[6];
  const g = guncang(t - t0, 18);
  const kabur = k(t, [t0 + 0.4, t1], [0, 1]);
  const kam: Pose = {
    pos: [0.0, 1.9, 4.9],
    look: [0.0, 0.95, 0.0],
    fov: 38,
  };
  return (
    <AbsoluteFill style={{ transform: `translate(${g.x}px, ${g.y}px) rotate(${g.r}deg)` }}>
      <Set3D kam={kam} latar="dek_siang" t={t} kapalJauhZ={-13} kapalKabur={kabur} petiTerbuka={-1} />
      <DiBajak peran="kapten" kam={kam} x={-0.44} z={0.1} tinggi={1.74} expression="teriak" pose="ayun" efek={["benturan"]} dir={1} t={t} />
      <DiBajak peran="awak_kumis" kam={kam} x={0.44} z={0.1} expression="kaget" pose="kuda_kuda" efek={["seru"]} dir={-1} t={t} />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <g transform={`translate(540, 270) rotate(${Math.sin(t * 10) * 5})`}>
          <rect x={-200} y={-100} width={400} height={200} rx={16} fill="#D91E18" stroke="#141414" strokeWidth={12} />
          <TeksKomik x={0} y={16} teks="TIADA AMPUN!" ukuran={46} atas="#FFF3A6" bawah="#FF9900" />
        </g>
      </svg>
      <Vignette kuat={0.5} />
    </AbsoluteFill>
  );
};

// SHOT 8: Makan Biskuit Keras Penuh Ulat di Gelap Gulita Bawah Dek
export const Shot8Biskuit: React.FC<{ t: number }> = ({ t }) => {
  const [t0, t1] = SHOT[7];
  const dur = t1 - t0;
  const lilinNyala = t >= t0 + dur * 0.32 && t <= t0 + dur * 0.72;
  const kam: Pose = mixPose(
    { pos: [0.0, 1.85, 4.8], look: [0.0, 0.95, 0.0], fov: 38 },
    { pos: [0.0, 1.8, 4.4], look: [0.0, 0.95, 0.0], fov: 36 },
    k(t, [t0, t1], [0, 1])
  );
  return (
    <AbsoluteFill>
      <Set3D kam={kam} latar="bawah_dek" t={t} petiTerbuka={-1} />
      <DiBajak peran="awak_kumis" kam={kam} x={-0.44} z={0.1} expression={lilinNyala ? "marah" : "fokus"} pose="pegang_benda" dir={1} t={t} />
      <DiBajak
        peran="kamu"
        kam={kam}
        x={0.44}
        z={0.1}
        expression={lilinNyala ? "kaget" : "merem"}
        reaksi={lilinNyala ? "kaget" : undefined}
        efek={lilinNyala ? ["seru", "keringat"] : ["keringat"]}
        dir={-1}
        t={t}
      />
      <AbsoluteFill
        style={{
          background: lilinNyala
            ? "radial-gradient(circle at 55% 58%, rgba(255,190,90,0.18) 12%, rgba(0,0,0,0.82) 75%)"
            : "rgba(0,0,0,0.78)",
          pointerEvents: "none",
        }}
      />
      <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {lilinNyala && (
          <g transform="translate(540, 340)">
            <circle cx={0} cy={0} r={155} fill="#3A2615" stroke="#FFB84D" strokeWidth={11} />
            <circle cx={0} cy={8} r={100} fill="#C69C6D" stroke="#141414" strokeWidth={9} />
            <circle cx={-30} cy={-18} r={7} fill="#5C3A1E" />
            <circle cx={26} cy={22} r={7} fill="#5C3A1E" />
            <path
              d={`M -40 ${8 + Math.sin(t * 25) * 11} Q -12 -22 12 ${8 - Math.sin(t * 25) * 11} T 55 4`}
              stroke="#8CE64C"
              strokeWidth={20}
              fill="none"
              strokeLinecap="round"
            />
            <TeksKomik x={0} y={205} teks="PENUH ULAT!" ukuran={50} atas="#B8FF70" bawah="#3BB500" />
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
