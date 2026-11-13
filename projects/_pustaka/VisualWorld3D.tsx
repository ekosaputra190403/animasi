import React from "react";
import "@react-three/fiber";
import { DoubleSide, Quaternion, Shape, Vector3 } from "three";

type Position3D = [number, number, number];
/** Pass animation time in seconds, for example Remotion frame divided by fps. */
type WorldVisualProps = {
  position?: Position3D;
  scale?: number;
  time?: number;
};

const gable = new Shape();
gable.moveTo(-1, 0);
gable.lineTo(1, 0);
gable.lineTo(0, 0.78);
gable.closePath();

const Rod3D: React.FC<{
  from: Position3D;
  to: Position3D;
  radius: number;
  color: string;
}> = ({ from, to, radius, color }) => {
  const direction = new Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
  const length = direction.length();
  const quaternion = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    direction.normalize(),
  );
  return (
    <mesh
      position={[(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2]}
      quaternion={quaternion}
      castShadow
    >
      <cylinderGeometry args={[radius, radius, length, 8]} />
      <meshStandardMaterial color={color} roughness={0.72} />
    </mesh>
  );
};

const Wheel3D: React.FC<{ position: Position3D; radius: number; color?: string }> = ({
  position,
  radius,
  color = "#25292d",
}) => (
  <group position={position} rotation={[Math.PI / 2, 0, 0]}>
    <mesh castShadow>
      <cylinderGeometry args={[radius, radius, 0.13, 16]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
    {[-1, 1].map((side) => (
      <mesh key={side} position={[0, 0, side * 0.072]}>
        <cylinderGeometry args={[radius * 0.48, radius * 0.48, 0.018, 12]} />
        <meshStandardMaterial color="#aab4bd" metalness={0.62} roughness={0.42} />
      </mesh>
    ))}
  </group>
);

const CloudMass3D: React.FC<{ color: string }> = ({ color }) => (
  <group>
    {[
      { position: [-0.62, 0, 0] as Position3D, radius: 0.48 },
      { position: [-0.18, 0.25, 0.02] as Position3D, radius: 0.62 },
      { position: [0.36, 0.14, 0] as Position3D, radius: 0.53 },
      { position: [0.78, -0.02, 0.01] as Position3D, radius: 0.38 },
    ].map((puff, index) => (
      <mesh key={index} position={puff.position} castShadow>
        <sphereGeometry args={[puff.radius, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.96} />
      </mesh>
    ))}
  </group>
);

export const Cloud3D: React.FC<WorldVisualProps & { storm?: boolean }> = ({
  position = [0, 0, 0],
  scale = 1,
  time = 0,
  storm = false,
}) => (
  <group position={[position[0] + Math.sin(time * 0.12) * 0.12, position[1], position[2]]} scale={scale}>
    <CloudMass3D color={storm ? "#566171" : "#f1f5f9"} />
  </group>
);

export const Thunderstorm3D: React.FC<WorldVisualProps> = ({
  position = [0, 0, 0],
  scale = 1,
  time = 0,
}) => {
  const phase = time % 5.6;
  const flash = phase < 0.24 || (phase > 0.38 && phase < 0.62);
  return (
    <group position={position} scale={scale}>
      <CloudMass3D color="#434d5b" />
      <pointLight position={[0.1, -0.7, 0.25]} color="#c5e8ff" intensity={flash ? 4 : 0} distance={5} />
      {flash && (
        <group>
          <Rod3D from={[0.1, -0.3, 0.12]} to={[-0.06, -0.58, 0.12]} radius={0.025} color="#d9f4ff" />
          <Rod3D from={[-0.06, -0.58, 0.12]} to={[0.12, -0.78, 0.12]} radius={0.02} color="#d9f4ff" />
          <Rod3D from={[0.12, -0.78, 0.12]} to={[-0.16, -1.06, 0.12]} radius={0.016} color="#d9f4ff" />
        </group>
      )}
    </group>
  );
};

export const WindGust3D: React.FC<WorldVisualProps> = ({
  position = [0, 0, 0],
  scale = 1,
  time = 0,
}) => (
  <group position={[position[0] + Math.sin(time * 2) * 0.1, position[1], position[2]]} scale={scale}>
    {[0, 1, 2].map((index) => (
      <mesh key={index} position={[index * 0.16, (index - 1) * 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.42 + index * 0.1, 0.014, 6, 24, Math.PI]} />
        <meshStandardMaterial color={index === 1 ? "#b9e8ef" : "#80c9d6"} transparent opacity={0.72} />
      </mesh>
    ))}
  </group>
);

export const Rain3D: React.FC<WorldVisualProps & { count?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
  time = 0,
  count = 36,
}) => (
  <group position={position} scale={scale}>
    {Array.from({ length: count }, (_, index) => {
      const x = ((index * 37) % 17) / 4 - 2;
      const z = ((index * 19) % 13) / 4 - 1.5;
      const y = 2.4 - ((time * 5 + index * 0.31) % 3);
      return (
        <mesh key={index} position={[x, y, z]} rotation={[0, 0, -0.16]}>
          <cylinderGeometry args={[0.008, 0.008, 0.28, 4]} />
          <meshBasicMaterial color="#9bdcf5" transparent opacity={0.72} />
        </mesh>
      );
    })}
  </group>
);

export const SmokePlume3D: React.FC<WorldVisualProps & { count?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
  time = 0,
  count = 8,
}) => (
  <group position={position} scale={scale}>
    {Array.from({ length: count }, (_, index) => {
      const rise = (time * 0.24 + index * 0.18) % 1.25;
      const size = 0.13 + index * 0.018;
      return (
        <mesh
          key={index}
          position={[Math.sin(time * 1.4 + index) * (0.08 + index * 0.025), index * 0.18 + rise, 0]}
        >
          <sphereGeometry args={[size, 10, 8]} />
          <meshStandardMaterial color="#87909a" transparent opacity={0.28} depthWrite={false} roughness={1} />
        </mesh>
      );
    })}
  </group>
);

