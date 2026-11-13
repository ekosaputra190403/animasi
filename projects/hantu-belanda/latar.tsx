import React from "react";

// Empat latar video Hantu Lawang Sewu, digambar ulang dari gambar referensi pemilik
// (gaya vektor datar). Semua 1080 x 1920. Setiap latar mengekspor garis lantainya.

const INK = "#2A2024";
const W = 1080;
const H = 1920;

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
    {children}
  </svg>
);

// ---------------------------------------------------------------------------
// 1. Gedung kolonial dari depan, malam hari (ref: gedung putih-kuning, atap oranye)
// ---------------------------------------------------------------------------
export const GEDUNG_GROUND = 1600;

const Arcade: React.FC<{ x: number; y: number; n: number; w: number; h: number; lit: number[] }> = ({ x, y, n, w, h, lit }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const ax = x + i * w;
      const on = lit.includes(i);
      return (
        <g key={i}>
          <path
            d={`M ${ax + 8} ${y + h} L ${ax + 8} ${y + w * 0.45} A ${w / 2 - 8} ${w / 2 - 8} 0 0 1 ${ax + w - 8} ${y + w * 0.45} L ${ax + w - 8} ${y + h} Z`}
            fill={on ? "#FFC46B" : "#3B2A2C"}
            stroke={INK}
            strokeWidth={4}
          />
          {on && <rect x={ax + 8} y={y + h - 16} width={w - 16} height={16} fill="#E8A24A" />}
          <rect x={ax} y={y + h - 4} width={w} height={8} fill="#E9E2D6" stroke={INK} strokeWidth={3} />
        </g>
      );
    })}
  </g>
);

