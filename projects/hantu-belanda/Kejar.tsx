import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { INK } from "../_pustaka/figure-tetangga";
import { Figure2, Char, handOf } from "./figure2";

// Hantu Belanda, scene 25-38 dtk of the 60 s script: the chase and the "ngobrol" line.
// Local time: 0 s = start of this scene. Captions are word-by-word.

export const DURATION = 13 * 30;

const FONT = "'Segoe UI', Arial, sans-serif";
// Floor line in the photo at the characters' depth. The photo's floor sits lower than the old 1170,
// so the feet were hovering over the back wall; 1420 puts them on the tiles.
const GROUND_Y = 1420;
const SCALE = 1.8;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const k = (t: number, times: number[], values: number[]) => interpolate(t, times, values, { ...clamp, easing: ease });
const blinkAt = (t: number, seed = 0) => (((t + seed) % 3.3) < 0.11 ? 1 : 0);

// Three different bodies: the officer is tall with long legs, the tourist shorter, the woman in between.
const HANTU: Char = {
  color: "#F3F6FA",
  accent: "#1F3A5F",
  hair: "topi",
  hairColor: "#2A2A33",
  detail: "jas",
  headR: 62,
  torsoW: 150,
  torsoH: 220,
  hipY: 250,
  legBend: [-16, 18],
  stance: 58,
  expr: "marah",
  handL: [-22, 150],
  handR: [28, 128],
  tie: true,
  belt: true,
  ghost: true,
};

const TURIS: Char = {
  color: "#F4E3B2",
  accent: "#2F7F76",
  hair: "pendek",
  hairColor: "#3A2A2E",
  detail: "kaus",
  headR: 66,
  torsoW: 132,
  torsoH: 200,
  hipY: 200,
  legBend: [14, -6],
  stance: 52,
  expr: "kaget",
  handL: [-18, 150],
  handR: [22, 120],
  bag: true,
};

const PEREMPUAN: Char = {
  color: "#C2577F",
  accent: "#8E3558",
  hair: "sebahu",
  hairColor: "#3A2A2E",
  detail: "blus",
  headR: 60,
  torsoW: 118,
  torsoH: 196,
  hipY: 230,
  legBend: [-8, 10],
  stance: 46,
  expr: "yakin",
  handL: [-12, 150],
  handR: [12, 150],
};

// Lawang Sewu-style hall: tall windows and pillars that slide past while the chase runs.
const Hall: React.FC<{ scroll: number }> = ({ scroll }) => {
  const idx = [0, 1, 2, 3, 4, 5, 6];
  const wrap = (v: number) => ((v % 1800) + 1800) % 1800 - 200;
  return (
    <g>
      <rect x={-200} y={-200} width={1500} height={GROUND_Y + 200} fill="#3A3530" />
      {idx.map((i) => {
        const x = wrap(i * 300 - scroll * 0.5);
        return (
          <g key={`w${i}`}>
            <rect x={x + 40} y={230} width={150} height={380} rx={75} fill="#2C3A44" stroke={INK} strokeWidth={8} />
            <line x1={x + 115} y1={230} x2={x + 115} y2={610} stroke={INK} strokeWidth={6} />
          </g>
        );
      })}
      {idx.map((i) => {
        const x = wrap(i * 300 - scroll);
        return <rect key={`p${i}`} x={x} y={-100} width={70} height={GROUND_Y + 100} fill="#57504A" stroke={INK} strokeWidth={6} />;
      })}
      <rect x={-200} y={GROUND_Y} width={1500} height={900} fill="#2E2925" />
      <rect x={-200} y={GROUND_Y - 6} width={1500} height={12} fill="#4A3B2C" />
    </g>
  );
};

