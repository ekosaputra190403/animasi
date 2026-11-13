import React from "react";

// Channel figure system: one body structure (round head, capsule torso, line
// limbs) dressed differently per story. Proportions and small facial features
// keep it reading as grown-up; heads are drawn at radius 100 and scaled.

export const INK = "#2A2A33";
const SKIN = "#FFFFFF";
const BODY_STROKE = 7;
const LIMB = 10;

export type Expr = "netral" | "senyum" | "tawa" | "kaget" | "sedih" | "marah" | "pusing";
export type Hair = "pendek" | "rapi" | "acak" | "sanggul" | "hijab" | "uban" | "topi" | "anak" | "sebahu" | "ikal";
export type Outfit = "kemeja" | "jas" | "blazer" | "celemek" | "batik" | "jaket" | "hoodie" | "kaus" | "polos";

export type FigureSpec = {
  headR: number;
  torsoW: number;
  torsoH: number;
  leg: number;
  color: string;
  accent: string;
  hair: Hair;
  hairColor?: string;
  outfit: Outfit;
  expr: Expr;
  handL: [number, number]; // offset from the left shoulder
  handR: [number, number];
  headTilt?: number;
  look?: number; // face shift in head units, + looks to screen right
  blink?: number; // 0 open, 1 shut
  stride?: number; // -1 to 1, walking: + puts the right foot ahead
  kumis?: boolean;
  bow?: number; // how far the elbows push out, for hands on hips
  seated?: boolean; // no legs or ground shadow; the scene draws the legs
};

const Face: React.FC<{ expr: Expr; blink?: number }> = ({ expr, blink = 0 }) => {
  const line = { stroke: INK, strokeWidth: 7, fill: "none", strokeLinecap: "round" as const };
  const eyeY = Math.max(1.5, (expr === "kaget" ? 13 : 9.5) * (1 - blink));
  const brow = (x: number, s: -1 | 1) => {
    if (expr === "kaget") return `M ${x - 15} -36 Q ${x} -44 ${x + 15} -36`;
    if (expr === "sedih" || expr === "pusing") return `M ${x - 15 * s} -32 L ${x + 15 * s} -20`;
    if (expr === "marah") return `M ${x - 15 * s} -14 L ${x + 15 * s} -28`;
    return `M ${x - 15} -25 Q ${x} -30 ${x + 15} -25`;
  };
  const mouth = () => {
    switch (expr) {
      case "senyum":
        return <path d="M -22 40 Q 0 58 22 40" {...line} />;
      case "tawa":
        return <path d="M -26 36 Q 0 72 26 36 Z" fill="#7C2F3B" stroke={INK} strokeWidth={6} strokeLinejoin="round" />;
      case "kaget":
        return <ellipse cx={0} cy={50} rx={11} ry={15} fill="#7C2F3B" stroke={INK} strokeWidth={6} />;
      case "sedih":
        return <path d="M -20 54 Q 0 38 20 54" {...line} />;
      case "marah":
        return <path d="M -22 52 Q 0 42 22 52" {...line} />;
      case "pusing":
        return <path d="M -24 48 q 8 -9 16 0 t 16 0 t 16 0" {...line} />;
      default:
        return <path d="M -16 46 L 16 46" {...line} />;
    }
  };
  return (
    <g>
      <path d={brow(-34, -1)} {...line} />
      <path d={brow(34, 1)} {...line} />
      {expr === "tawa" ? (
        <>
          <path d="M -46 6 Q -34 -8 -22 6" {...line} />
          <path d="M 22 6 Q 34 -8 46 6" {...line} />
        </>
      ) : (
        <>
          <ellipse cx={-34} cy={2} rx={8.5} ry={eyeY} fill={INK} />
          <ellipse cx={34} cy={2} rx={8.5} ry={eyeY} fill={INK} />
        </>
      )}
      {mouth()}
      {expr === "pusing" && <path d="M 78 -38 C 68 -22 66 -12 78 -8 C 90 -12 88 -22 78 -38 Z" fill="#7CC4F0" stroke={INK} strokeWidth={4} />}
    </g>
  );
};

