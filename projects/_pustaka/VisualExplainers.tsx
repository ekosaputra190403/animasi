import React from "react";
import type { VisualKind } from "./visual-production";

const cardStyle = (accent: string, top: number, width: number): React.CSSProperties => ({
  position: "absolute",
  right: 56,
  top,
  width,
  padding: 22,
  border: `1px solid ${accent}88`,
  borderRadius: 18,
  background: "rgba(5,18,24,.82)",
  boxShadow: "0 12px 32px rgba(0,0,0,.24)",
  color: "#fff8e9",
  fontFamily: "'Segoe UI', Arial, sans-serif",
  pointerEvents: "none",
});

const eyebrowStyle = (accent: string): React.CSSProperties => ({
  color: accent,
  fontSize: 17,
  fontWeight: 900,
  letterSpacing: 3,
  marginBottom: 13,
});

const enterStyle = (progress: number): React.CSSProperties => ({
  opacity: progress,
  transform: `translateY(${(1 - progress) * 18}px)`,
});

export const TwoGunDeckCutaway: React.FC<{ accent: string; progress: number; kind: VisualKind; intention: string }> = ({
  accent,
  progress,
  kind,
  intention,
}) => (
  <div
    role="img"
    aria-label={intention}
    data-visual-kind={kind}
    style={{ ...cardStyle(accent, 575, 400), ...enterStyle(progress) }}
  >
    <div style={eyebrowStyle(accent)}>POTONGAN SAMPING</div>
    <svg viewBox="0 0 340 190" width="100%" aria-hidden="true">
      <path d="M26 53H314M39 106H301M24 144Q161 169 317 141L301 176Q166 190 44 175Z" fill="#79563a" stroke="#e1bd7f" strokeWidth="3" />
      <path d="M39 100H301" stroke="#f1d291" strokeWidth="5" />
      {[65, 117, 169, 221, 273].map((x) => (
        <g key={x}>
          <circle cx={x} cy="91" r="7" fill="#292827" />
          <path d={`M${x - 3} 91h28`} stroke={accent} strokeWidth="5" strokeLinecap="round" />
          <circle cx={x} cy="143" r="7" fill="#292827" />
          <path d={`M${x - 3} 143h28`} stroke={accent} strokeWidth="5" strokeLinecap="round" />
        </g>
      ))}
      <text x="20" y="46" fill="#fff5df" fontSize="16" fontWeight="700">GELADAK ATAS</text>
      <text x="20" y="128" fill="#fff5df" fontSize="16" fontWeight="700">GELADAK BAWAH</text>
    </svg>
  </div>
);

export const StabilityExplainer: React.FC<{
  accent: string;
  progress: number;
  enter: number;
  topHeavy: boolean;
  kind: VisualKind;
  intention: string;
}> = ({
  accent,
  progress,
  enter,
  topHeavy,
  kind,
  intention,
}) => (
  <div
    role="img"
    aria-label={intention}
    data-visual-kind={kind}
    style={{ ...cardStyle(accent, 510, 390), ...enterStyle(enter) }}
  >
    <div style={eyebrowStyle(accent)}>{topHeavy ? "BEBAN TERKUMPUL DI ATAS" : "TITIK BERAT & DAYA APUNG"}</div>
    <svg viewBox="0 0 320 210" width="100%" aria-hidden="true">
      <g transform={`rotate(${topHeavy ? Math.sin(progress * Math.PI) * 8 : 0},160,92)`}>
        <path d="M65 41H255V127Q161 149 65 127Z" fill="#765536" stroke="#e4c185" strokeWidth="3" />
        <path d="M90 52H230M90 76H230" stroke="#e9cf9b" strokeWidth="5" />
        <circle cx="160" cy={topHeavy ? "59" : "78"} r="10" fill="#f3bd55" />
        <text x="178" y={topHeavy ? "65" : "84"} fill="#fff7e6" fontSize="17" fontWeight="800">TITIK BERAT</text>
      </g>
      <path d="M35 128H285" stroke="#79cddd" strokeWidth="4" />
      {!topHeavy && (
        <>
          <circle cx="160" cy="124" r="10" fill="#69c8e0" />
          <text x="178" y="131" fill="#e2faff" fontSize="17" fontWeight="800">DAYA APUNG</text>
        </>
      )}
      <path d="M160 22V42M151 32L160 42L169 32" stroke="#f3bd55" strokeWidth="4" />
      <path d="M160 181V151M151 161L160 151L169 161" stroke="#69c8e0" strokeWidth="4" />
    </svg>
    <div style={{ fontSize: 18, lineHeight: 1.35 }}>
      {topHeavy ? "Bobot di bagian atas membuat kapal mudah kehilangan keseimbangan." : "Ilustrasi konsep; bukan pengukuran titik berat historis."}
    </div>
  </div>
);

