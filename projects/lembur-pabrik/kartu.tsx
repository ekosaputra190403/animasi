import React from "react";

// Kartu absensi kertas (referensi pemilik no. 6): pita biru di atas, kotak No./Nama/Dept./Bulan,
// judul "KARTU ABSENSI", tabel tanggal 1–15 dengan kolom Pagi, Siang, Lembur (Masuk/Keluar).
// Kartu lama 1997 kekuningan + berdebu; kartu karyawan masih baru. Baris tanggal 9 (malam ini)
// terisi jam masuk dan masuk lembur, tapi kolom KELUAR lembur kosong.

type Props = {
  nama: string;
  bulan: string; // mis. "NOV 1997"
  tua?: boolean; // kertas kekuningan, noda, tinta pudar
  debu?: number; // 0..1 lapisan debu (ditiup hilang)
  sorot?: number; // 0..1 lingkaran merah di kolom KELUAR yang kosong
  hariIni?: number; // baris tanggal hari ini (default 9)
  lebar?: number; // px
};

const W = 600, H = 1240;
const BIRU = "#2D8FC4";
// x kolom: Tgl | Pagi M | Pagi K | Siang M | Siang K | Lembur M | Lembur K | Jam
const KOL = [30, 92, 164, 236, 308, 380, 452, 524, 570];
const BARIS0 = 520, TINGGI_BARIS = 44;

