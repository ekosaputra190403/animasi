import React from "react";
import { AbsoluteFill } from "remotion";
import { Karakter, KarakterProps } from "../_pustaka/Karakter";

// Lembar cek pustaka v5 (kostum Romawi, pose bertarung, senjata, efek). Bukan adegan video.
type Sel = Omit<KarakterProps, "x" | "groundY" | "width"> & { label: string };
const baris: Sel[][] = [
  [
    { label: "gladiator + helm", outfit: "gladiator", expression: "fokus", pose: "kuda_kuda", motion: "siaga", atribut: ["helm_gladiator"], t: 0.3 },
    { label: "tusuk + benturan", outfit: "gladiator", expression: "teriak", pose: "tusuk", motion: "seruduk", efek: ["benturan", "garis_cepat"], t: 0.22, dir: 1 },
    { label: "tangkis (terpental)", outfit: "gladiator", expression: "merem", pose: "tangkis", motion: "terpental", tAksi: 0.1, efek: ["benturan"], t: 0.1 },
    { label: "ayun", outfit: "flamma", expression: "teriak", pose: "ayun", t: 0.15 },
    { label: "helm secutor", outfit: "gladiator", expression: "kaget", pose: "kuda_kuda", atribut: ["helm_secutor"], t: 0.3 },
    { label: "retiarius jaring", outfit: "retiarius", expression: "pede", pose: "lempar_jaring", t: 0.3 },
    { label: "trisula", outfit: "retiarius", expression: "teriak", pose: "tusuk_trisula", t: 0.25 },
  ],
  [
    { label: "angkat jari", outfit: "retiarius", expression: "datar", pose: "angkat_jari", t: 0.3 },
    { label: "menghindar", outfit: "gladiator", expression: "takut", pose: "kuda_kuda", motion: "menghindar", tAksi: 0.3, t: 0.3 },
    { label: "wasit + tongkat", outfit: "wasit", expression: "marah", pose: "pegang_benda", pegang: "tongkat", t: 0.3 },
    { label: "lanista + koin", outfit: "lanista", expression: "syok", pose: "pegang_benda", pegang: "kantong_koin", t: 0.3 },
    { label: "pedang kayu", outfit: "flamma", expression: "girang", pose: "serahkan", pegang: "pedang_kayu", t: 0.3 },
    { label: "daun palem", outfit: "gladiator", expression: "girang", pose: "pegang_benda", pegang: "daun_palem", t: 0.3 },
    { label: "penonton", outfit: "romawi", expression: "girang", pose: "angkat_tangan", t: 0.3 },
  ],
];
export const KatalogGladiator: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#C9A36A", fontFamily: "Segoe UI, Arial" }}>
    {baris.map((row, r) => {
      const colW = 1920 / row.length;
      const ground = 60 + 500 * (r + 1) - 50;
      return row.map(({ label, ...k }, i) => (
        <React.Fragment key={`${r}${i}`}>
          <Karakter {...k} x={colW * (i + 0.5)} groundY={ground} width={300} />
          <div style={{ position: "absolute", left: colW * i, width: colW, top: ground + 6, textAlign: "center", color: "#2b1d0e", fontSize: 22, fontWeight: 700 }}>{label}</div>
        </React.Fragment>
      ));
    })}
  </AbsoluteFill>
);
