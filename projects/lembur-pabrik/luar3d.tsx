import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { Pose, W, H } from "./kamera";

// Set 3D tambahan: (1) pabrik dilihat dari luar saat malam (referensi pemilik no. 1),
// (2) pos satpam dengan deretan monitor CCTV (referensi no. 2). Satuan meter, lantai y = 0.

const CameraRig: React.FC<{ pose: Pose }> = ({ pose }) => {
  const { camera } = useThree();
  const cam = camera as THREE.PerspectiveCamera;
  cam.fov = pose.fov;
  cam.aspect = W / H;
  cam.position.set(...pose.pos);
  cam.lookAt(...pose.look);
  cam.updateProjectionMatrix();
  return null;
};

const Box: React.FC<{ p: [number, number, number]; s: [number, number, number]; c: string; e?: string; ei?: number; rot?: [number, number, number]; cast?: boolean; map?: THREE.Texture }> = ({ p, s, c, e, ei = 0, rot, cast = true, map }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} emissive={e ?? "#000000"} emissiveIntensity={ei} roughness={0.85} map={map} />
  </mesh>
);

// Angka acak tetap (supaya setiap frame sama).
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ===========================================================================
// 1. Pabrik dari luar, malam
// ===========================================================================
// Gedung utama di tengah menghadap +z. Jendela karyawan = satu-satunya yang menyala.
export const JENDELA_NYALA: [number, number, number] = [-2.2, 4.6, 6.06];

// Atap pelana merah: dua papan miring di atas kotak gedung.
const Gedung: React.FC<{ x: number; z: number; w: number; h: number; d: number; jendela?: [number, number][]; nyala?: [number, number] | null; nyalaKuat?: number }> = ({ x, z, w, h, d, jendela = [], nyala = null, nyalaKuat = 1 }) => {
  const roofH = Math.min(2.2, w * 0.18);
  const half = w / 2;
  const slope = Math.atan2(roofH, half);
  const len = Math.hypot(half, roofH) + 0.25;
  return (
    <group position={[x, 0, z]}>
      <Box p={[0, h / 2, 0]} s={[w, h, d]} c="#8d99a7" />
      {/* atap merah */}
      <Box p={[-half / 2, h + roofH / 2, 0]} s={[len, 0.22, d + 0.5]} c="#b23a32" rot={[0, 0, slope]} />
      <Box p={[half / 2, h + roofH / 2, 0]} s={[len, 0.22, d + 0.5]} c="#b23a32" rot={[0, 0, -slope]} />
      {/* dinding segitiga depan (gable) */}
      <mesh position={[0, h, d / 2 + 0.01]}>
        <shapeGeometry args={[new THREE.Shape([new THREE.Vector2(-half, 0), new THREE.Vector2(half, 0), new THREE.Vector2(0, roofH)])]} />
        <meshStandardMaterial color="#66727e" />
      </mesh>
      {/* jendela */}
      {jendela.map(([jx, jy], i) => {
        const on = nyala && nyala[0] === jx && nyala[1] === jy;
        return (
          <group key={i} position={[jx, jy, d / 2 + 0.02]}>
            <Box p={[0, 0, 0]} s={[1.0, 0.8, 0.06]} c="#2a3138" cast={false} />
            <Box p={[0, 0, 0.03]} s={[0.86, 0.66, 0.02]} c={on ? "#ffd58e" : "#17202b"} e={on ? "#ffc46b" : "#0d1520"} ei={on ? 2.4 * nyalaKuat : 0.3} cast={false} />
            <Box p={[0, 0, 0.05]} s={[0.04, 0.66, 0.02]} c="#2a3138" cast={false} />
          </group>
        );
      })}
    </group>
  );
};

const Silo: React.FC<{ x: number; z: number; r: number; h: number }> = ({ x, z, r, h }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[r, r, h, 28]} />
      <meshStandardMaterial color="#b9bec3" roughness={0.6} metalness={0.2} />
    </mesh>
    <mesh position={[0, h + r * 0.3, 0]} castShadow>
      <coneGeometry args={[r * 1.02, r * 0.6, 28]} />
      <meshStandardMaterial color="#9da3a8" />
    </mesh>
    {[0.25, 0.5, 0.75].map((k) => (
      <mesh key={k} position={[0, h * k, 0]}>
        <torusGeometry args={[r + 0.02, 0.04, 6, 28]} />
        <meshStandardMaterial color="#8c9297" />
      </mesh>
    ))}
  </group>
);