export const GedungMalam: React.FC<{ t?: number; doorOpen?: number }> = ({ t = 0, doorOpen = 1 }) => {
  const flicker = 0.85 + Math.sin(t * 7) * 0.05;
  return (
    <Frame>
      <defs>
        <linearGradient id="skyMalam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24161B" />
          <stop offset="1" stopColor="#5C2F25" />
        </linearGradient>
        <radialGradient id="bulan" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#F7E9C4" stopOpacity="0.35" />
          <stop offset="1" stopColor="#F7E9C4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lampuJalan" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD58A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFD58A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#skyMalam)" />
      {/* bulan + bintang */}
      <circle cx={850} cy={250} r={150} fill="url(#bulan)" />
      <circle cx={850} cy={250} r={68} fill="#F7E9C4" />
      {[[120, 180], [260, 320], [430, 140], [620, 260], [980, 420], [80, 470], [700, 90]].map(([sx, sy], i) => (
        <circle key={i} cx={sx} cy={sy} r={i % 2 ? 3 : 4} fill="#F7E9C4" opacity={0.7} />
      ))}

      {/* sayap kiri & kanan */}
      <rect x={-40} y={820} width={1160} height={640} fill="#D8D1C4" stroke={INK} strokeWidth={5} />
      <rect x={-40} y={1380} width={1160} height={80} fill="#C9A443" stroke={INK} strokeWidth={5} />
      <rect x={-40} y={790} width={1160} height={34} fill="#D9733A" stroke={INK} strokeWidth={5} />
      <Arcade x={-20} y={880} n={4} w={100} h={220} lit={[1]} />
      <Arcade x={720} y={880} n={4} w={100} h={220} lit={[2]} />
      <Arcade x={-20} y={1130} n={4} w={100} h={230} lit={[3]} />
      <Arcade x={720} y={1130} n={4} w={100} h={230} lit={[0]} />
      {/* kubah kecil di ujung */}
      {[60, 1020].map((dx) => (
        <g key={dx}>
          <rect x={dx - 46} y={740} width={92} height={60} fill="#E9E2D6" stroke={INK} strokeWidth={4} />
          <path d={`M ${dx - 52} 742 Q ${dx} 660 ${dx + 52} 742 Z`} fill="#EFEAE0" stroke={INK} strokeWidth={4} />
          <rect x={dx - 4} y={640} width={8} height={26} fill={INK} />
        </g>
      ))}

      {/* paviliun tengah */}
      <rect x={340} y={700} width={400} height={760} fill="#E6E0D4" stroke={INK} strokeWidth={5} />
      <path d="M 300 700 L 540 560 L 780 700 Z" fill="#E6E0D4" stroke={INK} strokeWidth={5} />
      <path d="M 360 700 L 540 600 L 720 700 Z" fill="#E9C85A" stroke={INK} strokeWidth={4} />
      <circle cx={540} cy={660} r={22} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
      {/* atap oranye */}
      <path d="M 380 560 L 420 430 L 660 430 L 700 560 Z" fill="#E07B3C" stroke={INK} strokeWidth={5} />
      <rect x={420} y={420} width={240} height={16} fill="#B95A26" stroke={INK} strokeWidth={4} />
      <line x1={540} y1={420} x2={540} y2={340} stroke={INK} strokeWidth={6} />
      <path d="M 540 342 L 584 356 L 540 370 Z" fill="#C0392B" stroke={INK} strokeWidth={3} />
      {/* kolom paviliun + jendela lengkung */}
      {[370, 450, 630, 710].map((cx) => (
        <rect key={cx} x={cx - 12} y={730} width={24} height={650} fill="#F1ECE3" stroke={INK} strokeWidth={4} />
      ))}
      <Arcade x={386} y={760} n={1} w={60} h={160} lit={[0]} />
      <Arcade x={634} y={760} n={1} w={60} h={160} lit={[]} />
      {/* pintu utama: daun pintu terbuka sebagian, cahaya kuning dari dalam */}
      <path d="M 470 1380 L 470 1150 A 70 70 0 0 1 610 1150 L 610 1380 Z" fill="#1B1013" stroke={INK} strokeWidth={5} />
      <path d={`M 470 1380 L 470 1150 A 70 70 0 0 1 610 1150 L 610 1380 Z`} fill="#FFC46B" opacity={0.35 * doorOpen * flicker} />
      <path d={`M 470 1150 L ${470 + 64 * (1 - doorOpen * 0.7)} 1160 L ${470 + 64 * (1 - doorOpen * 0.7)} 1380 L 470 1380 Z`} fill="#6D3B2A" stroke={INK} strokeWidth={4} />
      <path d={`M 610 1150 L ${610 - 64 * (1 - doorOpen * 0.7)} 1160 L ${610 - 64 * (1 - doorOpen * 0.7)} 1380 L 610 1380 Z`} fill="#6D3B2A" stroke={INK} strokeWidth={4} />
      {/* tangga depan + pelataran */}
      <path d="M 300 1460 L 780 1460 L 860 1540 L 220 1540 Z" fill="#CFC6B6" stroke={INK} strokeWidth={4} />
      <line x1={260} y1={1500} x2={820} y2={1500} stroke="#A89E8C" strokeWidth={4} />
      <rect x={0} y={1540} width={W} height={H - 1540} fill="#5E3F32" />
      <path d={`M 0 1540 L ${W} 1540`} stroke={INK} strokeWidth={5} />
      {[1640, 1760, 1880].map((ly) => (
        <line key={ly} x1={0} y1={ly} x2={W} y2={ly} stroke="#4E3328" strokeWidth={4} />
      ))}
      {/* tiang lampu taman */}
      {[110, 970].map((lx) => (
        <g key={lx}>
          <circle cx={lx} cy={1210} r={110 * flicker} fill="url(#lampuJalan)" />
          <rect x={lx - 6} y={1220} width={12} height={330} fill={INK} />
          <rect x={lx - 22} y={1180} width={44} height={46} rx={6} fill="#FFD58A" stroke={INK} strokeWidth={4} />
        </g>
      ))}
    </Frame>
  );
};

// ---------------------------------------------------------------------------
// 2. Lobi dalam gedung (ref: meja resepsionis oranye, lantai kotak kuning, bangku hitam)
// ---------------------------------------------------------------------------
export const LOBI_GROUND = 1640;

const CheckerFloor: React.FC<{ top: number; a: string; b: string; line: string }> = ({ top, a, b, line }) => {
  // Lantai kotak-kotak dengan perspektif sederhana ke titik hilang di atas lantai.
  const vp = { x: 540, y: top - 700 };
  const rows = [0, 70, 160, 270, 400, 560, 760];
  const cols = Array.from({ length: 15 }, (_, i) => -2100 + i * 300);
  const px = (cx: number, y: number) => vp.x + (cx - vp.x) * ((y - vp.y) / (H - vp.y));
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < rows.length - 1; r++) {
    const y1 = top + rows[r];
    const y2 = top + rows[r + 1];
    for (let c = 0; c < cols.length - 1; c++) {
      const pts = [
        [px(cols[c], y1), y1],
        [px(cols[c + 1], y1), y1],
        [px(cols[c + 1], y2), y2],
        [px(cols[c], y2), y2],
      ];
      cells.push(<polygon key={`${r}-${c}`} points={pts.map((p) => p.join(",")).join(" ")} fill={(r + c) % 2 ? a : b} stroke={line} strokeWidth={2} />);
    }
  }
  return <g>{cells}</g>;
};

