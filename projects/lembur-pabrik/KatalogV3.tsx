import React from "react";
import { AbsoluteFill } from "remotion";
import { Karakter, KarakterProps } from "../_pustaka/Karakter";

// Lembar cek pustaka karakter v3 (ekspresi, atribut, gerak lincah gaya referensi). Bukan adegan video.

type Sel = Omit<KarakterProps, "x" | "groundY" | "width"> & { label: string };

const Lembar: React.FC<{ judul: string; baris: Sel[][]; lebar?: number }> = ({ judul, baris, lebar = 300 }) => {
  const W = 1920, H = 1080;
  const rowH = (H - 90) / baris.length;
  return (
    <AbsoluteFill style={{ backgroundColor: "#24455E", fontFamily: "Segoe UI, Arial, sans-serif" }}>
      <div style={{ position: "absolute", left: 30, top: 18, color: "#FFFFFF", fontSize: 34, fontWeight: 700 }}>{judul}</div>
      {baris.map((row, r) => {
        const colW = W / row.length;
        const ground = 90 + rowH * (r + 1) - 46;
        return row.map((c, i) => {
          const { label, ...k } = c;
          return (
            <React.Fragment key={`${r}-${i}`}>
              <Karakter {...k} x={colW * (i + 0.5)} groundY={ground} width={lebar} />
              <div style={{ position: "absolute", left: colW * i, width: colW, top: ground + 8, textAlign: "center", color: "#E3EEF6", fontSize: 21, fontWeight: 600 }}>{label}</div>
            </React.Fragment>
          );
        });
      })}
    </AbsoluteFill>
  );
};

// A. Ekspresi baru (mata lebih besar, alis tebal, mulut lebar, wajah memerah)
export const KatalogEkspresi: React.FC = () => (
  <Lembar
    judul="v3 — Ekspresi baru gaya referensi"
    lebar={330}
    baris={[
      [
        { label: "teriak + bicara", outfit: "biasa", expression: "teriak", pose: "bicara", motion: "bicara", t: 0.3 },
        { label: "merem (wajah merah)", outfit: "warga", expression: "merem", pose: "kepal_marah", t: 0.2 },
        { label: "syok", outfit: "cewek", expression: "syok", pose: "tutup_mulut", t: 0.4 },
        { label: "datar", outfit: "biasa", expression: "datar", pose: "tangan_pinggang", t: 0.4 },
        { label: "curiga", outfit: "ilmuwan", expression: "curiga", pose: "garuk_kepala", t: 0.4 },
      ],
      [
        { label: "girang", outfit: "cewek", expression: "girang", pose: "angkat_tangan", t: 0.1 },
        { label: "bingung + tanya", outfit: "biasa", expression: "bingung", pose: "garuk_kepala", efek: ["tanya"], t: 0.3 },
        { label: "pingsan + pusing", outfit: "warga", expression: "pingsan", pose: "idle", efek: ["pusing"], t: 0.5 },
        { label: "takut + keringat", outfit: "cewek", expression: "takut", pose: "peluk", efek: ["keringat"], t: 0.3 },
        { label: "kaget + garis kaget", outfit: "sipir", expression: "kaget", pose: "angkat_tangan", motion: "kaget", tAksi: 0.2, efek: ["garis_kaget"], t: 0.2 },
      ],
    ]}
  />
);

// B. Gerak lincah: urutan bingkai satu aksi (kiri ke kanan = waktu berjalan)
const urut = (base: Omit<Sel, "label" | "t" | "tAksi">, waktu: number[], nama: string): Sel[] =>
  waktu.map((w) => ({ ...base, t: w, tAksi: w, label: `${nama} ${w.toFixed(2)} s` }));

export const KatalogGerak: React.FC = () => (
  <Lembar
    judul="v3 — Gerak lincah (bingkai berurutan, kiri → kanan)"
    lebar={230}
    baris={[
      urut({ outfit: "cewek", expression: "kaget", pose: "angkat_tangan", motion: "kaget", efek: ["garis_kaget"] }, [0, 0.07, 0.16, 0.26, 0.38, 0.8], "kaget"),
      urut({ outfit: "cewek", expression: "pingsan", pose: "idle", motion: "pingsan", efek: ["pusing"], dir: 1 }, [0, 0.3, 0.45, 0.56, 0.68, 1.2], "pingsan"),
      urut({ outfit: "biasa", expression: "girang", pose: "angkat_tangan", motion: "lompat" }, [0, 0.06, 0.2, 0.32, 0.45, 0.58], "lompat"),
    ]}
  />
);

// C. Atribut & benda: satpam BobEjoo, gunting seperti pedang, mendorong, lari, jenggot
export const KatalogAtribut: React.FC = () => (
  <Lembar
    judul="v3 — Atribut, benda, dan gerak lain"
    lebar={330}
    baris={[
      [
        { label: "satpam: topi + senter", outfit: "biasa", expression: "curiga", pose: "pegang_benda", pegang: "senter", atribut: ["topi_satpam"], t: 0.3 },
        { label: "satpam melambai bingung", outfit: "biasa", expression: "bingung", pose: "lambai", atribut: ["topi_satpam"], t: 0.35 },
        { label: "gunting + tali ID", outfit: "cewek", expression: "takut", pose: "pegang_benda", pegang: "gunting", atribut: ["tali_id"], motion: "gemetar", t: 0.3 },
        { label: "kartu absen", outfit: "cewek", expression: "syok", pose: "pegang_benda", pegang: "kartu_absen", t: 0.3 },
        { label: "lirik ke kanan", outfit: "cewek", expression: "takut", pose: "tutup_mulut", lirik: 1, t: 0.3 },
      ],
      [
        { label: "dorong (merem)", outfit: "warga", expression: "merem", pose: "dorong", motion: "dorong", efek: ["keringat"], t: 0.3 },
        { label: "lari", outfit: "cewek", expression: "takut", pose: "idle", motion: "lari", dir: 1, efek: ["debu"], t: 0.15 },
        { label: "jenggot + ikat kepala", outfit: "warga", expression: "datar", pose: "pegang_benda", pegang: "palu", atribut: ["jenggot", "ikat_kepala"], t: 0.3 },
        { label: "tongkat + seru", outfit: "ilmuwan", expression: "teriak", pose: "pegang_benda", pegang: "tongkat", efek: ["seru"], t: 0.2 },
        { label: "hantu melambai", outfit: "hantu", expression: "seram", pose: "lambai", motion: "melayang", t: 0.3 },
      ],
    ]}
  />
);
