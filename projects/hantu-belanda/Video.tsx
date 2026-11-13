import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { Karakter } from "../_pustaka/Karakter";
import { GedungMalam, GEDUNG_GROUND, Lobi, LOBI_GROUND, Lorong, LORONG_GROUND, Tangga, TANGGA_LANDING, tanggaGround } from "./latar";
import { CAPTIONS, TOTAL } from "./timing";

// Video lengkap "Hantu Lawang Sewu yang Mau Didengar" (v2), mengikuti narasi.wav (vo/make_vo.py).
// Alur: turis + temannya (cewek) datang ke gedung → hantu mengintip dari pintu → kamera menembus
// pintu ke lobi → whip pan ke lorong (pintu terbanting, tawa gagal, hantu melesat, turis kabur) →
// whip pan ke tangga (kejar-kejaran, hantu bercerita). Akhir: turis menyapa dari jauh lalu pergi,
// hantu yang sendirian akhirnya tersenyum.

export const VIDEO_DURATION = Math.round(TOTAL * 30);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const k = (t: number, a: number[], b: number[]) => interpolate(t, a, b, { ...clamp, easing: ease });

// Batas adegan (titik tengah transisi)
const T_LOBI = 7.0; // kamera menembus pintu
const T_LORONG = 17.15; // whip pan
const T_TANGGA = 32.05; // whip pan
const WHIP = 0.22; // setengah durasi whip pan

// ---------------------------------------------------------------------------
// Kamera
// ---------------------------------------------------------------------------
type Cam = { fx: number; fy: number; sx: number; sy: number; s: number };
// sx/sy dijepit supaya latar selalu menutupi layar (tidak ada pinggir kosong).
const safe = (c: Cam): Cam => {
  const s = Math.max(1, c.s);
  const sx = Math.min(Math.max(c.sx, 1080 - (1080 - c.fx) * s), c.fx * s);
  const sy = Math.min(Math.max(c.sy, 1920 - (1920 - c.fy) * s), c.fy * s);
  return { ...c, s, sx, sy };
};
const Camera: React.FC<{ cam: Cam; shake?: number; children: React.ReactNode }> = ({ cam, shake = 0, children }) => {
  const c = safe(cam);
  return (
    <AbsoluteFill style={{ transform: `translate(${c.sx + shake}px, ${c.sy}px) scale(${c.s}) translate(${-c.fx}px, ${-c.fy}px)`, transformOrigin: "0 0" }}>
      {children}
    </AbsoluteFill>
  );
};
const head = (x: number, groundY: number, width: number, headFrac: number) => {
  const h = (width * 315) / 240;
  return { x, y: groundY - (293 / 315) * h + headFrac * h };
};
const HF = { hantu: 0.187, biasa: 0.25, cewek: 0.24 };
const wide = (fx: number, fy: number, s: number): Cam => ({ fx, fy, sx: fx, sy: fy, s });
const close = (p: { x: number; y: number }, s: number, sy = 700): Cam => ({ fx: p.x, fy: p.y, sx: 540, sy, s });

// Jalur kamera: setiap kunci berlaku mulai waktunya; perpindahan antar-kunci meluncur halus.
type Key = { at: number; cam: (t: number) => Cam; glide?: number };
const mix = (a: Cam, b: Cam, p: number): Cam => ({
  fx: a.fx + (b.fx - a.fx) * p,
  fy: a.fy + (b.fy - a.fy) * p,
  sx: a.sx + (b.sx - a.sx) * p,
  sy: a.sy + (b.sy - a.sy) * p,
  s: a.s + (b.s - a.s) * p,
});
const track = (t: number, keys: Key[]): Cam => {
  let i = 0;
  while (i < keys.length - 1 && t >= keys[i + 1].at) i++;
  const cur = keys[i];
  const g = cur.glide ?? 0.4;
  if (i > 0 && t < cur.at + g) {
    const p = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, (t - cur.at) / g)));
    return mix(safe(keys[i - 1].cam(t)), safe(cur.cam(t)), p);
  }
  return cur.cam(t);
};