const Cerobong: React.FC<{ x: number; z: number; h: number }> = ({ x, z, h }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, h / 2, 0]} castShadow>
      <cylinderGeometry args={[0.55, 0.75, h, 20]} />
      <meshStandardMaterial color="#8b8f93" />
    </mesh>
    <mesh position={[0, h - 0.6, 0]}>
      <cylinderGeometry args={[0.6, 0.6, 0.4, 20]} />
      <meshStandardMaterial color="#b23a32" />
    </mesh>
  </group>
);

// Semak / pohon palem sederhana.
const Semak: React.FC<{ x: number; z: number; s: number }> = ({ x, z, s }) => (
  <mesh position={[x, s * 0.45, z]} castShadow>
    <sphereGeometry args={[s, 12, 10]} />
    <meshStandardMaterial color="#20402a" roughness={1} />
  </mesh>
);
const Palem: React.FC<{ x: number; z: number; h: number }> = ({ x, z, h }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, h / 2, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.18, h, 8]} />
      <meshStandardMaterial color="#4a3a2a" />
    </mesh>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <mesh key={i} position={[Math.cos(i * 1.05) * 0.9, h - 0.15, Math.sin(i * 1.05) * 0.9]} rotation={[Math.sin(i * 1.05) * 0.6, -i * 1.05, -Math.cos(i * 1.05) * 0.6]} castShadow>
        <boxGeometry args={[2.0, 0.05, 0.45]} />
        <meshStandardMaterial color="#2b5a35" />
      </mesh>
    ))}
  </group>
);

const LampuJalan: React.FC<{ x: number; z: number }> = ({ x, z }) => (
  <group position={[x, 0, z]}>
    <Box p={[0, 2.2, 0]} s={[0.12, 4.4, 0.12]} c="#3b4148" />
    <Box p={[0.35, 4.35, 0]} s={[0.8, 0.12, 0.12]} c="#3b4148" />
    <Box p={[0.7, 4.22, 0]} s={[0.32, 0.12, 0.22]} c="#ffe2a8" e="#ffcf7a" ei={2.2} cast={false} />
    <pointLight position={[0.7, 4.0, 0]} color="#ffcf8a" intensity={14} distance={11} decay={2} />
  </group>
);

