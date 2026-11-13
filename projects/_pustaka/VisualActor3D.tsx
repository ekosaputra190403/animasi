import React, { type ReactNode } from "react";

export type HistoricalRole = "sailor" | "worker" | "courtier" | "townsfolk" | "visitor";
export type HistoricalAction = "stand" | "work" | "haul" | "signal" | "react" | "walk" | "observe" | "push";

const historicalPalette: Record<HistoricalRole, { coat: string; trousers: string; hat: string }> = {
  sailor: { coat: "#38576a", trousers: "#493c32", hat: "#273b4b" },
  worker: { coat: "#78533a", trousers: "#4b4438", hat: "#5b4130" },
  courtier: { coat: "#713d35", trousers: "#342c2b", hat: "#bd9652" },
  townsfolk: { coat: "#64704e", trousers: "#494335", hat: "#594633" },
  visitor: { coat: "#526c68", trousers: "#484a43", hat: "#67513a" },
};

export const VisualActor3D: React.FC<{
  role: HistoricalRole;
  action: HistoricalAction;
  t: number;
  phase?: number;
  scale?: number;
  skinColor?: string;
  leftHandProp?: ReactNode;
  rightHandProp?: ReactNode;
}> = ({
  role,
  action,
  t,
  phase = 0,
  scale = 1,
  skinColor = "#bd8d69",
  leftHandProp,
  rightHandProp,
}) => {
  const palette = historicalPalette[role];
  const motion = Math.sin(t * (action === "work" ? 7 : action === "push" ? 3.2 : 4.5) + phase);
  const stride = action === "walk" ? motion * 0.32 : action === "react" ? motion * 0.08 : 0;
  const lean = action === "react"
    ? 0.1 + Math.abs(motion) * 0.08
    : action === "haul"
      ? 0.09
      : action === "push"
        ? 0.05 + Math.abs(motion) * 0.025
        : 0;
  const leftArm =
    action === "haul"
      ? -0.82
      : action === "work"
        ? -0.55 + motion * 0.15
        : action === "signal"
          ? -1.2
          : action === "react"
            ? -0.95
            : action === "walk"
              ? -stride
              : action === "push"
                ? -0.3
                : 0.12;
  const rightArm =
    action === "haul"
      ? 0.78
      : action === "work"
        ? 0.95 + motion * 0.18
        : action === "signal"
          ? 1.25
          : action === "react"
            ? 0.92
            : action === "walk"
              ? stride
              : action === "push"
                ? 0.3
                : -0.12;

  const arm = (side: -1 | 1, angle: number, prop?: ReactNode) => (
    <group
      key={`arm-${side}`}
      position={[side * 0.22, 1.04, 0]}
      rotation={[action === "push" ? -Math.PI / 2 : 0, 0, angle]}
    >
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 0.42, 7]} />
        <meshStandardMaterial color={palette.coat} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.43, 0]}>
        <sphereGeometry args={[0.075, 7, 6]} />
        <meshStandardMaterial color={skinColor} roughness={0.82} />
      </mesh>
      {prop && <group position={[0, -0.43, 0]}>{prop}</group>}
    </group>
  );

  return (
    <group scale={scale} rotation={[0, 0, lean]}>
      <mesh position={[0, 0.82, -0.06]} castShadow>
        <cylinderGeometry args={[0.2, 0.28, 0.62, 8]} />
        <meshStandardMaterial color={palette.coat} roughness={0.9} />
      </mesh>
      {role === "courtier" && (
        <mesh position={[0, 0.84, -0.16]} castShadow>
          <boxGeometry args={[0.42, 0.72, 0.08]} />
          <meshStandardMaterial color="#a54c3d" roughness={0.88} />
        </mesh>
      )}
      <mesh position={[0, 1.31, 0]} castShadow>
        <sphereGeometry args={[0.19, 10, 8]} />
        <meshStandardMaterial color={skinColor} roughness={0.78} />
      </mesh>
      <mesh position={[0, 1.49, 0]} castShadow>
        {role === "courtier" ? <coneGeometry args={[0.22, 0.16, 5]} /> : <cylinderGeometry args={[0.17, 0.2, 0.1, 8]} />}
        <meshStandardMaterial color={palette.hat} roughness={0.82} metalness={role === "courtier" ? 0.25 : 0} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={`eye-${side}`} position={[side * 0.065, 1.32, 0.164]}>
          <sphereGeometry args={[0.018, 6, 5]} />
          <meshBasicMaterial color="#241d19" />
        </mesh>
      ))}
      {arm(-1, leftArm, leftHandProp)}
      {arm(1, rightArm, rightHandProp)}
      {[-1, 1].map((side) => (
        <group key={`leg-${side}`} position={[side * 0.11, 0.5, 0]} rotation={[0, 0, side < 0 ? -stride : stride]}>
          <mesh position={[0, -0.23, 0]} castShadow>
            <cylinderGeometry args={[0.085, 0.1, 0.44, 7]} />
            <meshStandardMaterial color={palette.trousers} roughness={0.94} />
          </mesh>
          <mesh position={[0, -0.46, 0.06]}>
            <boxGeometry args={[0.17, 0.09, 0.28]} />
            <meshStandardMaterial color="#292825" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
