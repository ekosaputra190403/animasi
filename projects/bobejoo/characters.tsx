import React from "react";

// Bob and Ejo, the leads of the BobEjoo channel. Heads are drawn at radius 100
// and scaled, so every expression works for both characters at any size.

export const INK = "#23233B";
const SKIN = "#FFFFFF";
const CHEEK = "#FFB7B2";
const STROKE = 7;

export const BOB_BLUE = "#2F6BFF";
export const EJO_ORANGE = "#FF9F2E";

export type Expr = "senang" | "kaget" | "sedih" | "gaya" | "mikir";
export type Who = "bob" | "ejo";

const Eye: React.FC<{ x: number; expr: Expr }> = ({ x, expr }) => {
  if (expr === "senang") {
    return <path d={`M ${x - 17} 8 Q ${x} -14 ${x + 17} 8`} stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" />;
  }
  const ry = expr === "kaget" ? 21 : 16;
  const rx = expr === "kaget" ? 15 : 12.5;
  const gx = expr === "mikir" ? 5 : 0;
  const gy = expr === "mikir" ? -5 : 0;
  return (
    <g>
      <ellipse cx={x + gx} cy={2 + gy} rx={rx} ry={ry} fill={INK} />
      <circle cx={x + gx + 4} cy={-4 + gy} r={4.5} fill="#FFFFFF" />
    </g>
  );
};

const Brow: React.FC<{ x: number; side: -1 | 1; expr: Expr }> = ({ x, side, expr }) => {
  let d = `M ${x - 19} -30 Q ${x} -39 ${x + 19} -30`;
  if (expr === "kaget") d = `M ${x - 18} -44 Q ${x} -56 ${x + 18} -44`;
  // Inner end raised: reads as worry.
  if (expr === "sedih") d = `M ${x - 18 * side} -38 Q ${x} -32 ${x + 18 * side} -24`;
  if (expr === "mikir") d = side < 0 ? `M ${x - 18} -30 L ${x + 18} -30` : `M ${x - 18} -44 Q ${x} -54 ${x + 18} -42`;
  return <path d={d} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />;
};

const Mouth: React.FC<{ expr: Expr }> = ({ expr }) => {
  switch (expr) {
    case "senang":
      return <path d="M -30 34 Q 0 76 30 34 Z" fill="#8C2F3F" stroke={INK} strokeWidth={6} strokeLinejoin="round" />;
    case "kaget":
      return <ellipse cx={0} cy={54} rx={16} ry={22} fill="#8C2F3F" stroke={INK} strokeWidth={6} />;
    case "sedih":
      return <path d="M -24 58 Q 0 34 24 58" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />;
    case "gaya":
      return <path d="M -24 44 Q 8 62 32 34" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />;
    default:
      return <path d="M -16 50 Q 4 44 22 52" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />;
  }
};

const Shades: React.FC<{ y: number; scale?: number }> = ({ y, scale = 1 }) => (
  <g transform={`translate(0 ${y}) scale(${scale})`}>
    <rect x={-66} y={-20} width={58} height={42} rx={15} fill="#1E9BFF" stroke={INK} strokeWidth={STROKE} />
    <rect x={8} y={-20} width={58} height={42} rx={15} fill="#1E9BFF" stroke={INK} strokeWidth={STROKE} />
    <path d="M -8 -6 L 8 -6" stroke={INK} strokeWidth={STROKE} />
    <path d="M -56 -9 L -38 -9 M 18 -9 L 36 -9" stroke="#BFE6FF" strokeWidth={6} strokeLinecap="round" />
  </g>
);

const BLOCKS = ["#FF4D4D", "#FFC93C", "#37C871", "#2F6BFF", "#FF8A1F"];

// Bucket hat with the toy-block pattern from the channel avatar.
const BlockHat: React.FC<{ id: string }> = ({ id }) => {
  const dome = "M -86 -46 C -84 -122 -46 -146 0 -146 C 46 -146 84 -122 86 -46 Z";
  const cells: React.ReactNode[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      cells.push(
        <rect
          key={`${row}-${col}`}
          x={-105 + col * 30 + (row % 2) * 15}
          y={-150 + row * 36}
          width={30}
          height={36}
          fill={BLOCKS[(col * 2 + row * 3) % BLOCKS.length]}
          stroke={INK}
          strokeWidth={3}
        />,
      );
    }
  }
  return (
    <g>
      <clipPath id={id}>
        <path d={dome} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{cells}</g>
      <path d={dome} fill="none" stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
      <path d="M -120 -36 Q 0 -66 120 -36 Q 0 -14 -120 -36 Z" fill="#FFC93C" stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
    </g>
  );
};

const EjoHair: React.FC = () => (
  <path
    d="M -100 -8 C -112 -66 -76 -110 -34 -106 L -22 -134 L 4 -110 L 32 -136 L 42 -104 L 72 -112 L 70 -82 C 94 -62 106 -36 100 -8 C 86 -48 66 -70 34 -74 C 6 -62 -34 -66 -58 -76 C -78 -62 -92 -40 -100 -8 Z"
    fill="#2B2438"
    stroke={INK}
    strokeWidth={STROKE}
    strokeLinejoin="round"
  />
);

