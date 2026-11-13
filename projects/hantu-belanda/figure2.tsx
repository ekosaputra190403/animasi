import React from "react";
import { FigureHead, INK, Hair, Expr } from "../_pustaka/figure-tetangga";

// Body for the hantu scene. The head reuses the channel's face drawing; the body is new:
// shaped torsos (jacket, shirt, blouse) instead of capsules, separate leg lengths per
// character, and clothing details (collar, tie, buttons, belt, bag, hat).
// Origin is at the feet, y up is negative, scale 1 = one drawing unit.

export type Detail = "jas" | "kemeja" | "kaus" | "blus";

export type Char = {
  color: string;
  accent: string;
  hair: Hair;
  hairColor: string;
  detail: Detail;
  headR: number;
  torsoW: number;
  torsoH: number;
  hipY: number; // height of the hip line above the ground (legs length)
  legBend: [number, number]; // knee offset for the left and right leg (+ = forward)
  stance: number; // distance of each foot from centre
  expr: Expr;
  look?: number;
  blink?: number;
  talk?: number;
  stride?: number; // -1..1 walking phase
  handL: [number, number];
  handR: [number, number];
  tie?: boolean;
  bag?: boolean;
  belt?: boolean;
  ghost?: boolean;
};

const limb = { stroke: INK, strokeWidth: 10, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
const outline = { stroke: INK, strokeWidth: 7, strokeLinejoin: "round" as const };

export const Figure2: React.FC<{ c: Char; x: number; y: number; id: string; scale?: number }> = ({ c, x, y, id, scale = 1 }) => {
  const w = c.torsoW;
  const top = -c.hipY - c.torsoH; // top of the torso
  const neckY = top - 6;
  const shoulderY = top + 30;
  const sx = w / 2 - 14;
  const stride = c.stride ?? 0;
  const hipY = -c.hipY;

  // Torso: shoulders are rounded, the bottom narrows to the waist. Not a capsule.
  const torsoPath =
    `M ${-w * 0.36} ${top} ` +
    `Q ${-w * 0.5} ${top + 4} ${-w * 0.5} ${top + 30} ` +
    `L ${-w * 0.44} ${hipY} ` +
    `L ${w * 0.44} ${hipY} ` +
    `L ${w * 0.5} ${top + 30} ` +
    `Q ${w * 0.5} ${top + 4} ${w * 0.36} ${top} Z`;

  const legs = (side: -1 | 1, phase: number) => {
    const hip = { x: side * c.stance * 0.5, y: hipY };
    const knee = { x: hip.x + side * c.legBend[side < 0 ? 0 : 1] + side * phase * 12, y: hipY / 2 };
    const foot = { x: side * c.stance + stride * side * 22, y: 0 };
    return (
      <>
        <path d={`M ${hip.x} ${hip.y} L ${knee.x} ${knee.y} L ${foot.x} ${foot.y - 2}`} {...limb} />
        <path d={`M ${foot.x - 26} ${foot.y - 2} L ${foot.x + 22} ${foot.y - 2}`} {...limb} />
      </>
    );
  };

  const arm = (side: -1 | 1, hand: [number, number]) => {
    const start = { x: side * sx, y: shoulderY };
    const end = { x: start.x + hand[0], y: start.y + hand[1] };
    const cx = (start.x + end.x) / 2 + side * 24;
    const cy = (start.y + end.y) / 2;
    return (
      <>
        <path d={`M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`} {...limb} />
        <circle cx={end.x} cy={end.y} r={11} fill={INK} />
      </>
    );
  };

  const detailSvg = () => {
    const neckL = { x: -w * 0.18, y: top + 2 };
    const neckR = { x: w * 0.18, y: top + 2 };
    return (
      <>
        {/* collar */}
        <path d={`M ${neckL.x} ${neckL.y} L 0 ${top + 34} L ${neckR.x} ${neckR.y}`} fill="#FFFFFF" {...outline} />
        {c.detail === "jas" && (
          <>
            {/* lapels */}
            <path d={`M ${-w * 0.2} ${top + 6} L ${-w * 0.08} ${top + 110} L ${-w * 0.36} ${top + 120}`} fill="none" {...outline} strokeWidth={5} />
            <path d={`M ${w * 0.2} ${top + 6} L ${w * 0.08} ${top + 110} L ${w * 0.36} ${top + 120}`} fill="none" {...outline} strokeWidth={5} />
            {[top + 150, top + 190].map((by) => (
              <circle key={by} cx={0} cy={by} r={5} fill={INK} />
            ))}
          </>
        )}
        {c.detail === "kemeja" && (
          <>
            <line x1={0} y1={top + 40} x2={0} y2={hipY - 30} stroke={INK} strokeWidth={4} />
            {[top + 70, top + 110].map((by) => (
              <circle key={by} cx={0} cy={by} r={4} fill={INK} />
            ))}
          </>
        )}
        {c.detail === "kaus" && (
          <path d={`M ${-w * 0.22} ${top + 48} Q 0 ${top + 62} ${w * 0.22} ${top + 48}`} fill="none" stroke={INK} strokeWidth={5} />
        )}
        {c.detail === "blus" && (
          <path d={`M ${-w * 0.3} ${top + 110} Q 0 ${top + 140} ${w * 0.3} ${top + 110}`} fill="none" stroke={INK} strokeWidth={5} />
        )}
        {c.tie && (
          <polygon
            points={`0,${top + 36} -11,${top + 48} -5,${top + 96} 0,${top + 104} 5,${top + 96} 11,${top + 48}`}
            fill={c.accent}
            stroke={INK}
            strokeWidth={4}
            strokeLinejoin="round"
          />
        )}
        {c.belt && <line x1={-w * 0.44} y1={hipY - 22} x2={w * 0.44} y2={hipY - 22} stroke={INK} strokeWidth={10} />}
      </>
    );
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {c.ghost && (
        <defs>
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      {/* Contact shadow under the feet, so the living characters sit on the floor */}
      {!c.ghost && <ellipse cx={0} cy={2} rx={Math.max(72, c.stance + 34)} ry={9} fill="#000000" opacity={0.6} />}
      {c.bag && (
        <>
          <rect x={-w * 0.62} y={top + 60} width={w * 0.34} height={120} rx={14} fill={c.accent} stroke={INK} strokeWidth={6} />
          <path d={`M ${-w * 0.45} ${top + 6} L ${-w * 0.2} ${top + 100}`} stroke={INK} strokeWidth={6} fill="none" />
        </>
      )}
      <g opacity={c.ghost ? 0.72 : 1} filter={c.ghost ? `url(#${id}-glow)` : undefined}>
        {c.ghost ? (
          // Ghost: no legs, a wavy trailing hem instead.
          <path
            d={`M ${-w * 0.44} ${hipY} L ${-w * 0.52} -40 Q ${-w * 0.4} -12 ${-w * 0.28} -40 Q ${-w * 0.16} -12 ${-w * 0.04} -40 Q ${w * 0.08} -12 ${w * 0.2} -40 Q ${w * 0.34} -12 ${w * 0.44} -40 L ${w * 0.52} -40 L ${w * 0.44} ${hipY} Z`}
            fill={c.color}
            stroke={INK}
            strokeWidth={6}
          />
        ) : (
          <>
            {legs(-1, stride < 0 ? 1 : 0)}
            {legs(1, stride > 0 ? 1 : 0)}
          </>
        )}
        {arm(-1, c.handL)}
        {arm(1, c.handR)}
        <clipPath id={id}>
          <path d={torsoPath} />
        </clipPath>
        <path d={torsoPath} fill={c.color} />
        <g clipPath={`url(#${id})`}>{detailSvg()}</g>
        <path d={torsoPath} fill="none" {...outline} />
      </g>
      <path d={`M 0 ${neckY} L 0 ${top + 2}`} stroke={INK} strokeWidth={16} />
      <FigureHead hair={c.hair} hairColor={c.hairColor} expr={c.expr} y={neckY - c.headR + 6} r={c.headR} look={c.look} blink={c.blink} talk={c.talk} />
    </g>
  );
};

// World position of a hand, for holding props.
export const handOf = (c: Char, side: -1 | 1, x: number, y: number, scale = 1) => {
  const hand = side < 0 ? c.handL : c.handR;
  const top = -c.hipY - c.torsoH;
  const sx = c.torsoW / 2 - 14;
  return { x: x + (side * sx + hand[0]) * scale, y: y + (top + 30 + hand[1]) * scale };
};
