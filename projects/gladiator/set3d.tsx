import React, { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { Pose, W, H } from "./kamera";

// Set 3D video gladiator (satuan meter, lantai y = 0). Mengikuti referensi pemilik:
// arena game (tribun bertingkat, spanduk merah, atap kain bergaris, gerbang berjeruji, panel merah podium),
// Colosseum anime dari udara (kota kecil di sekeliling), lorong kartun ungu (kubah, pilar, sel berjeruji, obor),
// ruang batu berkubah (meja kayu, tong, rantai, obor) untuk barak, kamar merah-hijau untuk kamar modern.

export const A = 34; // setengah sumbu panjang arena (x)
export const B = 21; // setengah sumbu pendek arena (z)
export const K = A / B; // faktor elips
export const GERBANG = { x: -A, z: 0 }; // gerbang utama (lorong di baliknya, ke arah -x)
export const BALKON = { x: 0, z: -B }; // balkon penyelenggara (pulvinar)
export const PATUNG_DUEL = { x: -9.2, z: 4.6 }; // patung dekat lokasi duel (tempat jaring menyangkut)

// ---------------------------------------------------------------------------
// Alat bantu
// ---------------------------------------------------------------------------
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

const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const kanvas = (w: number, h: number, gambar: (g: CanvasRenderingContext2D) => void, ulangX = 1, ulangY = 1) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  gambar(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(ulangX, ulangY);
  t.anisotropy = 4;
  return t;
};

export const Box: React.FC<{ p: [number, number, number]; s: [number, number, number]; c: string; e?: string; ei?: number; rot?: [number, number, number]; map?: THREE.Texture; cast?: boolean }> = ({ p, s, c, e, ei = 0, rot, map, cast = true }) => (
  <mesh position={p} rotation={rot} castShadow={cast} receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} map={map} emissive={e ?? "#000000"} emissiveIntensity={ei} roughness={0.85} />
  </mesh>
);

// Tekstur batu bata (dipakai dinding barak, lorong, arena)
const texBata = (warna: string, garis: string, ulangX: number, ulangY: number) =>
  kanvas(256, 256, (g) => {
    g.fillStyle = warna;
    g.fillRect(0, 0, 256, 256);
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 5; c++) {
        const x = c * 52 + (r % 2 ? 26 : 0), y = r * 32;
        const v = (rnd(r * 9 + c) - 0.5) * 22;
        g.fillStyle = `rgba(${v > 0 ? 255 : 0},${v > 0 ? 240 : 0},${v > 0 ? 220 : 0},${Math.abs(v) / 120})`;
        g.fillRect(x + 2, y + 2, 48, 28);
      }
    }
    g.strokeStyle = garis;
    g.lineWidth = 3;
    for (let r = 0; r <= 8; r++) {
      g.beginPath(); g.moveTo(0, r * 32); g.lineTo(256, r * 32); g.stroke();
      for (let c = 0; c <= 5; c++) {
        const x = c * 52 + (r % 2 ? 26 : 0);
        g.beginPath(); g.moveTo(x, r * 32); g.lineTo(x, r * 32 + 32); g.stroke();
      }
    }
  }, ulangX, ulangY);

// Obor: tongkat + api bercahaya + lampu jingga yang berkedip
const Obor: React.FC<{ p: [number, number, number]; t: number; kuat?: number; rotY?: number }> = ({ p, t, kuat = 6, rotY = 0 }) => {
  const k = 1 + Math.sin(t * 17 + p[0]) * 0.08 + Math.sin(t * 29 + p[2]) * 0.05;
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <Box p={[0, 0, 0]} s={[0.12, 0.45, 0.12]} c="#3b2a1d" />
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.16, 0.08, 0.16, 12]} />
        <meshStandardMaterial color="#5a4632" />
      </mesh>
      <mesh position={[0, 0.5, 0]} scale={[1, k, 1]}>
        <coneGeometry args={[0.13, 0.36, 12]} />
        <meshBasicMaterial color="#ffb347" />
      </mesh>
      <mesh position={[0, 0.46, 0]} scale={[1, k, 1]}>
        <coneGeometry args={[0.07, 0.22, 12]} />
        <meshBasicMaterial color="#fff2b0" />
      </mesh>
      <pointLight position={[0, 0.6, 0.2]} color="#ff9d4a" intensity={kuat * k} distance={7} decay={2} />
    </group>
  );
};