export const Sun3D: React.FC<WorldVisualProps> = ({
  position = [0, 0, 0],
  scale = 1,
  time = 0,
}) => (
  <group position={position} scale={scale} rotation={[0, time * 0.05, 0]}>
    <mesh>
      <sphereGeometry args={[0.42, 24, 16]} />
      <meshStandardMaterial color="#ffd166" emissive="#ffb02e" emissiveIntensity={1.4} roughness={0.4} />
    </mesh>
    <pointLight color="#ffd47a" intensity={1.1} distance={6} />
    {Array.from({ length: 8 }, (_, index) => (
      <mesh key={index} position={[Math.cos((index * Math.PI) / 4) * 0.62, Math.sin((index * Math.PI) / 4) * 0.62, 0]}>
        <boxGeometry args={[0.08, 0.18, 0.06]} />
        <meshStandardMaterial color="#ffc34e" emissive="#f7a928" emissiveIntensity={0.55} />
      </mesh>
    ))}
  </group>
);

export const GrassPatch3D: React.FC<WorldVisualProps & { count?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
  time = 0,
  count = 28,
}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, -0.06, 0]} receiveShadow>
      <boxGeometry args={[2.8, 0.12, 1.8]} />
      <meshStandardMaterial color="#526f43" roughness={1} />
    </mesh>
    {Array.from({ length: count }, (_, index) => {
      const x = ((index * 17) % 13) / 5 - 1.2;
      const z = ((index * 11) % 9) / 5 - 0.8;
      const sway = Math.sin(time * 2.4 + index * 0.9) * 0.12;
      return (
        <mesh key={index} position={[x, 0.19, z]} rotation={[0, 0, sway]} castShadow>
          <coneGeometry args={[0.06, 0.5 + (index % 3) * 0.08, 4]} />
          <meshStandardMaterial color={index % 3 === 0 ? "#87a95b" : "#668c4b"} roughness={0.95} />
        </mesh>
      );
    })}
  </group>
);

export const FenceSegment3D: React.FC<WorldVisualProps & { length?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
  length = 3,
}) => {
  const postCount = Math.max(2, Math.floor(length / 0.5) + 1);
  return (
    <group position={position} scale={scale}>
      {Array.from({ length: postCount }, (_, index) => (
        <mesh key={`post-${index}`} position={[-length / 2 + (length / (postCount - 1)) * index, 0.58, 0]} castShadow>
          <boxGeometry args={[0.08, 1.16, 0.12]} />
          <meshStandardMaterial color="#9a714c" roughness={0.9} />
        </mesh>
      ))}
      {[0.3, 0.78].map((height) => (
        <mesh key={height} position={[0, height, 0]} castShadow>
          <boxGeometry args={[length, 0.09, 0.1]} />
          <meshStandardMaterial color="#bd9262" roughness={0.88} />
        </mesh>
      ))}
    </group>
  );
};