export const KartuAbsen: React.FC<Props> = ({ nama, bulan, tua = false, debu = 0, sorot = 0, hariIni = 9, lebar = 600 }) => {
  const kertas = tua ? "#E6D6A2" : "#F7F3E6";
  const tinta = tua ? "#5B4A8A" : "#3A3F9E";
  const garis = tua ? "#5E9EBF" : BIRU;
  const isian = (r: number) => {
    // Hari-hari sebelumnya terisi lengkap; hari ini lembur tanpa jam keluar.
    if (r > hariIni) return null;
    const terakhir = r === hariIni;
    return {
      pm: "07.00",
      pk: "12.00",
      sm: "13.00",
      sk: "17.00",
      lm: "17.30",
      lk: terakhir ? "" : r % 3 === 0 ? "23.10" : "21.45",
    };
  };
  const sx = KOL[6], sy = BARIS0 + (hariIni - 1) * TINGGI_BARIS;
  const keliling = 2 * Math.PI * 46;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={lebar} height={(lebar * H) / W} style={{ display: "block" }}>
      <defs>
        <filter id={`noda-${tua ? 1 : 0}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={tua ? 7 : 3} />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.22  0 0 0 0.35 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      {/* kertas */}
      <rect x={6} y={6} width={W - 12} height={H - 12} rx={18} fill={kertas} stroke="#141414" strokeWidth={6} />
      <path d={`M 6 60 Q 6 6 60 6 L ${W - 60} 6 Q ${W - 6} 6 ${W - 6} 60 L ${W - 6} 70 L 6 70 Z`} fill={garis} />
      {/* kotak isian atas */}
      <g fontFamily="Arial, sans-serif" fill={garis} fontSize={24} fontWeight={700}>
        <rect x={30} y={90} width={150} height={80} fill="none" stroke={garis} strokeWidth={3} />
        <text x={40} y={118}>No.</text>
        <rect x={180} y={90} width={390} height={80} fill="none" stroke={garis} strokeWidth={3} />
        <text x={190} y={118}>NAMA</text>
        <rect x={30} y={170} width={300} height={70} fill="none" stroke={garis} strokeWidth={3} />
        <text x={40} y={198}>DEPT.</text>
        <rect x={330} y={170} width={240} height={70} fill="none" stroke={garis} strokeWidth={3} />
        <text x={340} y={198}>BULAN</text>
        <text x={W / 2} y={320} textAnchor="middle" fontSize={50} fontWeight={800}>KARTU ABSENSI</text>
        <text x={W / 2} y={360} textAnchor="middle" fontSize={22} fontStyle="italic">BobEjoo</text>
      </g>
      {/* isian tulisan tangan */}
      <g fontFamily="'Segoe Print', 'Comic Sans MS', cursive" fill={tinta} fontSize={36} fontWeight={700}>
        <text x={80} y={158}>{tua ? "0417" : "0982"}</text>
        <text x={270} y={158}>{nama}</text>
        <text x={120} y={228}>JAHIT</text>
        <text x={430} y={228} fontSize={32}>{bulan}</text>
      </g>
      {/* kepala tabel */}
      <g fontFamily="Arial, sans-serif" fontSize={20} fontWeight={700} textAnchor="middle">
        <rect x={KOL[0]} y={400} width={KOL[8] - KOL[0]} height={120} fill="none" stroke={garis} strokeWidth={3} />
        {[["Pagi", 1], ["Siang", 3], ["Lembur", 5]].map(([lbl, i]) => (
          <text key={lbl as string} x={(KOL[i as number] + KOL[(i as number) + 2]) / 2} y={440} fill={garis}>{lbl}</text>
        ))}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i}>
            <rect x={KOL[i]} y={470} width={KOL[i + 1] - KOL[i]} height={50} fill={i % 2 ? garis : "none"} stroke={garis} strokeWidth={2} />
            <text x={(KOL[i] + KOL[i + 1]) / 2} y={503} fill={i % 2 ? "#ffffff" : garis} fontSize={17}>{i % 2 ? "Masuk" : "Keluar"}</text>
          </g>
        ))}
        <text x={(KOL[0] + KOL[1]) / 2} y={500} fill={garis} fontSize={18}>Tgl</text>
      </g>
      {/* baris tanggal */}
      {Array.from({ length: 15 }, (_, j) => {
        const r = j + 1, y = BARIS0 + j * TINGGI_BARIS, d = isian(r);
        return (
          <g key={r}>
            <rect x={KOL[0]} y={y} width={KOL[8] - KOL[0]} height={TINGGI_BARIS} fill={r === hariIni ? "rgba(255,230,120,0.25)" : "none"} stroke={garis} strokeWidth={2} />
            {KOL.slice(1, 8).map((x) => <line key={x} x1={x} y1={y} x2={x} y2={y + TINGGI_BARIS} stroke={garis} strokeWidth={2} />)}
            <text x={(KOL[0] + KOL[1]) / 2} y={y + 30} textAnchor="middle" fontFamily="Arial" fontWeight={700} fontSize={20} fill={garis}>{r}</text>
            {d && (
              <g fontFamily="Consolas, monospace" fontSize={19} fontWeight={700} fill={tinta} textAnchor="middle" opacity={tua ? 0.8 : 1}>
                {[d.pm, d.pk, d.sm, d.sk, d.lm, d.lk].map((v, i) => (
                  <text key={i} x={(KOL[i + 1] + KOL[i + 2]) / 2} y={y + 29} transform={`rotate(${((r * 7 + i * 3) % 5) - 2} ${(KOL[i + 1] + KOL[i + 2]) / 2} ${y + 22})`}>{v}</text>
                ))}
              </g>
            )}
          </g>
        );
      })}
      {/* lingkaran merah di kolom KELUAR lembur hari ini */}
      {sorot > 0 && (
        <ellipse cx={(sx + KOL[7]) / 2} cy={sy + TINGGI_BARIS / 2} rx={58} ry={34} fill="none" stroke="#E53935" strokeWidth={7} strokeLinecap="round" strokeDasharray={keliling * 1.1} strokeDashoffset={keliling * 1.1 * (1 - sorot)} transform={`rotate(-6 ${(sx + KOL[7]) / 2} ${sy + 22})`} />
      )}
      {/* noda + lipatan kertas tua */}
      {tua && (
        <g>
          <rect x={6} y={6} width={W - 12} height={H - 12} rx={18} filter={`url(#noda-1)`} fill="#000" opacity={0.9} />
          <ellipse cx={450} cy={900} rx={70} ry={50} fill="#B8954E" opacity={0.25} />
          <ellipse cx={130} cy={300} rx={40} ry={28} fill="#B8954E" opacity={0.2} />
          <line x1={6} y1={640} x2={W - 6} y2={630} stroke="#B9A673" strokeWidth={3} opacity={0.6} />
          <path d={`M ${W - 6} 1100 L ${W - 70} ${H - 6}`} stroke="#141414" strokeWidth={4} />
        </g>
      )}
      {/* lapisan debu abu-abu (ditiup hilang) */}
      {debu > 0.01 && (
        <g opacity={debu}>
          <rect x={6} y={6} width={W - 12} height={H - 12} rx={18} fill="#9C9686" opacity={0.75} />
          {Array.from({ length: 90 }, (_, i) => {
            const x = 20 + ((i * 137) % 560), y = 20 + ((i * 251) % 1190), r = 3 + ((i * 7) % 9);
            return <circle key={i} cx={x} cy={y} r={r} fill="#7E786A" opacity={0.6} />;
          })}
        </g>
      )}
    </svg>
  );
};