const Bintang: React.FC = () => {
  const geo = useMemo(() => {
    const n = 420;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = rnd(i) * Math.PI * 2;
      const e = 0.12 + rnd(i + 999) * 1.2;
      const r = 160;
      pos[i * 3] = Math.cos(a) * Math.cos(e) * r;
      pos[i * 3 + 1] = Math.sin(e) * r;
      pos[i * 3 + 2] = Math.sin(a) * Math.cos(e) * r - 40;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);
  return (
    <points geometry={geo}>
      <pointsMaterial color="#e8eeff" size={0.9} sizeAttenuation fog={false} />
    </points>
  );
};

export type LuarState = { t: number; jendela?: number /* 0..1 lampu jendela karyawan */ };

export const LuarPabrik3D: React.FC<{ pose: Pose; s: LuarState }> = ({ pose, s }) => {
  const { jendela = 1 } = s;
  // Jendela gedung utama: dua baris.
  const jendelaUtama: [number, number][] = [];
  for (const jy of [2.0, 4.6]) for (const jx of [-5.6, -3.9, -2.2, -0.5, 1.2, 2.9, 4.6]) jendelaUtama.push([jx, jy]);
  // Jalan tanah berkelok dari depan menuju gerbang.
  const jalan = useMemo(() => {
    const sh = new THREE.Shape();
    const pts: [number, number][] = [];
    for (let i = 0; i <= 20; i++) {
      const z = 8 + i * 3.2;
      pts.push([Math.sin(i * 0.35) * 4 - 1, z]);
    }
    sh.moveTo(pts[0][0] - 2.2, pts[0][1]);
    pts.forEach(([x, z]) => sh.lineTo(x - 2.2 - z * 0.02, z));
    for (let i = pts.length - 1; i >= 0; i--) sh.lineTo(pts[i][0] + 2.2 + pts[i][1] * 0.02, pts[i][1]);
    return sh;
  }, []);
  return (
    <ThreeCanvas width={W} height={H} shadows camera={{ fov: pose.fov, near: 0.1, far: 400 }} gl={{ antialias: true }}>
      <CameraRig pose={pose} />
      <color attach="background" args={["#0d1426"]} />
      <fog attach="fog" args={["#141c30", 45, 150]} />
      <ambientLight color="#6a7cb0" intensity={1.5} />
      <hemisphereLight args={["#9aaad8", "#203024", 1.0]} />
      {/* cahaya bulan dari kanan belakang */}
      <directionalLight position={[20, 50, -60]} color="#d6e0f8" intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-40} />
      {/* bulan purnama */}
      <mesh position={[8, 23, -100]}>
        <sphereGeometry args={[8, 40, 40]} />
        <meshBasicMaterial color="#f1f0e6" fog={false} />
      </mesh>
      <mesh position={[8, 23, -102]}>
        <sphereGeometry args={[13, 32, 32]} />
        <meshBasicMaterial color="#9fb0d8" transparent opacity={0.18} fog={false} />
      </mesh>
      <Bintang />

      {/* tanah rumput + jalan tanah */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#26402a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <shapeGeometry args={[jalan]} />
        <meshStandardMaterial color="#7a6646" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {/* halaman beton depan pabrik */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 8]} receiveShadow>
        <planeGeometry args={[30, 6]} />
        <meshStandardMaterial color="#5a5e62" roughness={1} />
      </mesh>

      {/* gedung-gedung */}
      <Gedung x={0} z={0} w={14} h={6} d={12} jendela={jendelaUtama} nyala={[-2.2, 4.6]} nyalaKuat={jendela} />
      <Gedung x={-12} z={1} w={8} h={4.5} d={10} jendela={[[-2, 2], [0, 2], [2, 2]]} />
      <Gedung x={-19.5} z={2} w={6} h={3.8} d={8} jendela={[[-1.2, 1.8], [1.2, 1.8]]} />
      <Gedung x={11.5} z={-1} w={7} h={4.2} d={9} jendela={[[-1.6, 2], [1.6, 2]]} />
      <Silo x={17} z={4} r={1.6} h={7} />
      <Silo x={20.6} z={3} r={1.6} h={7} />
      <Silo x={-24.5} z={-2} r={1.3} h={5.5} />
      <Cerobong x={3.6} z={-3} h={14} />
      <Cerobong x={6.4} z={-4} h={11} />
      {/* pipa antar-gedung */}
      <Box p={[11, 5.2, 4.2]} s={[9, 0.3, 0.3]} c="#9aa0a6" />
      <Box p={[15.4, 3.2, 4.2]} s={[0.3, 4.2, 0.3]} c="#9aa0a6" />
      <Box p={[-8, 4.8, 6.4]} s={[0.3, 0.3, 1.2]} c="#9aa0a6" />
      {/* pagar depan */}
      {Array.from({ length: 26 }, (_, i) => -26 + i * 2.1).filter((x) => Math.abs(x + 1) > 3.4).map((x) => (
        <Box key={x} p={[x, 0.7, 11.5]} s={[0.12, 1.4, 0.12]} c="#454b52" />
      ))}
      <Box p={[-14.6, 1.25, 11.5]} s={[22.8, 0.08, 0.08]} c="#454b52" cast={false} />
      <Box p={[13.6, 1.25, 11.5]} s={[24.8, 0.08, 0.08]} c="#454b52" cast={false} />
      {/* papan nama gerbang */}
      <Box p={[-4.6, 1.6, 11.6]} s={[0.25, 3.2, 0.25]} c="#3b4148" />
      <Box p={[2.6, 1.6, 11.6]} s={[0.25, 3.2, 0.25]} c="#3b4148" />
      <Box p={[-1, 3.1, 11.6]} s={[7.4, 0.6, 0.1]} c="#2c3a52" e="#1b2a44" ei={0.4} />
      {/* lampu jalan */}
      <LampuJalan x={-6} z={13} />
      <LampuJalan x={5} z={20} />
      {/* tanaman */}
      {[[-30, 18, 2.2], [-22, 22, 1.6], [-14, 26, 2.4], [16, 16, 2], [24, 22, 2.6], [30, 14, 1.8], [-34, 6, 2.4], [34, 2, 2.2], [12, 30, 1.8], [-8, 34, 2]].map(([x, z, r], i) => (
        <Semak key={i} x={x} z={z} s={r} />
      ))}
      <Palem x={9} z={14} h={5} />
      <Palem x={-11} z={16} h={6} />
      <Palem x={22} z={9} h={5.5} />
      {/* bukit jauh */}
      {[[-70, -90, 30], [-20, -110, 26], [40, -120, 34], [90, -80, 28]].map(([x, z, r], i) => (
        <mesh key={i} position={[x, -r * 0.55, z]}>
          <sphereGeometry args={[r, 24, 16]} />
          <meshStandardMaterial color="#1a2433" roughness={1} />
        </mesh>
      ))}
    </ThreeCanvas>
  );
};

