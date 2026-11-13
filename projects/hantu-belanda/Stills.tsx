import React from "react";
import { AbsoluteFill } from "remotion";
import { Karakter } from "../_pustaka/Karakter";
import {
  GedungMalam, GEDUNG_GROUND,
  Lobi, LOBI_GROUND,
  Lorong, LORONG_GROUND,
  Tangga, TANGGA_LANDING, tanggaGround,
} from "./latar";

// Satu still per beat naskah (naskah.md), untuk dicek sebelum animasi dan render.

const Caption: React.FC<{ text: string }> = ({ text }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <text
      x={540}
      y={1790}
      textAnchor="middle"
      fontFamily="'Arial Black', 'Segoe UI', sans-serif"
      fontWeight={900}
      fontSize={88}
      fill="#FFFFFF"
      stroke="#141414"
      strokeWidth={16}
      paintOrder="stroke"
      strokeLinejoin="round"
    >
      {text}
    </text>
  </svg>
);

const T = 0.4; // waktu contoh untuk napas/kedip/melayang

export const Beat1: React.FC = () => (
  <AbsoluteFill>
    <GedungMalam t={T} doorOpen={1} />
    <Karakter outfit="hantu" expression="fokus" motion="melayang" t={T} x={540} groundY={GEDUNG_GROUND} width={560} />
    <Caption text="LAGI-LAGI" />
  </AbsoluteFill>
);

export const Beat2: React.FC = () => (
  <AbsoluteFill>
    <Lobi />
    <Karakter outfit="hantu" expression="seram" motion="melayang" t={T} x={230} groundY={LOBI_GROUND - 40} width={520} />
    <Karakter outfit="biasa" expression="pede" pose="idle" t={T} x={560} groundY={LOBI_GROUND} width={600} />
    <Karakter outfit="cewek" expression="kaget" pose="idle" t={T} x={890} groundY={LOBI_GROUND} width={540} />
    <Caption text="CUMA FOTO" />
  </AbsoluteFill>
);

export const Beat3: React.FC = () => (
  <AbsoluteFill>
    <Lorong scroll={0} />
    <Karakter outfit="hantu" expression="ketawa" pose="kepal_marah" motion="melayang" t={T} x={330} groundY={LORONG_GROUND} width={580} />
    <Karakter outfit="biasa" expression="fokus" pose="idle" dir={-1} t={T} x={780} groundY={LORONG_GROUND} width={600} />
    <Caption text="HIHIHI" />
  </AbsoluteFill>
);

export const Beat4: React.FC = () => (
  <AbsoluteFill>
    <Tangga />
    <Karakter outfit="hantu" expression="seram" motion="terbang" dir={1} t={0.3} x={190} groundY={tanggaGround(190) - 60} width={540} />
    <Karakter outfit="biasa" expression="takut" pose="idle" motion="jalan" dir={1} t={0.3} x={480} groundY={tanggaGround(480)} width={560} />
    <Caption text="MAU NGOBROL" />
  </AbsoluteFill>
);

export const Beat5: React.FC = () => (
  <AbsoluteFill>
    <Tangga />
    <Karakter outfit="biasa" expression="kaget" pose="idle" dir={1} t={T} x={430} groundY={tanggaGround(430)} width={560} />
    <Karakter outfit="hantu" expression="seram" motion="melayang" dir={-1} t={T} x={850} groundY={TANGGA_LANDING} width={560} />
    <Caption text="SERATUS TAHUN" />
  </AbsoluteFill>
);

