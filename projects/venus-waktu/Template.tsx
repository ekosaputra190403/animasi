import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { CanvasTexture, SRGBColorSpace } from "three";
import { Karakter } from "../_pustaka/Karakter";
import { Caption } from "./Caption";
import { SCENE } from "./scene.config";

const FPS = SCENE.fps;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);

const cameraAt = (t: number) => ({
  zoom: interpolate(t, SCENE.shots.map((shot) => shot.at), SCENE.shots.map((shot) => shot.zoom), {
    ...clamp,
    easing: ease,
  }),
  dx: interpolate(t, SCENE.shots.map((shot) => shot.at), SCENE.shots.map((shot) => shot.dx), {
    ...clamp,
    easing: ease,
  }) + Math.sin(t * 0.75) * 4,
});

const CameraRig: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree();
  const cam = cameraAt(t);
  camera.position.set(cam.dx * 0.01, 0.25 + Math.sin(t * 0.31) * 0.025, 11 / cam.zoom);
  camera.lookAt(-0.4 + cam.dx * 0.006, 0.15, -1.7);
  return null;
};

const StarField: React.FC = () => {
  const positions = useMemo(() => {
    const values = new Float32Array(420 * 3);
    for (let i = 0; i < 420; i++) {
      const a = Math.sin(i * 127.1 + 3.7) * 43758.5453;
      const b = Math.sin(i * 311.7 + 1.2) * 24634.6345;
      const c = Math.sin(i * 74.7 + 9.1) * 15873.331;
      values[i * 3] = (a - Math.floor(a)) * 20 - 10;
      values[i * 3 + 1] = (b - Math.floor(b)) * 15 - 7.5;
      values[i * 3 + 2] = -7.8 + (c - Math.floor(c)) * 2.2;
    }
    return values;
  }, []);

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#D9E8FF" size={0.045} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
};

const createVenusSurface = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create the Venus surface texture");

  const base = context.createLinearGradient(0, 0, 0, canvas.height);
  base.addColorStop(0, "#E4B978");
  base.addColorStop(0.48, "#B87545");
  base.addColorStop(1, "#70402F");
  context.fillStyle = base;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let band = 0; band < 34; band++) {
    const y = 12 + band * 15;
    context.beginPath();
    for (let x = 0; x <= canvas.width; x += 16) {
      const longitude = (x / canvas.width) * Math.PI * 2;
      const wave = Math.sin(longitude + band * 0.7) * 7 + Math.sin(longitude * 3 - band) * 3;
      if (x === 0) context.moveTo(x, y + wave);
      else context.lineTo(x, y + wave);
    }
    context.strokeStyle = band % 3 === 0 ? "rgba(255,224,171,0.28)" : "rgba(77,39,29,0.16)";
    context.lineWidth = band % 4 === 0 ? 9 : 4;
    context.stroke();
  }

  for (let mark = 0; mark < 160; mark++) {
    const x = (mark * 379.7) % canvas.width;
    const y = (mark * 173.3) % canvas.height;
    context.beginPath();
    context.ellipse(x, y, 4 + (mark % 7) * 2, 2 + (mark % 4), 0.2, 0, Math.PI * 2);
    context.fillStyle = mark % 2 ? "rgba(255,220,168,0.2)" : "rgba(59,34,30,0.18)";
    context.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

const createVenusClouds = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create the Venus cloud texture");

  for (let band = 0; band < 26; band++) {
    const y = 14 + band * 19;
    context.beginPath();
    for (let x = 0; x <= canvas.width; x += 12) {
      const longitude = (x / canvas.width) * Math.PI * 2;
      const wave = Math.sin(longitude + band * 0.83) * 11 + Math.sin(longitude * 2 - band * 0.4) * 4;
      if (x === 0) context.moveTo(x, y + wave);
      else context.lineTo(x, y + wave);
    }
    context.strokeStyle = band % 2 ? "rgba(255,239,207,0.48)" : "rgba(246,199,139,0.3)";
    context.lineWidth = band % 4 === 0 ? 11 : 5;
    context.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
};

const Venus: React.FC<{ t: number }> = ({ t }) => {
  const surface = useMemo(createVenusSurface, []);
  const clouds = useMemo(createVenusClouds, []);
  const spin = -t * 0.42;
  const atmospherePulse = 1.045 + Math.sin(t * 1.4) * 0.012;
  return (
    <group position={[-1.05, 0.95, -3.2]}>
      <group rotation={[0.08 + Math.sin(t * 0.12) * 0.025, spin, -0.12]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[1.62, 48, 48]} />
          <meshStandardMaterial map={surface} roughness={0.94} />
        </mesh>
        <mesh scale={1.019} rotation={[0, t * 0.17, 0]}>
          <sphereGeometry args={[1.62, 48, 48]} />
          <meshStandardMaterial
            map={clouds}
            roughness={1}
            transparent
            opacity={0.48 + Math.sin(t * 0.7) * 0.08}
            depthWrite={false}
          />
        </mesh>
      </group>
      <mesh scale={atmospherePulse}>
        <sphereGeometry args={[1.62, 48, 48]} />
        <meshBasicMaterial color="#F4C982" transparent opacity={0.09 + Math.sin(t * 1.1) * 0.025} depthWrite={false} />
      </mesh>
    </group>
  );
};

const Sun: React.FC<{ t: number }> = ({ t }) => {
  const pulse = 1 + Math.sin(t * 1.4) * 0.04;
  return (
    <group position={[3.25 + Math.sin(t * 0.12) * 0.08, 2.2, -4.5]} scale={pulse}>
      <mesh>
        <sphereGeometry args={[0.36, 24, 24]} />
        <meshBasicMaterial color="#FFE6A5" />
      </mesh>
      <pointLight color="#FFD68A" intensity={2 + Math.sin(t * 0.75) * 0.6} distance={10} />
      <mesh>
        <sphereGeometry args={[0.58, 24, 24]} />
        <meshBasicMaterial color="#FFD68A" transparent opacity={0.11} />
      </mesh>
    </group>
  );
};

const blendColor = (from: string, to: string, progress: number) => {
  const start = Number.parseInt(from.slice(1), 16);
  const end = Number.parseInt(to.slice(1), 16);
  const channel = (shift: number) =>
    Math.round(
      ((start >> shift) & 0xff) +
        (((end >> shift) & 0xff) - ((start >> shift) & 0xff)) * progress,
    )
      .toString(16)
      .padStart(2, "0");
  return `#${channel(16)}${channel(8)}${channel(0)}`;
};

const BACKDROP_STYLES = [
  { id: "observatory", kind: "window", sky: "#090F20", fog: "#10182A", ground: "#263044", accent: "#DDBB82" },
  { id: "venus-surface", kind: "surface", sky: "#3A201B", fog: "#48291F", ground: "#70442F", accent: "#E8A15B" },
  { id: "deep-space", kind: "deep-space", sky: "#09091D", fog: "#12152C", ground: "#171A32", accent: "#9E8BFF" },
  { id: "rotation-lab", kind: "grid", sky: "#071820", fog: "#102C35", ground: "#1C3944", accent: "#70D4D4" },
  { id: "solar-orbit", kind: "orbit", sky: "#0D1224", fog: "#151D33", ground: "#263044", accent: "#F1C879" },
  { id: "calendar-deck", kind: "calendar", sky: "#18243B", fog: "#243148", ground: "#39445A", accent: "#F0D8A4" },
  { id: "long-day-horizon", kind: "horizon", sky: "#462A38", fog: "#663E42", ground: "#574044", accent: "#FFB867" },
  { id: "cloud-observatory", kind: "clouds", sky: "#26213B", fog: "#36314A", ground: "#31354A", accent: "#DFC1FF" },
  { id: "retrograde-map", kind: "retrograde", sky: "#101A30", fog: "#1A2940", ground: "#26344A", accent: "#84D8DE" },
  { id: "rotation-platform", kind: "surface", sky: "#321D20", fog: "#4A2927", ground: "#654032", accent: "#D9945A" },
  { id: "venus-sunrise", kind: "sunrise", sky: "#6A3032", fog: "#884744", ground: "#614047", accent: "#FFD17B" },
  { id: "finale-observatory", kind: "finale", sky: "#11172B", fog: "#1D2C40", ground: "#29384A", accent: "#B7DCE2" },
] as const;

const BackdropStage: React.FC<{ t: number }> = ({ t }) => {
  let index = 0;
  for (let i = 1; i < SCENE.backgrounds.length; i++) {
    if (t < SCENE.backgrounds[i].at) break;
    index = i;
  }
  const style = BACKDROP_STYLES[index];
  if (style.id !== SCENE.backgrounds[index].id) {
    throw new Error(`Backdrop configuration mismatch at ${SCENE.backgrounds[index].at}s`);
  }
  const transitionDuration = 0.8;
  const transitionProgress = index === 0
    ? 1
    : interpolate(
        t - SCENE.backgrounds[index].at,
        [0, transitionDuration],
        [0, 1],
        { ...clamp, easing: ease },
      );
  const previous = index > 0 ? BACKDROP_STYLES[index - 1] : null;
  const sky = previous ? blendColor(previous.sky, style.sky, transitionProgress) : style.sky;
  const fog = previous ? blendColor(previous.fog, style.fog, transitionProgress) : style.fog;
  const ground = previous ? blendColor(previous.ground, style.ground, transitionProgress) : style.ground;

  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[fog, 10, 34]} />
      <mesh position={[0, -3.28, 0.2]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13, 16]} />
        <meshStandardMaterial color={ground} metalness={0.25} roughness={0.74} />
      </mesh>
      {previous && (
        <BackdropDetails
          key={previous.id}
          kind={previous.kind}
          accent={previous.accent}
          opacity={1 - transitionProgress}
          t={t}
        />
      )}
      <BackdropDetails
        key={style.id}
        kind={style.kind}
        accent={style.accent}
        opacity={index === 0 ? 1 : transitionProgress}
        t={t}
      />
    </>
  );
};