const HairShape: React.FC<{ hair: Hair; color: string }> = ({ hair, color }) => {
  const shape = { fill: color, stroke: INK, strokeWidth: BODY_STROKE, strokeLinejoin: "round" as const };
  switch (hair) {
    case "pendek":
      return <path d="M -101 -8 C -108 -75 -60 -112 0 -110 C 60 -112 108 -75 101 -8 C 92 -42 70 -66 28 -68 C 4 -54 -50 -56 -74 -62 C -88 -46 -96 -28 -101 -8 Z" {...shape} />;
    case "sebahu":
      return <path d="M -102 10 C -112 -70 -56 -112 6 -110 C 66 -108 110 -70 102 10 C 94 -30 72 -58 34 -74 C 6 -46 -50 -40 -84 -34 C -92 -20 -98 -4 -102 10 Z" {...shape} />;
    case "ikal":
      return <path d="M -100 -2 C -124 -14 -120 -52 -100 -58 C -110 -88 -76 -112 -54 -100 C -44 -126 -6 -130 8 -110 C 28 -130 64 -120 68 -98 C 96 -104 116 -72 102 -52 C 122 -40 120 -12 100 -2 C 90 -36 62 -60 28 -62 C 6 -52 -40 -54 -64 -62 C -82 -48 -94 -26 -100 -2 Z" {...shape} />;
    case "rapi":
      return <path d="M -101 -20 C -102 -80 -50 -110 10 -108 C 70 -106 105 -68 101 -20 C 90 -56 62 -74 10 -78 C -40 -80 -80 -62 -101 -20 Z" {...shape} />;
    case "acak":
      return <path d="M -102 -6 C -112 -60 -84 -100 -46 -104 L -34 -124 L -10 -108 L 16 -128 L 30 -106 L 58 -112 L 62 -88 C 92 -66 108 -36 102 -6 C 92 -38 72 -62 38 -66 C 16 -52 -24 -54 -44 -68 C -74 -54 -94 -30 -102 -6 Z" {...shape} />;
    case "sanggul":
      return (
        <>
          <path d="M -102 -6 C -108 -78 -56 -112 0 -110 C 56 -112 108 -78 102 -6 C 90 -48 50 -74 0 -76 C -50 -74 -90 -48 -102 -6 Z" {...shape} />
          <circle cx={0} cy={-128} r={32} {...shape} />
        </>
      );
    case "hijab":
      return (
        <path
          fillRule="evenodd"
          d="M -112 0 A 112 112 0 0 1 112 0 C 120 100 92 156 0 164 C -92 156 -120 100 -112 0 Z M -70 6 A 70 80 0 1 0 70 6 A 70 80 0 1 0 -70 6 Z"
          {...shape}
        />
      );
    case "uban":
      return (
        <>
          <path d="M -101 2 C -108 -38 -92 -66 -70 -76 C -74 -52 -82 -30 -86 2 Z" {...shape} />
          <path d="M 101 2 C 108 -38 92 -66 70 -76 C 74 -52 82 -30 86 2 Z" {...shape} />
          <circle cx={-34} cy={2} r={25} fill="none" stroke={INK} strokeWidth={5} />
          <circle cx={34} cy={2} r={25} fill="none" stroke={INK} strokeWidth={5} />
          <path d="M -9 0 L 9 0" stroke={INK} strokeWidth={5} />
          <path d="M -32 38 Q 0 22 32 38 Q 0 46 -32 38 Z" {...shape} strokeWidth={4} />
        </>
      );
    case "topi":
      return (
        <>
          <path d="M -94 -36 C -94 -104 -44 -120 0 -120 C 48 -120 94 -102 96 -36 Z" {...shape} />
          <path d="M 28 -46 Q 104 -56 134 -32 Q 90 -26 28 -34 Z" {...shape} />
        </>
      );
    default:
      return <path d="M -101 -10 C -108 -76 -56 -112 -8 -110 L 8 -128 L 22 -108 C 70 -104 108 -72 101 -10 C 90 -44 60 -66 20 -62 C -10 -48 -60 -52 -101 -10 Z" {...shape} />;
  }
};