// Background: the Pixabay corridor photo (public/hantu-belanda/corridor.jpg), darkened with a
// vignette. It creeps forward slowly (push-in) and drifts sideways with the chase.
// Photo is 1920x1280; scaled to 2880x1920 so the full height fills the 1920 px frame.
const PHOTO_W = 2880;
const PHOTO_H = 1920;
const BackgroundPhoto: React.FC<{ t: number; scroll: number }> = ({ t, scroll }) => {
  const zoom = k(t, [0, 13], [1.0, 1.1]);
  const drift = -scroll * 0.18;
  return (
    <g>
      {/* Zoom is anchored on the feet line, so the floor under the characters stays put */}
      <g transform={`translate(${540 + drift} ${GROUND_Y}) scale(${zoom}) translate(-540 ${-GROUND_Y})`}>
        <image
          href={staticFile("hantu-belanda/corridor.jpg")}
          x={(1080 - PHOTO_W) / 2}
          y={0}
          width={PHOTO_W}
          height={PHOTO_H}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
      {/* Warm brown tint, multiplied over the grey photo */}
      <rect x={-200} y={-200} width={1500} height={2400} fill="#C98A4B" opacity={0.55} style={{ mixBlendMode: "multiply" }} />
      <rect x={-200} y={-200} width={1500} height={2400} fill="#1E1812" opacity={0.42} />
      <radialGradient id="vignette" cx="50%" cy="45%" r="70%">
        <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
        <stop offset="1" stopColor="#000000" stopOpacity="0.7" />
      </radialGradient>
      <rect x={-200} y={-200} width={1500} height={2400} fill="url(#vignette)" />
    </g>
  );
};

// Wide hall, not a tunnel: a flat back wall with tall windows and a tiled floor that runs
// out to the bottom of the frame. The floor's horizon sits at the feet, so the figures
// stand on the floor instead of floating in a vanishing corridor.
const VP = { x: 540, y: 820 }; // vanishing point of the floor tiles, above the feet line
const RoomBackdrop: React.FC<{ t: number; scroll: number }> = ({ t, scroll }) => {
  const sway = -scroll * 0.12;
  const windows = [60, 290, 520, 750];
  const floorLines = [-600, -300, 0, 300, 600, 900, 1200, 1500].map((x) => x);
  return (
    <g>
      {/* back wall */}
      <rect x={-200} y={-200} width={1500} height={GROUND_Y + 200} fill="#4A3E33" />
      {/* wall panels */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={`pn${i}`} x={i * 200 - 40 + sway} y={-200} width={6} height={GROUND_Y + 200} fill="#33291F" />
      ))}
      {/* tall windows */}
      {windows.map((wx, i) => (
        <g key={`win${i}`} transform={`translate(${sway * 0.5} 0)`}>
          <rect x={wx} y={220} width={170} height={420} rx={12} fill="#2B3840" stroke={INK} strokeWidth={8} />
          <line x1={wx + 85} y1={220} x2={wx + 85} y2={640} stroke={INK} strokeWidth={6} />
          <line x1={wx} y1={430} x2={wx + 170} y2={430} stroke={INK} strokeWidth={6} />
        </g>
      ))}
      {/* skirting board where the wall meets the floor */}
      <rect x={-200} y={GROUND_Y - 22} width={1500} height={26} fill="#261E17" />
      {/* floor */}
      <rect x={-200} y={GROUND_Y + 4} width={1500} height={900} fill="#5B4B3C" />
      {/* floor tiles: lines running toward the vanishing point, and rows across */}
      {floorLines.map((x, i) => (
        <line key={`fl${i}`} x1={x + sway} y1={GROUND_Y + 4} x2={VP.x + (x - VP.x) * 2.2} y2={GROUND_Y + 900} stroke="#43372B" strokeWidth={4} />
      ))}
      {[40, 110, 220, 370, 560].map((ry, i) => (
        <line key={`fr${i}`} x1={-200} y1={GROUND_Y + ry * 0.9} x2={1280} y2={GROUND_Y + ry * 0.9} stroke="#43372B" strokeWidth={4} />
      ))}
    </g>
  );
};

// Caption lines: each line reveals word by word (0.3 s per word), then holds until its end.
const LINES: { words: string[]; start: number; end: number }[] = [
  { words: ["TUNGGU!"], start: 1.4, end: 2.0 },
  { words: ["SAYA", "CUMA", "MAU", "NGOBROL!"], start: 2.0, end: 4.6 },
  { words: ["DIA", "CUMA", "MAU", "NGOBROL?"], start: 10.4, end: 12.9 },
];

