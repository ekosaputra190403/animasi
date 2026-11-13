import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import kata from "./vo/kata.json";

// Alat bantu bersama: easing, guncangan kamera, transisi, vignette, caption per kata.

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
// Nilai bergerak halus dari a ke b antara waktu t0..t1.
export const k = (t: number, ts: number[], vs: number[], e: (x: number) => number = ease) => interpolate(t, ts, vs, { ...clamp, easing: e });

// Guncangan kamera yang meluruh (detik sejak kejutan, kekuatan px).
export const guncang = (dt: number, kuat = 26) => {
  if (dt < 0 || dt > 0.6) return { x: 0, y: 0, r: 0 };
  const d = Math.exp(-dt * 7);
  return { x: Math.sin(dt * 71) * kuat * d, y: Math.cos(dt * 53) * kuat * 0.7 * d, r: Math.sin(dt * 47) * 1.2 * d };
};

export const Vignette: React.FC<{ kuat?: number }> = ({ kuat = 0.6 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,${kuat}) 100%)`, pointerEvents: "none" }} />
);

// Whip pan: adegan lama tersapu ke kiri, adegan baru masuk dari kanan, dengan blur gerak.
export const WHIP = 0.22;
export const Whip: React.FC<{ t: number; at: number; dari: React.ReactNode; ke: React.ReactNode }> = ({ t, at, dari, ke }) => {
  const p = k(t, [at - WHIP, at + WHIP], [0, 1], Easing.inOut(Easing.quad));
  const blur = Math.sin(p * Math.PI) * 22;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${-p * 1080}px)`, filter: `blur(${blur}px)` }}>{dari}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 1080}px)`, filter: `blur(${blur}px)` }}>{ke}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Caption 2 kata per tampilan (seperti referensi), kata kunci berwarna kuning.
// ---------------------------------------------------------------------------
type Kata = [number, number, string];
const BETUL: Record<string, string> = { dipasir: "di pasir", "tewasia-sia": "tewas sia-sia", flama: "Flamma", roma: "Roma" };
const KUNCI = new Set(["gladiator", "roma", "ribu", "orang", "gandum", "kacang", "abu", "tulang", "retiarius", "jaring", "tombak", "pedang", "perisai", "helm", "sempit", "meleset", "perisaimu", "pasir", "wasit", "mati", "mahal", "jari", "menyerah", "hidup", "palem", "uang", "kayu", "bebas", "flamma", "empat", "pensiun", "duel"]);
const bersih = (w: string) => (BETUL[w.replace(/[.,]/g, "").toLowerCase()] ?? w.replace(/[.,]/g, ""));
// Kelompokkan kata menjadi potongan 2 kata, putus di tanda baca.
const POTONGAN: { s: number; e: number; kata: string[] }[] = (() => {
  const out: { s: number; e: number; kata: string[] }[] = [];
  let cur: { s: number; e: number; kata: string[] } | null = null;
  (kata as Kata[]).forEach(([s, e, w]) => {
    if (!cur) cur = { s, e, kata: [] };
    cur.kata.push(bersih(w));
    cur.e = e;
    if (cur.kata.length >= 2 || /[.,]$/.test(w)) {
      out.push(cur);
      cur = null;
    }
  });
  if (cur) out.push(cur);
  // Tahan caption sampai potongan berikutnya mulai (maks. 0,5 s sesudah selesai).
  return out.map((p, i) => ({ ...p, e: Math.min(out[i + 1]?.s ?? p.e + 0.5, p.e + 0.5) }));
})();

export const CAPTION_Y = 1340;
export const Caption: React.FC<{ t: number }> = ({ t }) => {
  const p = POTONGAN.find((c) => t >= c.s && t < c.e);
  if (!p) return null;
  const pop = interpolate(t - p.s, [0, 0.08, 0.16], [0.75, 1.07, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <g transform={`translate(540 ${CAPTION_Y}) scale(${pop}) translate(-540 ${-CAPTION_Y})`}>
        <text x={540} y={CAPTION_Y} textAnchor="middle" fontFamily="'Segoe UI', Arial, sans-serif" fontWeight={800} fontSize={74} stroke="#141414" strokeWidth={12} paintOrder="stroke" strokeLinejoin="round">
          {p.kata.map((w, i) => (
            <tspan key={i} fill={KUNCI.has(w.toLowerCase()) ? "#FFD21F" : "#FFFFFF"}>
              {(i ? " " : "") + w}
            </tspan>
          ))}
        </text>
      </g>
    </svg>
  );
};
