import React, { useMemo } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { Pose, W, H } from "./kamera";

// Set 3D pabrik garmen saat lembur (malam). Satuan meter. Lantai di y = 0.
// Tata letak: dinding belakang z = -14, kiri x = -10, kanan x = 10. Kamera umumnya menghadap -z.
// Gaya: ruangan gelap kebiruan, satu meja karyawan diterangi lampu hangat,
// mesin tua di ujung belakang kanan dengan cahaya pucat sendiri, kabut tipis untuk kedalaman.

export const MEJA_KARYAWAN = { x: -1.5, z: 0 }; // meja jahit karyawan (depan kiri)
export const MESIN_TUA = { x: 4.5, z: -11 }; // mesin yang menyala sendiri (belakang kanan)
export const PINTU = { x: 9.9, z: 2 }; // pintu keluar + mesin absen (dinding kanan)

export type SetState = {
  t: number;
  jam?: { h: number; m: number; s?: number }; // jam dinding
  mesinTuaNyala?: number; // 0..1 lampu mesin tua
  lampuKaryawan?: number; // 0..1 lampu meja karyawan
  targetSelesai?: number; // angka "selesai" di papan target
  kedip?: number; // 0..1 lampu neon berkedip (efek seram)
  jahitT?: number; // detik menjahit: jarum mesin karyawan naik-turun (undefined = diam)
  mesinTuaT?: number; // detik mesin tua menjahit sendiri (jarum naik-turun)
  radio?: number; // 0..1 lampu radio di meja karyawan (1 = menyala)
  tumpukanTua?: number; // tinggi tumpukan baju jadi di samping mesin tua (m)
  papanDua?: number; // angka "selesai" di papan target dekat mesin tua (undefined = tidak ada)
  pintuTerbuka?: number; // 0..1 pintu keluar terbuka
  cekrek?: number; // 0..1 kilat lampu mesin absen saat kartu dicetak
};

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

const Box: React.FC<{ p: [number, number, number]; s: [number, number, number]; c: string; e?: string; ei?: number; cast?: boolean; rot?: [number, number, number] }> = ({ p, s, c, e, ei = 0, cast = true, rot }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} emissive={e ?? "#000000"} emissiveIntensity={ei} roughness={0.8} />
  </mesh>
);