// ===========================================================================
// 2. Pos satpam + monitor CCTV
// ===========================================================================
// Ruangan kecil: dinding belakang z = -1.6, kiri x = -2.2, kanan x = 2.2.
// Monitor utama di meja (tengah) = monitor yang kameranya didekati; isinya diganti overlay
// rekaman CCTV (lihat MONITOR_UTAMA, sudut-sudutnya diproyeksikan ke layar).
export const MONITOR_UTAMA = { x: 0, y: 1.08, z: -0.98, w: 0.62, h: 0.38 };
export const SATPAM_BERDIRI = { x: -0.52, z: -0.5 };

const layarTex = (label: string, seed: number) => {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 160;
  const g = c.getContext("2d")!;
  g.fillStyle = "#9aa3a6";
  g.fillRect(0, 0, 256, 160);
  // lorong / parkiran sederhana
  g.fillStyle = "#c7cdcf";
  g.beginPath();
  g.moveTo(40 + seed * 10, 160);
  g.lineTo(110 + seed * 6, 60);
  g.lineTo(150 + seed * 6, 60);
  g.lineTo(220 - seed * 8, 160);
  g.fill();
  g.fillStyle = "#6f777a";
  g.fillRect(0, 0, 256, 60);
  g.fillStyle = "#5b6366";
  for (let i = 0; i < 3; i++) g.fillRect(20 + i * 80 + seed * 5, 25, 30, 30);
  g.fillStyle = "#ffffff";
  g.font = "bold 20px Arial";
  g.fillText(label, 150, 150);
  // garis pindai
  g.fillStyle = "rgba(0,0,0,0.12)";
  for (let y = 0; y < 160; y += 4) g.fillRect(0, y, 256, 1);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const Monitor: React.FC<{ p: [number, number, number]; w: number; h: number; tex?: THREE.Texture; layarKosong?: boolean; kaki?: boolean }> = ({ p, w, h, tex, layarKosong, kaki = true }) => (
  <group position={p}>
    <Box p={[0, 0, -0.03]} s={[w + 0.06, h + 0.06, 0.05]} c="#1c1f22" />
    <mesh position={[0, 0, 0.0]}>
      <planeGeometry args={[w, h]} />
      {layarKosong ? <meshBasicMaterial color="#0c0f10" /> : <meshBasicMaterial map={tex} toneMapped={false} />}
    </mesh>
    {kaki && <Box p={[0, -h / 2 - 0.08, -0.04]} s={[0.05, 0.14, 0.05]} c="#1c1f22" />}
    {kaki && <Box p={[0, -h / 2 - 0.15, -0.04]} s={[0.24, 0.02, 0.16]} c="#1c1f22" />}
  </group>
);

export const PosSatpam3D: React.FC<{ pose: Pose; s: { t: number } }> = ({ pose }) => {
  const tex = useMemo(() => [1, 2, 3, 4, 5, 6, 7].map((i) => layarTex(`CAM ${i}`, i % 3)), []);
  const MU = MONITOR_UTAMA;
  return (
    <ThreeCanvas width={W} height={H} shadows camera={{ fov: pose.fov, near: 0.05, far: 50 }} gl={{ antialias: true }}>
      <CameraRig pose={pose} />
      <color attach="background" args={["#0c1112"]} />
      <ambientLight color="#5d7a7a" intensity={0.75} />
      <hemisphereLight args={["#7aa0a0", "#1a1a1a", 0.5]} />
      {/* cahaya kebiruan dari monitor + lampu meja hangat */}
      <pointLight position={[0, 1.6, -0.6]} color="#bfe1ff" intensity={4} distance={4} decay={2} />
      <spotLight position={[-1.3, 1.7, -0.4]} target-position={[-0.9, 0.75, -0.7]} color="#ffcf8a" intensity={10} angle={0.7} penumbra={0.6} distance={5} decay={2} castShadow />
      <pointLight position={[0, 2.7, 0.8]} color="#cfe0e0" intensity={5} distance={6} decay={2} castShadow />

      {/* lantai, dinding, plafon */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#3e4644" roughness={0.9} />
      </mesh>
      <Box p={[0, 1.5, -1.6]} s={[4.4, 3, 0.1]} c="#2f4a4a" cast={false} />
      <Box p={[-2.2, 1.5, 0]} s={[0.1, 3, 3.4]} c="#2b4444" cast={false} />
      <Box p={[2.2, 1.5, 0]} s={[0.1, 3, 3.4]} c="#2b4444" cast={false} />
      <Box p={[0, 3.0, 0]} s={[4.4, 0.08, 3.4]} c="#263838" cast={false} />
      {/* rel monitor dinding + 4 monitor dinding */}
      <Box p={[0, 2.62, -1.52]} s={[3.6, 0.06, 0.06]} c="#1c1f22" />
      <Monitor p={[-1.25, 2.2, -1.48]} w={0.8} h={0.5} tex={tex[0]} kaki={false} />
      <Monitor p={[-0.38, 2.2, -1.48]} w={0.8} h={0.5} tex={tex[1]} kaki={false} />
      <Monitor p={[0.49, 2.2, -1.48]} w={0.8} h={0.5} tex={tex[2]} kaki={false} />
      <Monitor p={[1.36, 2.2, -1.48]} w={0.8} h={0.5} tex={tex[3]} kaki={false} />
      {/* meja panjang + 3 monitor meja */}
      <Box p={[0, 0.74, -1.0]} s={[2.8, 0.05, 0.85]} c="#c8a06c" />
      {[-1.3, 1.3].map((x) => <Box key={x} p={[x, 0.37, -1.0]} s={[0.06, 0.74, 0.75]} c="#9aa0a6" />)}
      <Box p={[0, 0.4, -1.38]} s={[2.6, 0.6, 0.04]} c="#a07c50" cast={false} />
      <Monitor p={[-0.75, 1.03, -1.02]} w={0.56} h={0.34} tex={tex[4]} />
      <Monitor p={[MU.x, MU.y, MU.z]} w={MU.w} h={MU.h} layarKosong />
      <Monitor p={[0.75, 1.03, -1.02]} w={0.56} h={0.34} tex={tex[5]} />
      {/* barang di meja: buku tamu, termos, radio, senter, lampu meja */}
      <Box p={[-0.35, 0.78, -0.72]} s={[0.3, 0.03, 0.22]} c="#2f5d8a" />
      <Box p={[-0.35, 0.795, -0.72]} s={[0.27, 0.005, 0.19]} c="#f3efe2" cast={false} />
      <mesh position={[1.05, 0.88, -0.82]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.24, 14]} />
        <meshStandardMaterial color="#b23a32" />
      </mesh>
      <Box p={[0.45, 0.82, -0.7]} s={[0.08, 0.12, 0.04]} c="#1c1f22" />
      <Box p={[0.62, 0.78, -0.66]} s={[0.2, 0.05, 0.06]} c="#37474f" rot={[0, 0.4, 0]} />
      <Box p={[-1.1, 0.95, -1.15]} s={[0.04, 0.4, 0.04]} c="#2b2b2b" />
      <Box p={[-1.0, 1.15, -1.1]} s={[0.22, 0.08, 0.14]} c="#2b2b2b" e="#ffcf8a" ei={0.5} />
      {/* kursi kantor di depan meja (kosong, satpam berdiri) */}
      <Box p={[-0.9, 0.48, -0.3]} s={[0.48, 0.07, 0.46]} c="#26292c" />
      <Box p={[-0.9, 0.8, -0.07]} s={[0.46, 0.55, 0.06]} c="#26292c" rot={[0.12, 0, 0]} />
      <Box p={[-0.9, 0.24, -0.3]} s={[0.05, 0.44, 0.05]} c="#3b3f43" />
      <Box p={[-0.9, 0.03, -0.3]} s={[0.5, 0.03, 0.06]} c="#3b3f43" />
      <Box p={[-0.9, 0.03, -0.3]} s={[0.06, 0.03, 0.5]} c="#3b3f43" />
      {/* papan jadwal jaga + jam di dinding kiri, rak kunci di kanan */}
      <Box p={[-2.14, 1.7, -0.3]} s={[0.03, 0.7, 0.9]} c="#e8e2d0" />
      {[0, 1, 2, 3].map((i) => <Box key={i} p={[-2.12, 1.9 - i * 0.14, -0.3]} s={[0.01, 0.04, 0.7]} c="#4a6a8a" cast={false} />)}
      <Box p={[2.14, 1.6, -0.6]} s={[0.03, 0.4, 0.6]} c="#6d4c41" />
      {[-0.2, 0, 0.2].map((z) => <Box key={z} p={[2.1, 1.55, -0.6 + z]} s={[0.03, 0.1, 0.03]} c="#ffd54f" cast={false} />)}
      {/* lemari arsip */}
      <Box p={[-1.75, 0.6, -1.25]} s={[0.6, 1.2, 0.55]} c="#7b8a8c" />
      {[0.3, 0.7, 1.05].map((y) => <Box key={y} p={[-1.75, y, -0.97]} s={[0.5, 0.02, 0.01]} c="#555" cast={false} />)}
    </ThreeCanvas>
  );
};

// ===========================================================================
// 3. Pintu keluar dilihat dari luar (malam): dinding beton, pintu besi merah, papan KELUAR,
//    lampu dinding hangat, halaman beton. Pintu di bidang z = 0, luar = +z, engsel di x = -0.52.
//    Di balik pintu: lorong pabrik yang gelap (hantu digambar 2D di titik PINTU_LUAR.dalam).
// ===========================================================================
export const PINTU_LUAR = { satpam: { x: 0.85, z: 0.75 }, dalam: { x: -1.0, z: -2.4 } };

const teks = (t: string, warna: string, latar: string) => {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 160;
  const g = c.getContext("2d")!;
  g.fillStyle = latar;
  g.fillRect(0, 0, 512, 160);
  g.fillStyle = warna;
  g.font = "bold 96px Arial";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(t, 256, 84);
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace;
  return tx;
};

export const PintuLuar3D: React.FC<{ pose: Pose; s: { t: number; terbuka: number; lampuDalam?: number } }> = ({ pose, s }) => {
  const keluar = useMemo(() => teks("KELUAR", "#eafff0", "#1f8f4a"), []);
  const { terbuka, lampuDalam = 1 } = s;
  return (
    <ThreeCanvas width={W} height={H} shadows camera={{ fov: pose.fov, near: 0.05, far: 200 }} gl={{ antialias: true }}>
      <CameraRig pose={pose} />
      <color attach="background" args={["#0d1426"]} />
      <fog attach="fog" args={["#141c30", 12, 60]} />
      <ambientLight color="#6a7cb0" intensity={1.0} />
      <hemisphereLight args={["#9aaad8", "#203024", 0.6]} />
      <directionalLight position={[20, 40, 40]} color="#d6e0f8" intensity={0.8} />
      {/* lampu dinding di atas pintu */}
      <pointLight position={[0, 2.75, 0.5]} color="#ffcf8a" intensity={9} distance={7} decay={2} castShadow />
      <Box p={[0, 2.7, 0.12]} s={[0.36, 0.12, 0.2]} c="#ffe2a8" e="#ffcf7a" ei={2} cast={false} />
      {/* bintang + bulan kecil di langit */}
      <Bintang />
      <mesh position={[-30, 30, 60]}><sphereGeometry args={[3, 24, 24]} /><meshBasicMaterial color="#f1f0e6" fog={false} /></mesh>
      {/* halaman beton + rumput */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#26402a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 4]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#5f6468" roughness={1} />
      </mesh>
      {/* dinding pabrik (beton) dengan lubang pintu 1,04 x 2,1 */}
      <Box p={[-3.76, 3, -0.1]} s={[6.5, 6, 0.2]} c="#8d99a7" />
      <Box p={[3.76, 3, -0.1]} s={[6.5, 6, 0.2]} c="#8d99a7" />
      <Box p={[0, 4.05, -0.1]} s={[1.04, 3.9, 0.2]} c="#8d99a7" />
      {/* garis sambungan beton */}
      {[-5, -3, -1.5, 1.5, 3, 5].map((x) => <Box key={x} p={[x, 3, 0.005]} s={[0.02, 6, 0.01]} c="#7b8794" cast={false} />)}
      <Box p={[0, 3.6, 0.005]} s={[13, 0.02, 0.01]} c="#7b8794" cast={false} />
      {/* jendela gelap + pipa + kotak listrik + tong sampah */}
      <Box p={[-3.2, 3.9, 0.02]} s={[1.2, 0.9, 0.04]} c="#17202b" e="#0d1520" ei={0.3} cast={false} />
      <Box p={[3.4, 3.9, 0.02]} s={[1.2, 0.9, 0.04]} c="#17202b" e="#0d1520" ei={0.3} cast={false} />
      <Box p={[2.2, 2.5, 0.06]} s={[0.08, 5, 0.08]} c="#9aa0a6" />
      <Box p={[-1.6, 1.4, 0.08]} s={[0.4, 0.55, 0.14]} c="#9aa0a6" />
      <mesh position={[-2.6, 0.45, 0.6]} castShadow><cylinderGeometry args={[0.28, 0.25, 0.9, 18]} /><meshStandardMaterial color="#2e5d3a" /></mesh>
      <Semak x={4.6} z={1.4} s={0.9} />
      <Semak x={-4.4} z={1.8} s={1.1} />
      {/* kusen + daun pintu merah (membuka ke luar, engsel kiri) */}
      <Box p={[-0.56, 1.07, 0.02]} s={[0.08, 2.15, 0.12]} c="#b3261e" />
      <Box p={[0.56, 1.07, 0.02]} s={[0.08, 2.15, 0.12]} c="#b3261e" />
      <Box p={[0, 2.17, 0.02]} s={[1.2, 0.08, 0.12]} c="#b3261e" />
      <group position={[-0.52, 0, 0.05]} rotation={[0, -terbuka * 1.75, 0]}>
        <Box p={[0.52, 1.05, 0]} s={[1.04, 2.1, 0.05]} c="#c62f25" />
        <Box p={[0.9, 1.05, 0.05]} s={[0.05, 0.22, 0.05]} c="#cfd3d6" />
      </group>
      {/* papan KELUAR hijau menyala */}
      <group position={[0, 2.45, 0.05]}>
        <Box p={[0, 0, 0]} s={[0.62, 0.2, 0.05]} c="#cfd3d6" cast={false} />
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[0.56, 0.16]} />
          <meshStandardMaterial map={keluar} emissive="#2fd06a" emissiveMap={keluar} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      </group>
      {/* lorong di dalam (terlihat saat pintu terbuka): lantai, dinding, satu lampu jauh */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -4]}>
        <planeGeometry args={[3, 8]} />
        <meshStandardMaterial color="#2c3136" />
      </mesh>
      <Box p={[-1.5, 2, -4]} s={[0.1, 4, 8]} c="#1c2026" cast={false} />
      <Box p={[1.5, 2, -4]} s={[0.1, 4, 8]} c="#1c2026" cast={false} />
      <Box p={[0, 2, -8]} s={[3, 4, 0.1]} c="#151a20" cast={false} />
      <pointLight position={[-0.8, 1.6, -2.6]} color="#bfe8ff" intensity={6 * lampuDalam} distance={6} decay={2} />
    </ThreeCanvas>
  );
};
