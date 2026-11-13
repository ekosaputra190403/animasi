import React from "react";

export const HammerProp3D: React.FC = () => (
  <group rotation={[0, 0, -0.28]}>
    <mesh position={[0, -0.23, 0]} castShadow>
      <cylinderGeometry args={[0.035, 0.045, 0.48, 8]} />
      <meshStandardMaterial color="#785337" roughness={0.88} />
    </mesh>
    <mesh position={[0, -0.44, 0]} castShadow>
      <boxGeometry args={[0.26, 0.13, 0.14]} />
      <meshStandardMaterial color="#393936" metalness={0.38} roughness={0.62} />
    </mesh>
  </group>
);

export const ChiselProp3D: React.FC = () => (
  <group rotation={[0, 0, -0.18]}>
    <mesh position={[0, -0.18, 0]} castShadow>
      <cylinderGeometry args={[0.035, 0.05, 0.3, 8]} />
      <meshStandardMaterial color="#785337" roughness={0.88} />
    </mesh>
    <mesh position={[0, -0.38, 0]}>
      <coneGeometry args={[0.045, 0.28, 6]} />
      <meshStandardMaterial color="#c0c6c3" metalness={0.72} roughness={0.38} />
    </mesh>
  </group>
);

export const CannonballProp3D: React.FC = () => (
  <mesh castShadow>
    <sphereGeometry args={[0.14, 12, 10]} />
    <meshStandardMaterial color="#383a39" metalness={0.62} roughness={0.43} />
  </mesh>
);

export const TimberPlankProp3D: React.FC = () => (
  <mesh position={[0, -0.65, 0]} castShadow>
    <boxGeometry args={[0.1, 1.5, 0.14]} />
    <meshStandardMaterial color="#9b7042" roughness={0.9} />
  </mesh>
);