export const RoadSegment3D: React.FC<WorldVisualProps & { length?: number; width?: number }> = ({
  position = [0, 0, 0],
  scale = 1,
  length = 8,
  width = 4,
}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0, 0]} receiveShadow>
      <boxGeometry args={[width, 0.08, length]} />
      <meshStandardMaterial color="#3e4a55" roughness={0.42} metalness={0.12} emissive="#14202b" emissiveIntensity={0.18} />
    </mesh>
    {[
      { x: -0.65, z: -2.4, width: 0.5, length: 1.8 },
      { x: 0.45, z: 0.2, width: 0.36, length: 1.35 },
      { x: -0.25, z: 2.5, width: 0.54, length: 1.65 },
    ].map((patch, index) => (
      <mesh key={`wet-patch-${index}`} position={[patch.x, 0.045, patch.z]} scale={[patch.width, 0.012, patch.length]}>
        <sphereGeometry args={[0.5, 16, 10]} />
        <meshBasicMaterial color="#b4d7e8" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    ))}
    {Array.from({ length: Math.floor(length / 1.25) }, (_, index) => (
      <mesh key={index} position={[0, 0.046, -length / 2 + 0.6 + index * 1.25]}>
        <boxGeometry args={[0.08, 0.012, 0.62]} />
        <meshStandardMaterial color="#f4dc9b" emissive="#d4ae52" emissiveIntensity={0.34} />
      </mesh>
    ))}
    {[-1, 1].map((side) => (
      <mesh key={`edge-${side}`} position={[side * (width / 2 - 0.16), 0.047, 0]}>
        <boxGeometry args={[0.055, 0.012, length]} />
        <meshStandardMaterial color="#d6e0e5" emissive="#a7c7d6" emissiveIntensity={0.2} />
      </mesh>
    ))}
    {[-1, 1].map((side) => (
      <mesh key={side} position={[side * (width / 2 + 0.38), 0.015, 0]} receiveShadow>
        <boxGeometry args={[0.72, 0.16, length]} />
        <meshStandardMaterial color="#9aa3a7" roughness={0.84} />
      </mesh>
    ))}
  </group>
);

export const StreetLamp3D: React.FC<WorldVisualProps> = ({
  position = [0, 0, 0],
  scale = 1,
  time = 0,
}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 2.1, 0]} castShadow>
      <cylinderGeometry args={[0.07, 0.11, 4.2, 10]} />
      <meshStandardMaterial color="#46515d" metalness={0.28} roughness={0.68} />
    </mesh>
    <mesh position={[0, 0.12, 0]} castShadow>
      <cylinderGeometry args={[0.24, 0.3, 0.18, 12]} />
      <meshStandardMaterial color="#55616a" roughness={0.82} />
    </mesh>
    <mesh position={[0.42, 4.12, 0]} castShadow>
      <boxGeometry args={[0.92, 0.08, 0.08]} />
      <meshStandardMaterial color="#46515d" metalness={0.28} roughness={0.68} />
    </mesh>
    <mesh position={[0.82, 4.02, 0]} castShadow>
      <boxGeometry args={[0.48, 0.16, 0.32]} />
      <meshStandardMaterial color="#3d4852" roughness={0.68} />
    </mesh>
    <mesh position={[0.82, 3.9, 0]}>
      <sphereGeometry args={[0.11, 14, 10]} />
      <meshStandardMaterial color="#ffe7a3" emissive="#ffc857" emissiveIntensity={1.35 + Math.sin(time * 1.5) * 0.12} />
    </mesh>
    <pointLight position={[0.82, 3.82, 0]} color="#ffd27b" intensity={1.3} distance={8} decay={2} />
  </group>
);

