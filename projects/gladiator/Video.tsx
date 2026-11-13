import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SHOT, DURASI, FPS } from "./timing";
import { Caption, Whip, WHIP } from "./efek";
import { Shot1Kamar, Shot2Rebah, Shot3Sarapan, Shot4Abu, Shot5Lawan, Shot6Helm, Shot7POV } from "./adegan1";
import { Shot8Jaring, Shot9Beku, Shot10Kunci, Shot11Wasit, Shot12Mahal, Shot13Menyerah, Shot14Ampun } from "./adegan2";
import { ShotDuel, DUEL_PANJANG } from "./duel";
import { Shot15Hadiah, Shot16Rudis, Shot17EmpatKali, Shot18Pilih, Shot19Duel, Shot20Miniatur } from "./adegan3";

// Video "Bayangkan Kamu Jadi Gladiator di Roma" (storyboard v2, 64,6 s).
// Batas shot dari timing.ts (awal kalimat rekaman VO). Bagian 1 = shot 1–7, 2 = 8–14, 3 = 15–20.

// Sisipan duel aksi 4 detik tanpa narasi (VO: vo_narator_aksi.wav, jeda disisipkan di 25,55 s).
// Waktu asli cerita tt = t untuk t < SISIP, dan tt = t - JEDA setelah sisipan.
const SISIP = 25.55, JEDA = 4.0;
const AKHIR_SISIP = SISIP + DUEL_PANJANG; // 29,66 = awal shot 10 (25,66) + 4
const keAsli = (t: number) => (t < SISIP ? t : t - JEDA);
export const VIDEO_FRAMES = Math.round((DURASI + JEDA) * FPS);
const S = (n: number) => SHOT[n - 1];

const Adegan: React.FC<{ t: number }> = ({ t: tv }) => {
  // Duel aksi, lalu whip pan ke serudukan (shot 10).
  if (Math.abs(tv - AKHIR_SISIP) < WHIP) return <Whip t={tv} at={AKHIR_SISIP} dari={<ShotDuel d={tv - SISIP} t={tv} />} ke={<Shot10Kunci t={keAsli(tv)} />} />;
  if (tv >= SISIP && tv < AKHIR_SISIP) return <ShotDuel d={tv - SISIP} t={tv} />;
  const t = keAsli(tv);
  if (t < S(2)[0]) return <Shot1Kamar t={t} />;
  if (t < S(3)[0]) return <Shot2Rebah t={t} />;
  if (t < S(4)[0]) return <Shot3Sarapan t={t} />;
  if (t < S(5)[0]) return <Shot4Abu t={t} />;
  if (t < S(6)[0]) return <Shot5Lawan t={t} />;
  if (t < S(7)[0]) return <Shot6Helm t={t} />;
  if (t < S(8)[0]) return <Shot7POV t={t} />;
  if (t < S(9)[0]) return <Shot8Jaring t={t} />;
  if (t < S(10)[0]) return <Shot9Beku t={t} />;
  if (t < S(11)[0]) return <Shot10Kunci t={t} />;
  if (t < S(12)[0]) return <Shot11Wasit t={t} />;
  if (t < S(13)[0]) return <Shot12Mahal t={t} />;
  if (t < S(14)[0]) return <Shot13Menyerah t={t} />;
  if (t < S(15)[0]) return <Shot14Ampun t={t} />;
  if (t < S(16)[0]) return <Shot15Hadiah t={t} />;
  if (t < S(17)[0]) return <Shot16Rudis t={t} />;
  if (t < S(18)[0]) return <Shot17EmpatKali t={t} />;
  if (t < S(19)[0]) return <Shot18Pilih t={t} />;
  if (t < S(20)[0]) return <Shot19Duel t={t} />;
  return <Shot20Miniatur t={t} />;
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Adegan t={t} />
      {(t < SISIP || t >= AKHIR_SISIP) && <Caption t={keAsli(t)} />}
      {/* VO + sorak penonton + efek suara (audio/make_audio.py); musik latar menyusul */}
      <Audio src={staticFile("gladiator/master.wav")} volume={1} />
    </AbsoluteFill>
  );
};