const Caption: React.FC<{ t: number }> = ({ t }) => {
  const line = LINES.find((l) => t >= l.start && t < l.end);
  if (!line) return null;
  const count = Math.min(line.words.length, Math.floor((t - line.start) / 0.3) + 1);
  const text = line.words.slice(0, count).join(" ");
  return (
    <text
      x={540}
      y={1540}
      textAnchor="middle"
      fontFamily={FONT}
      fontWeight={900}
      fontSize={72}
      fill="#FFFFFF"
      stroke={INK}
      strokeWidth={14}
      paintOrder="stroke"
      strokeLinejoin="round"
    >
      {text}
    </text>
  );
};

export const Kejar: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  // Chase: turis runs ahead, hantu follows, both stop at about 8 s.
  const turisX = k(t, [0, 8], [180, 600]);
  const hantuX = k(t, [0, 8.5], [-60, 300]);
  const running = t < 8;
  const stride = running ? Math.sin(t * 14) : 0;
  const scroll = k(t, [0, 8], [0, 1400]);

  // Turis looks back at the ghost from 8 s on, showing the twist.
  const turisExpr = t < 8 ? "kaget" : "heran";
  const turisLook = t < 8 ? 0 : -18;

  // Hantu talks from 1.4 s; sad face at the twist.
  const hantuExpr = t < 8 ? "marah" : "sedih";

  // Woman steps in at 9.6 s and talks from 10.4 s.
  const perempuanX = k(t, [9.6, 10.6], [1250, 900]);
  const perempuanTalk = t >= 10.4 && t <= 12.9 ? 0.5 + 0.5 * Math.sin(t * 18) : 0;

  // The ghost floats: it hovers above the floor and bobs slowly.
  const hantuY = GROUND_Y - 30 + Math.sin(t * 2.6) * 10;
  const cane = handOf(HANTU, 1, hantuX, hantuY, SCALE);
  const caneEnd = { x: cane.x + 40, y: hantuY + 8 };

  const shake = running ? Math.sin(t * 40) * 3 * (1 - t / 8) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#24211E" }}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          {/* Cast shadow: blur, then colour everything near-black and keep the alpha */}
          <filter id="castShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="soft" />
            <feColorMatrix in="soft" type="matrix" values="0 0 0 0 0.04  0 0 0 0 0.03  0 0 0 0 0.03  0 0 0 1 0" />
          </filter>
        </defs>
        <g transform={`translate(${shake} 0)`}>
          <RoomBackdrop t={t} scroll={scroll} />

          {/* Shadows fall on the wall behind the living characters; the ghost casts none */}
          <g filter="url(#castShadow)" opacity={0.55}>
            <g transform="translate(90 -18)">
              <Figure2
                c={{ ...TURIS, expr: turisExpr, look: turisLook, blink: 0, stride: running ? stride : 0 }}
                x={turisX}
                y={GROUND_Y}
                id="shadow-turis"
                scale={SCALE}
              />
            </g>
            {t >= 9.6 && (
              <g transform="translate(90 -18)">
                <Figure2
                  c={{ ...PEREMPUAN, blink: 0, talk: 0 }}
                  x={perempuanX}
                  y={GROUND_Y}
                  id="shadow-perempuan"
                  scale={SCALE}
                />
              </g>
            )}
          </g>

          <Figure2
            c={{ ...HANTU, expr: hantuExpr, look: 18, blink: blinkAt(t, 0.7), stride: 0 }}
            x={hantuX}
            y={hantuY}
            id="hantu-belanda"
            scale={SCALE}
          />
          {/* cane held in the officer's right hand */}
          <line x1={cane.x} y1={cane.y} x2={caneEnd.x} y2={caneEnd.y} stroke={INK} strokeWidth={12} strokeLinecap="round" />

          <Figure2
            c={{ ...TURIS, expr: turisExpr, look: turisLook, blink: blinkAt(t, 1.3), stride: running ? stride : 0 }}
            x={turisX}
            y={GROUND_Y}
            id="turis-kejar"
            scale={SCALE}
          />

          {t >= 9.6 && (
            <Figure2
              c={{ ...PEREMPUAN, blink: blinkAt(t, 2.1), talk: perempuanTalk }}
              x={perempuanX}
              y={GROUND_Y}
              id="perempuan-kejar"
              scale={SCALE}
            />
          )}


          <Caption t={t} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