// Langit biru dengan awan (bola besar terbalik + gumpalan awan)
const Langit: React.FC = () => {
  const tex = useMemo(
    () =>
      kanvas(16, 256, (g) => {
        const gr = g.createLinearGradient(0, 0, 0, 256);
        gr.addColorStop(0, "#2f7fd8");
        gr.addColorStop(0.55, "#7fb8ee");
        gr.addColorStop(1, "#d9ecfa");
        g.fillStyle = gr;
        g.fillRect(0, 0, 16, 256);
      }),
    [],
  );
  return (
    <group>
      <mesh>
        <sphereGeometry args={[900, 32, 16]} />
        <meshBasicMaterial map={tex} side={THREE.BackSide} fog={false} />
      </mesh>
      {Array.from({ length: 14 }, (_, i) => {
        const a = rnd(i) * Math.PI * 2, r = 420 + rnd(i + 5) * 200, y = 150 + rnd(i + 9) * 160;
        return (
          <group key={i} position={[Math.cos(a) * r, y, Math.sin(a) * r]}>
            {[0, 1, 2, 3].map((j) => (
              <mesh key={j} position={[(j - 1.5) * 28, rnd(i * 4 + j) * 10, rnd(i * 7 + j) * 12]}>
                <sphereGeometry args={[22 + rnd(i * 3 + j) * 14, 16, 12]} />
                <meshBasicMaterial color="#ffffff" fog={false} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
};

// ---------------------------------------------------------------------------
// Penonton (ribuan, instanced): badan + kepala, bersorak naik-turun
// ---------------------------------------------------------------------------
const WARNA_PENONTON = ["#f4f1ea", "#e8dcc4", "#8a6a45", "#b3261e", "#2e5d9c", "#4f8f4f", "#d9a441", "#6a2c8a", "#f4f1ea", "#c9b28f"];
type Kursi = { x: number; y: number; z: number; ry: number; fase: number; warna: string };
const kursiPenonton = (lompat = 1): Kursi[] => {
  const out: Kursi[] = [];
  let id = 0;
  for (let i = 0; i < 14; i++) {
    const r = B + 0.9 + i * 1.3 + 0.55;
    const y = 3.6 + (i + 1) * 1.3; // permukaan duduk = puncak anak tangga ke-i
    const keliling = Math.PI * 2 * r * (1 + K) * 0.5;
    const n = Math.floor(keliling / (0.75 * lompat));
    for (let j = 0; j < n; j++) {
      const a = (j / n) * Math.PI * 2;
      // lorong tangga tiap 22,5°, gerbang utama (sudut π) dan balkon (sudut 3π/2 = -z)
      const da = ((a % (Math.PI / 8)) + Math.PI / 8) % (Math.PI / 8);
      if (da < 0.035) continue;
      if (Math.abs(a - Math.PI) < 0.14 && i < 6) continue;
      if (Math.abs(a - Math.PI * 1.5) < 0.16 && i < 7) continue;
      id++;
      out.push({ x: Math.cos(a) * r * K, y, z: Math.sin(a) * r, ry: -a + Math.PI / 2, fase: rnd(id) * 6.28, warna: WARNA_PENONTON[Math.floor(rnd(id + 77) * WARNA_PENONTON.length)] });
    }
  }
  return out;
};

const Penonton: React.FC<{ t: number; sorak?: number; lompat?: number }> = ({ t, sorak = 1, lompat = 1 }) => {
  const kursi = useMemo(() => kursiPenonton(lompat), [lompat]);
  const badan = useRef<THREE.InstancedMesh>(null);
  const kepala = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(1, 1, 1), v = new THREE.Vector3();
    const col = new THREE.Color();
    kursi.forEach((k, i) => {
      const naik = Math.max(0, Math.sin(t * 7 + k.fase)) * 0.22 * sorak;
      e.set(0, k.ry, 0);
      q.setFromEuler(e);
      v.set(k.x, k.y + 0.38 + naik, k.z);
      m.compose(v, q, sc);
      badan.current!.setMatrixAt(i, m);
      v.set(k.x, k.y + 0.9 + naik, k.z);
      m.compose(v, q, sc);
      kepala.current!.setMatrixAt(i, m);
      col.set(k.warna);
      badan.current!.setColorAt(i, col);
      kepala.current!.setColorAt(i, col.set(k.fase > 5.2 ? "#3a2a20" : "#f6efe6"));
    });
    badan.current!.instanceMatrix.needsUpdate = true;
    kepala.current!.instanceMatrix.needsUpdate = true;
    if (badan.current!.instanceColor) badan.current!.instanceColor.needsUpdate = true;
    if (kepala.current!.instanceColor) kepala.current!.instanceColor.needsUpdate = true;
  });
  return (
    <group>
      <instancedMesh ref={badan} args={[undefined, undefined, kursi.length]} frustumCulled={false}>
        <boxGeometry args={[0.46, 0.72, 0.34]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={kepala} args={[undefined, undefined, kursi.length]} frustumCulled={false}>
        <sphereGeometry args={[0.19, 8, 6]} />
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
    </group>
  );
};

// ---------------------------------------------------------------------------
// Colosseum (dipakai di arena, dari udara, dan sebagai miniatur di meja kamar)
// ---------------------------------------------------------------------------
export type ArenaState = { t: number; sorak?: number; jeruji?: number /* 0 = gerbang tertutup, 1 = terangkat */; luar?: boolean /* dinding luar + kota */; penonton?: boolean };

const Colosseum: React.FC<{ s: ArenaState }> = ({ s }) => {
  const { t, sorak = 1, jeruji = 0, luar = true, penonton = true } = s;
  const tex = useMemo(() => {
    const pasir = kanvas(512, 512, (g) => {
      g.fillStyle = "#e6c98d";
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 2600; i++) {
        g.fillStyle = `rgba(${rnd(i) > 0.5 ? "255,240,200" : "150,110,60"},${0.08 + rnd(i + 3) * 0.12})`;
        g.fillRect(rnd(i + 1) * 512, rnd(i + 2) * 512, 2 + rnd(i + 4) * 5, 2 + rnd(i + 5) * 5);
      }
      for (let i = 0; i < 26; i++) {
        g.strokeStyle = "rgba(160,120,70,0.18)";
        g.lineWidth = 4 + rnd(i) * 6;
        g.beginPath();
        const x = rnd(i + 40) * 512, y = rnd(i + 50) * 512;
        g.arc(x, y, 20 + rnd(i + 60) * 40, rnd(i) * 6, rnd(i) * 6 + 1.5);
        g.stroke();
      }
    }, 3, 3);
    const podium = kanvas(512, 128, (g) => {
      g.fillStyle = "#d8b98a";
      g.fillRect(0, 0, 512, 128);
      for (let i = 0; i < 4; i++) {
        const x = 12 + i * 128;
        g.fillStyle = "#9c2b23";
        g.fillRect(x, 22, 104, 84);
        g.strokeStyle = "#5e1a14";
        g.lineWidth = 6;
        g.strokeRect(x + 8, 30, 88, 68);
        if (i === 2) {
          // gerbang kecil berjeruji di panel
          g.fillStyle = "#2a1e18";
          g.beginPath(); g.moveTo(x + 30, 106); g.lineTo(x + 30, 66); g.arc(x + 52, 66, 22, Math.PI, 0); g.lineTo(x + 74, 106); g.fill();
          g.strokeStyle = "#8c8c8c"; g.lineWidth = 3;
          for (let b = 0; b < 5; b++) { g.beginPath(); g.moveTo(x + 36 + b * 8, 106); g.lineTo(x + 36 + b * 8, 50); g.stroke(); }
        }
      }
      g.fillStyle = "#b99a6c";
      g.fillRect(0, 0, 512, 12);
      g.fillRect(0, 116, 512, 12);
    }, 18, 1);
    const tribun = kanvas(256, 256, (g) => {
      g.fillStyle = "#d8b37a";
      g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? "#c9a36a" : "#e3c48f"; g.fillRect(0, i * 16, 256, 16); }
      for (let i = 0; i < 40; i++) { g.fillStyle = "rgba(90,60,30,0.25)"; g.fillRect(rnd(i) * 256, rnd(i + 9) * 256, 10, 5); }
    }, 24, 1);
    const atas = kanvas(512, 256, (g) => {
      g.fillStyle = "#d9b986";
      g.fillRect(0, 0, 512, 256);
      g.fillStyle = "#c4a272";
      for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) g.fillRect(c * 64 + (r % 2 ? 32 : 0), r * 32, 62, 3);
      for (let i = 0; i < 4; i++) {
        const x = 24 + i * 128;
        g.fillStyle = "#3b2a20";
        g.beginPath(); g.moveTo(x, 200); g.lineTo(x, 110); g.arc(x + 40, 110, 40, Math.PI, 0); g.lineTo(x + 80, 200); g.fill();
        g.strokeStyle = "#b08a5a"; g.lineWidth = 8;
        g.beginPath(); g.arc(x + 40, 110, 44, Math.PI, 0); g.stroke();
        g.fillStyle = "#4a3426";
        g.fillRect(x + 22, 30, 36, 24);
      }
      g.fillStyle = "#c4a272";
      g.fillRect(0, 210, 512, 14);
    }, 14, 1);
    const luarTex = kanvas(512, 512, (g) => {
      g.fillStyle = "#dcc29a";
      g.fillRect(0, 0, 512, 512);
      for (let lv = 0; lv < 3; lv++) {
        const y0 = 40 + lv * 140;
        for (let i = 0; i < 4; i++) {
          const x = 20 + i * 128;
          g.fillStyle = "#5a4330";
          g.beginPath(); g.moveTo(x + 14, y0 + 120); g.lineTo(x + 14, y0 + 50); g.arc(x + 64, y0 + 50, 50, Math.PI, 0); g.lineTo(x + 114, y0 + 120); g.fill();
          g.fillStyle = "#cbb088";
          g.fillRect(x - 6, y0, 16, 124);
        }
        g.fillStyle = "#c2a67c";
        g.fillRect(0, y0 + 122, 512, 14);
      }
      for (let i = 0; i < 8; i++) { g.fillStyle = "#6b5440"; g.fillRect(28 + i * 64, 470, 22, 26); }
    }, 16, 1);
    const spanduk = kanvas(128, 256, (g) => {
      g.fillStyle = "#b3261e";
      g.fillRect(0, 0, 128, 256);
      g.fillStyle = "#7e1a14";
      g.fillRect(0, 0, 128, 14);
      g.strokeStyle = "#e0b400";
      g.lineWidth = 6;
      g.beginPath(); g.arc(64, 110, 30, Math.PI * 0.75, Math.PI * 2.25); g.stroke();
      for (let i = 0; i < 6; i++) {
        const a = Math.PI * 0.8 + i * 0.28;
        g.fillStyle = "#e0b400";
        g.beginPath(); g.ellipse(64 + Math.cos(a) * 30, 110 + Math.sin(a) * 30, 9, 4, a + 1.2, 0, Math.PI * 2); g.fill();
        g.beginPath(); g.ellipse(64 - Math.cos(a) * 30, 110 + Math.sin(a) * 30, 9, 4, -a - 1.2, 0, Math.PI * 2); g.fill();
      }
      g.beginPath(); g.moveTo(0, 256); g.lineTo(64, 228); g.lineTo(128, 256); g.fillStyle = "#00000000"; g.fill();
    });
    const kain = kanvas(256, 64, (g) => {
      for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#f0dcb8" : "#b8452e"; g.fillRect(i * 32, 0, 32, 64); }
    }, 1, 1);
    return { pasir, podium, tribun, atas, luarTex, spanduk, kain };
  }, []);

  // Tribun bertingkat: profil anak tangga diputar (lathe), lalu dijadikan elips dengan skala x = K.
  const profil = useMemo(() => {
    const pts: THREE.Vector2[] = [new THREE.Vector2(B + 0.9, 3.6)];
    for (let i = 0; i < 14; i++) {
      const r = B + 0.9 + i * 1.3, y = 3.6 + i * 1.3;
      pts.push(new THREE.Vector2(r, y), new THREE.Vector2(r, y + 1.3), new THREE.Vector2(r + 1.3, y + 1.3));
    }
    pts.push(new THREE.Vector2(B + 0.9 + 14 * 1.3 + 0.5, 3.6 + 14 * 1.3 + 0.2), new THREE.Vector2(B + 0.9 + 14 * 1.3 + 0.5, 0));
    return pts;
  }, []);
  const R_ATAS = B + 0.9 + 14 * 1.3 + 0.5; // radius dinding atas
  const Y_ATAS = 3.6 + 14 * 1.3;
  return (
    <group>
      {/* pasir arena */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[K, 1, 1]} receiveShadow>
        <circleGeometry args={[B, 96]} />
        <meshStandardMaterial map={tex.pasir} roughness={1} />
      </mesh>
      {/* dinding podium dengan panel merah */}
      <mesh position={[0, 1.8, 0]} scale={[K, 1, 1]} receiveShadow>
        <cylinderGeometry args={[B, B, 3.6, 96, 1, true, Math.PI * 1.5 + 0.085, Math.PI * 2 - 0.17]} />
        <meshStandardMaterial map={tex.podium} side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.6, 0]} scale={[K, 1, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[B - 0.2, B + 0.95, 96]} />
        <meshStandardMaterial color="#cdb083" side={THREE.DoubleSide} />
      </mesh>
      {/* tribun */}
      <mesh scale={[K, 1, 1]} castShadow receiveShadow>
        <latheGeometry args={[profil, 96]} />
        <meshStandardMaterial map={tex.tribun} side={THREE.DoubleSide} roughness={0.95} flatShading />
      </mesh>
      {/* lorong tangga di tribun (tiap 22,5°) */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const rm = B + 0.9 + 7 * 1.3;
        const len = 14 * 1.3 * 1.414;
        return (
          <mesh key={i} position={[Math.cos(a) * rm * K, 3.6 + 7 * 1.3 + 0.5, Math.sin(a) * rm]} rotation={[0, -a, Math.PI / 4]}>
            <boxGeometry args={[len, 0.25, 0.7]} />
            <meshStandardMaterial color="#b8925c" />
          </mesh>
        );
      })}
      {penonton && <Penonton t={t} sorak={sorak} />}
      {/* dinding atas berlengkung */}
      <mesh position={[0, Y_ATAS + 5, 0]} scale={[K, 1, 1]}>
        <cylinderGeometry args={[R_ATAS, R_ATAS, 10, 96, 1, true]} />
        <meshStandardMaterial map={tex.atas} side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
      {/* spanduk merah berlogo daun salam */}
      {Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2 + 0.09;
        const r = R_ATAS - 0.15;
        return (
          <mesh key={i} position={[Math.cos(a) * r * K, Y_ATAS + 5.5 + Math.sin(t * 2 + i) * 0.05, Math.sin(a) * r]} rotation={[0, -a - Math.PI / 2, 0]}>
            <planeGeometry args={[1.6, 3.6]} />
            <meshStandardMaterial map={tex.spanduk} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {/* atap kain bergaris (velarium) di tepi atas, tengahnya terbuka */}
      {Array.from({ length: 24 }, (_, i) => {
        const a0 = (i / 24) * Math.PI * 2, a1 = ((i + 0.92) / 24) * Math.PI * 2;
        const r0 = R_ATAS, r1 = R_ATAS - 9;
        const g = new THREE.BufferGeometry();
        const v = new Float32Array([
          Math.cos(a0) * r0 * K, Y_ATAS + 10, Math.sin(a0) * r0,
          Math.cos(a1) * r0 * K, Y_ATAS + 10, Math.sin(a1) * r0,
          Math.cos(a1) * r1 * K, Y_ATAS + 11.5, Math.sin(a1) * r1,
          Math.cos(a0) * r1 * K, Y_ATAS + 11.5, Math.sin(a0) * r1,
        ]);
        g.setAttribute("position", new THREE.BufferAttribute(v, 3));
        g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), 2));
        g.setIndex([0, 1, 2, 0, 2, 3]);
        g.computeVertexNormals();
        return (
          <mesh key={i} geometry={g}>
            <meshStandardMaterial map={tex.kain} side={THREE.DoubleSide} roughness={1} />
          </mesh>
        );
      })}
      {/* tiang-tiang atap */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <Box key={i} p={[Math.cos(a) * R_ATAS * K, Y_ATAS + 11, Math.sin(a) * R_ATAS]} s={[0.25, 3, 0.25]} c="#6d4c41" cast={false} />;
      })}
      {/* gerbang utama berjeruji (di -x), bangunan kecil bertiang */}
      <group position={[GERBANG.x - 0.4, 0, GERBANG.z]} rotation={[0, Math.PI / 2, 0]}>
        <Box p={[-2.5, 3, -0.6]} s={[2, 6, 1.6]} c="#d6bd94" />
        <Box p={[2.5, 3, -0.6]} s={[2, 6, 1.6]} c="#d6bd94" />
        <Box p={[0, 5.1, -0.6]} s={[3, 1.8, 1.6]} c="#d6bd94" />
        <Box p={[0, 6.3, -0.6]} s={[7.6, 0.6, 2]} c="#c8ad80" />
        <Box p={[0, 7.2, -0.6]} s={[5, 1.2, 1.6]} c="#d6bd94" />
        {[-2.9, -2.1, 2.1, 2.9].map((x) => <Box key={x} p={[x, 2.8, 0.35]} s={[0.45, 5.6, 0.45]} c="#e6d3b0" />)}
        {/* lubang gerbang + jeruji yang bisa terangkat */}
        <group position={[0, 2.1 + jeruji * 4.0, 0.35]}>
          {Array.from({ length: 9 }, (_, i) => <Box key={i} p={[-1.4 + i * 0.35, 0, 0]} s={[0.09, 4.2, 0.09]} c="#5f6469" cast={false} />)}
          {[-1.5, -0.5, 0.5, 1.5].map((y) => <Box key={y} p={[0, y, 0]} s={[3, 0.09, 0.09]} c="#5f6469" cast={false} />)}
        </group>
      </group>
      {/* balkon penyelenggara (pulvinar) berlengkung + patung, di -z */}
      <group position={[BALKON.x, 3.6, BALKON.z - 1.6]}>
        <Box p={[0, 2.4, 0]} s={[9, 4.8, 3]} c="#e2cfab" />
        <Box p={[0, 0.5, 1.6]} s={[9.4, 1, 0.4]} c="#b3261e" />
        {[-3.6, -1.2, 1.2, 3.6].map((x) => <Box key={x} p={[x, 2.6, 1.7]} s={[0.5, 4, 0.5]} c="#f1e6cf" />)}
        <Box p={[0, 5.0, 1.4]} s={[9.6, 0.5, 3.4]} c="#cdb083" />
        <mesh position={[0, 3.0, 1.55]}>
          <torusGeometry args={[1.6, 0.25, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#d9c49c" />
        </mesh>
        {/* patung di atas balkon */}
        <group position={[0, 5.3, 1.2]}>
          <Box p={[0, 0.3, 0]} s={[1.2, 0.6, 1]} c="#cfc4b0" />
          <mesh position={[0, 1.3, 0]}><cylinderGeometry args={[0.35, 0.45, 1.5, 12]} /><meshStandardMaterial color="#e8e2d6" /></mesh>
          <mesh position={[0, 2.3, 0]}><sphereGeometry args={[0.32, 14, 12]} /><meshStandardMaterial color="#e8e2d6" /></mesh>
        </group>
      </group>
      {/* patung di tepi arena (tempat jaring menyangkut) */}
      {[[PATUNG_DUEL.x, PATUNG_DUEL.z], [0.45 * A, -(B - 1.6) * Math.sqrt(1 - 0.45 * 0.45)], [0.2 * A, (B - 1.6) * Math.sqrt(1 - 0.2 * 0.2)]].map(([x, z], i) => {
        return (
          <group key={i} position={[x, 0, z]}>
            <Box p={[0, 0.6, 0]} s={[1.2, 1.2, 1.2]} c="#cdbfa6" />
            <mesh position={[0, 2.0, 0]}><cylinderGeometry args={[0.3, 0.42, 1.6, 12]} /><meshStandardMaterial color="#ece6da" /></mesh>
            <mesh position={[0, 3.05, 0]}><sphereGeometry args={[0.3, 14, 12]} /><meshStandardMaterial color="#ece6da" /></mesh>
            <Box p={[0.45, 2.4, 0]} s={[0.6, 0.16, 0.16]} c="#ece6da" rot={[0, 0, -0.6]} />
          </group>
        );
      })}
      {luar && (
        <group>
          {/* dinding luar berlengkung tiga lantai */}
          <mesh position={[0, (Y_ATAS + 10) / 2, 0]} scale={[K, 1, 1]} castShadow>
            <cylinderGeometry args={[R_ATAS + 0.4, R_ATAS + 1.2, Y_ATAS + 10, 96, 1, true]} />
            <meshStandardMaterial map={tex.luarTex} side={THREE.DoubleSide} roughness={0.95} />
          </mesh>
          <mesh position={[0, Y_ATAS + 10, 0]} scale={[K, 1, 1]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[R_ATAS - 0.2, R_ATAS + 0.9, 96]} />
            <meshStandardMaterial color="#cbb088" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Kota kecil di sekeliling Colosseum (dari udara): rumah-rumah putih beratap merah.
const Kota: React.FC = () => {
  const rumah = useMemo(() => {
    const out: { x: number; z: number; w: number; d: number; h: number; ry: number; c: string }[] = [];
    for (let i = 0; i < 420; i++) {
      const a = rnd(i) * Math.PI * 2, r = 80 + rnd(i + 1) * 170;
      out.push({ x: Math.cos(a) * r * 1.2, z: Math.sin(a) * r, w: 5 + rnd(i + 2) * 7, d: 5 + rnd(i + 3) * 7, h: 3 + rnd(i + 4) * 6, ry: rnd(i + 5) * Math.PI, c: ["#f2ead8", "#e8d8b8", "#f6f0e2", "#e2cfa6"][i % 4] });
    }
    return out;
  }, []);
  const dinding = useRef<THREE.InstancedMesh>(null);
  const atap = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), col = new THREE.Color();
    rumah.forEach((r, i) => {
      q.setFromEuler(new THREE.Euler(0, r.ry, 0));
      m.compose(new THREE.Vector3(r.x, r.h / 2, r.z), q, new THREE.Vector3(r.w, r.h, r.d));
      dinding.current!.setMatrixAt(i, m);
      dinding.current!.setColorAt(i, col.set(r.c));
      m.compose(new THREE.Vector3(r.x, r.h + 0.4, r.z), q, new THREE.Vector3(r.w + 0.6, 0.8, r.d + 0.6));
      atap.current!.setMatrixAt(i, m);
      atap.current!.setColorAt(i, col.set(i % 3 ? "#b8452e" : "#c9603f"));
    });
    dinding.current!.instanceMatrix.needsUpdate = true;
    atap.current!.instanceMatrix.needsUpdate = true;
  }, [rumah]);
  return (
    <group>
      <instancedMesh ref={dinding} args={[undefined, undefined, rumah.length]} castShadow receiveShadow frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={atap} args={[undefined, undefined, rumah.length]} castShadow frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
    </group>
  );
};

// ---------------------------------------------------------------------------
// Kamar modern (referensi kamar merah-hijau). Poster pemain bola FIKTIF + poster BobEjoo.
// Dinding bisa rebah ke luar seperti kardus (rebah 0..1). Pusat lantai di (cx, 0, cz).
// ---------------------------------------------------------------------------
export const KAMAR = { kasur: { x: 0.2, z: -0.6 }, meja: { x: -1.45, z: -1.4 }, nakas: { x: 1.55, z: -1.55 } };
const posterTex = (jenis: number) =>
  kanvas(256, 384, (g) => {
    if (jenis === 3) {
      g.fillStyle = "#FFD21F";
      g.fillRect(0, 0, 256, 384);
      g.fillStyle = "#2B2B2B";
      g.font = "600 52px 'Segoe UI', Arial";
      g.textAlign = "center";
      g.fillText("BobEjoo", 128, 200);
      g.font = "26px 'Segoe UI', Arial";
      g.fillText("Sejarah · Seru · Singkat", 128, 250);
      return;
    }
    const langit = ["#2a7a3e", "#1d4f9a", "#7a1d1d"][jenis];
    g.fillStyle = langit;
    g.fillRect(0, 0, 256, 384);
    g.fillStyle = "#3d9a4f";
    g.fillRect(0, 290, 256, 94);
    // pemain bola fiktif (siluet sederhana) menendang bola
    const baju = ["#d32f2f", "#f5f5f5", "#ffca28"][jenis];
    g.fillStyle = "#f2d2b6";
    g.beginPath(); g.arc(128, 110, 26, 0, Math.PI * 2); g.fill();
    g.fillStyle = baju;
    g.fillRect(100, 140, 56, 80);
    g.fillStyle = "#222";
    g.fillRect(100, 220, 56, 26);
    g.strokeStyle = "#f2d2b6"; g.lineWidth = 14; g.lineCap = "round";
    g.beginPath(); g.moveTo(112, 246); g.lineTo(96, 320); g.stroke();
    g.beginPath(); g.moveTo(146, 246); g.lineTo(190, 290); g.stroke();
    g.beginPath(); g.moveTo(102, 150); g.lineTo(62, 200); g.stroke();
    g.beginPath(); g.moveTo(154, 150); g.lineTo(198, 120); g.stroke();
    g.fillStyle = "#fff";
    g.beginPath(); g.arc(212, 300, 16, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#fff";
    g.font = "bold 40px Arial";
    g.textAlign = "center";
    g.fillText(String([4, 11, 23][jenis]), 128, 196);
  });

const Kamar: React.FC<{ t: number; rebah?: number; hp?: number /* 0..1 alarm menyala */; miniatur?: boolean; plafon?: boolean }> = ({ t, rebah = 0, hp = 0, miniatur = false, plafon = true }) => {
  const tex = useMemo(() => ({ p0: posterTex(0), p1: posterTex(1), p2: posterTex(2), p3: posterTex(3), karpet: kanvas(128, 128, (g) => { g.fillStyle = "#4a4d52"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 400; i++) { g.fillStyle = `rgba(255,255,255,${rnd(i) * 0.06})`; g.fillRect(rnd(i + 1) * 128, rnd(i + 2) * 128, 2, 2); } }, 4, 4), slat: kanvas(128, 128, (g) => { g.fillStyle = "#1f5a3a"; g.fillRect(0, 0, 128, 128); for (let i = 0; i < 8; i++) { g.fillStyle = "#16432b"; g.fillRect(i * 16, 0, 4, 128); } }, 3, 1) }), []);
  const L = 2.1, T = 2.8; // setengah lebar ruangan, tinggi
  const sudut = Math.min(1, rebah) * (Math.PI / 2);
  // Dinding: berputar di tepi bawahnya, rebah ke luar (pantulan kecil di akhir).
  const pantul = rebah > 1 ? 0 : rebah > 0.85 ? Math.sin((rebah - 0.85) / 0.15 * Math.PI) * 0.06 : 0;
  const a = sudut - pantul;
  const dinding = (rotSumbu: "x" | "z", tanda: number, isi: React.ReactNode, pos: [number, number, number]) => (
    <group position={pos} rotation={rotSumbu === "x" ? [tanda * a, 0, 0] : [0, 0, tanda * a]}>{isi}</group>
  );
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[L * 2, L * 2]} />
        <meshStandardMaterial map={tex.karpet} />
      </mesh>
      {/* dinding belakang (z = -L): merah + poster */}
      {dinding("x", -1, (
        <group>
          <Box p={[0, T / 2, 0]} s={[L * 2, T, 0.12]} c="#c62828" />
          <Box p={[0, 0.5, 0.07]} s={[L * 2, 1.0, 0.02]} c="#a51f1f" cast={false} />
          <Box p={[0, 1.02, 0.08]} s={[L * 2, 0.03, 0.02]} c="#ff6b6b" e="#ff4040" ei={1.4} cast={false} />
          {[[-1.3, tex.p0], [-0.45, tex.p1], [0.4, tex.p2], [1.25, tex.p3]].map(([x, m], i) => (
            <mesh key={i} position={[x as number, 1.85, 0.08]}>
              <planeGeometry args={[0.62, 0.92]} />
              <meshStandardMaterial map={m as THREE.Texture} />
            </mesh>
          ))}
        </group>
      ), [0, 0, -L])}
      {/* dinding kiri (x = -L): putih + garis vertikal */}
      {dinding("z", 1, (
        <group>
          <Box p={[0, T / 2, 0]} s={[0.12, T, L * 2]} c="#f2f2f0" />
          <Box p={[0.07, 0.5, 0]} s={[0.02, 1.0, L * 2]} c="#c62828" cast={false} />
          {[-0.6, -0.45].map((z) => <Box key={z} p={[0.07, 1.9, z]} s={[0.02, 1.6, 0.03]} c="#333" cast={false} />)}
        </group>
      ), [-L, 0, 0])}
      {/* dinding kanan (x = +L): panel hijau bergaris */}
      {dinding("z", -1, (
        <group>
          <Box p={[0, T / 2, 0]} s={[0.12, T, L * 2]} c="#1f5a3a" map={tex.slat} />
          {/* jendela pagi */}
          <Box p={[-0.07, 1.7, 0.6]} s={[0.03, 1.0, 1.1]} c="#cfe8ff" e="#fff4d6" ei={1.2} cast={false} />
        </group>
      ), [L, 0, 0])}
      {/* dinding depan (z = +L, di belakang kamera) */}
      {dinding("x", 1, <Box p={[0, T / 2, 0]} s={[L * 2, T, 0.12]} c="#c62828" />, [0, 0, L])}
      {plafon && rebah < 0.05 && <Box p={[0, T + 0.05, 0]} s={[L * 2, 0.1, L * 2]} c="#f5f5f5" cast={false} />}
      {/* kasur abu-abu dengan seprai putih dan bantal */}
      <group position={[KAMAR.kasur.x, 0, KAMAR.kasur.z]}>
        <Box p={[0, 0.2, 0]} s={[1.7, 0.4, 2.1]} c="#9e9e9e" />
        <Box p={[0, 0.48, 0.05]} s={[1.62, 0.18, 2.0]} c="#fafafa" />
        <Box p={[0, 0.6, 0.45]} s={[1.66, 0.08, 1.2]} c="#c8c8c8" />
        <Box p={[0, 0.85, -1.02]} s={[1.8, 0.9, 0.12]} c="#bdbdbd" />
        <Box p={[-0.42, 0.66, -0.72]} s={[0.62, 0.16, 0.36]} c="#ffffff" />
        <Box p={[0.42, 0.66, -0.72]} s={[0.62, 0.16, 0.36]} c="#ffffff" />
      </group>
      {/* nakas + HP (layar menyala saat alarm) + lampu */}
      <group position={[KAMAR.nakas.x, 0, KAMAR.nakas.z]}>
        <mesh position={[0, 0.3, 0]} castShadow><cylinderGeometry args={[0.28, 0.28, 0.6, 20]} /><meshStandardMaterial color="#222" /></mesh>
        <Box p={[0.05, 0.62, 0.05]} s={[0.09, 0.015, 0.17]} c="#111" e={hp > 0 ? "#7fd0ff" : "#000"} ei={hp * (0.6 + 0.4 * Math.sin(t * 20))} />
      </group>
      {/* meja belajar + lampu meja + miniatur Colosseum */}
      <group position={[KAMAR.meja.x, 0, KAMAR.meja.z]}>
        <Box p={[0, 0.74, 0]} s={[1.0, 0.05, 0.6]} c="#f0f0f0" />
        {[-0.45, 0.45].map((x) => <Box key={x} p={[x, 0.37, 0]} s={[0.04, 0.74, 0.55]} c="#d0d0d0" />)}
        <Box p={[0.32, 0.98, -0.18]} s={[0.03, 0.45, 0.03]} c="#ddd" />
        <Box p={[0.26, 1.2, -0.12]} s={[0.16, 0.05, 0.08]} c="#eee" e="#fff2cc" ei={0.8} />
        <pointLight position={[0.26, 1.1, -0.05]} color="#ffe2b0" intensity={1.6} distance={3} decay={2} />
        {miniatur && (
          <group position={[-0.1, 0.77, 0.02]} scale={0.0042}>
            <Colosseum s={{ t, sorak: 1, luar: true }} />
          </group>
        )}
      </group>
      {/* lampu kamar hangat */}
      {rebah < 0.5 && <pointLight position={[0, 2.5, 0.4]} color="#ffe6c4" intensity={6} distance={7} decay={2} />}
    </group>
  );
};