const BackdropDetails: React.FC<{
  kind: string;
  accent: string;
  opacity: number;
  t: number;
}> = ({ kind, accent, opacity, t }) => {
  if (kind === "window" || kind === "finale") {
    return (
      <group position={[0, 0.55, -6.75]}>
        <mesh position={[0, 3.25, 0.08]}>
          <boxGeometry args={[10.2, 0.1, 0.12]} />
          <meshStandardMaterial color={accent} metalness={0.68} roughness={0.38} transparent opacity={opacity} />
        </mesh>
        <mesh position={[-5.05, 0, 0.08]}>
          <boxGeometry args={[0.1, 6.6, 0.12]} />
          <meshStandardMaterial color={accent} metalness={0.68} roughness={0.38} transparent opacity={opacity} />
        </mesh>
        <mesh position={[5.05, 0, 0.08]}>
          <boxGeometry args={[0.1, 6.6, 0.12]} />
          <meshStandardMaterial color={accent} metalness={0.68} roughness={0.38} transparent opacity={opacity} />
        </mesh>
        <mesh position={[0, -3.25, 0.08]}>
          <boxGeometry args={[10.2, 0.1, 0.12]} />
          <meshStandardMaterial color={accent} metalness={0.68} roughness={0.38} transparent opacity={opacity} />
        </mesh>
        {kind === "finale" && (
          <mesh position={[0, 0.45, -0.5]} scale={[1.7, 1.1, 0.12]}>
            <sphereGeometry args={[1, 32, 24]} />
            <meshBasicMaterial color={accent} transparent opacity={opacity * 0.12} />
          </mesh>
        )}
      </group>
    );
  }
  if (kind === "surface") {
    return (
      <group>
        {[-5.3, -2.1, 2.5, 5.4].map((x, index) => (
          <mesh key={`surface-ridge-${index}`} position={[x, -2.1 + (index % 2) * 0.24, -4.7 - (index % 2) * 0.4]} scale={[2.4, 1.05, 0.9]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial color={accent} roughness={1} transparent opacity={opacity * 0.42} />
          </mesh>
        ))}
        <mesh position={[-3.4, -1.65, -4.5]} rotation={[0, 0, 0.35]} scale={[0.65, 1.7, 0.62]}>
          <coneGeometry args={[1, 2, 7]} />
          <meshStandardMaterial color={accent} roughness={1} transparent opacity={opacity * 0.54} />
        </mesh>
      </group>
    );
  }
  if (kind === "grid") {
    return (
      <group position={[0, 0.35, -6.82]}>
        {[-4, -2, 0, 2, 4].map((x) => (
          <mesh key={`lab-grid-v-${x}`} position={[x, 0, 0]}>
            <boxGeometry args={[0.025, 6.4, 0.045]} />
            <meshBasicMaterial color={accent} transparent opacity={opacity * 0.25} />
          </mesh>
        ))}
        {[-2, 0, 2].map((y) => (
          <mesh key={`lab-grid-h-${y}`} position={[0, y, 0]}>
            <boxGeometry args={[9.2, 0.025, 0.045]} />
            <meshBasicMaterial color={accent} transparent opacity={opacity * 0.25} />
          </mesh>
        ))}
        {[-4.8, 4.8].map((x) => (
          <mesh key={`lab-pillar-${x}`} position={[x, -0.05, -0.16]}>
            <boxGeometry args={[0.08, 5.5, 0.08]} />
            <meshBasicMaterial color={accent} transparent opacity={opacity * 0.7} />
          </mesh>
        ))}
      </group>
    );
  }
  if (kind === "deep-space") {
    return (
      <group>
        <mesh position={[3.9, 1.8, -7.5]} scale={[2.9, 2.9, 0.6]}>
          <sphereGeometry args={[1, 40, 32]} />
          <meshBasicMaterial color={accent} transparent opacity={opacity * 0.36} />
        </mesh>
        <mesh position={[3.9, 1.8, -7.35]} scale={[3.1, 3.1, 0.62]}>
          <sphereGeometry args={[1, 40, 32]} />
          <meshBasicMaterial color={accent} transparent opacity={opacity * 0.12} />
        </mesh>
      </group>
    );
  }
  if (kind === "orbit") {
    return (
      <group position={[0, 0.35, -7]}>
        <mesh rotation={[0.1, 0.08, -0.08]}>
          <torusGeometry args={[2.9, 0.025, 8, 120]} />
          <meshBasicMaterial color={accent} transparent opacity={opacity * 0.62} />
        </mesh>
        <mesh position={[-2.9, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshBasicMaterial color={accent} transparent opacity={opacity * 0.8} />
        </mesh>
      </group>
    );
  }
  if (kind === "calendar") {
    return (
      <group position={[3.8, 0.7, -6.8]} rotation={[0, -0.18, 0.06]}>
        {[-1.45, 0, 1.45].map((y, index) => (
          <mesh key={`calendar-panel-${index}`} position={[0, y, 0]} rotation={[0, 0, Math.sin(t * 0.7 + index) * 0.05]}>
            <boxGeometry args={[1.25, 0.92, 0.04]} />
            <meshStandardMaterial color={accent} roughness={0.7} metalness={0.12} transparent opacity={opacity * 0.58} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[1.4, 0.06, 0.07]} />
          <meshBasicMaterial color={accent} transparent opacity={opacity * 0.8} />
        </mesh>
      </group>
    );
  }
  if (kind === "clouds") {
    return (
      <group position={[0, 0.8, -6.9]}>
        {[0, 1, 2].map((index) => (
          <mesh key={`cloud-layer-${index}`} position={[Math.sin(t * 0.18 + index) * 1.1, (index - 1) * 0.85, 0]} scale={[4.5 - index * 0.35, 0.42, 0.22]}>
            <sphereGeometry args={[1, 32, 16]} />
            <meshBasicMaterial color={accent} transparent opacity={opacity * (0.13 + index * 0.035)} depthWrite={false} />
          </mesh>
        ))}
      </group>
    );
  }
  if (kind === "retrograde") {
    return (
      <group position={[0, 0.35, -6.9]} rotation={[0.16, 0, -0.08]}>
        <mesh>
          <torusGeometry args={[2.7, 0.025, 8, 120]} />
          <meshBasicMaterial color={accent} transparent opacity={opacity * 0.58} />
        </mesh>
        <mesh position={[2.7, 0, 0]}>
          <coneGeometry args={[0.11, 0.32, 3]} />
          <meshBasicMaterial color={accent} transparent opacity={opacity * 0.75} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[1.45, 0.022, 8, 100]} />
          <meshBasicMaterial color="#F1C879" transparent opacity={opacity * 0.46} />
        </mesh>
      </group>
    );
  }
  if (kind === "sunrise" || kind === "horizon") {
    return (
      <group>
        <mesh position={[0, -1.2, -7]}>
          <sphereGeometry args={[2.25, 32, 24]} />
          <meshBasicMaterial color={accent} transparent opacity={opacity * (kind === "sunrise" ? 0.15 : 0.09)} />
        </mesh>
        <mesh position={[0, -2.7, -5.7]} scale={[7.2, 0.8, 0.8]}>
          <sphereGeometry args={[1, 32, 20]} />
          <meshStandardMaterial color={accent} roughness={1} transparent opacity={opacity * 0.42} />
        </mesh>
        <mesh position={[0, -0.9, -7.1]}>
          <sphereGeometry args={[0.42, 24, 20]} />
          <meshBasicMaterial color={accent} transparent opacity={opacity * 0.9} />
        </mesh>
      </group>
    );
  }
  if (kind === "orbit") return null;
  return (
    <mesh position={[0, -0.8, -5.9]}>
      <boxGeometry args={[14, 0.045, 0.08]} />
      <meshBasicMaterial color={accent} transparent opacity={opacity * 0.45} />
    </mesh>
  );
};

const Observatory: React.FC<{ t: number }> = ({ t }) => (
  <ThreeCanvas
    width={SCENE.width}
    height={SCENE.height}
    shadows
    flat
    camera={{ fov: 40, near: 0.1, far: 100, position: [0, 0.25, 11] }}
    gl={{ antialias: true }}
  >
    <CameraRig t={t} />
    <BackdropStage t={t} />
    <ambientLight intensity={0.68} color="#AFC9F2" />
    <directionalLight
      position={[-4 + Math.sin(t * 0.18) * 1.4, 6 + Math.cos(t * 0.14) * 0.8, 5]}
      intensity={1.15 + Math.sin(t * 0.42) * 0.18}
      color="#C7D9FF"
      castShadow
    />
    <StarField />
    <Venus t={t} />
    <Sun t={t} />
    <mesh position={[0, -2.65, 0.1]} castShadow receiveShadow>
      <boxGeometry args={[10.7, 0.72, 1.8]} />
      <meshStandardMaterial color="#34445C" metalness={0.58} roughness={0.4} />
    </mesh>
    <mesh position={[0, -2.22, -0.55]} castShadow>
      <boxGeometry args={[9.8, 0.1, 0.52]} />
      <meshStandardMaterial color="#8AA5C5" emissive="#4D81B5" emissiveIntensity={0.34} />
    </mesh>
    {[-3.8, -2.3, -0.8, 0.8, 2.3, 3.8].map((x, i) => (
      <mesh key={`console-${x}`} position={[x, -2.17, -0.21]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.58, 0.035, 0.26]} />
        <meshBasicMaterial color={i % 2 ? "#E9B96D" : "#71D0DA"} />
      </mesh>
    ))}
  </ThreeCanvas>
);

const opacityAt = (t: number, start: number, end: number) =>
  interpolate(t, [start, start + 0.35, end - 0.35, end], [0, 1, 1, 0], clamp);

const popScale = (t: number, start: number) =>
  interpolate(t, [start, start + 0.36], [0.88, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

const DataGraphics: React.FC<{ t: number }> = ({ t }) => {
  const hookOpacity = opacityAt(t, 0, 3.5);
  const hookOrbit = interpolate(t, [0, 3.5], [0, Math.PI * 2], clamp);
  const hookPlanetX = 472 + Math.cos(hookOrbit) * 184;
  const hookPlanetY = 848 + Math.sin(hookOrbit) * 105;
  const hookSpin = -t * 180;
  const compareOpacity = opacityAt(t, 9, 29);
  const solarOpacity = opacityAt(t, 29, 39.5);
  const reverseOpacity = opacityAt(t, 39, 50.5);
  const directionOpacity = opacityAt(t, 50, 55.8);
  const calendarOpacity = Math.max(opacityAt(t, 3.1, 9), opacityAt(t, 50, 55.8));
  const calendarTime = t < 9 ? Math.max(0, t - 3.1) : t - 50;
  const orbitProgress = interpolate(t, [19, 28.5], [0, Math.PI * 2], clamp);
  const raceProgress = interpolate(t, [19, 28.5], [0, 1], { ...clamp, easing: ease });
  const yearProgress = Math.min(1, raceProgress / (225 / 243));
  const raceTrackX = 174;
  const raceTrackWidth = 390;
  const retrogradeProgress = interpolate(t, [39, 50], [0, Math.PI * 4], clamp);
  const rotationDays = Math.round(interpolate(t, [9, 10.1], [0, 243], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const yearDays = Math.round(interpolate(t, [18.5, 19.6], [0, 225], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const solarDayDays = Math.round(interpolate(t, [29, 30], [0, 117], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const sunX = interpolate(t, [50, 55.8], [325, 755], { ...clamp, easing: ease });
  const orbitDemoX = 280 + Math.cos(retrogradeProgress) * 145;
  const orbitDemoY = 1095 + Math.sin(retrogradeProgress) * 53;
  const surfaceDemoX = 620 + Math.cos(-retrogradeProgress) * 62;
  const surfaceDemoY = 1095 + Math.sin(-retrogradeProgress) * 24;

  return (
    <svg
      width={SCENE.width}
      height={SCENE.height}
      viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id="card-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#182740" stopOpacity="0.94" />
          <stop offset="1" stopColor="#263A55" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="sun-glow">
          <stop offset="0" stopColor="#FFF4CE" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFD26E" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hook-venus-fill" cx="30%" cy="28%">
          <stop offset="0" stopColor="#FFE1A3" />
          <stop offset="1" stopColor="#A85F3D" />
        </radialGradient>
        <clipPath id="hook-venus-disk">
          <circle r="27" />
        </clipPath>
      </defs>

      <g opacity={hookOpacity}>
        <rect x="68" y="280" width="944" height="108" rx="26" fill="#101B2C" fillOpacity="0.9" stroke="#E3C58C" strokeOpacity="0.78" strokeWidth="3" />
        <text x="540" y="326" textAnchor="middle" fill="#FFF2D6" fontFamily="Arial, sans-serif" fontSize="30" fontWeight="900" letterSpacing="1.5">
          ROTASI VENUS LEBIH LAMA
        </text>
        <text x="540" y="365" textAnchor="middle" fill="#8BD8E0" fontFamily="Arial, sans-serif" fontSize="27" fontWeight="900" letterSpacing="2">
          DARI SATU TAHUNNYA?
        </text>
        <ellipse cx="472" cy="848" rx="184" ry="105" fill="none" stroke="#A8C6DC" strokeOpacity="0.75" strokeWidth="4" strokeDasharray="9 10" />
        <path d="M638 785L655 795L638 804" fill="none" stroke="#D8E8F4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="472" cy="848" r="52" fill="url(#sun-glow)" />
        <circle cx="472" cy="848" r="23" fill="#FFE6A5" />
        <circle cx="472" cy="848" r="6" fill="#FFF9E8" />
        <text x="472" y="912" textAnchor="middle" fill="#FFE9B7" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="900" letterSpacing="2">
          MATAHARI
        </text>
        <g transform={`translate(${hookPlanetX} ${hookPlanetY})`}>
          <circle r="32" fill="#E5B772" fillOpacity="0.2" />
          <circle r="27" fill="url(#hook-venus-fill)" stroke="#FFE4AD" strokeWidth="3" />
          <g clipPath="url(#hook-venus-disk)" transform={`rotate(${hookSpin})`}>
            <path d="M-36 -12Q-10 -25 36 -11M-35 2Q-8 -8 34 3M-34 16Q-8 8 35 19" fill="none" stroke="#79442F" strokeOpacity="0.8" strokeWidth="5" />
            <path d="M-36 -19Q-8 -29 30 -18M-35 9Q-9 -1 34 10" fill="none" stroke="#FFF0C9" strokeOpacity="0.8" strokeWidth="3" />
          </g>
          <path d="M-2 -41A42 42 0 0 1 32 -27" fill="none" stroke="#F0C982" strokeWidth="4" strokeLinecap="round" />
          <path d="M29 -35L35 -25L23 -26" fill="#F0C982" />
        </g>
        <text x="472" y="1024" textAnchor="middle" fill="#EAF3FF" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="900" letterSpacing="1.2">
          ORBIT 225 HARI • ROTASI 243 HARI
        </text>
        <text x="472" y="1062" textAnchor="middle" fill="#AFC9DD" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="700" letterSpacing="1.4">
          DIAGRAM SKEMATIS
        </text>
      </g>

      <g opacity={calendarOpacity} transform={`translate(190 ${t < 9 ? 835 : 650}) scale(1.08)`}>
        <rect x="-127" y="-143" width="254" height="278" rx="25" fill="#111E31" stroke="#D7B978" strokeWidth="5" />
        <path d="M-127 -119Q-127 -143 -103 -143H103Q127 -143 127 -119V-83H-127Z" fill="#A85F4A" />
        <path d="M-84 -155V-125M84 -155V-125" stroke="#F7E7C4" strokeWidth="10" strokeLinecap="round" />
        <circle cx="-84" cy="-155" r="6" fill="#D7B978" />
        <circle cx="84" cy="-155" r="6" fill="#D7B978" />
        <text x="0" y="-105" textAnchor="middle" fill="#FFF2D6" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="900" letterSpacing="2">
          KALENDER VENUS
        </text>
        <rect x="-104" y="-67" width="208" height="184" rx="12" fill="#F3E8D0" />
        <text x="-84" y="-39" fill="#5A6672" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="800" letterSpacing="2">
          TAHUN BARU
        </text>
        <text x="83" y="-39" textAnchor="end" fill="#A85F4A" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="900">
          VENUS
        </text>
        <path d="M-84 -26H84" stroke="#C9BFAE" strokeWidth="2" />
        {Array.from({ length: 21 }, (_, index) => {
          const col = index % 7;
          const row = Math.floor(index / 7);
          const x = -76 + col * 25;
          const y = -8 + row * 28;
          const isFlipping = index === 20;
          return (
            <g key={`calendar-day-${index}`} transform={isFlipping ? `rotate(${Math.sin(calendarTime * 8) * 9} ${x} ${y})` : undefined}>
              <rect
                x={x - 8}
                y={y - 10}
                width="16"
                height="20"
                rx="4"
                fill={isFlipping ? "#C98258" : index === 13 ? "#E3C58C" : "#D7D1C4"}
                opacity={isFlipping ? 0.96 : 0.72}
              />
            </g>
          );
        })}
        <g transform={`rotate(${Math.sin(calendarTime * 5) * 5} 0 82)`}>
          <path d="M-86 74H86" stroke="#C9BFAE" strokeWidth="2" />
          <text x="0" y="101" textAnchor="middle" fill="#25364A" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="900" letterSpacing="1.5">
            TAHUN BERGANTI
          </text>
        </g>
        <path d="M-107 123H107" stroke="#D7B978" strokeOpacity="0.5" strokeWidth="2" />
        <text x="0" y="155" textAnchor="middle" fill="#D1DDEA" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="800" letterSpacing="1.4">
          HARI VENUS MASIH BERJALAN
        </text>
      </g>

      <g opacity={compareOpacity} transform={`translate(286 642) scale(${popScale(t, 9)}) translate(-286 -642)`}>
        <rect x="78" y="535" width="416" height="214" rx="28" fill="url(#card-fill)" stroke="#FFE0A4" strokeWidth="4" />
        <text x="286" y="647" textAnchor="middle" fill="#FFF2D4" fontFamily="Arial, sans-serif" fontSize="92" fontWeight="900" stroke="#182233" strokeWidth="3" paintOrder="stroke">
          {rotationDays}
        </text>
        <text x="286" y="706" textAnchor="middle" fill="#B9D3E5" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="800" letterSpacing="1.3">
          ROTASI PADA SUMBU
        </text>
      </g>
      <g opacity={opacityAt(t, 18.5, 29)} transform={`translate(794 642) scale(${popScale(t, 18.5)}) translate(-794 -642)`}>
        <rect x="586" y="535" width="416" height="214" rx="28" fill="url(#card-fill)" stroke="#8BD8E0" strokeWidth="4" />
        <text x="794" y="647" textAnchor="middle" fill="#E8FAFF" fontFamily="Arial, sans-serif" fontSize="92" fontWeight="900" stroke="#182233" strokeWidth="3" paintOrder="stroke">
          {yearDays}
        </text>
        <text x="794" y="706" textAnchor="middle" fill="#B9D3E5" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="800" letterSpacing="1.3">
          SATU ORBIT MATAHARI
        </text>
      </g>
      <g opacity={opacityAt(t, 22.5, 29)} transform={`translate(518 850) scale(${popScale(t, 22.5)}) translate(-518 -850)`}>
        <path d="M518 785V870" stroke="#FFF1C8" strokeWidth="7" strokeLinecap="round" />
        <path d="M497 848L518 871L539 848" fill="none" stroke="#FFF1C8" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <text x="518" y="922" textAnchor="middle" fill="#FFF1C8" fontFamily="Arial, sans-serif" fontSize="31" fontWeight="800" letterSpacing="1">
          TAHUN SELESAI DULUAN
        </text>
      </g>
      <g opacity={opacityAt(t, 19, 29)}>
        <ellipse cx="432" cy="1000" rx="145" ry="66" fill="none" stroke="#9FC7DB" strokeWidth="5" strokeDasharray="9 12" />
        <circle cx="432" cy="1000" r="13" fill="#FFE6A5" />
        <circle
          cx={432 + Math.cos(orbitProgress) * 145}
          cy={1000 + Math.sin(orbitProgress) * 66}
          r="17"
          fill="#E5B772"
          stroke="#FFF0D0"
          strokeWidth="4"
        />
        <text x="432" y="1098" textAnchor="middle" fill="#D8E8F4" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="800" letterSpacing="1">
          ORBIT 225 HARI
        </text>
      </g>
      <g opacity={opacityAt(t, 20, 29)} aria-label="Perbandingan waktu tahun dan rotasi Venus">
        <text x="92" y="1263" fill="#E8F2FA" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="900" letterSpacing="2">
          BALAP WAKTU VENUS
        </text>
        <text x="92" y="1320" fill="#D9EEF7" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="900">
          TAHUN
        </text>
        <text x="92" y="1392" fill="#FFE3A7" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="900">
          ROTASI
        </text>
        <path d={`M${raceTrackX} 1312H${raceTrackX + raceTrackWidth}`} stroke="#E8F2FA" strokeOpacity="0.22" strokeWidth="13" strokeLinecap="round" />
        <path
          d={`M${raceTrackX} 1312H${raceTrackX + raceTrackWidth * yearProgress}`}
          stroke="#8BD8E0"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <circle cx={raceTrackX + raceTrackWidth * yearProgress} cy="1312" r="11" fill="#E8FAFF" />
        <path d={`M${raceTrackX} 1384H${raceTrackX + raceTrackWidth}`} stroke="#E8F2FA" strokeOpacity="0.22" strokeWidth="13" strokeLinecap="round" />
        <path
          d={`M${raceTrackX} 1384H${raceTrackX + raceTrackWidth * raceProgress}`}
          stroke="#F0C982"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <circle cx={raceTrackX + raceTrackWidth * raceProgress} cy="1384" r="11" fill="#FFF2D4" />
        <path
          d={`M${raceTrackX + raceTrackWidth * yearProgress} 1340V1360H${raceTrackX + raceTrackWidth * raceProgress}`}
          fill="none"
          stroke="#F3C36C"
          strokeWidth="3"
          strokeDasharray="5 5"
          opacity={yearProgress >= 1 ? 1 : 0}
        />
        <text x="584" y="1320" fill="#BEEBF0" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="900">
          225 HARI
        </text>
        <text x="584" y="1392" fill="#FFE3A7" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="900">
          243 HARI
        </text>
        <text
          x={raceTrackX + raceTrackWidth - 3}
          y="1359"
          textAnchor="end"
          fill="#FFE3A7"
          fontFamily="Arial, sans-serif"
          fontSize="16"
          fontWeight="900"
          opacity={yearProgress >= 1 ? 1 : 0}
        >
          TAHUN SELESAI, ROTASI MASIH LANJUT
        </text>
        <text
          x={raceTrackX + raceTrackWidth}
          y="1280"
          textAnchor="end"
          fill="#FFE3A7"
          fontFamily="Arial, sans-serif"
          fontSize="18"
          fontWeight="900"
          opacity={yearProgress >= 1 ? 1 : 0}
        >
          SISA 18 HARI
        </text>
      </g>

      <g opacity={solarOpacity} transform={`translate(375 555) scale(${popScale(t, 29)}) translate(-375 -555)`}>
        <rect x="100" y="470" width="550" height="170" rx="28" fill="#111E31" fillOpacity="0.92" stroke="#FFC96C" strokeWidth="4" />
        <text x="375" y="570" textAnchor="middle" fill="#FFE3A7" fontFamily="Arial, sans-serif" fontSize="82" fontWeight="900">
          {solarDayDays} HARI
        </text>
        <text x="375" y="612" textAnchor="middle" fill="#D1DDEA" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="800" letterSpacing="1.5">
          HARI MATAHARI: TERBIT → TERBIT LAGI
        </text>
        <path d="M178 815H852" stroke="#B6C7D9" strokeWidth="7" strokeLinecap="round" />
        <circle cx="180" cy="815" r="28" fill="#FFE4A0" stroke="#FFF6DD" strokeWidth="5" />
        <circle cx="514" cy="815" r="22" fill="#17243A" stroke="#A8BBD3" strokeWidth="5" />
        <circle cx="850" cy="815" r="28" fill="#FFE4A0" stroke="#FFF6DD" strokeWidth="5" />
        <path d="M208 815H486" stroke="#FFC96C" strokeWidth="5" strokeDasharray="12 16" />
        <path d="M542 815H822" stroke="#85D5DD" strokeWidth="5" strokeDasharray="12 16" />
        <text x="180" y="866" textAnchor="middle" fill="#FFF2D6" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="800">
          TERBIT
        </text>
        <text x="514" y="866" textAnchor="middle" fill="#D1DDEA" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="800">
          TERBENAM
        </text>
        <text x="850" y="866" textAnchor="middle" fill="#FFF2D6" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="800">
          TERBIT LAGI
        </text>
        <text x="347" y="916" textAnchor="middle" fill="#FFE3A7" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="900">
          SIANG ≈ 58,4 HARI
        </text>
        <text x="683" y="916" textAnchor="middle" fill="#BEEBF0" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="900">
          MALAM ≈ 58,4 HARI
        </text>
      </g>
      <g opacity={opacityAt(t, 9, 29)}>
        <circle cx="170" cy="1018" r="72" fill="#111E31" fillOpacity="0.92" stroke="#C7DAEA" strokeWidth="5" />
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <path
              key={`clock-tick-${i}`}
              d={`M${170 + Math.cos(angle) * 55} ${1018 + Math.sin(angle) * 55}L${170 + Math.cos(angle) * 63} ${1018 + Math.sin(angle) * 63}`}
              stroke="#C7DAEA"
              strokeWidth="4"
              strokeLinecap="round"
            />
          );
        })}
        <path d={`M170 1018L${170 + Math.cos(t * 4) * 43} ${1018 + Math.sin(t * 4) * 43}`} stroke="#F6D28E" strokeWidth="6" strokeLinecap="round" />
        <path d={`M170 1018L${170 + Math.cos(t * 0.35) * 31} ${1018 + Math.sin(t * 0.35) * 31}`} stroke="#85D5DD" strokeWidth="8" strokeLinecap="round" />
        <circle cx="170" cy="1018" r="7" fill="#FFFFFF" />
        <text x="170" y="1115" textAnchor="middle" fill="#E8F2FA" fontFamily="Arial, sans-serif" fontSize="21" fontWeight="800" letterSpacing="1">
          JAM ROTASI
        </text>
      </g>

      <g opacity={reverseOpacity}>
        <rect x="106" y="420" width="570" height="92" rx="22" fill="#111E31" fillOpacity="0.88" stroke="#85D5DD" strokeWidth="3" />
        <text x="391" y="480" textAnchor="middle" fill="#E5FCFF" fontFamily="Arial, sans-serif" fontSize="33" fontWeight="900" letterSpacing="2">
          PUTARAN RETROGRADE
        </text>
        <g transform={`translate(0 ${Math.sin(t * 2.2) * 5})`}>
          <text x="280" y="984" textAnchor="middle" fill="#CDE3F3" fontFamily="Arial, sans-serif" fontSize="23" fontWeight="900" letterSpacing="2">
            ORBIT
          </text>
          <ellipse cx="280" cy="1095" rx="145" ry="53" fill="none" stroke="#8BB3D2" strokeWidth="5" strokeDasharray="12 10" />
          <circle cx="280" cy="1095" r="20" fill="#FFE6A5" stroke="#FFF5D9" strokeWidth="4" />
          <circle cx={orbitDemoX} cy={orbitDemoY} r="15" fill="#D9A762" stroke="#FFF0D0" strokeWidth="4" />
          <path d="M399 1057L420 1065L403 1078" fill="none" stroke="#8BB3D2" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

          <text x="620" y="984" textAnchor="middle" fill="#F6D492" fontFamily="Arial, sans-serif" fontSize="23" fontWeight="900" letterSpacing="2">
            ROTASI VENUS
          </text>
          <circle cx="620" cy="1095" r="82" fill="url(#card-fill)" stroke="#F0C982" strokeWidth="5" />
          <g transform={`rotate(${retrogradeProgress * 57.2958} 620 1095)`}>
            <path d="M620 1017V1173M540 1095H700" stroke="#FFE4AD" strokeOpacity="0.4" strokeWidth="4" />
            <ellipse cx="620" cy="1095" rx="80" ry="27" fill="none" stroke="#FFE4AD" strokeOpacity="0.58" strokeWidth="4" />
          </g>
          <ellipse cx="620" cy="1095" rx="65" ry="22" fill="none" stroke="#C9D9E8" strokeOpacity="0.68" strokeWidth="3" />
          <circle cx={surfaceDemoX} cy={surfaceDemoY} r="11" fill="#FFF2D4" stroke="#593E31" strokeWidth="3" />
          <path d="M567 1150L549 1160L550 1138" fill="none" stroke="#F3C36C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <text x="450" y="1208" textAnchor="middle" fill="#D8E8F4" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="800">
            ORBIT MAJU • ROTASI MUNDUR
          </text>
        </g>
      </g>

      <g opacity={directionOpacity}>
        <circle cx={sunX} cy="760" r="125" fill="url(#sun-glow)" />
        <circle cx={sunX} cy="760" r="34" fill="#FFE6A5" />
        <path d="M270 895H812" stroke="#D3E1F2" strokeWidth="5" strokeDasharray="10 13" opacity="0.8" />
        <path d="M812 895L788 880V910Z" fill="#D3E1F2" />
        <text x="235" y="958" textAnchor="middle" fill="#E6EDF8" fontFamily="Arial, sans-serif" fontSize="29" fontWeight="800" letterSpacing="2">
          BARAT
        </text>
        <text x="855" y="958" textAnchor="middle" fill="#E6EDF8" fontFamily="Arial, sans-serif" fontSize="29" fontWeight="800" letterSpacing="2">
          TIMUR
        </text>
        <rect x="296" y="462" width="490" height="74" rx="18" fill="#101B2B" fillOpacity="0.86" stroke="#F3D28D" strokeWidth="3" />
        <text x="541" y="512" textAnchor="middle" fill="#FFF0C8" fontFamily="Arial, sans-serif" fontSize="31" fontWeight="900" letterSpacing="2">
          TERBIT DI BARAT
        </text>
      </g>

      <g opacity={opacityAt(t, 54.2, 56.2)}>
        <rect x="70" y="1010" width="940" height="220" rx="28" fill="#0B1220" fillOpacity="0.94" stroke="#9CC7D5" strokeWidth="3" />
        <text x="540" y="1098" textAnchor="middle" fill="#FFFFFF" fontFamily="Arial Black, Arial, sans-serif" fontSize="56" fontWeight="900" letterSpacing="5">
          RUANG PIKIR
        </text>
        <text x="540" y="1155" textAnchor="middle" fill="#C5D8E8" fontFamily="Arial, sans-serif" fontSize="23" fontWeight="700" letterSpacing="1.5">
          SATU ROTASI LEBIH LAMA DARI SATU TAHUN.
        </text>
        <text x="540" y="1196" textAnchor="middle" fill="#F0C982" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="800" letterSpacing="1.2">
          MENURUTMU, FAKTA VENUS MANA YANG PALING MENGEJUTKAN?
        </text>
      </g>
    </svg>
  );
};

const characterAt = (t: number) => {
  const expressions = [
    { at: 0, key: "menjelaskan" },
    { at: 4.8, key: "curiga" },
    { at: 6, key: "menjelaskan" },
    { at: 9, key: "fokus" },
    { at: 10, key: "menjelaskan" },
    { at: 18.7, key: "kaget" },
    { at: 19.25, key: "menjelaskan" },
    { at: 23, key: "bingung" },
    { at: 24, key: "menjelaskan" },
    { at: 29, key: "fokus" },
    { at: 30, key: "menjelaskan" },
    { at: 34.8, key: "ngantuk" },
    { at: 35.6, key: "menjelaskan" },
    { at: 39, key: "fokus" },
    { at: 40, key: "menjelaskan" },
    { at: 40.15, key: "kaget" },
    { at: 40.8, key: "menjelaskan" },
    { at: 44.6, key: "bingung" },
    { at: 45.4, key: "menjelaskan" },
    { at: 50, key: "kaget" },
    { at: 50.55, key: "menjelaskan" },
    { at: 54.2, key: "girang" },
  ];
  const poses = [
    { at: 0, key: "bicara" },
    { at: 2.4, key: "tunjuk_jelaskan" },
    { at: 4.8, key: "tunjuk_jelaskan" },
    { at: 6, key: "bicara" },
    { at: 6.4, key: "angkat_tangan" },
    { at: 9, key: "tunjuk_jelaskan" },
    { at: 12.2, key: "tunjuk_jelaskan" },
    { at: 15, key: "angkat_tangan" },
    { at: 16.8, key: "bicara" },
    { at: 18.7, key: "tutup_mulut" },
    { at: 19.25, key: "bicara" },
    { at: 21.6, key: "tunjuk_jelaskan" },
    { at: 23, key: "garuk_kepala" },
    { at: 24, key: "tunjuk_jelaskan" },
    { at: 26.4, key: "angkat_tangan" },
    { at: 29, key: "bicara" },
    { at: 33.6, key: "tunjuk_jelaskan" },
    { at: 34.8, key: "garuk_kepala" },
    { at: 35.6, key: "bicara" },
    { at: 39, key: "tunjuk_jelaskan" },
    { at: 40.15, key: "angkat_tangan" },
    { at: 40.8, key: "tunjuk_jelaskan" },
    { at: 43.2, key: "angkat_tangan" },
    { at: 44.6, key: "bicara" },
    { at: 48, key: "tunjuk_jelaskan" },
    { at: 50, key: "angkat_tangan" },
    { at: 50.55, key: "tunjuk_jelaskan" },
    { at: 53.8, key: "tunjuk_jelaskan" },
  ];
  const looks = [
    { at: 0, value: -0.55 },
    { at: 2.4, value: 0.7 },
    { at: 5, value: -0.7 },
    { at: 9, value: -0.65 },
    { at: 14.5, value: 0.65 },
    { at: 19, value: 0.65 },
    { at: 23, value: -0.2 },
    { at: 25, value: 0.65 },
    { at: 29, value: -0.7 },
    { at: 34.8, value: 0.3 },
    { at: 36, value: -0.65 },
    { at: 39, value: -0.65 },
    { at: 45, value: 0.65 },
    { at: 50, value: -0.7 },
    { at: 53.5, value: 0.7 },
    { at: 54.2, value: 0 },
  ];
  let expressionIndex = 0;
  let poseIndex = 0;
  for (let i = 1; i < expressions.length; i++) {
    if (t >= expressions[i].at) expressionIndex = i;
  }
  for (let i = 1; i < poses.length; i++) {
    if (t >= poses[i].at) poseIndex = i;
  }
  return {
    expression: expressions[expressionIndex].key,
    tExpression: t - expressions[expressionIndex].at,
    pose: poses[poseIndex].key,
    previousPose: poses[Math.max(0, poseIndex - 1)].key,
    tPose: t - poses[poseIndex].at,
    look: interpolate(t, looks.map((key) => key.at), looks.map((key) => key.value), { ...clamp, easing: ease }),
  };
};

const Researcher: React.FC<{ t: number }> = ({ t }) => {
  if (t >= 54.2) return null;
  const character = characterAt(t);
  const positionStops = [
    { at: 0, x: 1120 },
    { at: 1.2, x: 835 },
    { at: 2.4, x: 790 },
    { at: 4.8, x: 875 },
    { at: 6.4, x: 815 },
    { at: 9, x: 835 },
    { at: 10, x: 820 },
    { at: 12.2, x: 885 },
    { at: 14.5, x: 790 },
    { at: 16.8, x: 850 },
    { at: 19, x: 895 },
    { at: 21.6, x: 770 },
    { at: 23, x: 890 },
    { at: 26.4, x: 780 },
    { at: 29, x: 820 },
    { at: 30, x: 840 },
    { at: 33.6, x: 790 },
    { at: 34.8, x: 810 },
    { at: 39, x: 835 },
    { at: 40.15, x: 790 },
    { at: 43.2, x: 890 },
    { at: 44.6, x: 820 },
    { at: 48, x: 760 },
    { at: 50, x: 830 },
    { at: 52.8, x: 780 },
    { at: 54, x: 840 },
    { at: 54.2, x: 840 },
  ];
  const x = interpolate(t, positionStops.map((stop) => stop.at), positionStops.map((stop) => stop.x), {
    ...clamp,
    easing: ease,
  });
  const nod = Math.sin(t * 4.1) * 1.4 + Math.max(0, Math.sin(t * 1.3)) * 1.8;
  const stepping =
    t < 1.2 ||
    Math.abs(
      interpolate(t + 0.05, positionStops.map((stop) => stop.at), positionStops.map((stop) => stop.x), {
        ...clamp,
        easing: ease,
      }) - x,
    ) > 1;
  const reacting = character.expression === "kaget" && character.tExpression < 0.48;
  return (
    <Karakter
      outfit="ilmuwan"
      expression={character.expression}
      pose={character.pose}
      poseDari={character.previousPose}
      tPose={character.tPose}
      durPose={0.28}
      motion={
        reacting
          ? "kaget"
          : character.pose === "tutup_mulut"
            ? "napas"
            : stepping
              ? "jalan"
              : "bicara"
      }
      t={t}
      tEkspresi={character.tExpression}
      tAksi={character.tExpression}
      reaksi={reacting ? "kaget" : undefined}
      angguk={nod}
      lirik={character.look}
      x={x}
      groundY={SCENE.groundY}
      width={360}
      nama="Ruang Pikir Venus Researcher"
    />
  );
};

export const Template: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cam = cameraAt(t);

  return (
    <AbsoluteFill style={{ backgroundColor: "#080D19" }}>
      <AbsoluteFill>
        <Observatory t={t} />
      </AbsoluteFill>

      <Sequence from={0} durationInFrames={Math.round(36 * FPS)}>
        <Audio
          src={staticFile("venus-waktu/spooky-obon-fog.mp3")}
          volume={(f) => interpolate(f, [0, 20, 1040, 1080], [0.075, 0.075, 0.075, 0], clamp)}
        />
      </Sequence>
      <Sequence from={Math.round(35.5 * FPS)} durationInFrames={Math.round((SCENE.durationSec - 35.5) * FPS)}>
        <Audio
          src={staticFile("venus-waktu/spooky-drifting-memories.mp3")}
          volume={(f) => interpolate(f, [0, 36, 100, (SCENE.durationSec - 35.5) * FPS], [0, 0.075, 0.075, 0], clamp)}
        />
      </Sequence>
      <Audio src={staticFile("venus-waktu/narasi.mp3")} volume={1} />
      {[10, 30, 40, 50].map((at) => (
        <Sequence key={`scene-whoosh-${at}`} from={Math.round(at * FPS)} durationInFrames={26}>
          <Audio
            src={staticFile("venus-waktu/sfx-whoosh-kamera-pendek.mp3")}
            volume={0.075}
          />
        </Sequence>
      ))}

      <AbsoluteFill
        style={{
          transform: `translateX(${-cam.dx * 0.6}px) scale(${cam.zoom})`,
          transformOrigin: "center center",
        }}
      >
        <DataGraphics t={t} />
        <Researcher t={t} />
      </AbsoluteFill>
      <Caption t={t} />
    </AbsoluteFill>
  );
};
