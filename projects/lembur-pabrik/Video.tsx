import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { SHOT, DURASI, FPS } from "./timing";
import { Caption, Whip, WHIP } from "./efek";
import { Shot1Luar, Shot2Pos, Shot3Jahit, Shot4Atas, Shot5Wajah, Shot6Jam, Shot7Mesin } from "./adegan1";
import { Shot8Radio, Shot9Manekin, Shot10Lorong, Shot11Baju, Shot12Kartu, Shot13DuaKartu } from "./adegan2";
import { Shot14Hantu, Shot15Pingsan, Shot16CloseHantu, Shot17Tunjuk, Shot18Absen, Shot19Lambai, Shot20Satpam, Shot21Kabur, Shot22Banting, Shot23Penutup } from "./adegan3";

// Video "Mesin Jahit yang Menyala Jam Dua Belas Malam" (storyboard v3, 72 s).
// Batas shot dari timing.ts (awal kalimat rekaman VO). Bagian 1 = shot 1–7, 2 = 8–13, 3 = 14–23.

export const VIDEO_FRAMES = Math.round(DURASI * FPS);
const S = (n: number) => SHOT[n - 1]; // [mulai, selesai] shot ke-n

const Adegan: React.FC<{ t: number }> = ({ t }) => {
  // Transisi whip pan jam → mesin tua (shot 6 → 7).
  const tWhip = S(7)[0];
  if (Math.abs(t - tWhip) < WHIP) return <Whip t={t} at={tWhip} dari={<Shot6Jam t={t} />} ke={<Shot7Mesin t={t} />} />;
  if (t < S(2)[0]) return <Shot1Luar t={t} />;
  if (t < S(3)[0]) return <Shot2Pos t={t} />;
  if (t < S(4)[0]) return <Shot3Jahit t={t} />;
  if (t < S(5)[0]) return <Shot4Atas t={t} />;
  if (t < S(6)[0]) return <Shot5Wajah t={t} />;
  if (t < S(7)[0]) return <Shot6Jam t={t} />;
  if (t < S(8)[0]) return <Shot7Mesin t={t} />;
  if (t < S(9)[0]) return <Shot8Radio t={t} />;
  if (t < S(10)[0]) return <Shot9Manekin t={t} />;
  if (t < S(11)[0]) return <Shot10Lorong t={t} />;
  if (t < S(12)[0]) return <Shot11Baju t={t} />;
  if (t < S(13)[0]) return <Shot12Kartu t={t} />;
  if (t < S(14)[0]) return <Shot13DuaKartu t={t} />;
  if (t < S(15)[0]) return <Shot14Hantu t={t} />;
  if (t < S(16)[0]) return <Shot15Pingsan t={t} />;
  if (t < S(17)[0]) return <Shot16CloseHantu t={t} />;
  if (t < S(18)[0]) return <Shot17Tunjuk t={t} />;
  if (t < S(19)[0]) return <Shot18Absen t={t} />;
  if (t < S(20)[0]) return <Shot19Lambai t={t} />;
  if (t < S(21)[0]) return <Shot20Satpam t={t} />;
  if (t < S(22)[0]) return <Shot21Kabur t={t} />;
  if (t < S(23)[0]) return <Shot22Banting t={t} />;
  return <Shot23Penutup t={t} />;
};

export const Video: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Adegan t={t} />
      <Caption t={t} />
      {/* VO + musik + efek suara dicampur jadi satu (audio/make_audio.py) */}
      <Audio src={staticFile("lembur-pabrik/master.wav")} volume={1} />
    </AbsoluteFill>
  );
};
