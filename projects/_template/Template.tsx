import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Figure2, Char } from "../hantu-belanda/figure2";
import { INK } from "../_pustaka/figure-tetangga";
import { SCENE } from "./scene.config";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";

// Template adegan. Jangan edit file ini untuk video baru: isi scene.config.ts saja.

const FPS = 30;
const FONT = "'Segoe UI', Arial, sans-serif";
const ease = Easing.inOut(Easing.cubic);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Preset bentuk badan. Tambah tipe baru di sini kalau butuh karakter lain.
const PRESET: Record<string, Omit<Char, "expr" | "stride" | "handL" | "handR">> = {
  utama: {
    color: "#F3F6FA", accent: "#1F3A5F", hair: "topi", hairColor: "#2A2A33", detail: "jas",
    headR: 62, torsoW: 150, torsoH: 220, hipY: 250, legBend: [-16, 18], stance: 58, tie: true, belt: true,
  },
  kedua: {
    color: "#F4E3B2", accent: "#2F7F76", hair: "pendek", hairColor: "#3A2A2E", detail: "kaus",
    headR: 66, torsoW: 132, torsoH: 200, hipY: 200, legBend: [14, -6], stance: 52, bag: true,
  },
};

const Room: React.FC<{ t: number }> = ({ t }) => {
  // Dinding dan lantai datar. Garis lantai = groundY supaya kaki selalu menapak.
  const g = SCENE.groundY;
  return (
    <g>
      <rect x={-200} y={-200} width={1500} height={g + 200} fill={SCENE.wallColor} />
      <rect x={-200} y={g - 22} width={1500} height={26} fill="#261E17" />
      <rect x={-200} y={g + 4} width={1500} height={900} fill={SCENE.floorColor} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={120 + i * 240} y={260} width={170} height={420} rx={12} fill="#2B3840" stroke={INK} strokeWidth={8} />
      ))}
      <text x={-10} y={-10} fontSize={1} fill="none">{t}</text>
    </g>
  );
};

// Kamera: interpolasi zoom dan geser antar shot. Tidak pernah diam.
const cameraAt = (t: number) => {
  const s = SCENE.shots;
  const times = s.map((x) => x.at);
  const zoom = interpolate(t, times, s.map((x) => x.zoom), { ...clamp, easing: ease });
  const dx = interpolate(t, times, s.map((x) => x.dx), { ...clamp, easing: ease });
  // Dorongan kecil terus-menerus agar kamera tidak pernah diam.
  const drift = Math.sin(t * 0.8) * 6;
  return { zoom, dx: dx + drift };
};

const Captions: React.FC<{ t: number }> = ({ t }) => {
  const line = SCENE.captions.find((l) => t >= l.start && t < l.end);
  if (!line) return null;
  const count = Math.min(line.words.length, Math.floor((t - line.start) / 0.3) + 1);
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
      {line.words.slice(0, count).join(" ")}
    </text>
  );
};


// Kamera diatur langsung: posisi dari shot, dan selalu menghadap lurus ke depan.
const CameraRig: React.FC<{ x: number; z: number }> = ({ x, z }) => {
  const { camera } = useThree();
  camera.position.set(x, 2.4, z);
  camera.lookAt(x, 2.4, -10);
  return null;
};

// Latar 3D sederhana: dinding belakang, lantai, dua kolom, dan satu jendela.
// Kamera menghadap lurus ke depan (tanpa kemiringan), jadi garis lantai di dinding
// jatuh tepat di groundY (1420 px) dan karakter 2D yang ditempel di atasnya menapak.
const Room3D: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = cameraAt(t);
  // Dorongan kamera kecil: maju-mundur dan geser, mengikuti shot.
  const camZ = 7 - (cam.zoom - 1) * 4;
  const camX = cam.dx * 0.01;
  return (
    <ThreeCanvas width={1080} height={1920} flat camera={{ fov: 50, near: 0.1, far: 300 }} gl={{ antialias: true }}>
      <CameraRig x={camX} z={camZ} />
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 6, 6]} intensity={0.6} />
      {/* dinding belakang: alasnya di y = 0 */}
      <mesh position={[0, 5, -4]}>
        <boxGeometry args={[24, 10, 0.2]} />
        <meshStandardMaterial color={SCENE.wallColor} />
      </mesh>
      {/* lantai */}
      <mesh position={[0, -0.05, 4]}>
        <boxGeometry args={[24, 0.1, 18]} />
        <meshStandardMaterial color={SCENE.floorColor} />
      </mesh>
      {/* kolom */}
      {[-3.2, 3.2].map((x) => (
        <mesh key={x} position={[x, 5, -3.6]}>
          <boxGeometry args={[0.6, 10, 0.6]} />
          <meshStandardMaterial color="#57504A" />
        </mesh>
      ))}
      {/* jendela: cahaya dari luar, tampak sebagai bidang terang di dinding */}
      <mesh position={[-1.2, 2.8, -3.88]}>
        <boxGeometry args={[1.6, 2.6, 0.05]} />
        <meshStandardMaterial color="#CFE3EE" emissive="#9FBFD0" emissiveIntensity={0.6} />
      </mesh>
    </ThreeCanvas>
  );
};

export const Template: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = cameraAt(t);

  return (
    <AbsoluteFill style={{ backgroundColor: "#24211E" }}>
      {SCENE.background === "3d" && (
        <AbsoluteFill>
          <Room3D />
        </AbsoluteFill>
      )}
      <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(540 ${SCENE.groundY}) scale(${cam.zoom}) translate(-540 ${-SCENE.groundY}) translate(${cam.dx} 0)`}>
          {SCENE.background === "ruangan" && <Room t={t} />}
          {SCENE.characters.map((c) => {
            if (t < c.from || t > c.to) return null;
            const walking = c.gerak === "jalan" && t < c.to;
            const phase = walking ? Math.sin(t * 14) : 0;
            const char: Char = {
              ...PRESET[c.tipe],
              expr: c.expr as Char["expr"],
              stride: phase,
              handL: [-18, 150],
              handR: [22, 120],
            };
            return <Figure2 key={c.id} c={char} x={c.x} y={SCENE.groundY} id={`tpl-${c.id}`} scale={1.8} />;
          })}
        </g>
        <Captions t={t} />
      </svg>
    </AbsoluteFill>
  );
};

export const TEMPLATE_DURATION = Math.round(SCENE.durationSec * FPS);