// ---------------------------------------------------------------------------
// Efek
// ---------------------------------------------------------------------------
const GhostGlow: React.FC<{ x: number; y: number; r: number; opacity?: number; t: number }> = ({ x, y, r, opacity = 1, t }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="aura">
        <stop offset="0" stopColor="#BFF0FF" stopOpacity="0.5" />
        <stop offset="1" stopColor="#BFF0FF" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx={x} cy={y} rx={r * (1 + Math.sin(t * 3) * 0.04)} ry={r * 1.35} fill="url(#aura)" opacity={opacity} />
  </svg>
);
const Vignette: React.FC<{ strength: number }> = ({ strength }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(10,4,6,${strength}) 100%)` }} />
);
const Tint: React.FC<{ color: string; opacity: number }> = ({ color, opacity }) =>
  opacity > 0.001 ? <AbsoluteFill style={{ backgroundColor: color, opacity }} /> : null;

// Caption 1–2 kata, sekitar 70% tinggi layar
const CAPTION_Y = 1350;
const Caption: React.FC<{ t: number }> = ({ t }) => {
  const c = CAPTIONS.find(([, s, e]) => t >= s && t < e);
  if (!c) return null;
  const [text, s] = c;
  const pop = interpolate(t - s, [0, 0.1, 0.2], [0.7, 1.08, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g transform={`translate(540 ${CAPTION_Y}) scale(${pop}) translate(-540 ${-CAPTION_Y})`}>
        <text x={540} y={CAPTION_Y} textAnchor="middle" fontFamily="'Arial Black', 'Segoe UI', sans-serif" fontWeight={900} fontSize={70} fill="#FFFFFF" stroke="#141414" strokeWidth={13} paintOrder="stroke" strokeLinejoin="round">
          {text}
        </text>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------------
// 1. Gedung malam (0–7): turis + teman datang, hantu mengintip dari pintu
// ---------------------------------------------------------------------------
const DOOR = { x: 540, y: 1270 }; // tengah pintu utama
const Gedung: React.FC<{ t: number }> = ({ t }) => {
  const doorOpen = k(t, [0.6, 1.6], [0, 1]);
  // Hantu mengintip di ambang pintu (kecil, jauh), lalu mundur menghilang ke dalam.
  const ghostOp = Math.min(k(t, [1.1, 1.9], [0, 1]), k(t, [4.6, 5.4], [1, 0]));
  const gW = 300;
  const gG = 1400;
  // Turis berjalan dari kanan menuju pintu sambil melihat HP; temannya sedikit di belakang.
  // Berhenti di kanan pintu supaya kamera bisa menembus pintu tanpa terhalang.
  const tx = k(t, [0, 6.0], [1180, 790]);
  const cx = k(t, [0.2, 6.0], [1400, 950]);
  const cam = track(t, [
    { at: 0, cam: (tt) => wide(600, 1300, k(tt, [0, 2.4], [1.0, 1.08])) },
    { at: 2.35, cam: (tt) => close(head(DOOR.x, gG, gW, HF.hantu), k(tt, [2.35, 4.2], [4.0, 4.3])), glide: 0.3 },
    { at: 4.2, cam: (tt) => wide(700, 1320, k(tt, [4.2, 6.2], [1.15, 1.25])), glide: 0.45 },
    // Kamera menembus pintu: makin dekat ke pintu sampai layar gelap.
    { at: 6.2, cam: (tt) => ({ fx: DOOR.x, fy: DOOR.y, sx: 540, sy: 960, s: k(tt, [6.2, 7.0], [1.3, 7]) }), glide: 0.3 },
  ]);
  return (
    <>
      <Camera cam={cam}>
        <GedungMalam t={t} doorOpen={doorOpen} />
        <GhostGlow x={DOOR.x} y={gG - 170} r={130} opacity={ghostOp} t={t} />
        <Karakter outfit="hantu" expression={t < 4.2 ? "fokus" : "ngantuk"} motion="melayang" t={t} x={DOOR.x} groundY={gG} width={gW} opacity={ghostOp} />
        <Karakter outfit="cewek" expression="kaget" pose="idle" motion={t < 6.0 ? "jalan" : "napas"} dir={-1} t={t + 0.4} x={cx} groundY={GEDUNG_GROUND} width={520} />
        <Karakter outfit="biasa" expression="pede" pose="pegang_hp" motion={t < 6.0 ? "jalan" : "napas"} dir={-1} t={t} x={tx} groundY={GEDUNG_GROUND} width={580} />
      </Camera>
      <Vignette strength={t >= 2.35 && t < 4.2 ? 0.55 : 0.4} />
      <Tint color="#FFF8E6" opacity={interpolate(t, [2.4, 2.46, 2.65], [0, 0.6, 0], clamp)} />
      <Tint color="#000000" opacity={k(t, [6.6, 7.0], [0, 1])} />
    </>
  );
};

// ---------------------------------------------------------------------------
// 2. Lobi (7–17.15): masuk lewat pintu kiri, hantu menunggu dekat meja resepsionis
// ---------------------------------------------------------------------------
const LobiScene: React.FC<{ t: number }> = ({ t }) => {
  // Masuk dari pintu oranye di kiri, lalu turis berjalan ke kanan menuju lorong (16.2–).
  const tx = t < 16.2 ? k(t, [7.0, 8.7], [60, 470]) : k(t, [16.2, 17.4], [470, 1250]);
  const cxw = k(t, [7.3, 9.0], [0, 240]);
  const tWalk = t < 8.7 || t >= 16.2;
  const cWalk = t < 9.0;
  const gx = 830;
  const gG = LOBI_GROUND - 40;
  const touristExpr = t >= 9 && t < 12.3 ? "ketawa" : "pede";
  const ghostExpr = t >= 12.3 && t < 14.9 ? "ngantuk" : "seram";
  const cam = track(t, [
    { at: 7.0, cam: (tt) => wide(500, 1250, k(tt, [7, 9], [1.12, 1.06])) },
    { at: 9.0, cam: (tt) => close(head(470, LOBI_GROUND, 600, HF.biasa), k(tt, [9, 12.3], [2.3, 2.45]), 520), glide: 0.35 },
    { at: 12.3, cam: (tt) => close(head(gx, gG, 520, HF.hantu), k(tt, [12.3, 14.9], [2.45, 2.6])), glide: 0.35 },
    { at: 14.9, cam: (tt) => close(head(240, LOBI_GROUND, 520, HF.cewek), k(tt, [14.9, 16.2], [2.2, 2.3]), 620), glide: 0.35 },
    { at: 16.1, cam: (tt) => wide(600, 1250, k(tt, [16.1, 17.4], [1.1, 1.16])), glide: 0.4 },
  ]);
  return (
    <>
      <Camera cam={cam}>
        <Lobi />
        <GhostGlow x={gx} y={gG - 290} r={220} t={t} />
        <Karakter outfit="hantu" expression={ghostExpr} motion="melayang" t={t} x={gx} groundY={gG} width={520} />
        <Karakter outfit="cewek" expression="kaget" pose="idle" motion={cWalk ? "jalan" : "napas"} dir={1} t={t} x={cxw} groundY={LOBI_GROUND} width={520} />
        <Karakter outfit="biasa" expression={touristExpr} pose="pegang_hp" motion={tWalk ? "jalan" : "napas"} dir={1} t={t} x={tx} groundY={LOBI_GROUND} width={600} />
      </Camera>
      <Tint color="#000000" opacity={k(t, [7.0, 7.3], [1, 0])} />
    </>
  );
};

// ---------------------------------------------------------------------------
// 3. Lorong (17.15–32.05): pintu terbanting, tawa gagal, hantu melesat, turis teriak dan kabur
// ---------------------------------------------------------------------------
const SLAMS = [17.6, 18.5, 19.4];
const LorongScene: React.FC<{ t: number }> = ({ t }) => {
  const tx = t < 31.6 ? k(t, [16.9, 18.1], [-200, 560]) : k(t, [31.6, 32.4], [560, 1300]);
  const tWalk = t < 18.1 || t >= 31.6;
  const ghostIn = k(t, [20.3, 21.0], [0, 1]);
  // Hantu melesat mendekat setelah batuk (30.3–30.8): alasan turis berteriak dan kabur.
  const gx = k(t, [30.3, 30.8], [250, 400]);
  const flicker = t >= 17.3 && t < 20.2 && Math.sin(t * 37) * Math.sin(t * 13) > 0.25 ? 0.6 : 0;
  const shake =
    SLAMS.reduce((acc, s) => acc + (t >= s && t < s + 0.35 ? Math.sin((t - s) * 90) * 14 * (1 - (t - s) / 0.35) : 0), 0) +
    (t >= 30.3 && t < 30.7 ? Math.sin((t - 30.3) * 80) * 10 : 0);
  const cough = t >= 25.6 && t < 28 ? Math.abs(Math.sin(t * 16)) * 10 : 0;
  const touristExpr = t < 17.6 ? "pede" : t < 20.3 ? "takut" : t < 28.1 ? "kaget" : t < 30.3 ? "fokus" : "takut";
  const ghostExpr = t < 23.4 ? "seram" : t < 25.6 ? "ketawa" : t < 28.1 ? "ngeden" : t < 30.3 ? "ngantuk" : "kaget";
  const cam = track(t, [
    { at: 16.9, cam: (tt) => wide(560, 1250, k(tt, [16.9, 20.3], [1.2, 1.32])) },
    { at: 20.3, cam: (tt) => wide(480, 1250, k(tt, [20.3, 23.2], [1.06, 1.12])), glide: 0.45 },
    { at: 23.2, cam: (tt) => close(head(250, LORONG_GROUND - cough, 580, HF.hantu), k(tt, [23.2, 28.1], [2.4, 2.6])), glide: 0.35 },
    { at: 28.1, cam: (tt) => wide(460, 1260, k(tt, [28.1, 30.3], [1.18, 1.25])), glide: 0.4 },
    { at: 30.9, cam: (tt) => close(head(560, LORONG_GROUND, 600, HF.biasa), k(tt, [30.9, 31.6], [2.2, 2.5]), 560), glide: 0.25 },
    { at: 31.6, cam: () => wide(700, 1250, 1.12), glide: 0.3 },
  ]);
  return (
    <>
      <Camera cam={cam} shake={shake}>
        <Lorong scroll={0} />
        {ghostIn > 0 && <GhostGlow x={gx} y={LORONG_GROUND - 330} r={240} opacity={ghostIn} t={t} />}
        {ghostIn > 0 && (
          <Karakter outfit="hantu" expression={ghostExpr} pose={t >= 23.4 && t < 25.6 ? "kepal_marah" : "idle"} motion={t >= 30.3 ? "terbang" : "melayang"} dir={1} t={t} x={gx} groundY={LORONG_GROUND - cough} width={580} opacity={ghostIn} />
        )}
        <Karakter outfit="biasa" expression={touristExpr} pose={t >= 31.6 ? "idle" : "pegang_hp"} motion={tWalk ? "jalan" : "napas"} dir={1} t={t >= 31.6 ? t * 2 : t} x={tx} groundY={LORONG_GROUND} width={600} />
      </Camera>
      <Tint color="#0A0406" opacity={flicker} />
      <Vignette strength={0.35} />
    </>
  );
};

// ---------------------------------------------------------------------------
// 4. Tangga (32.05–56.5): kejar-kejaran, teman menyusul, hantu bercerita.
// Akhir: turis tetap menjaga jarak, melambai menyapa dari bordes, lalu pergi bersama temannya.
// Hantu yang tinggal sendirian akhirnya tersenyum karena ada yang menyapa.
// ---------------------------------------------------------------------------
const TanggaScene: React.FC<{ t: number }> = ({ t }) => {
  const tx = t < 36.0 ? k(t, [31.9, 36.0], [200, 720]) : t < 50.6 ? 720 : k(t, [50.6, 53.6], [720, 1300]);
  const running = t < 36.0;
  const leaving = t >= 50.6;
  const waving = t >= 48.0 && t < 50.6;
  const tg = tx >= 636 ? TANGGA_LANDING : tanggaGround(tx);
  // Hantu terbang masuk dari kiri (terlihat saat "Tunggu!" di 33.0 dtk), lalu tetap melayang di tangga.
  const gx = t < 35.7 ? k(t, [32.2, 35.7], [-20, 360]) : 360;
  const gg = tanggaGround(Math.max(0, gx)) - 70 + (t >= 38 ? k(t, [38, 40.4], [0, 40]) : 0);
  // Teman (cewek) menyusul dari kanan bawah, lalu pergi bersama turis.
  const cx = t < 50.8 ? k(t, [35.2, 36.0], [1250, 930]) : k(t, [50.8, 53.8], [930, 1400]);
  const cWalk = (t >= 35.2 && t < 36.0) || t >= 50.8;
  const touristExpr = t < 38 ? "takut" : t < 48 ? "kaget" : "kalem";
  // Hantu: sedih saat bercerita, kaget ketika disapa, lalu tersenyum.
  const ghostExpr = t < 48.4 ? "seram" : t < 49.3 ? "kaget" : "kalem";
  const follow = (x: number) => Math.min(700, Math.max(300, x));
  const ghostHead = head(gx, gg, 560, HF.hantu);
  const cam = track(t, [
    { at: 31.9, cam: () => wide(follow(tx), (tx >= 636 ? TANGGA_LANDING : tanggaGround(tx)) - 260, 1.3) },
    { at: 33.0, cam: () => wide(follow((tx + Math.max(0, gx)) / 2), 1150, 1.08), glide: 0.5 },
    { at: 35.7, cam: (tt) => wide(760, 1250, k(tt, [35.7, 38], [1.18, 1.24])), glide: 0.4 },
    { at: 38.0, cam: (tt) => wide(560, 1230, k(tt, [38, 40.4], [1.12, 1.18])), glide: 0.4 },
    { at: 40.4, cam: (tt) => close(ghostHead, k(tt, [40.4, 45.6], [2.4, 2.6])), glide: 0.4 },
    { at: 45.6, cam: (tt) => wide(600, 1250, k(tt, [45.6, 48], [1.12, 1.16])), glide: 0.5 },
    { at: 48.0, cam: (tt) => close(head(720, TANGGA_LANDING, 560, HF.biasa), k(tt, [48, 50.4], [1.45, 1.52]), 760), glide: 0.4 },
    // Penutup: turis pergi, kamera pelan mendekat ke hantu yang kini tersenyum sendirian.
    { at: 50.4, cam: (tt) => close(ghostHead, k(tt, [50.4, 56.5], [1.3, 2.2]), 820), glide: 0.6 },
  ]);
  return (
    <>
      <Camera cam={cam}>
        <Tangga />
        <GhostGlow x={gx} y={gg - 300} r={230} t={t} />
        <Karakter outfit="hantu" expression={ghostExpr} motion={t < 35.7 ? "terbang" : "melayang"} dir={1} t={t} x={gx} groundY={gg} width={560} />
        {t >= 35.2 && (
          <Karakter outfit="cewek" expression={t < 48 ? "kaget" : "kalem"} pose="idle" motion={cWalk ? "jalan" : "napas"} dir={t >= 50.8 ? 1 : -1} t={t} x={cx} groundY={TANGGA_LANDING} width={520} />
        )}
        <Karakter
          outfit="biasa"
          expression={touristExpr}
          pose={running ? "idle" : waving ? "tunjuk_jelaskan" : "pegang_hp"}
          motion={running || leaving ? "jalan" : "napas"}
          dir={1}
          t={running ? t * 2 : t}
          x={tx}
          groundY={tg}
          width={560}
        />
      </Camera>
      <Vignette strength={t >= 40.4 && t < 45.6 ? 0.5 : 0.3} />
      <Tint color="#000000" opacity={interpolate(t, [55.7, 56.5], [0, 1], clamp)} />
    </>
  );
};

// ---------------------------------------------------------------------------
// Whip pan: adegan lama tersapu ke kiri, adegan baru masuk dari kanan, dengan blur gerak.
// ---------------------------------------------------------------------------
const Whip: React.FC<{ t: number; at: number; from: React.ReactNode; to: React.ReactNode }> = ({ t, at, from, to }) => {
  const p = Easing.inOut(Easing.quad)(Math.min(1, Math.max(0, (t - (at - WHIP)) / (2 * WHIP))));
  const blur = Math.sin(p * Math.PI) * 18;
  return (
    <>
      <AbsoluteFill style={{ transform: `translateX(${-p * 1080}px)`, filter: `blur(${blur}px)` }}>{from}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${(1 - p) * 1080}px)`, filter: `blur(${blur}px)` }}>{to}</AbsoluteFill>
    </>
  );
};