export const House3D: React.FC<WorldVisualProps & { wallColor?: string; roofColor?: string }> = ({
  position = [0, 0, 0],
  scale = 1,
  wallColor = "#d9c7a2",
  roofColor = "#7d4d42",
}) => {
  const slopeLength = Math.sqrt(1 + 0.78 * 0.78);
  const slopeAngle = Math.atan2(0.78, 1);
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 1.44, 1.8]} />
        <meshStandardMaterial color={wallColor} roughness={0.9} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side * 0.5, 1.83, 0]}
          rotation={[0, 0, -side * slopeAngle]}
          castShadow
        >
          <boxGeometry args={[slopeLength, 0.12, 2.02]} />
          <meshStandardMaterial color={roofColor} roughness={0.84} />
        </mesh>
      ))}
      {[-0.9, 0.9].map((side) => (
        <mesh key={side} position={[0, 1.44, side * 0.9]} castShadow>
          <shapeGeometry args={[gable]} />
          <meshStandardMaterial color={wallColor} side={DoubleSide} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0.62, 0.4, 0.91]} castShadow>
        <boxGeometry args={[0.42, 0.8, 0.08]} />
        <meshStandardMaterial color="#694c38" roughness={0.84} />
      </mesh>
      {[-0.55, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.96, 0.925]}>
          <boxGeometry args={[0.36, 0.36, 0.05]} />
          <meshStandardMaterial color="#8fc2d1" metalness={0.12} roughness={0.32} />
        </mesh>
      ))}
    </group>
  );
};

export const Car3D: React.FC<WorldVisualProps & { color?: string }> = ({
  position = [0, 0, 0],
  scale = 1,
  color = "#3976a8",
}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.48, 0]} castShadow>
      <boxGeometry args={[2.25, 0.42, 1.02]} />
      <meshStandardMaterial color={color} metalness={0.22} roughness={0.46} />
    </mesh>
    <mesh position={[0.12, 0.83, 0]} castShadow>
      <boxGeometry args={[1.12, 0.42, 0.86]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.42} />
    </mesh>
    <mesh position={[0.12, 0.85, 0.445]}>
      <boxGeometry args={[0.86, 0.28, 0.025]} />
      <meshStandardMaterial color="#8cc7dc" metalness={0.2} roughness={0.28} />
    </mesh>
    {[-0.72, 0.72].flatMap((x) =>
      [-0.54, 0.54].map((z) => (
        <Wheel3D key={`${x}-${z}`} position={[x, 0.28, z]} radius={0.28} />
      )),
    )}
    {[-1, 1].map((side) => (
      <mesh key={side} position={[1.13, 0.55, side * 0.28]}>
        <boxGeometry args={[0.05, 0.14, 0.18]} />
        <meshStandardMaterial color="#f7e3a1" emissive="#f2bc49" emissiveIntensity={0.35} />
      </mesh>
    ))}
  </group>
);

export const Motorcycle3D: React.FC<WorldVisualProps & { color?: string }> = ({
  position = [0, 0, 0],
  scale = 1,
  color = "#c4473d",
}) => (
  <group position={position} scale={scale}>
    <Wheel3D position={[-0.72, 0.32, 0]} radius={0.3} />
    <Wheel3D position={[0.72, 0.32, 0]} radius={0.3} />
    <Rod3D from={[-0.72, 0.32, 0]} to={[-0.18, 0.68, 0]} radius={0.035} color="#68747d" />
    <Rod3D from={[-0.18, 0.68, 0]} to={[0.2, 0.35, 0]} radius={0.035} color="#68747d" />
    <Rod3D from={[0.2, 0.35, 0]} to={[0.72, 0.32, 0]} radius={0.035} color="#68747d" />
    <Rod3D from={[0.72, 0.32, 0]} to={[0.48, 0.93, 0]} radius={0.04} color="#68747d" />
    <mesh position={[0.08, 0.72, 0]} castShadow>
      <sphereGeometry args={[0.3, 12, 8]} />
      <meshStandardMaterial color={color} metalness={0.22} roughness={0.42} />
    </mesh>
    <mesh position={[-0.36, 0.85, 0]} castShadow>
      <boxGeometry args={[0.62, 0.1, 0.34]} />
      <meshStandardMaterial color="#292d31" roughness={0.72} />
    </mesh>
    <Rod3D from={[0.42, 0.95, 0]} to={[0.78, 1.02, 0]} radius={0.025} color="#69747c" />
    <mesh position={[0.78, 1.02, 0]}>
      <sphereGeometry args={[0.11, 12, 8]} />
      <meshStandardMaterial color="#f4e3a5" emissive="#f1c25b" emissiveIntensity={0.28} />
    </mesh>
  </group>
);