// ---------------------------------------------------------------------------
// Barak gladiator (ruang batu berkubah, cahaya obor hangat, meja kayu, tong, rantai)
// Pusat di (0, 0, 0); ruangan 8 x 6 m, dinding belakang z = -3.
// ---------------------------------------------------------------------------
export const BARAK = { meja: { x: 0, z: -0.6 } };
const Barak: React.FC<{ t: number }> = ({ t }) => {
  const tex = useMemo(() => ({ dinding: texBata("#7a6448", "#4e3e2c", 4, 2), lantai: texBata("#6a5a46", "#3e3326", 5, 4), kayu: kanvas(64, 64, (g) => { g.fillStyle = "#7a5534"; g.fillRect(0, 0, 64, 64); for (let i = 0; i < 6; i++) { g.fillStyle = "#5e3f24"; g.fillRect(0, i * 11, 64, 2); } }) }), []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[10, 8]} /><meshStandardMaterial map={tex.lantai} roughness={1} /></mesh>
      <Box p={[0, 2.2, -3.1]} s={[10, 4.4, 0.3]} c="#ffffff" map={tex.dinding} />
      <Box p={[-4.6, 2.2, 0]} s={[0.3, 4.4, 8]} c="#ffffff" map={tex.dinding} />
      <Box p={[4.6, 2.2, 0]} s={[0.3, 4.4, 8]} c="#ffffff" map={tex.dinding} />
      {/* kubah setengah silinder + lengkung-lengkung batu */}
      <mesh position={[0, 3.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[4.6, 4.6, 8, 24, 1, true, 0, Math.PI]} />
        <meshStandardMaterial map={tex.dinding} side={THREE.BackSide} roughness={1} />
      </mesh>
      {[-2.8, 0, 2.8].map((z) => (
        <mesh key={z} position={[0, 3.6, z]}>
          <torusGeometry args={[4.4, 0.22, 8, 32, Math.PI]} />
          <meshStandardMaterial color="#8a7454" />
        </mesh>
      ))}
      {/* jendela kecil di dinding belakang + berkas cahaya */}
      <Box p={[2.6, 3.4, -2.94]} s={[0.8, 0.5, 0.05]} c="#fff3cf" e="#ffe8a8" ei={2} cast={false} />
      <mesh position={[2.0, 2.2, -1.8]} rotation={[0.55, 0, 0.35]}>
        <cylinderGeometry args={[0.3, 1.2, 3.4, 16, 1, true]} />
        <meshBasicMaterial color="#fff1c4" transparent opacity={0.12} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      {/* meja kayu panjang + bangku */}
      <group position={[BARAK.meja.x, 0, BARAK.meja.z]}>
        <Box p={[0, 0.78, 0]} s={[2.6, 0.08, 0.9]} c="#ffffff" map={tex.kayu} />
        {[[-1.15, -0.35], [1.15, -0.35], [-1.15, 0.35], [1.15, 0.35]].map(([x, z], i) => <Box key={i} p={[x, 0.38, z]} s={[0.1, 0.76, 0.1]} c="#5e3f24" />)}
        <Box p={[0, 0.45, -0.75]} s={[2.4, 0.07, 0.35]} c="#6d4a2a" />
        {/* mangkuk, cangkir, roti, kendi */}
        {[-0.7, 0.1, 0.8].map((x, i) => (
          <group key={i} position={[x, 0.82, 0.05]}>
            <mesh><cylinderGeometry args={[0.16, 0.1, 0.1, 16]} /><meshStandardMaterial color="#8d6e63" /></mesh>
            <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.14, 0.14, 0.01, 16]} /><meshStandardMaterial color="#e8d8a8" /></mesh>
          </group>
        ))}
        <mesh position={[-0.3, 0.92, 0.25]}><cylinderGeometry args={[0.06, 0.05, 0.18, 12]} /><meshStandardMaterial color="#a1887f" /></mesh>
        <mesh position={[1.05, 0.98, -0.2]}><sphereGeometry args={[0.18, 14, 12]} /><meshStandardMaterial color="#a0522d" /></mesh>
        <mesh position={[0.45, 0.86, -0.25]} scale={[1.3, 0.6, 1]}><sphereGeometry args={[0.12, 12, 10]} /><meshStandardMaterial color="#c8a060" /></mesh>
      </group>
      {/* dipan kayu berjerami di kiri */}
      <group position={[-3.4, 0, -1.6]}>
        <Box p={[0, 0.35, 0]} s={[1.0, 0.12, 2.2]} c="#ffffff" map={tex.kayu} />
        <Box p={[0, 0.46, 0]} s={[0.9, 0.1, 2.0]} c="#c9a95f" />
        {[[-0.45, -1.0], [0.45, -1.0], [-0.45, 1.0], [0.45, 1.0]].map(([x, z], i) => <Box key={i} p={[x, 0.15, z]} s={[0.08, 0.3, 0.08]} c="#5e3f24" />)}
      </group>
      {/* tong kayu, rantai di dinding, perisai & pedang tergantung */}
      {[[3.6, -2.4], [3.9, -1.6], [-3.9, 1.8]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.45, z]} castShadow><cylinderGeometry args={[0.38, 0.34, 0.9, 16]} /><meshStandardMaterial color="#7a5534" /></mesh>
      ))}
      {[-1.6, -1.2].map((x) => (
        <group key={x} position={[x, 2.6, -2.92]}>
          {Array.from({ length: 6 }, (_, i) => (
            <mesh key={i} position={[0, -i * 0.12, 0]} rotation={[0, i % 2 ? Math.PI / 2 : 0, 0]}>
              <torusGeometry args={[0.05, 0.015, 6, 12]} />
              <meshStandardMaterial color="#5f6469" metalness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
      <Box p={[0.9, 2.3, -2.9]} s={[0.7, 1.1, 0.08]} c="#b3261e" />
      <Box p={[0.9, 2.3, -2.85]} s={[0.12, 0.12, 0.05]} c="#e0b400" />
      <Obor p={[-2.4, 2.2, -2.85]} t={t} kuat={7} />
      <Obor p={[3.0, 2.2, -2.85]} t={t} kuat={5} />
      <Obor p={[-4.35, 2.2, 1.0]} t={t} kuat={5} rotY={Math.PI / 2} />
    </group>
  );
};

// ---------------------------------------------------------------------------
// Lorong bawah arena (referensi lorong ungu): kubah, pilar, pintu sel berjeruji, obor.
// Membentang dari x = GERBANG.x - 0.6 ke arah -x sepanjang 22 m; lebar 4 m.
// ---------------------------------------------------------------------------
export const LORONG = { x0: GERBANG.x - 1.4, panjang: 22 };
const Lorong: React.FC<{ t: number }> = ({ t }) => {
  const tex = useMemo(() => ({ batu: texBata("#5d5a86", "#3c3a5c", 6, 2), lantai: texBata("#6e6a99", "#4a4770", 8, 2) }), []);
  const x0 = LORONG.x0, Lp = LORONG.panjang;
  const xm = x0 - Lp / 2;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[xm, 0.01, 0]} receiveShadow><planeGeometry args={[Lp, 4]} /><meshStandardMaterial map={tex.lantai} roughness={1} /></mesh>
      <Box p={[xm, 1.9, -2.1]} s={[Lp, 3.8, 0.3]} c="#ffffff" map={tex.batu} />
      <Box p={[xm, 1.9, 2.1]} s={[Lp, 3.8, 0.3]} c="#ffffff" map={tex.batu} />
      <mesh position={[xm, 3.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[2.1, 2.1, Lp, 20, 1, true, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial map={tex.batu} side={THREE.BackSide} roughness={1} />
      </mesh>
      <Box p={[x0 - Lp, 2.4, 0]} s={[0.3, 4.8, 4.2]} c="#ffffff" map={tex.batu} />
      {Array.from({ length: 6 }, (_, i) => {
        const x = x0 - 2 - i * 3.6;
        return (
          <group key={i}>
            {[-1.85, 1.85].map((z) => <Box key={z} p={[x, 1.8, z]} s={[0.5, 3.6, 0.5]} c="#44425f" />)}
            {i % 2 === 0 && [-1.92, 1.92].map((z) => (
              <group key={`p${z}`} position={[x - 1.8, 0, z]}>
                <Box p={[0, 1.2, 0]} s={[1.3, 2.4, 0.06]} c="#1b1a26" cast={false} />
                {Array.from({ length: 5 }, (_, b) => <Box key={b} p={[-0.5 + b * 0.25, 1.2, z > 0 ? -0.05 : 0.05]} s={[0.05, 2.3, 0.05]} c="#6f6c78" cast={false} />)}
                <Box p={[0, 2.45, z > 0 ? -0.05 : 0.05]} s={[1.5, 0.14, 0.12]} c="#b86a3a" cast={false} />
              </group>
            ))}
            {i % 2 === 1 && <Obor p={[x - 1.8, 2.2, 1.9]} t={t} kuat={4} rotY={Math.PI} />}
            {i % 2 === 1 && <Obor p={[x - 1.8, 2.2, -1.9]} t={t} kuat={4} />}
          </group>
        );
      })}
    </group>
  );
};

// ---------------------------------------------------------------------------
// Panggung: satu kanvas 3D dengan kamera bersama + isi set yang dipilih.
// ---------------------------------------------------------------------------
export type Panggung = {
  t: number;
  arena?: ArenaState | null; // Colosseum utuh di (0,0,0)
  kota?: boolean;
  kamar?: { rebah?: number; hp?: number; miniatur?: boolean; plafon?: boolean } | null; // kamar di tengah arena (0,0,0)
  barak?: boolean; // barak berdiri sendiri (tanpa arena)
  lorong?: boolean; // lorong di balik gerbang arena
  siang?: boolean; // matahari terik (arena) vs cahaya dalam ruangan
  malam?: boolean; // arena saat malam (cahaya bulan biru, tanpa langit siang)
};

export const Set3D: React.FC<{ pose: Pose; p: Panggung }> = ({ pose, p }) => {
  const malam = !!p.malam;
  const siang = !malam && (p.siang ?? !!p.arena);
  return (
    <ThreeCanvas width={W} height={H} shadows camera={{ fov: pose.fov, near: 0.03, far: 2500 }} gl={{ antialias: true }}>
      <CameraRig pose={pose} />
      <color attach="background" args={[siang ? "#8cc3ef" : "#1a1410"]} />
      {malam ? (
        <>
          <color attach="background" args={["#0d1630"]} />
          <fog attach="fog" args={["#0d1630", 120, 600]} />
          <ambientLight color="#5b6fa8" intensity={0.9} />
          <hemisphereLight args={["#6f86c8", "#2a2418", 0.5]} />
          <directionalLight position={[-50, 90, 40]} color="#cdd8ff" intensity={1.2} />
          <mesh position={[-120, 160, -260]}><sphereGeometry args={[14, 24, 24]} /><meshBasicMaterial color="#f1f0e6" fog={false} /></mesh>
        </>
      ) : siang ? (
        <>
          <Langit />
          <fog attach="fog" args={["#cfe3f2", 260, 900]} />
          <ambientLight color="#fff4e0" intensity={1.05} />
          <hemisphereLight args={["#bfdcff", "#c9a070", 0.75]} />
          <directionalLight position={[60, 110, 50]} color="#fff1d6" intensity={2.4} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-70} shadow-camera-right={70} shadow-camera-top={70} shadow-camera-bottom={-70} />
        </>
      ) : (
        <>
          <ambientLight color="#6a5240" intensity={0.55} />
          <hemisphereLight args={["#ffd2a0", "#2a1e14", 0.35]} />
        </>
      )}
      {p.arena && <Colosseum s={p.arena} />}
      {p.kota && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <planeGeometry args={[1400, 1400]} />
          <meshStandardMaterial color="#d8b77e" roughness={1} />
        </mesh>
      )}
      {p.kota && <Kota />}
      {p.kamar && <Kamar t={p.t} {...p.kamar} />}
      {p.barak && <Barak t={p.t} />}
      {p.lorong && <Lorong t={p.t} />}
    </ThreeCanvas>
  );
};