const Scene: React.FC<{ t: number }> = ({ t }) => {
  if (t < T_LOBI) return <Gedung t={t} />;
  if (Math.abs(t - T_LORONG) < WHIP) return <Whip t={t} at={T_LORONG} from={<LobiScene t={t} />} to={<LorongScene t={t} />} />;
  if (t < T_LORONG) return <LobiScene t={t} />;
  if (Math.abs(t - T_TANGGA) < WHIP) return <Whip t={t} at={T_TANGGA} from={<LorongScene t={t} />} to={<TanggaScene t={t} />} />;
  if (t < T_TANGGA) return <LorongScene t={t} />;
  return <TanggaScene t={t} />;
};

// ---------------------------------------------------------------------------
// Suara: narasi + suara seram
// ---------------------------------------------------------------------------
const pub = (f: string) => staticFile(`hantu-belanda/${f}`);
const F = (sec: number) => Math.round(sec * 30);
const Sfx: React.FC<{ at: number; file: string; len: number; vol: number }> = ({ at, file, len, vol }) => (
  <Sequence from={F(at)} durationInFrames={F(len)}>
    <Audio src={pub(`sfx/${file}`)} volume={vol} />
  </Sequence>
);
const Drone: React.FC<{ from: number; to: number; vol: number }> = ({ from, to, vol }) => (
  <Sequence from={F(from)} durationInFrames={F(to - from)}>
    <Audio src={pub("sfx/dengung-panjang.wav")} trimBefore={F(from)} volume={vol} />
  </Sequence>
);
const Suara: React.FC = () => (
  <>
    <Audio src={pub("narasi.wav")} volume={1} />
    <Drone from={0} to={T_LOBI} vol={0.8} />
    <Drone from={T_LOBI} to={T_LORONG} vol={0.3} />
    <Drone from={T_LORONG} to={T_TANGGA} vol={0.6} />
    <Drone from={T_TANGGA} to={TOTAL} vol={0.45} />
    <Sfx at={0.6} file="derit-pintu.wav" len={1.5} vol={0.8} />
    <Sfx at={1.2} file="whoosh.wav" len={1.4} vol={0.45} />
    <Sfx at={2.35} file="sting.wav" len={2.4} vol={0.75} />
    <Sfx at={6.3} file="whoosh.wav" len={1.4} vol={0.7} />
    <Sfx at={T_LORONG - 0.3} file="whoosh.wav" len={1.4} vol={0.6} />
    <Sfx at={17.3} file="lampu-kedip.wav" len={3} vol={0.8} />
    {SLAMS.map((s) => <Sfx key={s} at={s} file="pintu-banting.wav" len={0.9} vol={0.75} />)}
    <Sfx at={30.3} file="whoosh.wav" len={1.4} vol={0.85} />
    <Sfx at={30.3} file="sting.wav" len={2.4} vol={0.4} />
    <Sfx at={T_TANGGA - 0.3} file="whoosh.wav" len={1.4} vol={0.6} />
    <Sfx at={32.6} file="whoosh.wav" len={1.4} vol={0.75} />
    <Sfx at={40.4} file="sting.wav" len={2.4} vol={0.3} />
  </>
);

export const Video: React.FC = () => {
  const t = useCurrentFrame() / 30;
  return (
    <AbsoluteFill style={{ backgroundColor: "#24161B", overflow: "hidden" }}>
      <Scene t={t} />
      <Caption t={t} />
      <Suara />
    </AbsoluteFill>
  );
};
