import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import kataData from "./vo/kata.json";
import { TeksKomik } from "./teks";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
export const k = (t: number, ts: number[], vs: number[], e: (x: number) => number = ease) =>
  interpolate(t, ts, vs, { ...clamp, easing: e });

export const guncang = (dt: number, kuat = 26) => {
  if (dt < 0 || dt > 0.6) return { x: 0, y: 0, r: 0 };
  const d = Math.exp(-dt * 7);
  return {
    x: Math.sin(dt * 71) * kuat * d,
    y: Math.cos(dt * 53) * kuat * 0.7 * d,
    r: Math.sin(dt * 47) * 1.2 * d,
  };
};

export const Vignette: React.FC<{ kuat?: number }> = ({ kuat = 0.6 }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,${kuat}) 100%)`,
      pointerEvents: "none",
    }}
  />
);

export const WHIP = 0.22;
export const Whip: React.FC<{ t: number; at: number; dari: React.ReactNode; ke: React.ReactNode }> = ({
  t, at, dari, ke
}) => {
  const p = k(t, [at - WHIP, at + WHIP], [0, 1], Easing.inOut(Easing.quad));
  const blur = Math.sin(p * Math.PI) * 22;
  return ( 
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${-p * 1080}px)`, filter: `blur(${blur}px)` }}>
        {dari}
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 1080}px)`, filter: `blur(${blur}px)` }}>
        {ke}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Kelompokkan kata menjadi potongan 2 kata untuk Caption di 70% tinggi layar (y = 1344)
type ItemKata = { s: number; e: number; w: string };
const daftarKata: ItemKata[] = Array.isArray(kataData) ? (kataData as ItemKata[]) : [];

const potonganCaption = (() => {
  const out: { s: number; e: number; teks: string }[] = [];
  let cur: { s: number; e: number; kata: string[] } | null = null;
  for (const item of daftarKata) {
    const w = (item.w || "").trim();
    if (!w) continue;
    const jeda = cur ? item.s - cur.e : 0;
    if (!cur || cur.kata.length >= 2 || jeda > 0.35) {
      if (cur) out.push({ s: cur.s, e: cur.e, teks: cur.kata.join(" ").toUpperCase() });
      cur = { s: item.s, e: item.e, kata: [w] };
    } else {
      cur.e = item.e;
      cur.kata.push(w);
    }
  }
  if (cur) out.push({ s: cur.s, e: cur.e, teks: cur.kata.join(" ").toUpperCase() });
  return out.map((p, i) => ({
    ...p,
    e: Math.min(out[i + 1]?.s ?? p.e + 0.4, p.e + 0.4),
  }));
})();

export const Caption: React.FC<{ t: number }> = ({ t }) => {
  const aktif = potonganCaption.find((p) => t >= p.s && t < p.e);
  if (!aktif) return null;
  const dt = t - aktif.s;
  const skala = k(dt, [0, 0.08, 0.14], [0.75, 1.08, 1.0]);
  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <g transform={`translate(540, 1360) scale(${skala})`}>
        <TeksKomik x={0} y={0} teks={aktif.teks} ukuran={62} atas="#FFF7B2" bawah="#FFB800" />
      </g>
    </svg>
  );
};