export const FigureHead: React.FC<{ hair: Hair; hairColor?: string; expr: Expr; x?: number; y?: number; r?: number; tilt?: number; look?: number; blink?: number; kumis?: boolean }> = ({
  hair,
  hairColor = "#2B2730",
  expr,
  x = 0,
  y = 0,
  r = 100,
  tilt = 0,
  look = 0,
  blink = 0,
  kumis = false,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${r / 100})`}>
    {/* Shoulder-length hair falls behind the head, so it needs its own back layer. */}
    {hair === "sebahu" && (
      <path d="M -104 -30 C -124 40 -124 110 -100 150 Q -60 168 -30 150 L 30 150 Q 60 168 100 150 C 124 110 124 40 104 -30 Z" fill={hairColor} stroke={INK} strokeWidth={BODY_STROKE} strokeLinejoin="round" />
    )}
    <circle r={100} fill={SKIN} stroke={INK} strokeWidth={BODY_STROKE + 1} />
    <g transform={`translate(${look} 0)`}>
      <Face expr={expr} blink={blink} />
      {kumis && <path d="M -36 32 Q -18 14 0 25 Q 18 14 36 32 Q 18 33 0 31 Q -18 33 -36 32 Z" fill={hairColor} stroke={INK} strokeWidth={4} strokeLinejoin="round" />}
    </g>
    <HairShape hair={hair} color={hairColor} />
  </g>
);

// Clothing details, clipped to the torso capsule.
const Clothes: React.FC<{ s: FigureSpec; top: number }> = ({ s, top }) => {
  const w = s.torsoW;
  const h = s.torsoH;
  const a = s.accent;
  const seam = { stroke: INK, strokeWidth: 5, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (s.outfit) {
    case "polos":
      return <path d={`M -24 ${top + 4} Q 0 ${top + 36} 24 ${top + 4}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
    case "kemeja":
      return (
        <>
          <path d={`M -7 ${top + 34} L 7 ${top + 34} L 11 ${top + 118} L 0 ${top + 136} L -11 ${top + 118} Z`} fill={a} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <path d={`M -30 ${top + 4} L 0 ${top + 34} L 30 ${top + 4}`} fill="#FFFFFF" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        </>
      );
    case "jas":
      return (
        <>
          <path d={`M -26 ${top} L 0 ${top + 110} L 26 ${top} Z`} fill="#F4F4F6" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M -6 ${top + 22} L 6 ${top + 22} L 9 ${top + 78} L 0 ${top + 96} L -9 ${top + 78} Z`} fill={a} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <path d={`M 0 ${top + 110} L 0 ${top + h}`} {...seam} />
        </>
      );
    case "blazer":
      return (
        <>
          <path d={`M -24 ${top} L 0 ${top + 120} L 24 ${top} Z`} fill={a} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M 0 ${top + 120} L 0 ${top + h}`} {...seam} />
        </>
      );
    case "celemek":
      return (
        <>
          <rect x={-w * 0.3} y={top + h * 0.3} width={w * 0.6} height={h} fill={a} stroke={INK} strokeWidth={5} />
          <path d={`M ${-w * 0.3} ${top + h * 0.3} L ${-w * 0.12} ${top} M ${w * 0.3} ${top + h * 0.3} L ${w * 0.12} ${top}`} {...seam} />
          <rect x={-w * 0.16} y={top + h * 0.55} width={w * 0.32} height={h * 0.14} rx={4} fill="none" stroke={INK} strokeWidth={4} />
        </>
      );
    case "batik": {
      const dots: React.ReactNode[] = [];
      for (let row = 0; row < 6; row++) {
        for (let col = -2; col <= 2; col++) {
          dots.push(
            <path
              key={`${row}${col}`}
              d="M 0 -11 L 11 0 L 0 11 L -11 0 Z"
              transform={`translate(${col * 36 + (row % 2) * 18} ${top + 34 + row * 42})`}
              fill={a}
              stroke={INK}
              strokeWidth={3}
            />,
          );
        }
      }
      return (
        <>
          {dots}
          <path d={`M 0 ${top} L 0 ${top + h}`} {...seam} />
        </>
      );
    }
    case "jaket":
      return (
        <>
          <path d={`M 0 ${top} L 0 ${top + h}`} {...seam} />
          <rect x={-w / 2} y={top + h * 0.42} width={w} height={22} fill={a} stroke={INK} strokeWidth={4} />
          <rect x={w * 0.1} y={top + 40} width={w * 0.26} height={24} rx={4} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        </>
      );
    case "hoodie":
      return (
        <>
          <path d={`M ${-w * 0.42} ${top + 2} Q 0 ${top + 62} ${w * 0.42} ${top + 2} Z`} fill={a} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M -14 ${top + 34} L -14 ${top + 76} M 14 ${top + 34} L 14 ${top + 76}`} {...seam} />
          <path d={`M ${-w * 0.28} ${top + h * 0.64} L ${w * 0.28} ${top + h * 0.64} L ${w * 0.36} ${top + h * 0.86} L ${-w * 0.36} ${top + h * 0.86} Z`} fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        </>
      );
    default:
      return (
        <>
          <rect x={-w / 2} y={top + h * 0.3} width={w} height={h * 0.16} fill={a} />
          <rect x={-w / 2} y={top + h * 0.6} width={w} height={h * 0.16} fill={a} />
        </>
      );
  }
};

export const Figure: React.FC<{ s: FigureSpec; x: number; y: number; id: string; scale?: number }> = ({ s, x, y, id, scale = 1 }) => {
  const top = -s.leg - s.torsoH + 12;
  const shoulderY = top + 34;
  const sx = s.torsoW / 2 - 8;
  const hipY = -s.leg;
  const stance = Math.max(20, s.torsoW * 0.26);
  const limb = { stroke: INK, strokeWidth: LIMB, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const arm = (side: -1 | 1, hand: [number, number]) => {
    const start = { x: side * sx, y: shoulderY };
    const end = { x: start.x + hand[0], y: start.y + hand[1] };
    // Elbow bows outward from the body.
    const c = { x: (start.x + end.x) / 2 + side * (s.bow ?? 24), y: (start.y + end.y) / 2 };
    return (
      <>
        <path d={`M ${start.x} ${start.y} Q ${c.x} ${c.y} ${end.x} ${end.y}`} {...limb} />
        <circle cx={end.x} cy={end.y} r={10} fill={INK} />
      </>
    );
  };
  const neckTop = top - 12;
  const stride = s.stride ?? 0;
  const walk = stride * stance * 0.7; // keeps the feet from crossing
  const liftL = Math.max(0, stride) * 26;
  const liftR = Math.max(0, -stride) * 26;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {!s.seated && <ellipse cx={0} cy={6} rx={Math.max(70, s.torsoW * 0.75)} ry={12} fill="#000000" opacity={0.1} />}
      {!s.seated && (
        <>
        <path d={`M ${-stance * 0.6} ${hipY} L ${-stance + walk} ${-3 - liftL} L ${-stance + walk - 28} ${-2 - liftL}`} {...limb} />
        <path d={`M ${stance * 0.6} ${hipY} L ${stance - walk} ${-3 - liftR} L ${stance - walk + 28} ${-2 - liftR}`} {...limb} />
        </>
      )}
      <path d={`M 0 ${neckTop} L 0 ${top + 10}`} stroke={INK} strokeWidth={16} />
      {arm(-1, s.handL)}
      {arm(1, s.handR)}
      <clipPath id={id}>
        <rect x={-s.torsoW / 2} y={top} width={s.torsoW} height={s.torsoH} rx={s.torsoW * 0.42} />
      </clipPath>
      <rect x={-s.torsoW / 2} y={top} width={s.torsoW} height={s.torsoH} rx={s.torsoW * 0.42} fill={s.color} />
      <g clipPath={`url(#${id})`}>
        <Clothes s={s} top={top} />
      </g>
      <rect x={-s.torsoW / 2} y={top} width={s.torsoW} height={s.torsoH} rx={s.torsoW * 0.42} fill="none" stroke={INK} strokeWidth={BODY_STROKE} />
      <FigureHead hair={s.hair} hairColor={s.hairColor} expr={s.expr} y={neckTop - s.headR + 6} r={s.headR} tilt={s.headTilt} look={s.look} blink={s.blink} kumis={s.kumis} />
    </g>
  );
};

// World position of a hand, for attaching props.
export const handAt = (s: FigureSpec, side: -1 | 1, x: number, y: number, scale = 1) => {
  const hand = side < 0 ? s.handL : s.handR;
  const top = -s.leg - s.torsoH + 12;
  return { x: x + (side * (s.torsoW / 2 - 8) + hand[0]) * scale, y: y + (top + 34 + hand[1]) * scale };
};

// World position of the head centre, for props worn on the face.
export const headAt = (s: FigureSpec, x: number, y: number, scale = 1) => ({
  x,
  y: y + (-s.leg - s.torsoH + 12 - 12 - s.headR + 6) * scale,
});
