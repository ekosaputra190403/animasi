import React from "react";
import { Karakter } from "../_pustaka/Karakter";
import { Pose, placeCharacter } from "./kamera";

export type PeranBajak =
  | "kamu"        // Jaket kulit bajak laut + kaos dalam hitam "RUANG PIKIR" + bandana merah
  | "kapten"      // Jubah merah kapten emas + Topi Tricorn besar + Jenggot & Kumis lebat
  | "awak_kumis"  // Rompi biru tua + Kumis melengkung tebal + Penutup mata (eyepatch) + bandana
  | "awak_tato"   // Rompi cokelat + Jenggot + Sabuk silang dada + bandana kuning
  | "awak_kurus"; // Kemeja garis-garis pelaut + Kacamata + Topi kupluk bajak laut

type KarProps = Omit<React.ComponentProps<typeof Karakter>, "x" | "groundY" | "width" | "outfit">;

export const DiBajak: React.FC<
  { kam: Pose; x: number; z: number; tinggi?: number; lantai?: number; peran: PeranBajak } & KarProps
> = ({ kam, x, z, tinggi = 1.65, lantai = 0, peran, dir = 1, atribut = [], ...rest }) => {
  const c = placeCharacter(kam, x, z, tinggi, lantai);
  if (!c.visible) return null;

  // Pilih base outfit & atribut bawaan rig sebagai fondasi
  const baseOutfit =
    peran === "kapten" ? "lanista" :
    peran === "awak_tato" ? "flamma" :
    peran === "awak_kumis" ? "gladiator" :
    peran === "awak_kurus" ? "romawi" : "biasa";

  const gabunganAtribut = Array.from(
    new Set([
      ...atribut,
      ...(peran === "kapten" ? ["jenggot"] : []),
      ...(peran === "awak_tato" ? ["jenggot", "ikat_kepala"] : []),
      ...(peran === "awak_kumis" ? ["ikat_kepala"] : []),
      ...(peran === "awak_kurus" ? ["kacamata"] : []),
      ...(peran === "kamu" ? ["ikat_kepala"] : []),
    ])
  );

  // Ukuran proporsional overlay kostum mengikuti tinggi/lebar karakter di layar
  const w = c.width;
  const h = (w * 315) / 240;
  const left = c.x - w / 2;
  const top = c.groundY - (293 / 315) * h;
  const napasY = Math.sin(rest.t * 3.2) * 1.8;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* Karakter Dasar dari Rig */}
      <Karakter
        {...rest}
        outfit={baseOutfit}
        atribut={gabunganAtribut}
        dir={dir}
        x={c.x}
        groundY={c.groundY}
        width={w}
      />

      {/* Lapisan Kostum & Aksesoris Bajak Laut di Atas Karakter (Skala Identik dengan ViewBox Rig -120..120, -165..150) */}
      <svg
        viewBox="-120 -165 240 315"
        style={{
          position: "absolute",
          left,
          top,
          width: w,
          height: h,
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <g transform={`scale(${dir}, 1) translate(0, ${napasY})`}>
          {/* ================= 1. KOSTUM BADAN BAJAK LAUT (Menutup Kaos Kuning) ================= */}
          {peran === "kamu" && (
            <g>
              {/* Kaos Dalam Hitam + Jaket Kulit Cokelat Tua Terbuka */}
              <rect x={-34} y={-22} width={68} height={82} rx={14} fill="#1E242B" stroke="#141414" strokeWidth={4.5} />
              <path d="M -36 -22 L -14 -22 L -18 60 L -38 60 Z" fill="#5C3317" stroke="#141414" strokeWidth={4} strokeLinejoin="round" />
              <path d="M 14 -22 L 36 -22 L 38 60 L 18 60 Z" fill="#5C3317" stroke="#141414" strokeWidth={4} strokeLinejoin="round" />
              {/* Kerah Jaket & Sabuk Bajak Laut */}
              <rect x={-36} y={44} width={72} height={14} rx={4} fill="#3A1F0D" stroke="#141414" strokeWidth={4} />
              <rect x={-10} y={42} width={20} height={18} rx={3} fill="#FFD700" stroke="#141414" strokeWidth={3.5} />
              {/* Tulisan RUANG PIKIR di dada (Tidak terbalik saat dir=-1) */}
              <g transform={`scale(${dir}, 1)`}>
                <text x={0} y={14} textAnchor="middle" fill="#FFD700" fontSize="9.5" fontWeight="900" fontFamily="Arial Black, sans-serif">
                  RUANG
                </text>
                <text x={0} y={26} textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="900" fontFamily="Arial Black, sans-serif">
                  PIKIR
                </text>
              </g>
              {/* Bandana Merah Bajak Laut di Kepala */}
              <path d="M -41 -98 Q 0 -112 41 -98 L 43 -82 Q 0 -92 -43 -82 Z" fill="#D91E18" stroke="#141414" strokeWidth={4.5} />
              <path d="M -42 -88 L -62 -76 L -54 -65 Z" fill="#D91E18" stroke="#141414" strokeWidth={4} />
            </g>
          )}

          {peran === "kapten" && (
            <g>
              {/* Jubah Panjang Merah Marun Kapten + Kancing Emas */}
              <path d="M -42 -24 L 42 -24 L 48 72 L -48 72 Z" fill="#9E1B1B" stroke="#141414" strokeWidth={5} strokeLinejoin="round" />
              <rect x={-12} y={-22} width={24} height={92} fill="#F5E6C8" stroke="#141414" strokeWidth={3.5} />
              {/* Pundak Epaulette Emas Kapten */}
              <ellipse cx={-42} cy={-20} rx={14} ry={8} fill="#FFD700" stroke="#141414" strokeWidth={4} />
              <ellipse cx={42} cy={-20} rx={14} ry={8} fill="#FFD700" stroke="#141414" strokeWidth={4} />
              {/* Sabuk Hitam Gesper Emas */}
              <rect x={-45} y={42} width={90} height={15} rx={4} fill="#1A1A1A" stroke="#141414" strokeWidth={4} />
              <rect x={-12} y={40} width={24} height={19} rx={3} fill="#FFD700" stroke="#141414" strokeWidth={4} />
              {/* Kumis Melengkung & Jenggot Lebat Hitam Kapten */}
              <path d="M -32 -42 Q 0 -22 32 -42 L 26 -8 Q 0 12 -26 -8 Z" fill="#1E1E1E" stroke="#141414" strokeWidth={4} />
              <path d="M -34 -46 Q -15 -56 0 -45 Q 15 -56 34 -46" stroke="#141414" strokeWidth={7} fill="none" strokeLinecap="round" />
              {/* Topi Besar Tricorn Kapten + Tengkorak Kecil & Bulu */}
              <path d="M -72 -96 Q 0 -152 72 -96 Q 0 -82 -72 -96 Z" fill="#1B1F26" stroke="#141414" strokeWidth={5} strokeLinejoin="round" />
              <path d="M -68 -96 Q 0 -138 68 -96" stroke="#FFD700" strokeWidth={4.5} fill="none" />
              <circle cx={0} cy={-112} r={9} fill="#FFFFFF" stroke="#141414" strokeWidth={3} />
              <path d="M 32 -122 Q 62 -155 48 -110" fill="#E74C3C" stroke="#141414" strokeWidth={3.5} />
            </g>
          )}

          {peran === "awak_kumis" && (
            <g>
              {/* Rompi Biru Laut & Sabuk Selempang */}
              <rect x={-35} y={-22} width={70} height={80} rx={12} fill="#1F4E78" stroke="#141414" strokeWidth={4.5} />
              <line x1={-32} y1={-20} x2={32} y2={54} stroke="#8B4513" strokeWidth={11} />
              <rect x={-37} y={44} width={74} height={14} fill="#8B0000" stroke="#141414" strokeWidth={4} />
              {/* Penutup Mata (Eyepatch) Bajak Laut & Kumis Melengkung Lebat */}
              <line x1={-38} y1={-78} x2={38} y2={-62} stroke="#141414" strokeWidth={4} />
              <circle cx={-16} cy={-68} r={10} fill="#141414" />
              <path d="M -36 -45 Q -16 -58 0 -44 Q 16 -58 36 -45" stroke="#2C1B10" strokeWidth={8.5} fill="none" strokeLinecap="round" />
              {/* Bandana Biru Tua */}
              <path d="M -41 -98 Q 0 -112 41 -98 L 43 -83 Q 0 -92 -43 -83 Z" fill="#1B3B6F" stroke="#141414" strokeWidth={4.5} />
            </g>
          )}

          {peran === "awak_tato" && (
            <g>
              {/* Rompi Kulit Terbuka & Sabuk Tengkorak */}
              <rect x={-36} y={-22} width={72} height={80} rx={12} fill="#7A4928" stroke="#141414" strokeWidth={4.5} />
              <rect x={-12} y={-22} width={24} height={80} fill="#D9A773" />
              <rect x={-38} y={44} width={76} height={15} fill="#222" stroke="#141414" strokeWidth={4} />
              <circle cx={0} cy={51} r={8} fill="#FFF" stroke="#141414" strokeWidth={3} />
              {/* Jenggot Kasar & Bandana Kuning Emas */}
              <path d="M -30 -42 L 30 -42 L 22 -14 L -22 -14 Z" fill="#3B2313" stroke="#141414" strokeWidth={4} />
              <path d="M -41 -98 Q 0 -112 41 -98 L 43 -83 Q 0 -92 -43 -83 Z" fill="#E67E22" stroke="#141414" strokeWidth={4.5} />
            </g>
          )}

          {peran === "awak_kurus" && (
            <g>
              {/* Baju Belang-Belang Pelaut Biru-Putih */}
              <rect x={-33} y={-22} width={66} height={78} rx={12} fill="#F5F7FA" stroke="#141414" strokeWidth={4.5} />
              {[-10, 6, 22, 38].map((yy, i) => (
                <line key={i} x1={-31} y1={yy} x2={31} y2={yy} stroke="#1F5A9E" strokeWidth={7} />
              ))}
              <rect x={-35} y={44} width={70} height={13} fill="#5C3317" stroke="#141414" strokeWidth={4} />
              {/* Topi Kupluk Merah Pelaut */}
              <path d="M -40 -92 Q 0 -138 40 -92 Z" fill="#C0392B" stroke="#141414" strokeWidth={4.5} />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