export const HeatedAirColumn3D: React.FC<
  WorldVisualProps & { stage?: "heat" | "expand" | "cool" }
> = ({ position = [0, 0, 0], scale = 1, time = 0, stage = "heat" }) => {
  const progress = Math.min(1, Math.max(0, time / 1.6));
  const spread = stage === "expand" ? 0.35 + progress * 0.9 : stage === "cool" ? 0.35 : 0.18;
  const height = stage === "expand" ? 1.5 + progress * 0.55 : stage === "cool" ? 1.45 : 1.8;
  const color = stage === "cool" ? "#67d7ed" : "#fb923c";

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[spread * 0.8, spread * 0.48, height, 24, 1, true]} />
        <meshStandardMaterial color={color} transparent opacity={0.28} roughness={0.4} side={DoubleSide} />
      </mesh>
      {Array.from({ length: 7 }, (_, index) => {
        const rise = (time * 0.45 + index * 0.16) % 1.25;
        const wobble = Math.sin(time * 2 + index * 1.7) * spread * 0.62;
        return (
          <mesh key={index} position={[wobble, 0.15 + rise + index * 0.12, 0.08]}>
            <sphereGeometry args={[0.12 + spread * 0.12, 12, 10]} />
            <meshStandardMaterial color={color} transparent opacity={0.45} emissive={color} emissiveIntensity={0.35} />
          </mesh>
        );
      })}
      {stage === "expand" && Array.from({ length: 3 }, (_, index) => {
        const ringPhase = (progress * 0.7 + index / 3) % 1;
        const radius = 0.28 + ringPhase * 0.72;
        return (
          <mesh
            key={`pressure-ring-${index}`}
            position={[0, 0.3 + index * 0.56, 0.02]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[radius, 0.018, 6, 28]} />
            <meshBasicMaterial color="#ffd6a8" transparent opacity={0.16 + (1 - ringPhase) * 0.34} />
          </mesh>
        );
      })}
      <pointLight position={[0, 0.8, 0.3]} color={color} intensity={stage === "cool" ? 0.35 : 1.1} distance={4} />
    </group>
  );
};

export const SoundWaveTravel3D: React.FC<WorldVisualProps> = ({
  position = [0, 0, 0],
  scale = 1,
  time = 0,
}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.12, 0]}>
      <boxGeometry args={[6.5, 0.035, 0.06]} />
      <meshBasicMaterial color="#34506b" transparent opacity={0.75} />
    </mesh>
    {[-3.1, 3.1].map((x, index) => (
      <mesh key={x} position={[x, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[index === 0 ? 0.48 : 0.4, 0.025, 6, 32]} />
        <meshBasicMaterial color={index === 0 ? "#fde047" : "#93c5fd"} transparent opacity={0.72} />
      </mesh>
    ))}
    <mesh position={[-3.1, 0.2, 0]}>
      <sphereGeometry args={[0.28, 16, 12]} />
      <meshStandardMaterial color="#fde047" emissive="#facc15" emissiveIntensity={0.8} />
    </mesh>
    <mesh position={[3.1, 0.2, 0]}>
      <sphereGeometry args={[0.24, 16, 12]} />
      <meshStandardMaterial color="#dbeafe" emissive="#93c5fd" emissiveIntensity={0.24} />
    </mesh>
    {Array.from({ length: 4 }, (_, index) => {
      const progress = (time * 0.48 + index * 0.18) % 1;
      const x = -2.55 + progress * 5.1;
      const radius = 0.42 + progress * 0.34;
      return (
        <mesh key={index} position={[x, 0.42, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[radius, 0.035, 8, 36]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.48} transparent opacity={0.78} />
        </mesh>
      );
    })}
    <pointLight position={[-3.1, 0.3, 0]} color="#fde047" intensity={0.75} distance={3} />
  </group>
);

export const LightningDistanceScale3D: React.FC<WorldVisualProps> = ({
  position = [0, 0, 0],
  scale = 1,
  time = 0,
}) => {
  const active = Math.floor(time * 1.25) % 3;
  const marks = [-1.35, 0, 1.35];

  return (
    <group position={position} scale={scale}>
      <group position={[-2.65, 2.2, 0]} scale={1.25}>
        <CloudMass3D color="#566171" />
      </group>
      <group position={[-2.65, 1.25, 0]}>
        <Rod3D from={[0, 0.3, 0]} to={[-0.2, -0.2, 0]} radius={0.055} color="#fde047" />
        <Rod3D from={[-0.2, -0.2, 0]} to={[0.12, -0.62, 0]} radius={0.045} color="#fde047" />
        <pointLight position={[0, -0.1, 0.5]} color="#facc15" intensity={0.8} distance={3} />
      </group>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[6.3, 0.05, 0.12]} />
        <meshStandardMaterial color="#64748b" roughness={0.72} />
      </mesh>
      {marks.map((x, index) => {
        const lit = index === active;
        return (
          <group key={x} position={[x, 0.38, 0]}>
            <mesh>
              <sphereGeometry args={[0.2, 16, 12]} />
              <meshStandardMaterial
                color={lit ? "#38bdf8" : "#64748b"}
                emissive={lit ? "#0ea5e9" : "#1e293b"}
                emissiveIntensity={lit ? 1.2 : 0.1}
              />
            </mesh>
            <pointLight color="#38bdf8" intensity={lit ? 0.5 : 0} distance={1.2} />
          </group>
        );
      })}
      <group position={[2.65, 0, 0]}>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.14, 0.2, 0.9, 10]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.86} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.22, 14, 12]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.78} />
        </mesh>
      </group>
    </group>
  );
};