// Meja jahit industri (dipakai sambil duduk) + mesin jahit industri.
// Mengikuti referensi pemilik: badan mesin putih dengan lengan panjang, tiang benang + tatakan
// gulungan benang di belakang kanan, kotak motor di bawah meja, pedal di lantai.
// Tinggi meja disesuaikan dengan tinggi tangan karakter 2D yang duduk.
export const TINGGI_MEJA = 0.55;
const MejaJahit: React.FC<{ x: number; z: number; tua?: boolean; kain?: string; lampu?: number; jahitT?: number }> = ({ x, z, tua = false, kain = "#3a6fb0", lampu = 0, jahitT }) => {
  // Jarum naik-turun cepat saat menjahit (±1,2 cm, 12 tusukan per detik).
  const jarumY = jahitT === undefined ? 0 : Math.sin(jahitT * Math.PI * 24) * 0.012;
  const meja = tua ? "#8a7d68" : "#d8c49a";
  const mesin = tua ? "#a5aba8" : "#eef0ee";
  const abu = tua ? "#7b827f" : "#9aa3a9";
  const ty = TINGGI_MEJA;
  return (
    <group position={[x, 0, z]}>
      {/* daun meja + rangka besi */}
      <Box p={[0, ty, 0]} s={[1.3, 0.05, 0.62]} c={meja} />
      {[[-0.6, 0], [0.6, 0]].map(([lx], i) => (
        <group key={i}>
          <Box p={[lx, ty / 2, -0.24]} s={[0.05, ty, 0.05]} c="#bfc4c8" />
          <Box p={[lx, ty / 2, 0.24]} s={[0.05, ty, 0.05]} c="#bfc4c8" />
          <Box p={[lx, 0.06, 0]} s={[0.05, 0.05, 0.52]} c="#bfc4c8" />
        </group>
      ))}
      {/* kotak motor di bawah meja + pedal */}
      <Box p={[0.32, ty - 0.12, -0.08]} s={[0.32, 0.16, 0.2]} c="#8d969c" />
      <Box p={[-0.15, 0.03, 0.18]} s={[0.22, 0.04, 0.16]} c="#555b60" rot={[-0.25, 0, 0]} />
      {/* mesin: alas rata dengan meja, tiang kanan, lengan panjang, kepala kiri berisi jarum */}
      <Box p={[-0.05, ty + 0.04, -0.05]} s={[0.62, 0.04, 0.2]} c={abu} />
      <Box p={[0.2, ty + 0.17, -0.06]} s={[0.16, 0.26, 0.17]} c={mesin} />
      <Box p={[-0.02, ty + 0.3, -0.06]} s={[0.52, 0.11, 0.15]} c={mesin} />
      <Box p={[-0.27, ty + 0.2, -0.06]} s={[0.09, 0.22, 0.13]} c={mesin} />
      <Box p={[-0.27, ty + 0.08 + jarumY, -0.04]} s={[0.012, 0.06, 0.012]} c="#c8c8c8" cast={false} />
      {/* jahitan yang sudah jadi di kain (garis tipis) */}
      {jahitT !== undefined && <Box p={[-0.27, ty + 0.045, 0.02 + (0.06 + ((jahitT * 0.05) % 0.18)) / 2]} s={[0.008, 0.003, 0.06 + ((jahitT * 0.05) % 0.18)]} c="#f6ecd0" cast={false} />}
      {/* roda tangan di kanan */}
      <mesh position={[0.3, ty + 0.27, -0.06]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 20]} />
        <meshStandardMaterial color={abu} />
      </mesh>
      {/* panel kecil + lampu jarum */}
      <Box p={[0.2, ty + 0.2, 0.03]} s={[0.1, 0.07, 0.01]} c="#2b3a44" e="#4fd1c5" ei={0.6 * lampu} cast={false} />
      <Box p={[-0.27, ty + 0.11, 0.02]} s={[0.04, 0.02, 0.03]} c="#fff6d8" e="#fff6d8" ei={2.5 * lampu} cast={false} />
      {/* tiang benang + tatakan + dua gulungan benang */}
      <Box p={[0.45, ty + 0.4, -0.22]} s={[0.02, 0.8, 0.02]} c="#c8ccd0" />
      <Box p={[0.45, ty + 0.8, -0.22]} s={[0.3, 0.01, 0.08]} c="#c8ccd0" />
      <mesh position={[0.35, ty + 0.84, -0.22]}><cylinderGeometry args={[0.025, 0.025, 0.07, 12]} /><meshStandardMaterial color="#c9504a" /></mesh>
      <mesh position={[0.55, ty + 0.84, -0.22]}><cylinderGeometry args={[0.025, 0.025, 0.07, 12]} /><meshStandardMaterial color="#e3c35a" /></mesh>
      {/* kain di bawah jarum, menjuntai ke depan meja */}
      <Box p={[-0.3, ty + 0.035, 0.12]} s={[0.5, 0.015, 0.36]} c={kain} cast={false} />
      <Box p={[-0.4, ty - 0.08, 0.31]} s={[0.36, 0.22, 0.012]} c={kain} cast={false} />
    </group>
  );
};

const Manekin: React.FC<{ x: number; z: number; rotY?: number }> = ({ x, z, rotY = 0 }) => (
  <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
    <mesh position={[0, 0.05, 0]} receiveShadow>
      <cylinderGeometry args={[0.22, 0.25, 0.08, 20]} />
      <meshStandardMaterial color="#2b2b2b" />
    </mesh>
    <Box p={[0, 0.55, 0]} s={[0.04, 1.0, 0.04]} c="#2b2b2b" />
    <mesh position={[0, 1.3, 0]} castShadow>
      <cylinderGeometry args={[0.2, 0.15, 0.6, 20]} />
      <meshStandardMaterial color="#d8cbb8" roughness={0.6} />
    </mesh>
    <mesh position={[0, 1.66, 0]} castShadow>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#d8cbb8" roughness={0.6} />
    </mesh>
  </group>
);