export const Lobi: React.FC = () => (
  <Frame>
    <rect width={W} height={H} fill="#D9D5CE" />
    {/* plafon + lampu panel */}
    <rect x={0} y={0} width={W} height={150} fill="#ECEAE6" />
    <rect x={560} y={70} width={420} height={30} rx={4} fill="#FFFFFF" stroke="#B9B4AC" strokeWidth={3} />
    <line x1={0} y1={150} x2={W} y2={150} stroke="#B9B4AC" strokeWidth={4} />
    {/* dinding kanan bermotif */}
    <rect x={720} y={150} width={360} height={1090} fill="#CFCBC4" />
    {Array.from({ length: 30 }, (_, i) => (
      <path key={i} d={`M ${760 + (i % 5) * 64} ${210 + Math.floor(i / 5) * 150} l 8 -16 l 8 16 z`} fill="#BDB8AF" />
    ))}
    {/* pintu oranye + AC + tanaman di kiri */}
    <rect x={20} y={760} width={130} height={480} fill="#D9733A" stroke={INK} strokeWidth={4} />
    <circle cx={128} cy={1010} r={7} fill={INK} />
    <rect x={40} y={400} width={170} height={56} rx={8} fill="#F4F4F2" stroke={INK} strokeWidth={4} />
    <line x1={56} y1={440} x2={194} y2={440} stroke="#B9B4AC" strokeWidth={3} />
    {/* meja resepsionis: panel oranye bergaris + papan putih + tanda merah */}
    <rect x={190} y={430} width={420} height={810} fill="#D9733A" stroke={INK} strokeWidth={5} />
    {Array.from({ length: 9 }, (_, i) => (
      <line key={i} x1={215 + i * 46} y1={430} x2={215 + i * 46} y2={1240} stroke="#B95A26" strokeWidth={6} />
    ))}
    <rect x={250} y={540} width={300} height={210} fill="#FAFAF8" stroke={INK} strokeWidth={5} />
    <line x1={360} y1={430} x2={360} y2={500} stroke={INK} strokeWidth={4} />
    <line x1={440} y1={430} x2={440} y2={500} stroke={INK} strokeWidth={4} />
    <rect x={330} y={496} width={140} height={58} rx={6} fill="#C0392B" stroke={INK} strokeWidth={4} />
    <rect x={350} y={512} width={100} height={26} rx={3} fill="#FFFFFF" />
    <rect x={170} y={1000} width={470} height={26} fill="#F2E6B4" stroke={INK} strokeWidth={4} />
    <rect x={180} y={1026} width={450} height={214} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
    <rect x={210} y={1050} width={150} height={160} fill="#F4D35E" stroke={INK} strokeWidth={3} />
    <rect x={390} y={1050} width={210} height={160} fill="#7BC67B" stroke={INK} strokeWidth={3} />
    {/* sekat meja kanan dengan monitor */}
    <rect x={660} y={1080} width={420} height={160} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
    {[700, 840, 980].map((mx) => (
      <g key={mx}>
        <rect x={mx} y={1100} width={90} height={120} fill="#E84A5F" opacity={0.85} stroke={INK} strokeWidth={3} />
        <rect x={mx + 4} y={1010} width={80} height={56} fill="#7FD3F2" stroke={INK} strokeWidth={4} />
        <rect x={mx + 38} y={1066} width={10} height={16} fill={INK} />
      </g>
    ))}
    {/* lantai kotak kuning */}
    <rect x={0} y={1240} width={W} height={H - 1240} fill="#E6D873" />
    <CheckerFloor top={1240} a="#E9DC7A" b="#D2C257" line="#C2B24C" />
    <line x1={0} y1={1240} x2={W} y2={1240} stroke={INK} strokeWidth={5} />
    {/* bangku tunggu hitam di belakang */}
    <rect x={720} y={1290} width={330} height={120} rx={14} fill="#2E2E33" stroke={INK} strokeWidth={4} />
    <rect x={720} y={1400} width={330} height={30} rx={8} fill="#3B3B42" stroke={INK} strokeWidth={4} />
    {[740, 1020].map((bx) => (
      <rect key={bx} x={bx} y={1430} width={14} height={60} fill={INK} />
    ))}
    {/* tanaman pot */}
    <path d="M 60 1310 L 140 1310 L 128 1400 L 72 1400 Z" fill="#7FB8C9" stroke={INK} strokeWidth={4} />
    {[-30, -10, 10, 30].map((a, i) => (
      <path key={i} d={`M 100 1310 Q ${100 + a * 2} 1220 ${100 + a * 3.2} 1150`} stroke="#3E8E4A" strokeWidth={9} fill="none" strokeLinecap="round" />
    ))}
  </Frame>
);