export const ShelterInterior3D: React.FC<
  WorldVisualProps & { doorProgress?: number }
> = ({ position = [0, 0, 0], scale = 1, doorProgress = 0 }) => {
  const doorAngle = Math.max(0, Math.min(1, doorProgress)) * 1.08;

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[6.2, 0.16, 5.6]} />
        <meshStandardMaterial color="#604a3c" roughness={0.92} />
      </mesh>
      <mesh position={[0, 1.7, -2.8]} receiveShadow>
        <boxGeometry args={[6.2, 3.4, 0.16]} />
        <meshStandardMaterial color="#d6c6a9" roughness={0.9} />
      </mesh>
      {[-3.02, 3.02].map((x) => (
        <mesh key={x} position={[x, 1.7, 0]} receiveShadow>
          <boxGeometry args={[0.16, 3.4, 5.6]} />
          <meshStandardMaterial color="#c5b396" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 3.4, 0]}>
        <boxGeometry args={[6.2, 0.14, 5.6]} />
        <meshStandardMaterial color="#b9a78e" roughness={0.92} />
      </mesh>
      <group position={[1.42, 0, -2.68]} rotation={[0, -doorAngle, 0]}>
        <mesh position={[-0.68, 1.02, 0]} castShadow>
          <boxGeometry args={[1.36, 2.04, 0.12]} />
          <meshStandardMaterial color="#684b37" roughness={0.78} />
        </mesh>
        <mesh position={[-0.2, 1.02, 0.08]}>
          <sphereGeometry args={[0.065, 12, 10]} />
          <meshStandardMaterial color="#e5c27b" metalness={0.55} roughness={0.38} />
        </mesh>
      </group>
      <mesh position={[-2.91, 1.9, -0.25]}>
        <boxGeometry args={[0.04, 1.25, 1.6]} />
        <meshStandardMaterial color="#24465a" emissive="#17384b" emissiveIntensity={0.65} />
      </mesh>
      <group position={[-1.2, 0, -0.55]}>
        <mesh position={[0, 0.48, 0]} castShadow>
          <boxGeometry args={[1.5, 0.34, 0.75]} />
          <meshStandardMaterial color="#586270" roughness={0.88} />
        </mesh>
        {[-0.58, 0.58].map((x) => (
          <mesh key={x} position={[x, 0.2, 0.24]}>
            <boxGeometry args={[0.1, 0.4, 0.1]} />
            <meshStandardMaterial color="#46392f" roughness={0.88} />
          </mesh>
        ))}
      </group>
      <mesh position={[0.6, 2.95, 0.5]}>
        <sphereGeometry args={[0.15, 12, 10]} />
        <meshStandardMaterial color="#ffe7a3" emissive="#f4c86a" emissiveIntensity={0.9} />
      </mesh>
      <pointLight position={[0.6, 2.75, 0.5]} color="#ffd78a" intensity={1.25} distance={8} />
    </group>
  );
};