// Tumpukan baju (lapisan kotak tipis warna-warni).
const TumpukanBaju: React.FC<{ x: number; z: number; tinggi: number; y?: number }> = ({ x, z, tinggi, y = 0 }) => {
  const warna = ["#3a6fb0", "#c9504a", "#e3c35a", "#4f8f6b", "#f2efe8"];
  const n = Math.max(0, Math.round(tinggi / 0.05));
  return (
    <group position={[x, y, z]}>
      {Array.from({ length: n }, (_, i) => (
        <Box key={i} p={[((i * 37) % 5) * 0.01 - 0.02, 0.025 + i * 0.05, ((i * 17) % 5) * 0.01 - 0.02]} s={[0.5, 0.045, 0.38]} c={warna[i % warna.length]} />
      ))}
    </group>
  );
};

// Papan target (teks digambar ke kanvas → tekstur).
const PapanTarget: React.FC<{ x: number; z: number; selesai: number }> = ({ x, z, selesai }) => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 384;
    const g = c.getContext("2d")!;
    g.fillStyle = "#f4f2ea";
    g.fillRect(0, 0, 512, 384);
    g.fillStyle = "#c0392b";
    g.font = "bold 46px Arial";
    g.fillText("TARGET LEMBUR", 60, 80);
    g.fillStyle = "#222";
    g.font = "bold 120px Arial";
    g.fillText("300", 150, 220);
    g.font = "bold 44px Arial";
    g.fillText(`SELESAI: ${selesai}`, 110, 320);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [selesai]);
  return (
    <group position={[x, 0, z]}>
      <Box p={[0, 0.9, -0.02]} s={[0.05, 1.8, 0.05]} c="#2b2b2b" />
      <mesh position={[0, 1.85, 0]} castShadow>
        <boxGeometry args={[1.1, 0.82, 0.04]} />
        <meshStandardMaterial color="#cfcfcf" />
      </mesh>
      <mesh position={[0, 1.85, 0.025]}>
        <planeGeometry args={[1.0, 0.75]} />
        <meshStandardMaterial map={tex} roughness={0.9} />
      </mesh>
    </group>
  );
};