export const CauseEffectDiagram: React.FC<{ accent: string; progress: number; kind: VisualKind; intention: string }> = ({
  accent,
  progress,
  kind,
  intention,
}) => (
  <div role="img" aria-label={intention} data-visual-kind={kind} style={{ ...cardStyle(accent, 625, 375), ...enterStyle(progress) }}>
    <div style={eyebrowStyle(accent)}>PENYEBAB → AKIBAT</div>
    <div style={{ display: "grid", gap: 10, fontSize: 20, fontWeight: 850 }}>
      <div style={{ borderLeft: `4px solid ${accent}`, paddingLeft: 12 }}>BOBOT DI ATAS</div>
      <div style={{ paddingLeft: 18, color: accent }}>↓</div>
      <div style={{ borderLeft: "4px solid #8ccbd3", paddingLeft: 12 }}>TITIK BERAT MENINGGI</div>
      <div style={{ paddingLeft: 18, color: accent }}>↓</div>
      <div style={{ borderLeft: "4px solid #f2a76b", paddingLeft: 12 }}>KAPAL MUDAH OLENG</div>
    </div>
  </div>
);

export const StabilityComparison: React.FC<{ accent: string; progress: number; kind: VisualKind; intention: string }> = ({
  accent,
  progress,
  kind,
  intention,
}) => (
  <div
    role="img"
    aria-label={intention}
    data-visual-kind={kind}
    style={{
      ...cardStyle(accent, 510, 952),
      left: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      gap: 24,
      ...enterStyle(progress),
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div style={{ color: "#f0ac75", fontSize: 18, fontWeight: 900, letterSpacing: 2 }}>BOBOT DI ATAS</div>
      <svg viewBox="0 0 220 110" width="220" height="110" aria-hidden="true">
        <path d="M25 51H195L172 83Q110 98 48 83Z" fill="#79563a" stroke="#f0c879" strokeWidth="3" />
        <path d="M60 26H168M69 38H160" stroke="#e9cf9b" strokeWidth="8" />
        <path d="M110 8V58" stroke="#f0ac75" strokeWidth="4" strokeDasharray="5 5" />
      </svg>
      <div style={{ fontSize: 17 }}>Mudah oleng</div>
    </div>
    <div style={{ color: accent, fontSize: 34, fontWeight: 900 }}>?</div>
    <div style={{ textAlign: "center" }}>
      <div style={{ color: "#8fd1d7", fontSize: 18, fontWeight: 900, letterSpacing: 2 }}>OPSIMU</div>
      <svg viewBox="0 0 220 110" width="220" height="110" aria-hidden="true">
        <path d="M25 57H195L172 83Q110 98 48 83Z" fill="#79563a" stroke="#8fd1d7" strokeWidth="3" />
        <path d="M64 32H164" stroke="#e9cf9b" strokeWidth="8" />
        <path d="M110 18V58" stroke="#8fd1d7" strokeWidth="4" strokeDasharray="5 5" />
      </svg>
      <div style={{ fontSize: 17 }}>Jaga keseimbangan</div>
    </div>
  </div>
);
