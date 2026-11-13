import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { SHOT, DURASI, FPS } from "./timing";
import { Caption, Whip, WHIP } from "./efek";
import { Shot1Hook, Shot2Gabung, Shot3Kontrak, Shot4Voting } from "./adegan1";
import { Shot5Asuransi, Shot6BenderaHitam, Shot7BenderaMerah, Shot8Biskuit } from "./adegan2";
import { Shot9Mangsa, Shot10Peti, Shot11Twist, Shot12Pilih } from "./adegan3";

export const VIDEO_FRAMES = Math.round(DURASI * FPS);
const S = (n: number) => SHOT[n - 1];

const Adegan: React.FC<{ t: number }> = ({ t }) => {
  // Whip pan dramatis di pergantian babak
  const tWhip1 = S(5)[0];
  if (Math.abs(t - tWhip1) < WHIP) return <Whip t={t} at={tWhip1} dari={<Shot4Voting t={t} />} ke={<Shot5Asuransi t={t} />} />;
  const tWhip2 = S(9)[0];
  if (Math.abs(t - tWhip2) < WHIP) return <Whip t={t} at={tWhip2} dari={<Shot8Biskuit t={t} />} ke={<Shot9Mangsa t={t} />} />;

  if (t < S(2)[0]) return <Shot1Hook t={t} />;
  if (t < S(3)[0]) return <Shot2Gabung t={t} />;
  if (t < S(4)[0]) return <Shot3Kontrak t={t} />;
  if (t < S(5)[0]) return <Shot4Voting t={t} />;
  if (t < S(6)[0]) return <Shot5Asuransi t={t} />;
  if (t < S(7)[0]) return <Shot6BenderaHitam t={t} />;
  if (t < S(8)[0]) return <Shot7BenderaMerah t={t} />;
  if (t < S(9)[0]) return <Shot8Biskuit t={t} />;
  if (t < S(10)[0]) return <Shot9Mangsa t={t} />;
  if (t < S(11)[0]) return <Shot10Peti t={t} />;
  if (t < S(12)[0]) return <Shot11Twist t={t} />;
  return <Shot12Pilih t={t} />;
};

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{ background: "#0B1528" }}>
      <Adegan t={t} />
      <Caption t={t} />
      <Audio src={staticFile("vo/vo_narator.mp3")} />
    </AbsoluteFill>
  );
};