// Jam dinding bulat (dipasang di tiang): bingkai hitam, muka berangka, jarum hitam + detik merah.
const MukaJam: React.FC = () => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 512;
    const g = c.getContext("2d")!;
    g.fillStyle = "#f4f2ea";
    g.beginPath();
    g.arc(256, 256, 256, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#1a1a1a";
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const besar = i % 5 === 0;
      g.save();
      g.translate(256 + Math.sin(a) * 228, 256 - Math.cos(a) * 228);
      g.rotate(a);
      g.fillRect(besar ? -5 : -2, besar ? -16 : -8, besar ? 10 : 4, besar ? 32 : 16);
      g.restore();
    }
    g.font = "bold 58px Arial";
    g.textAlign = "center";
    g.textBaseline = "middle";
    for (let n = 1; n <= 12; n++) {
      const a = (n / 12) * Math.PI * 2;
      g.fillText(String(n), 256 + Math.sin(a) * 172, 256 - Math.cos(a) * 172);
    }
    // Nama channel di muka jam (gaya sama dengan tulisan di kaus BobEjoo).
    g.font = "600 34px 'Segoe UI', Arial, sans-serif";
    g.fillStyle = "#2B2B2B";
    g.fillText("BobEjoo", 256, 336);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh position={[0, 0, 0.032]}>
      <circleGeometry args={[0.3, 64]} />
      <meshStandardMaterial map={tex} emissive="#f4f2ea" emissiveIntensity={0.12} roughness={0.7} />
    </mesh>
  );
};
const JamDinding: React.FC<{ x: number; y: number; z: number; h: number; m: number; detik?: number }> = ({ x, y, z, h, m, detik = 0 }) => {
  const am = -(m / 60) * Math.PI * 2;
  const ah = -((h % 12) / 12 + m / 720) * Math.PI * 2;
  const as = -(detik / 60) * Math.PI * 2;
  return (
    <group position={[x, y, z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.06, 64]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.5} />
      </mesh>
      <MukaJam />
      <group rotation={[0, 0, ah]}><mesh position={[0, 0.07, 0.04]}><boxGeometry args={[0.032, 0.15, 0.01]} /><meshStandardMaterial color="#111" /></mesh></group>
      <group rotation={[0, 0, am]}><mesh position={[0, 0.1, 0.045]}><boxGeometry args={[0.02, 0.23, 0.01]} /><meshStandardMaterial color="#111" /></mesh></group>
      <group rotation={[0, 0, as]}><mesh position={[0, 0.09, 0.05]}><boxGeometry args={[0.006, 0.26, 0.006]} /><meshStandardMaterial color="#c62828" /></mesh></group>
      <mesh position={[0, 0, 0.055]}><circleGeometry args={[0.018, 20]} /><meshStandardMaterial color="#111" /></mesh>
    </group>
  );
};

// Pintu keluar di dinding kanan (menghadap -x), seperti referensi pemilik no. 5: pintu besi merah,
// palang dorong, papan hijau "KELUAR". Di sebelahnya mesin absen model lama (kotak logam, jam bundar,
// celah kartu) + rak kartu kertas.
const teksTex = (teks: string, warna: string, latar: string, w = 512, h = 160, ukuran = 96) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  g.fillStyle = latar;
  g.fillRect(0, 0, w, h);
  g.fillStyle = warna;
  g.font = `bold ${ukuran}px Arial`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(teks, w / 2, h / 2 + 4);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};