// ---------------------------------------------------------------------------
// 3. Lorong dengan banyak pintu, tampak samping (ref: pintu marun, dinding peach, lampu plafon)
// ---------------------------------------------------------------------------
export const LORONG_GROUND = 1600;

export const Lorong: React.FC<{ scroll?: number }> = ({ scroll = 0 }) => {
  const wrap = (v: number) => ((v % 1500) + 1500) % 1500 - 210;
  const idx = [0, 1, 2, 3, 4];
  return (
    <Frame>
      <defs>
        <linearGradient id="cahayaLampu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF3C9" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFF3C9" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* plafon kuning + dinding peach */}
      <rect width={W} height={H} fill="#EFC39B" />
      <rect x={0} y={0} width={W} height={300} fill="#F6D06A" />
      <line x1={0} y1={300} x2={W} y2={300} stroke="#C98F4A" strokeWidth={6} />
      {/* lampu plafon + sorot cahaya lembut ke dinding (sumbernya terlihat) */}
      {idx.map((i) => {
        const lx = wrap(i * 300 - scroll) + 60;
        return (
          <g key={`l${i}`}>
            <path d={`M ${lx - 40} 300 L ${lx + 220} 300 L ${lx + 300} 1400 L ${lx - 120} 1400 Z`} fill="url(#cahayaLampu)" opacity={0.55} />
            <rect x={lx - 10} y={190} width={200} height={22} rx={4} fill="#7A2E36" stroke={INK} strokeWidth={4} />
            <line x1={lx + 20} y1={150} x2={lx + 20} y2={190} stroke={INK} strokeWidth={4} />
            <line x1={lx + 160} y1={150} x2={lx + 160} y2={190} stroke={INK} strokeWidth={4} />
          </g>
        );
      })}
      {/* bingkai foto + pintu bergantian */}
      {idx.map((i) => {
        const dx = wrap(i * 300 - scroll);
        const isDoor = i % 2 === 0;
        return isDoor ? (
          <g key={`d${i}`}>
            <rect x={dx - 14} y={790} width={208} height={620} fill="#6E2430" stroke={INK} strokeWidth={5} />
            <rect x={dx} y={806} width={180} height={604} fill="#8E2E3A" stroke={INK} strokeWidth={4} />
            <rect x={dx + 20} y={830} width={140} height={230} fill="#7E2833" />
            <rect x={dx + 54} y={870} width={72} height={36} rx={4} fill="#F4EEE8" stroke={INK} strokeWidth={3} />
            <circle cx={dx + 156} cy={1130} r={10} fill="#E8B64A" stroke={INK} strokeWidth={3} />
          </g>
        ) : (
          <g key={`f${i}`}>
            <rect x={dx + 10} y={560} width={150} height={300} fill="#8E2E3A" stroke={INK} strokeWidth={5} />
            <rect x={dx + 26} y={576} width={118} height={268} fill="#F6C2B4" />
            <rect x={dx + 46} y={600} width={78} height={150} fill="#F08C8C" />
          </g>
        );
      })}
      {/* plint + lantai tegel abu dengan pantulan pink */}
      <rect x={0} y={1410} width={W} height={34} fill="#8A3B3F" stroke={INK} strokeWidth={4} />
      <rect x={0} y={1444} width={W} height={H - 1444} fill="#B6ADB4" />
      {[1520, 1630, 1770].map((ly) => (
        <line key={ly} x1={0} y1={ly} x2={W} y2={ly} stroke="#A2989F" strokeWidth={4} />
      ))}
      {Array.from({ length: 8 }, (_, i) => {
        const tx = (((i * 180 - scroll * 1.2) % 1440) + 1440) % 1440 - 180;
        return <line key={i} x1={tx} y1={1444} x2={tx - 80} y2={H} stroke="#A2989F" strokeWidth={4} />;
      })}
      {idx.map((i) => {
        const dx = wrap(i * 300 - scroll);
        return i % 2 === 0 ? <rect key={`r${i}`} x={dx + 10} y={1460} width={160} height={90} fill="#C98A96" opacity={0.35} /> : null;
      })}
    </Frame>
  );
};