export const Head: React.FC<{ who: Who; expr: Expr; id: string; x?: number; y?: number; r?: number; tilt?: number }> = ({
  who,
  expr,
  id,
  x = 0,
  y = 0,
  r = 100,
  tilt = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${r / 100})`}>
    <circle r={100} fill={SKIN} stroke={INK} strokeWidth={STROKE + 1} />
    {expr !== "gaya" && (
      <>
        <Brow x={-38} side={-1} expr={expr} />
        <Brow x={38} side={1} expr={expr} />
        <Eye x={-38} expr={expr} />
        <Eye x={38} expr={expr} />
      </>
    )}
    <ellipse cx={-64} cy={32} rx={15} ry={9} fill={CHEEK} opacity={0.85} />
    <ellipse cx={64} cy={32} rx={15} ry={9} fill={CHEEK} opacity={0.85} />
    <Mouth expr={expr} />
    {expr === "sedih" && <path d="M 76 -36 C 64 -18 62 -6 76 -2 C 90 -6 88 -18 76 -36 Z" fill="#6CC6FF" stroke={INK} strokeWidth={4} />}
    {expr === "mikir" && (
      <text x={92} y={-92} fontSize={58} fontWeight={800} fontFamily="Arial" fill={INK}>
        ?
      </text>
    )}
    {who === "bob" ? (
      <>
        {/* Raised so the brim clears the brows, which carry most of the emotion. */}
        <g transform="translate(0 -32)">
          <BlockHat id={id} />
        </g>
        {/* Shades live on the hat so his eyes stay readable; they drop down only for the "gaya" look. */}
        {expr === "gaya" ? <Shades y={2} scale={1.05} /> : <Shades y={-116} scale={0.72} />}
      </>
    ) : (
      <>
        {expr === "gaya" && <Shades y={2} scale={1.05} />}
        <EjoHair />
      </>
    )}
  </g>
);

const SPEC = {
  bob: { headR: 118, bodyW: 150, bodyH: 205, leg: 125, spread: 40, color: BOB_BLUE },
  ejo: { headR: 100, bodyW: 96, bodyH: 285, leg: 205, spread: 34, color: EJO_ORANGE },
};

// Standing figure. x/y mark the point on the floor between the feet.
export const Character: React.FC<{ who: Who; x: number; y: number; scale?: number; expr?: Expr }> = ({
  who,
  x,
  y,
  scale = 1,
  expr = "senang",
}) => {
  const s = SPEC[who];
  const bodyTop = -s.leg - s.bodyH + 14;
  const shoulderY = bodyTop + s.bodyH * 0.3;
  const sx = s.bodyW / 2 - 8;
  const limb = { stroke: INK, strokeWidth: 13, strokeLinecap: "round" as const, fill: "none" };
  const hipY = -s.leg;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={6} rx={s.bodyW * 0.95} ry={16} fill="#000000" opacity={0.12} />
      <path d={`M ${-s.spread / 2} ${hipY} L ${-s.spread} -4 L ${-s.spread - 34} -2`} {...limb} strokeLinejoin="round" />
      <path d={`M ${s.spread / 2} ${hipY} L ${s.spread} -4 L ${s.spread + 34} -2`} {...limb} strokeLinejoin="round" />
      {who === "bob" ? (
        <>
          {/* Hand on hip, other arm waving: the spontaneous one. */}
          <path d={`M ${-sx} ${shoulderY} Q ${-sx - 92} ${shoulderY + 72} ${-sx + 4} ${shoulderY + 118}`} {...limb} />
          <path d={`M ${sx} ${shoulderY} Q ${sx + 56} ${shoulderY - 18} ${sx + 92} ${shoulderY - 112}`} {...limb} />
          <circle cx={sx + 92} cy={shoulderY - 112} r={17} fill={INK} />
        </>
      ) : (
        <>
          {/* Holds a small notebook: the one who plans. */}
          <path d={`M ${-sx} ${shoulderY} Q ${-sx - 60} ${shoulderY + 90} ${-sx - 26} ${shoulderY + 196}`} {...limb} />
          <circle cx={-sx - 26} cy={shoulderY + 196} r={16} fill={INK} />
          <path d={`M ${sx} ${shoulderY} Q ${sx + 76} ${shoulderY + 70} ${sx + 40} ${shoulderY + 112}`} {...limb} />
          <g transform={`translate(${sx + 58} ${shoulderY + 88}) rotate(8)`}>
            <rect x={-30} y={-40} width={60} height={80} rx={7} fill="#FFF3C9" stroke={INK} strokeWidth={STROKE} />
            <path d="M -16 -16 L 16 -16 M -16 2 L 16 2 M -16 20 L 6 20" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          </g>
          <circle cx={sx + 40} cy={shoulderY + 112} r={16} fill={INK} />
        </>
      )}
      <rect x={-s.bodyW / 2} y={bodyTop} width={s.bodyW} height={s.bodyH} rx={s.bodyW / 2} fill={s.color} stroke={INK} strokeWidth={STROKE + 2} />
      <Head who={who} expr={expr} id={`hat-full-${who}`} y={bodyTop - s.headR + 34} r={s.headR} />
    </g>
  );
};