export const PapanKeluar: React.FC<{ p: [number, number, number]; rotY: number }> = ({ p, rotY }) => {
  const tex = useMemo(() => teksTex("KELUAR", "#eafff0", "#1f8f4a"), []);
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <mesh>
        <boxGeometry args={[0.62, 0.2, 0.05]} />
        <meshStandardMaterial color="#cfd3d6" />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.56, 0.16]} />
        <meshStandardMaterial map={tex} emissive="#2fd06a" emissiveMap={tex} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
    </group>
  );
};
const PintuDalam: React.FC<{ terbuka: number; cekrek: number }> = ({ terbuka, cekrek }) => {
  const x = PINTU.x - 0.16, z = PINTU.z;
  const absenTex = useMemo(() => teksTex("ABSEN", "#222", "#e9e4d4", 256, 80, 44), []);
  return (
    <group>
      {/* kusen merah + daun pintu merah (engsel di sisi z+), membuka ke luar */}
      <Box p={[x + 0.05, 1.07, z - 0.56]} s={[0.1, 2.15, 0.08]} c="#b3261e" />
      <Box p={[x + 0.05, 1.07, z + 0.56]} s={[0.1, 2.15, 0.08]} c="#b3261e" />
      <Box p={[x + 0.05, 2.17, z]} s={[0.1, 0.08, 1.2]} c="#b3261e" />
      <group position={[x + 0.1, 0, z + 0.52]} rotation={[0, terbuka * 1.6, 0]}>
        <Box p={[0, 1.05, -0.52]} s={[0.05, 2.1, 1.04]} c="#c62f25" />
        {/* palang dorong */}
        <Box p={[-0.07, 1.0, -0.52]} s={[0.04, 0.05, 0.8]} c="#cfd3d6" />
        <Box p={[-0.05, 1.0, -0.15]} s={[0.06, 0.08, 0.04]} c="#cfd3d6" />
        <Box p={[-0.05, 1.0, -0.89]} s={[0.06, 0.08, 0.04]} c="#cfd3d6" />
        <mesh position={[-0.03, 1.5, -0.52]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.32, 0.08]} />
          <meshStandardMaterial map={useMemo(() => teksTex("PINTU DARURAT", "#222", "#e8e8e8", 512, 128, 56), [])} />
        </mesh>
      </group>
      {/* di balik pintu: halaman luar gelap kebiruan */}
      <Box p={[PINTU.x + 0.4, 1.05, z]} s={[0.1, 2.1, 1.04]} c="#0d1426" e="#1a2747" ei={0.6} cast={false} />
      <PapanKeluar p={[x - 0.02, 2.45, z]} rotY={-Math.PI / 2} />
      <pointLight position={[x - 0.3, 2.4, z]} color="#5dff9a" intensity={2.2} distance={3} decay={2} />
      {/* lantai pelat besi di depan pintu */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PINTU.x - 0.8, 0.006, z]} receiveShadow>
        <planeGeometry args={[1.4, 1.6]} />
        <meshStandardMaterial color="#6d7378" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* garis kuning-hitam di ambang pintu */}
      <Box p={[PINTU.x - 0.18, 0.01, z]} s={[0.08, 0.01, 1.1]} c="#e0b400" cast={false} />
      {/* mesin absen model lama */}
      <group position={[x - 0.02, 1.35, z - 1.15]}>
        <Box p={[0, 0, 0]} s={[0.2, 0.46, 0.34]} c="#8d969c" />
        <mesh position={[-0.105, 0.09, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <circleGeometry args={[0.11, 32]} />
          <meshStandardMaterial color="#f4f2ea" emissive="#f4f2ea" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[-0.11, 0.09, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <ringGeometry args={[0.105, 0.125, 32]} />
          <meshStandardMaterial color="#2b2b2b" />
        </mesh>
        <Box p={[-0.112, 0.09, 0.0]} s={[0.005, 0.07, 0.008]} c="#111" cast={false} />
        <Box p={[-0.112, 0.12, 0.02]} s={[0.005, 0.008, 0.05]} c="#111" cast={false} />
        {/* celah kartu + label */}
        <Box p={[-0.105, -0.12, 0]} s={[0.02, 0.02, 0.2]} c="#1a1a1a" cast={false} />
        <mesh position={[-0.106, -0.18, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.18, 0.05]} />
          <meshStandardMaterial map={absenTex} />
        </mesh>
        <Box p={[-0.106, -0.07, 0.13]} s={[0.01, 0.025, 0.025]} c="#ff3b30" e="#ff3b30" ei={0.4 + cekrek * 4} cast={false} />
      </group>
      {/* rak kartu kertas */}
      <group position={[x - 0.02, 1.35, z - 1.7]}>
        <Box p={[0, 0, 0]} s={[0.06, 0.62, 0.42]} c="#6d4c41" />
        {[0, 1, 2, 3, 4].map((r) => [0, 1, 2].map((c) => (
          <Box key={`${r}${c}`} p={[-0.04, 0.22 - r * 0.11, -0.13 + c * 0.13]} s={[0.01, 0.13, 0.08]} c={(r + c) % 4 === 0 ? "#f7f3e6" : "#e6d6a2"} cast={false} />
        )))}
      </group>
    </group>
  );
};

export const Pabrik3D: React.FC<{ pose: Pose; s: SetState }> = ({ pose, s }) => {
  const { t, jam = { h: 23, m: 40 }, mesinTuaNyala = 0, lampuKaryawan = 1, targetSelesai = 100, kedip = 0 } = s;
  const neon = 1 - kedip * (Math.sin(t * 41) * Math.sin(t * 13) > 0.2 ? 0.85 : 0);
  // Deretan meja jahit (lantai produksi), kecuali posisi meja karyawan dan mesin tua.
  const meja: [number, number][] = [];
  for (const z of [-3, -6, -9, -12]) for (const x of [-6, -3, 0, 3, 6]) if (!(x === 3 && z === -12)) meja.push([x, z]);
  return (
    <ThreeCanvas width={W} height={H} shadows camera={{ fov: pose.fov, near: 0.1, far: 200 }} gl={{ antialias: true }}>
      <CameraRig pose={pose} />
      <color attach="background" args={["#0b0e14"]} />
      <fog attach="fog" args={["#10141c", 10, 32]} />

      {/* cahaya dasar malam: biru redup */}
      <ambientLight color="#4a5a80" intensity={0.95} />
      <hemisphereLight args={["#6274a0", "#1c1c1c", 0.7]} />
      {/* cahaya bulan dari jendela tinggi di dinding belakang */}
      <directionalLight position={[2, 9, -16]} color="#7d93c4" intensity={0.7} />

      {/* lampu neon di atas meja karyawan (satu-satunya yang menyala) */}
      <pointLight position={[MEJA_KARYAWAN.x, 4.2, MEJA_KARYAWAN.z + 0.4]} color="#d9e8ff" intensity={18 * neon * lampuKaryawan} distance={10} decay={2} />
      {/* lampu meja hangat */}
      <spotLight
        position={[MEJA_KARYAWAN.x + 0.3, 2.6, MEJA_KARYAWAN.z + 1.2]}
        target-position={[MEJA_KARYAWAN.x, 1, MEJA_KARYAWAN.z]}
        color="#ffcf8a"
        intensity={45 * lampuKaryawan}
        angle={0.75}
        penumbra={0.7}
        distance={9}
        decay={2}
        castShadow
      />
      {/* cahaya pucat mesin tua */}
      <pointLight position={[MESIN_TUA.x, 1.8, MESIN_TUA.z + 0.6]} color="#bfe8ff" intensity={40 * mesinTuaNyala} distance={9} decay={2} />
      {/* pendar cahaya mesin tua (terlihat dari jauh) */}
      {mesinTuaNyala > 0.01 && (
        <mesh position={[MESIN_TUA.x - 0.27, TINGGI_MEJA + 0.15, MESIN_TUA.z + 0.1]}>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshBasicMaterial color="#bfe8ff" transparent opacity={0.22 * mesinTuaNyala} depthWrite={false} />
        </mesh>
      )}

      {/* lantai beton + garis kuning keselamatan */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#454b45" roughness={0.95} />
      </mesh>
      {[-8.5, 8.5].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, -4]}>
          <planeGeometry args={[0.12, 20]} />
          <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={0.08} />
        </mesh>
      ))}

      {/* dinding belakang + jendela tinggi */}
      <Box p={[0, 3, -14]} s={[20, 6, 0.3]} c="#3a4048" cast={false} />
      {[-7, -3.5, 0, 3.5, 7].map((x) => (
        <Box key={x} p={[x, 4.4, -13.82]} s={[2.2, 1.3, 0.05]} c="#203152" e="#2a4170" ei={0.35} cast={false} />
      ))}
      {/* dinding kiri & kanan */}
      <Box p={[-10, 3, -4]} s={[0.3, 6, 20]} c="#363c43" cast={false} />
      <Box p={[10, 3, -4]} s={[0.3, 6, 20]} c="#363c43" cast={false} />
      {/* pintu keluar + mesin absen di dinding kanan */}
      <PintuDalam terbuka={s.pintuTerbuka ?? 0} cekrek={s.cekrek ?? 0} />
      {/* tiang */}
      {[-7.5, 7.5].flatMap((x) => [0, -5, -10].map((z) => <Box key={`${x}${z}`} p={[x, 3, z]} s={[0.5, 6, 0.5]} c="#4a5058" />))}
      {/* deretan lampu neon di plafon (sebagian besar mati) */}
      {[-6, -3, 0, 3, 6].flatMap((x) =>
        [1, -4, -9].map((z) => {
          const on = x === -3 && z === 1;
          return <Box key={`n${x}${z}`} p={[x + (on ? 1.5 : 0), 5.2, z]} s={[0.12, 0.06, 1.6]} c="#9aa3ad" e="#e8f1ff" ei={on ? 3 * neon * lampuKaryawan : 0.05} cast={false} />;
        }),
      )}

      {/* lantai produksi */}
      {meja.map(([x, z]) => (
        <MejaJahit key={`${x}${z}`} x={x} z={z} kain={["#3a6fb0", "#c9504a", "#4f8f6b"][(x + z + 30) % 3]} />
      ))}
      {/* meja karyawan + tumpukan target */}
      <MejaJahit x={MEJA_KARYAWAN.x} z={MEJA_KARYAWAN.z} lampu={lampuKaryawan} jahitT={s.jahitT} />
      {/* radio kecil */}
      <group position={[MEJA_KARYAWAN.x - 0.5, TINGGI_MEJA + 0.025, MEJA_KARYAWAN.z - 0.12]}>
        <Box p={[0, 0.08, 0]} s={[0.26, 0.16, 0.1]} c="#b23a32" />
        <Box p={[-0.05, 0.08, 0.052]} s={[0.12, 0.1, 0.005]} c="#2b2b2b" cast={false} />
        <Box p={[0.08, 0.11, 0.052]} s={[0.05, 0.025, 0.005]} c="#ffd58e" e="#ffb84d" ei={2.2 * (s.radio ?? 1)} cast={false} />
        <Box p={[0.1, 0.24, -0.02]} s={[0.01, 0.16, 0.01]} c="#cfcfcf" rot={[0, 0, -0.4]} />
      </group>
      <TumpukanBaju x={MEJA_KARYAWAN.x - 1.1} z={MEJA_KARYAWAN.z - 0.2} tinggi={0.9} />
      <TumpukanBaju x={MEJA_KARYAWAN.x + 1.1} z={MEJA_KARYAWAN.z - 0.2} tinggi={0.3} />
      <PapanTarget x={MEJA_KARYAWAN.x - 2.3} z={MEJA_KARYAWAN.z - 0.6} selesai={targetSelesai} />
      {s.papanDua !== undefined && <PapanTarget x={MESIN_TUA.x - 1.55} z={MESIN_TUA.z - 0.7} selesai={s.papanDua} />}
      <JamDinding x={-7.5} y={3.2} z={0.27} h={jam.h} m={jam.m} detik={jam.s ?? 0} />
      <Manekin x={-3.6} z={1.6} rotY={0.4} />
      <Manekin x={-4.3} z={1.0} rotY={-0.3} />
      {/* mesin tua di ujung belakang kanan */}
      <MejaJahit x={MESIN_TUA.x} z={MESIN_TUA.z} tua lampu={mesinTuaNyala} kain="#7b6f8f" jahitT={s.mesinTuaT} />
      {/* baju jadi yang terlipat rapi di meja kecil samping mesin tua (dua tumpukan) */}
      <Box p={[MESIN_TUA.x + 1.15, 0.35, MESIN_TUA.z + 0.05]} s={[1.1, 0.04, 0.6]} c="#8a7d68" />
      {[-0.4, 0.4].map((dx) => <Box key={dx} p={[MESIN_TUA.x + 1.15 + dx, 0.17, MESIN_TUA.z + 0.05]} s={[0.05, 0.34, 0.5]} c="#6d6455" />)}
      <TumpukanBaju x={MESIN_TUA.x + 0.88} z={MESIN_TUA.z + 0.05} y={0.37} tinggi={s.tumpukanTua ?? 0.6} />
      <TumpukanBaju x={MESIN_TUA.x + 1.42} z={MESIN_TUA.z + 0.05} y={0.37} tinggi={(s.tumpukanTua ?? 0.6) * 0.85} />
    </ThreeCanvas>
  );
};