// ---------------------------------------------------------------------------
// 4. Tangga tampak samping (ref: anak tangga hijau, pegangan hitam, dinding putih)
// ---------------------------------------------------------------------------
export const TANGGA_LANDING = 1480; // lantai bordes (kanan bawah)
const STEP_RUN = 106;
const STEP_RISE = 84;
const STEP_TOP = 976; // permukaan anak tangga pertama
const STEPS = 6;
// Tinggi permukaan tangga pada posisi x (untuk menaruh kaki karakter)
export const tanggaGround = (x: number) => {
  if (x >= STEPS * STEP_RUN) return TANGGA_LANDING;
  const i = Math.max(0, Math.floor(x / STEP_RUN));
  return STEP_TOP + i * STEP_RISE;
};

export const Tangga: React.FC = () => (
  <Frame>
    <rect width={W} height={H} fill="#EEF0EF" />
    {/* bayangan dinding + kisi ventilasi + AC */}
    <rect x={0} y={0} width={W} height={160} fill="#E2E5E4" />
    <rect x={130} y={330} width={240} height={130} fill="#DCDFDE" stroke="#8C9290" strokeWidth={4} />
    {Array.from({ length: 6 }, (_, i) => (
      <line key={i} x1={145} y1={350 + i * 18} x2={355} y2={350 + i * 18} stroke="#8C9290" strokeWidth={4} />
    ))}
    <rect x={930} y={760} width={170} height={360} rx={8} fill="#F6F7F6" stroke="#8C9290" strokeWidth={5} />
    {Array.from({ length: 9 }, (_, i) => (
      <line key={i} x1={950} y1={790 + i * 34} x2={1080} y2={790 + i * 34} stroke="#B5BAB8" strokeWidth={4} />
    ))}
    {/* lantai atas (kiri) */}
    <rect x={-20} y={STEP_TOP - 30} width={20} height={30} fill="#2E6F60" />
    {/* anak tangga turun ke kanan */}
    {Array.from({ length: STEPS }, (_, i) => {
      const x = i * STEP_RUN;
      const y = STEP_TOP + i * STEP_RISE;
      return (
        <g key={i}>
          <rect x={x} y={y} width={STEP_RUN + 2} height={H - y} fill="#E3E7E6" />
          <rect x={x} y={y} width={STEP_RUN + 2} height={STEP_RISE} fill="#3D8F7B" stroke={INK} strokeWidth={3} />
          <rect x={x} y={y} width={STEP_RUN + 2} height={12} fill="#2F7F6C" />
          <line x1={x} y1={y + 2} x2={x + STEP_RUN} y2={y + 2} stroke="#F1F4F3" strokeWidth={5} />
        </g>
      );
    })}
    {/* bordes (lantai bawah) */}
    <rect x={STEPS * STEP_RUN} y={TANGGA_LANDING} width={W} height={H - TANGGA_LANDING} fill="#2E6F60" />
    <line x1={STEPS * STEP_RUN} y1={TANGGA_LANDING + 2} x2={W} y2={TANGGA_LANDING + 2} stroke="#F1F4F3" strokeWidth={5} />
    <rect x={0} y={TANGGA_LANDING + 60} width={W} height={H} fill="#2A6457" opacity={0.6} />
    {/* pegangan tangga hitam mengikuti kemiringan */}
    {Array.from({ length: STEPS + 1 }, (_, i) => {
      const px = Math.min(i, STEPS - 0.5) * STEP_RUN + 52;
      const py = STEP_TOP + Math.min(i, STEPS - 1) * STEP_RISE;
      return <rect key={i} x={px - 5} y={py - 300} width={10} height={300} fill="#1C1C1E" />;
    })}
    <line x1={20} y1={STEP_TOP - 300} x2={STEPS * STEP_RUN + 40} y2={STEP_TOP + (STEPS - 1) * STEP_RISE - 300} stroke="#1C1C1E" strokeWidth={14} strokeLinecap="round" />
    <line x1={20} y1={STEP_TOP - 160} x2={STEPS * STEP_RUN + 40} y2={STEP_TOP + (STEPS - 1) * STEP_RISE - 160} stroke="#1C1C1E" strokeWidth={6} />
    <line x1={STEPS * STEP_RUN + 40} y1={STEP_TOP + (STEPS - 1) * STEP_RISE - 300} x2={W} y2={STEP_TOP + (STEPS - 1) * STEP_RISE - 300} stroke="#1C1C1E" strokeWidth={14} />
  </Frame>
);
