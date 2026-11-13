/**
 * PUSTAKA KARAKTER EJOOVERSE (2D Stick-Head Rig for 3D Scenes)
 * Terinspirasi dari proporsi & gaya karakter referensi Sel Pink (Baker-Miller Pink).
 * Deterministik: seluruh gerak dihitung dari fungsi waktu `t` (detik).
 */

window.EjooverseCharacter = (function () {
  const EXPRESSIONS = {
    fokus: {
      label: 'Fokus / Serius',
      desc: 'Alis datar tegas, mata fokus, mulut garis lurus kecil (saat menakar/bekerja)',
      renderFace: (blink) => `
        <!-- Alis -->
        <path d="M -26 -14 L -8 -11" stroke="#141414" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M 8 -11 L 26 -14" stroke="#141414" stroke-width="4.5" stroke-linecap="round"/>
        <!-- Mata -->
        <ellipse cx="-16" cy="-3" rx="4.2" ry="${blink ? 0.6 : 4.5}" fill="#141414"/>
        <ellipse cx="16" cy="-3" rx="4.2" ry="${blink ? 0.6 : 4.5}" fill="#141414"/>
        <!-- Mulut -->
        <path d="M -9 16 L 9 15" stroke="#141414" stroke-width="3.8" stroke-linecap="round"/>
      `
    },
    pede: {
      kepala: { sx: 1.0, sy: 1.02, telur: 0, miring: -8 },
      label: 'Pede / Smug',
      desc: 'Satu alis terangkat, mata setengah sayu, senyum miring (saat pegang kartu/stopwatch)',
      renderFace: (blink) => `
        <!-- Alis -->
        <path d="M -27 -13 L -8 -10" stroke="#141414" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M 8 -15 Q 18 -21 27 -13" stroke="#141414" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <!-- Mata setengah sayu -->
        <ellipse cx="-15" cy="-3" rx="4" ry="${blink ? 0.6 : 3.5}" fill="#141414"/>
        <ellipse cx="16" cy="-3" rx="4" ry="${blink ? 0.6 : 3.5}" fill="#141414"/>
        <path d="M -22 -5 L -8 -5" stroke="#141414" stroke-width="3" stroke-linecap="round"/>
        <!-- Senyum miring -->
        <path d="M -8 15 Q 4 18 14 10" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
      `
    },
    ketawa: {
      kepala: { sx: 1.06, sy: 0.96, telur: 0 },
      label: 'Ketawa / Mengejek',
      desc: 'Mata memicing puas, mulut terbuka lebar bergigi (saat menertawakan ide aneh)',
      renderFace: () => `
        <!-- Alis naik -->
        <path d="M -26 -16 Q -17 -22 -8 -15" stroke="#141414" stroke-width="4.2" stroke-linecap="round" fill="none"/>
        <path d="M 8 -15 Q 17 -22 26 -16" stroke="#141414" stroke-width="4.2" stroke-linecap="round" fill="none"/>
        <!-- Mata menyipit ketawa -->
        <path d="M -23 -4 Q -15 -11 -8 -4" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M 8 -4 Q 15 -11 23 -4" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
        <!-- Mulut ketawa bergigi -->
        <path d="M -18 9 L 18 9 Q 16 26 0 26 Q -16 26 -18 9 Z" fill="#FFFFFF" stroke="#141414" stroke-width="3.8" stroke-linejoin="round"/>
        <line x1="-15" y1="16" x2="15" y2="16" stroke="#141414" stroke-width="2.5"/>
        <line x1="-6" y1="9" x2="-6" y2="24" stroke="#141414" stroke-width="2.5"/>
        <line x1="6" y1="9" x2="6" y2="24" stroke="#141414" stroke-width="2.5"/>
      `
    },
    kalem: {
      kepala: { sx: 1.0, sy: 1.0, telur: 0, miring: 8 },
      label: 'Kalem / Bahagia',
      desc: 'Mata melengkung damai (^ ^), senyum ramah (saat keluar sel pink / merajut)',
      renderFace: () => `
        <!-- Alis lembut -->
        <path d="M -25 -16 Q -16 -21 -8 -16" stroke="#141414" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M 8 -16 Q 16 -21 25 -16" stroke="#141414" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <!-- Mata lengkung bahagia -->
        <path d="M -22 -3 Q -15 -12 -8 -3" stroke="#141414" stroke-width="4.2" stroke-linecap="round" fill="none"/>
        <path d="M 8 -3 Q 15 -12 22 -3" stroke="#141414" stroke-width="4.2" stroke-linecap="round" fill="none"/>
        <!-- Senyum manis -->
        <path d="M -11 13 Q 0 23 11 13" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
      `
    },
    menjelaskan: {
      kepala: { sx: 1.0, sy: 1.0, telur: 0, miring: -2 },
      label: 'Menjelaskan / Presenter',
      desc: 'Alis ekspresif dan mulut bergerak saat menyampaikan informasi',
      renderFace: (blink, t = 0) => {
        const buka = 3 + Math.abs(Math.sin(t * 13.5)) * 8;
        return `
          <path d="M -27 -15 Q -17 -20 -8 -14" stroke="#141414" stroke-width="4.2" stroke-linecap="round" fill="none"/>
          <path d="M 8 -14 Q 18 -20 27 -15" stroke="#141414" stroke-width="4.2" stroke-linecap="round" fill="none"/>
          <ellipse cx="-15" cy="-3" rx="4.2" ry="${blink ? 0.6 : 4.5}" fill="#141414"/>
          <ellipse cx="15" cy="-3" rx="4.2" ry="${blink ? 0.6 : 4.5}" fill="#141414"/>
          <ellipse cx="0" cy="16" rx="6.5" ry="${buka.toFixed(1)}" fill="#5A1F2A" stroke="#141414" stroke-width="3"/>
        `;
      }
    },
    ngeden: {
      kepala: { sx: 1.08, sy: 0.9, telur: -0.05 },
      label: 'Ngeden / Panik Kerja Keras',
      desc: 'Satu mata titik satu memicing, gigi gemeretak, keringat (adu panco, adu kunci senjata)',
      renderFace: () => `
        <!-- Alis miring tegang -->
        <path d="M -27 -17 L -7 -10" stroke="#141414" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M 7 -10 L 27 -17" stroke="#141414" stroke-width="4.5" stroke-linecap="round"/>
        <!-- Mata: satu titik, satu memicing (v8: tanpa mata putih besar) -->
        <ellipse cx="-15" cy="-2" rx="4.4" ry="4.8" fill="#141414"/>
        <path d="M 9 -2 L 22 -4" stroke="#141414" stroke-width="4.2" stroke-linecap="round"/>
        <!-- Gigi gemeretak -->
        <rect x="-16" y="10" width="32" height="13" rx="5" fill="#FFFFFF" stroke="#141414" stroke-width="3.8"/>
        <line x1="-15" y1="16.5" x2="15" y2="16.5" stroke="#141414" stroke-width="2.5"/>
        <line x1="-6" y1="10" x2="-6" y2="23" stroke="#141414" stroke-width="2.5"/>
        <line x1="6" y1="10" x2="6" y2="23" stroke="#141414" stroke-width="2.5"/>
        <!-- Keringat -->
        <path d="M 32 -18 Q 36 -10 32 -7 Q 28 -10 32 -18 Z" fill="#4FC3F7" stroke="#141414" stroke-width="2"/>
      `
    },
    ngantuk: {
      kepala: { sx: 1.04, sy: 0.94, telur: -0.04, miring: 10 },
      label: 'Ngantuk / Bosan',
      desc: 'Kelopak mata turun setengah, mulut datar kecil (saat jaga malam / menunggu lama)',
      renderFace: () => `
        <!-- Alis datar rendah -->
        <path d="M -25 -10 L -9 -10" stroke="#141414" stroke-width="3.8" stroke-linecap="round"/>
        <path d="M 9 -10 L 25 -10" stroke="#141414" stroke-width="3.8" stroke-linecap="round"/>
        <!-- Mata sayu -->
        <path d="M -22 -2 L -9 -2" stroke="#141414" stroke-width="4" stroke-linecap="round"/>
        <path d="M 9 -2 L 22 -2" stroke="#141414" stroke-width="4" stroke-linecap="round"/>
        <!-- Mulut kecil -->
        <path d="M -6 16 Q 0 14 6 16" stroke="#141414" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      `
    },
    kaget: {
      kepala: { sx: 0.92, sy: 1.26, telur: 0.22 },
      label: 'Kaget / Melotot',
      desc: 'Mata bulat besar hanya 0,5 detik pertama, lalu mata titik dengan alis naik (melihat bangku jebol)',
      renderFace: () => `
        <!-- Alis naik tinggi -->
        <path d="M -26 -20 Q -15 -26 -7 -19" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M 7 -19 Q 15 -26 26 -20" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
        <!-- Mata melotot -->
        <circle cx="-14" cy="-3" r="8.5" fill="#FFFFFF" stroke="#141414" stroke-width="3.5"/>
        <circle cx="-13" cy="-3" r="2.5" fill="#141414"/>
        <circle cx="14" cy="-3" r="8.5" fill="#FFFFFF" stroke="#141414" stroke-width="3.5"/>
        <circle cx="13" cy="-3" r="2.5" fill="#141414"/>
        <!-- Mulut kaget -->
        <ellipse cx="0" cy="17" rx="8" ry="6" fill="#141414"/>
      `,
      // v8: mata putih besar hanya +-0,5 detik pertama (tEkspresi), lalu kembali ke mata titik.
      reda: (blink) => `
        <path d="M -26 -19 Q -15 -25 -7 -18" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M 7 -18 Q 15 -25 26 -19" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
        <ellipse cx="-14" cy="-3" rx="4.4" ry="${blink ? 0.6 : 5.4}" fill="#141414"/>
        <ellipse cx="14" cy="-3" rx="4.4" ry="${blink ? 0.6 : 5.4}" fill="#141414"/>
        <ellipse cx="0" cy="17" rx="5.5" ry="4.5" fill="#141414"/>
      `
    },
    marah: {
      kepala: { sx: 1.08, sy: 0.96, telur: -0.1 },
      label: 'Marah Besar / Mengamuk',
      desc: 'Bayangan dahi gelap, alis menukik tajam V, mata merah/melotot, gigi menggertak',
      renderFace: () => `
        <!-- Bayangan dahi marah -->
        <path d="M -42 -15 A 45 45 0 0 1 42 -15 Z" fill="rgba(20,20,20,0.22)"/>
        <!-- Alis V tajam -->
        <path d="M -28 -18 L -6 -7" stroke="#141414" stroke-width="5.5" stroke-linecap="round"/>
        <path d="M 28 -18 L 6 -7" stroke="#141414" stroke-width="5.5" stroke-linecap="round"/>
        <!-- Mata marah merah -->
        <ellipse cx="-15" cy="-2" rx="7" ry="5" fill="#FFebee" stroke="#141414" stroke-width="3.5"/>
        <circle cx="-14" cy="-2" r="2.8" fill="#D50000"/>
        <ellipse cx="15" cy="-2" rx="7" ry="5" fill="#FFebee" stroke="#141414" stroke-width="3.5"/>
        <circle cx="14" cy="-2" r="2.8" fill="#D50000"/>
        <!-- Gigi menyeringai besar -->
        <rect x="-18" y="9" width="36" height="16" rx="6" fill="#FFFFFF" stroke="#141414" stroke-width="4"/>
        <line x1="-17" y1="17" x2="17" y2="17" stroke="#141414" stroke-width="2.8"/>
        <line x1="-9" y1="9" x2="-9" y2="25" stroke="#141414" stroke-width="2.5"/>
        <line x1="0" y1="9" x2="0" y2="25" stroke="#141414" stroke-width="2.5"/>
        <line x1="9" y1="9" x2="9" y2="25" stroke="#141414" stroke-width="2.5"/>
      `
    },
    seram: {
      label: 'Seram / Hantu',
      desc: 'Mata cekung gelap tanpa pupil, alis turun, mulut tipis melengkung ke bawah (hantu menatap)',
      renderFace: (blink) => `
        <!-- Lingkar mata gelap -->
        <ellipse cx="-15" cy="-2" rx="9" ry="${blink ? 2 : 8}" fill="#2B3A44" opacity="0.35"/>
        <ellipse cx="15" cy="-2" rx="9" ry="${blink ? 2 : 8}" fill="#2B3A44" opacity="0.35"/>
        <!-- Mata hitam kosong -->
        <ellipse cx="-15" cy="-2" rx="5" ry="${blink ? 0.6 : 6}" fill="#0E0E10"/>
        <ellipse cx="15" cy="-2" rx="5" ry="${blink ? 0.6 : 6}" fill="#0E0E10"/>
        <!-- Alis turun sedih -->
        <path d="M -25 -13 L -8 -17" stroke="#141414" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M 8 -17 L 25 -13" stroke="#141414" stroke-width="3.5" stroke-linecap="round"/>
        <!-- Mulut tipis turun -->
        <path d="M -8 19 Q 0 14 8 19" stroke="#141414" stroke-width="3" stroke-linecap="round" fill="none"/>
      `
    },
    takut: {
      kepala: { sx: 0.94, sy: 1.16, telur: 0.16, miring: -5 },
      label: 'Ketakutan',
      desc: 'Alis naik miring ke tengah, mata melotot dengan pupil kecil melirik, mulut gemetar bergelombang, garis pucat di dahi dan keringat (saat melihat hantu)',
      renderFace: (blink) => `
        <!-- Garis pucat di dahi -->
        <path d="M -14 -38 L -14 -27 M -6 -40 L -6 -27 M 2 -40 L 2 -27 M 10 -39 L 10 -27" stroke="#7FA7C9" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Alis naik, ujung dalam lebih tinggi (cemas) -->
        <path d="M -27 -14 Q -18 -18 -8 -23" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M 8 -23 Q 18 -18 27 -14" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
        <!-- Mata melotot, pupil kecil melirik ke samping -->
        <circle cx="-15" cy="-2" r="${blink ? 2 : 9}" fill="#FFFFFF" stroke="#141414" stroke-width="3.5"/>
        <circle cx="15" cy="-2" r="${blink ? 2 : 9}" fill="#FFFFFF" stroke="#141414" stroke-width="3.5"/>
        <circle cx="-19" cy="-2" r="${blink ? 0 : 2.4}" fill="#141414"/>
        <circle cx="11" cy="-2" r="${blink ? 0 : 2.4}" fill="#141414"/>
        <!-- Mulut terbuka gemetar -->
        <path d="M -11 17 Q -7 13 -3.5 16 Q 0 13 3.5 16 Q 7 13 11 17 Q 9 29 0 29 Q -9 29 -11 17 Z" fill="#5A1F2A" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>
        <path d="M -7 18 L 7 18" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Keringat -->
        <path d="M 33 -20 Q 37 -12 33 -8 Q 29 -12 33 -20 Z" fill="#4FC3F7" stroke="#141414" stroke-width="2"/>
        <path d="M -35 -12 Q -32 -6 -35 -3 Q -38 -6 -35 -12 Z" fill="#4FC3F7" stroke="#141414" stroke-width="2"/>
      `,
      reda: (blink) => `
        <path d="M -14 -38 L -14 -27 M -6 -40 L -6 -27 M 2 -40 L 2 -27 M 10 -39 L 10 -27" stroke="#7FA7C9" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M -27 -14 Q -18 -18 -8 -23" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M 8 -23 Q 18 -18 27 -14" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
        <ellipse cx="-18" cy="-2" rx="3.8" ry="${blink ? 0.6 : 4.6}" fill="#141414"/>
        <ellipse cx="12" cy="-2" rx="3.8" ry="${blink ? 0.6 : 4.6}" fill="#141414"/>
        <path d="M -11 17 Q -7 13 -3.5 16 Q 0 13 3.5 16 Q 7 13 11 17 Q 9 29 0 29 Q -9 29 -11 17 Z" fill="#5A1F2A" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>
        <path d="M 33 -20 Q 37 -12 33 -8 Q 29 -12 33 -20 Z" fill="#4FC3F7" stroke="#141414" stroke-width="2"/>
      `
    },
    // ===== Ekspresi gaya referensi (v3): mata lebih besar, alis tebal, mulut lebar =====
    teriak: {
      kepala: { sx: 1.04, sy: 1.12, telur: -0.08 },
      label: 'Teriak / Membentak',
      desc: 'Alis V tebal, mata titik, mulut terbuka lebar dengan lidah (membentak, teriak menyerang)',
      renderFace: (blink) => `
        <path d="M -30 -23 L -7 -11" stroke="#141414" stroke-width="6" stroke-linecap="round"/>
        <path d="M 30 -23 L 7 -11" stroke="#141414" stroke-width="6" stroke-linecap="round"/>
        <ellipse cx="-14" cy="-2" rx="4.6" ry="${blink ? 0.7 : 5}" fill="#141414"/>
        <ellipse cx="14" cy="-2" rx="4.6" ry="${blink ? 0.7 : 5}" fill="#141414"/>
        <path d="M -15 10 Q 0 5 15 10 Q 17 33 0 35 Q -17 33 -15 10 Z" fill="#5A1F2A" stroke="#141414" stroke-width="3.8" stroke-linejoin="round"/>
        <path d="M -9 29 Q 0 21 9 29 Q 0 35 -9 29 Z" fill="#E57373"/>
        <path d="M -11 11 L 11 11" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
      `
    },
    merem: {
      kepala: { sx: 1.1, sy: 0.88, telur: -0.06 },
      label: 'Merem Ngeden / Kesal (Wajah Merah)',
      desc: 'Mata terpejam > <, gigi menggertak, wajah memerah (mendorong batu, menahan marah)',
      tint: '#F8B9B4',
      renderFace: () => `
        <path d="M -28 -19 L -9 -13" stroke="#141414" stroke-width="5" stroke-linecap="round"/>
        <path d="M 28 -19 L 9 -13" stroke="#141414" stroke-width="5" stroke-linecap="round"/>
        <path d="M -25 -9 L -11 -3 L -25 3" stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M 25 -9 L 11 -3 L 25 3" stroke="#141414" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <rect x="-16" y="11" width="32" height="13" rx="5" fill="#FFFFFF" stroke="#141414" stroke-width="3.8"/>
        <line x1="-15" y1="17.5" x2="15" y2="17.5" stroke="#141414" stroke-width="2.4"/>
        <line x1="-8" y1="11" x2="-8" y2="24" stroke="#141414" stroke-width="2.2"/>
        <line x1="0" y1="11" x2="0" y2="24" stroke="#141414" stroke-width="2.2"/>
        <line x1="8" y1="11" x2="8" y2="24" stroke="#141414" stroke-width="2.2"/>
      `
    },
    syok: {
      kepala: { sx: 0.93, sy: 1.22, telur: 0.2 },
      label: 'Syok / Gugup',
      desc: 'Mata lingkaran ganda (bingung-kaget), mulut bergelombang, keringat (sadar ada yang salah)',
      renderFace: (blink) => `
        <path d="M -25 -20 Q -16 -25 -8 -20" stroke="#141414" stroke-width="3.8" stroke-linecap="round" fill="none"/>
        <path d="M 8 -20 Q 16 -25 25 -20" stroke="#141414" stroke-width="3.8" stroke-linecap="round" fill="none"/>
        <circle cx="-15" cy="-3" r="${blink ? 2 : 10}" fill="#FFFFFF" stroke="#141414" stroke-width="3.5"/>
        <circle cx="15" cy="-3" r="${blink ? 2 : 10}" fill="#FFFFFF" stroke="#141414" stroke-width="3.5"/>
        <circle cx="-15" cy="-3" r="${blink ? 0 : 5}" fill="none" stroke="#141414" stroke-width="2.4"/>
        <circle cx="15" cy="-3" r="${blink ? 0 : 5}" fill="none" stroke="#141414" stroke-width="2.4"/>
        <circle cx="-15" cy="-3" r="${blink ? 0 : 1.8}" fill="#141414"/>
        <circle cx="15" cy="-3" r="${blink ? 0 : 1.8}" fill="#141414"/>
        <path d="M -13 19 Q -9.5 14 -6.5 19 Q -3 24 0 19 Q 3 14 6.5 19 Q 9.5 24 13 19" stroke="#141414" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M 34 -24 Q 39 -15 34 -11 Q 29 -15 34 -24 Z" fill="#4FC3F7" stroke="#141414" stroke-width="2"/>
      `,
      reda: (blink) => `
        <path d="M -25 -17 Q -16 -23 -8 -20" stroke="#141414" stroke-width="3.8" stroke-linecap="round" fill="none"/>
        <path d="M 8 -20 Q 16 -23 25 -17" stroke="#141414" stroke-width="3.8" stroke-linecap="round" fill="none"/>
        <ellipse cx="-15" cy="-3" rx="3.6" ry="${blink ? 0.6 : 4.2}" fill="#141414"/>
        <ellipse cx="15" cy="-3" rx="3.6" ry="${blink ? 0.6 : 4.2}" fill="#141414"/>
        <path d="M -13 19 Q -9.5 14 -6.5 19 Q -3 24 0 19 Q 3 14 6.5 19 Q 9.5 24 13 19" stroke="#141414" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M 34 -24 Q 39 -15 34 -11 Q 29 -15 34 -24 Z" fill="#4FC3F7" stroke="#141414" stroke-width="2"/>
      `
    },
    datar: {
      kepala: { sx: 1.02, sy: 0.98, telur: 0, miring: 7 },
      label: 'Datar / Malas Ditanya',
      desc: 'Kelopak setengah turun, pupil di bawah, mulut garis kecil miring (deadpan, tidak terkesan)',
      renderFace: (blink) => `
        <path d="M -25 -13 L -8 -13" stroke="#141414" stroke-width="4" stroke-linecap="round"/>
        <path d="M 8 -13 L 25 -13" stroke="#141414" stroke-width="4" stroke-linecap="round"/>
        <path d="M -24 -4 L -7 -4" stroke="#141414" stroke-width="4" stroke-linecap="round"/>
        <path d="M 7 -4 L 24 -4" stroke="#141414" stroke-width="4" stroke-linecap="round"/>
        <path d="M -21 -4 Q -15.5 ${blink ? -3 : 5} -10 -4 Z" fill="#141414"/>
        <path d="M 10 -4 Q 15.5 ${blink ? -3 : 5} 21 -4 Z" fill="#141414"/>
        <path d="M -6 18 L 9 16" stroke="#141414" stroke-width="3.6" stroke-linecap="round"/>
      `
    },
    curiga: {
      kepala: { sx: 1.0, sy: 1.04, telur: 0.04, miring: -11 },
      label: 'Curiga / Mikir',
      desc: 'Satu alis naik tinggi, satu turun, mata melirik ke samping, mulut miring (menimbang ide)',
      renderFace: (blink) => `
        <path d="M -26 -11 L -8 -9" stroke="#141414" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M 8 -19 Q 18 -27 28 -18" stroke="#141414" stroke-width="4.5" stroke-linecap="round" fill="none"/>
        <ellipse cx="-12" cy="-1" rx="4" ry="${blink ? 0.6 : 3.4}" fill="#141414"/>
        <path d="M -21 -4 L -6 -4" stroke="#141414" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="19" cy="-3" rx="4.2" ry="${blink ? 0.6 : 4.8}" fill="#141414"/>
        <path d="M -4 18 Q 6 19 13 14" stroke="#141414" stroke-width="3.6" stroke-linecap="round" fill="none"/>
      `
    },
    girang: {
      kepala: { sx: 1.05, sy: 1.04, telur: 0.04 },
      label: 'Girang / Berhasil',
      desc: 'Mata ^ ^ tebal, mulut D terbuka lebar dengan lidah, pipi merona (berhasil, merayakan)',
      renderFace: () => `
        <path d="M -26 -21 Q -17 -27 -8 -21" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M 8 -21 Q 17 -27 26 -21" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M -24 -2 Q -16 -14 -8 -2" stroke="#141414" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M 8 -2 Q 16 -14 24 -2" stroke="#141414" stroke-width="5" stroke-linecap="round" fill="none"/>
        <ellipse cx="-27" cy="9" rx="6" ry="3.5" fill="#F48FB1" opacity="0.7"/>
        <ellipse cx="27" cy="9" rx="6" ry="3.5" fill="#F48FB1" opacity="0.7"/>
        <path d="M -17 8 L 17 8 Q 16 31 0 32 Q -16 31 -17 8 Z" fill="#5A1F2A" stroke="#141414" stroke-width="3.8" stroke-linejoin="round"/>
        <path d="M -9 26 Q 0 19 9 26 Q 0 32 -9 26 Z" fill="#E57373"/>
        <path d="M -13 9 L 13 9" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
      `
    },
    bingung: {
      kepala: { sx: 0.95, sy: 1.14, telur: 0.14, miring: 13 },
      label: 'Bingung / Ragu',
      desc: 'Mata satu besar satu kecil, alis tidak rata, mulut "o" kecil di samping (tidak paham apa yang terjadi)',
      renderFace: (blink) => `
        <path d="M -26 -14 L -9 -16" stroke="#141414" stroke-width="4" stroke-linecap="round"/>
        <path d="M 8 -22 Q 17 -26 26 -20" stroke="#141414" stroke-width="4" stroke-linecap="round" fill="none"/>
        <ellipse cx="-15" cy="-3" rx="3.2" ry="${blink ? 0.6 : 3.6}" fill="#141414"/>
        <ellipse cx="15" cy="-4" rx="4.8" ry="${blink ? 0.6 : 5.6}" fill="#141414"/>
        <ellipse cx="7" cy="18" rx="4.5" ry="4" fill="#141414"/>
      `
    },
    // ===== v8: ekspresi dasar bermata titik (gaya referensi: cool / waspada) =====
    santai: {
      kepala: { sx: 1.02, sy: 0.98, telur: 0, miring: 6 },
      label: 'v8 Santai / Cool',
      desc: 'Mata titik setengah sayu, alis rileks, senyum tipis (wajah standar sehari-hari)',
      renderFace: (blink) => `
        <path d="M -25 -14 Q -16 -17 -8 -14" stroke="#141414" stroke-width="3.8" stroke-linecap="round" fill="none"/>
        <path d="M 8 -14 Q 16 -17 25 -14" stroke="#141414" stroke-width="3.8" stroke-linecap="round" fill="none"/>
        <ellipse cx="-15" cy="-2" rx="4.2" ry="${blink ? 0.6 : 3.4}" fill="#141414"/>
        <ellipse cx="15" cy="-2" rx="4.2" ry="${blink ? 0.6 : 3.4}" fill="#141414"/>
        <path d="M -22 -4.5 L -8 -4.5 M 8 -4.5 L 22 -4.5" stroke="#141414" stroke-width="3" stroke-linecap="round"/>
        <path d="M -7 15 Q 2 19 11 14" stroke="#141414" stroke-width="3.8" stroke-linecap="round" fill="none"/>
      `
    },
    waspada: {
      kepala: { sx: 1.04, sy: 0.96, telur: -0.03 },
      label: 'v8 Waspada / Siap Bertarung',
      desc: 'Alis menukik, mata titik menyipit, mulut garis tegas (kuda-kuda, menghadapi lawan)',
      renderFace: (blink) => `
        <path d="M -27 -17 L -8 -10" stroke="#141414" stroke-width="5" stroke-linecap="round"/>
        <path d="M 27 -17 L 8 -10" stroke="#141414" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="-15" cy="-1" rx="4.4" ry="${blink ? 0.6 : 3.6}" fill="#141414"/>
        <ellipse cx="15" cy="-1" rx="4.4" ry="${blink ? 0.6 : 3.6}" fill="#141414"/>
        <path d="M -22 -5 L -8 -3.5 M 8 -3.5 L 22 -5" stroke="#141414" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M -9 16 L 9 15" stroke="#141414" stroke-width="4" stroke-linecap="round"/>
      `
    },
    pingsan: {
      kepala: { sx: 1.0, sy: 1.08, telur: 0.06 },
      label: 'Pingsan / Pusing',
      desc: 'Mata X, mulut terbuka miring dengan lidah keluar (pingsan, kepala terbentur)',
      renderFace: () => `
        <path d="M -21 -9 L -9 3 M -9 -9 L -21 3" stroke="#141414" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M 9 -9 L 21 3 M 21 -9 L 9 3" stroke="#141414" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M -12 15 Q 0 11 12 17 Q 8 27 -2 26 Q -11 24 -12 15 Z" fill="#5A1F2A" stroke="#141414" stroke-width="3.4" stroke-linejoin="round"/>
        <path d="M 2 22 Q 8 21 9 30 Q 5 34 1 30 Z" fill="#E57373" stroke="#141414" stroke-width="2"/>
      `
    }
  };

  // Badan berbentuk (bukan kapsul): bahu membulat, menyempit ke pinggang.
  // sw = lebar bahu, ww = lebar pinggang, h = tinggi badan, r = lengkung bahu.
  function torsoPath(sw, ww, h, r = 12, br = 6) {
    return `M ${-sw/2 + r} 0 L ${sw/2 - r} 0 Q ${sw/2} 0 ${sw/2} ${r}
      L ${ww/2} ${h - br} Q ${ww/2} ${h} ${ww/2 - br} ${h}
      L ${-ww/2 + br} ${h} Q ${-ww/2} ${h} ${-ww/2} ${h - br}
      L ${-sw/2} ${r} Q ${-sw/2} 0 ${-sw/2 + r} 0 Z`;
  }

  // Lengan baju pendek di kedua bahu. Digambar di atas pangkal tangan,
  // jadi tangan terlihat keluar dari ujung lengan baju.
  function sleeveCaps(w, fill, extra = '') {
    return `
      <path d="M ${-w/2 + 2} 1 Q ${-w/2 - 7} 2 ${-w/2 - 11} 9 L ${-w/2 - 9} 23 Q ${-w/2 - 3} 25 ${-w/2 + 2} 22 Z" fill="${fill}" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      <path d="M ${w/2 - 2} 1 Q ${w/2 + 7} 2 ${w/2 + 11} 9 L ${w/2 + 9} 23 Q ${w/2 + 3} 25 ${w/2 - 2} 22 Z" fill="${fill}" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      ${extra}
    `;
  }

  // v9: badan kimono/happi Jepang: kain sampai paha/lutut, kerah silang, ikat pinggang (obi).
  function kimonoBadan(w, h, o, c) {
    const ww = o.waistWidth, p = c.panjang || 16;
    const motif = c.motif ? [[-14, 18], [12, 14], [-6, 40], [16, 46], [-18, 58], [6, 64]].map(([x, y]) => `<path d="M ${x - 3} ${y} L ${x + 3} ${y} M ${x} ${y - 3} L ${x} ${y + 3}" stroke="${c.motif}" stroke-width="2" stroke-linecap="round"/>`).join('') : '';
    return `
        <path d="M ${-w/2 + 6} 0 L ${w/2 - 6} 0 Q ${w/2} 0 ${w/2} 6 L ${ww/2 + 6} ${h + p} Q 0 ${h + p + 5} ${-ww/2 - 6} ${h + p} L ${-w/2} 6 Q ${-w/2} 0 ${-w/2 + 6} 0 Z" fill="${c.kain}" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        ${motif}
        <path d="M 4 ${h - 6} L ${ww/2 + 4} ${h + p - 1}" stroke="#141414" stroke-width="2.6" opacity="0.55"/>
        <path d="M -13 0 L 8 ${h - 16}" stroke="${c.kerah}" stroke-width="5" fill="none"/>
        <path d="M 13 0 L -1 20" stroke="${c.kerah}" stroke-width="5" fill="none"/>
        ${c.tambalan ? `<rect x="14" y="36" width="9" height="8" rx="1.5" fill="${c.tambalan}" stroke="#141414" stroke-width="1.8" transform="rotate(8 18 40)"/>` : ''}
        <rect x="${-ww/2 - 2}" y="${h - (c.tulisan ? 18 : 16)}" width="${ww + 4}" height="${c.tulisan ? 13 : 11}" rx="2" fill="${c.obi}" stroke="#141414" stroke-width="3"/>
        ${c.tulisan ? `<text x="0" y="${h - 8.2}" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="8.5" letter-spacing="0.3" text-anchor="middle" fill="${c.tulisan}">Ruang Pikir</text>` : ''}
    `;
  }
  // v9: warga Jepang (penonton/pasar) dengan tiga gaya rambut.
  function wargaJepang(label, kain, obi, rambut) {
    const kepala = {
      kuncir: `<path d="M -44 -10 C -44 -44, 42 -48, 44 -10 C 30 -26, -30 -28, -44 -10 Z" fill="#1E1A18" stroke="#141414" stroke-width="4" stroke-linejoin="round"/><path d="M -6 -44 Q 0 -62 10 -56 Q 6 -50 4 -44 Z" fill="#1E1A18" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>`,
      sanggul: `<ellipse cx="0" cy="-50" rx="20" ry="13" fill="#1E1A18" stroke="#141414" stroke-width="3.6"/><path d="M -44 -6 C -46 -44, 44 -48, 44 -6 C 32 -24, -32 -24, -44 -6 Z" fill="#1E1A18" stroke="#141414" stroke-width="4" stroke-linejoin="round"/><path d="M 14 -56 L 30 -64" stroke="#C9A227" stroke-width="3" stroke-linecap="round"/>`,
      tua: `<path d="M -44 -6 Q -46 -22 -36 -30 L -32 -10 Z" fill="#C8C8C8" stroke="#141414" stroke-width="3"/><path d="M 44 -6 Q 46 -22 36 -30 L 32 -10 Z" fill="#C8C8C8" stroke="#141414" stroke-width="3"/>`
    }[rambut];
    return {
      label, bodyWidth: 56, waistWidth: 50, bodyHeight: 66, legLength: 90, neck: 9, knee: [-4, 4], shoe: '#B8925A', armOffset: { x: 5, y: 1 },
      atributBawaan: rambut === 'tua' ? ['jenggot'] : [],
      renderHeadGear: () => kepala,
      renderBody: (w, h, o) => kimonoBadan(w, h, o, { kain, kerah: '#E8E2D4', obi, panjang: rambut === 'sanggul' ? 34 : 22 }),
      renderOverArms: (w) => sleeveCaps(w, kain)
    };
  }

  // Setiap peran punya proporsi sendiri: lebar bahu, pinggang, tinggi badan,
  // panjang kaki, panjang leher, dan tekukan lutut kiri/kanan yang berbeda.
  const OUTFITS = {
    ilmuwan: {
      label: 'Ilmuwan / Ahli',
      bodyWidth: 60,      // lebar bahu (dipakai pose tangan)
      waistWidth: 50,
      bodyHeight: 66,
      legLength: 104,      // kaki panjang, badan ramping
      neck: 10,
      knee: [-7, 9],
      shoe: '#3E2C23',
      armOffset: { x: 6, y: 1 }, // tangan keluar dari lengan jas lab
      renderOverArms: (w) => sleeveCaps(w, '#FFFFFF'),
      renderHeadGear: () => `
        <!-- Rambut Coklat Belah Samping -->
        <path d="M -43 -12 C -42 -48, 38 -52, 44 -14 C 30 -28, -10 -30, -43 -12 Z" fill="#6D4428" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
        <path d="M -6 -40 Q 6 -30 20 -34" stroke="#4A2E1A" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      `,
      renderBody: (w, h, o) => `
        <!-- Kemeja biru muda di dalam -->
        <path d="${torsoPath(w, o.waistWidth, h)}" fill="#DCEBF7" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <!-- Dasi bergaris -->
        <polygon points="-5,3 5,3 8,46 0,56 -8,46" fill="#D97724" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>
        <line x1="-6" y1="16" x2="6" y2="20" stroke="#FFF" stroke-width="2.5"/>
        <line x1="-7" y1="28" x2="7" y2="32" stroke="#FFF" stroke-width="2.5"/>
        <line x1="-7" y1="40" x2="7" y2="44" stroke="#FFF" stroke-width="2.5"/>
        <!-- Jas lab putih terbuka (dua sisi) -->
        <path d="M ${-w/2 + 12} 0 Q ${-w/2} 0 ${-w/2} 12 L ${-o.waistWidth/2 - 3} ${h + 8} L -12 ${h + 8} L -10 22 L -14 0 Z" fill="#FFFFFF" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
        <path d="M ${w/2 - 12} 0 Q ${w/2} 0 ${w/2} 12 L ${o.waistWidth/2 + 3} ${h + 8} L 12 ${h + 8} L 10 22 L 14 0 Z" fill="#FFFFFF" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
        <!-- Kantong + pulpen -->
        <rect x="${w/2 - 22}" y="26" width="13" height="12" rx="2" fill="#FFFFFF" stroke="#141414" stroke-width="2.5"/>
        <line x1="${w/2 - 18}" y1="20" x2="${w/2 - 18}" y2="30" stroke="#1E63B5" stroke-width="3" stroke-linecap="round"/>
        <line x1="${w/2 - 13}" y1="21" x2="${w/2 - 13}" y2="30" stroke="#C62828" stroke-width="3" stroke-linecap="round"/>
        <!-- Kartu ID -->
        <rect x="${-w/2 + 9}" y="30" width="11" height="14" rx="2" fill="#FFF59D" stroke="#141414" stroke-width="2.2"/>
        <line x1="${-w/2 + 12}" y1="35" x2="${-w/2 + 17}" y2="35" stroke="#141414" stroke-width="1.6"/>
      `
    },
    sipir: {
      label: 'Sipir / Petugas',
      bodyWidth: 66,
      waistWidth: 54,
      bodyHeight: 70,
      legLength: 94,
      neck: 8,
      knee: [6, -7],
      shoe: '#141414',
      armOffset: { x: 6, y: 1 }, // tangan keluar dari lengan seragam
      renderOverArms: (w) => sleeveCaps(w, '#233044', `
        <rect x="${-w/2 - 8}" y="5" width="9" height="5" rx="1.5" fill="#FFD54F" stroke="#141414" stroke-width="1.8"/>
        <rect x="${w/2 - 1}" y="5" width="9" height="5" rx="1.5" fill="#FFD54F" stroke="#141414" stroke-width="1.8"/>
      `),
      renderHeadGear: () => `
        <!-- Topi Petugas Biru Tua -->
        <path d="M -46 -18 C -46 -52, 46 -52, 46 -18 Z" fill="#28354A" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
        <path d="M -50 -18 Q 0 -10 52 -18 Q 35 -6 -48 -14 Z" fill="#18202C" stroke="#141414" stroke-width="3.8"/>
        <circle cx="0" cy="-32" r="5" fill="#FFD54F" stroke="#141414" stroke-width="2"/>
      `,
      renderBody: (w, h, o) => `
        <!-- Seragam biru tua -->
        <path d="${torsoPath(w, o.waistWidth, h, 14)}" fill="#233044" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <!-- Kerah -->
        <path d="M -14 0 L 0 14 L 14 0" fill="#2E3E57" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>
        <!-- Pangkat di bahu -->
        <rect x="${-w/2 + 2}" y="2" width="16" height="7" rx="2" fill="#FFD54F" stroke="#141414" stroke-width="2"/>
        <rect x="${w/2 - 18}" y="2" width="16" height="7" rx="2" fill="#FFD54F" stroke="#141414" stroke-width="2"/>
        <!-- Kancing -->
        <line x1="0" y1="14" x2="0" y2="${h - 18}" stroke="#141414" stroke-width="3"/>
        <circle cx="0" cy="22" r="2.4" fill="#FFD54F"/><circle cx="0" cy="34" r="2.4" fill="#FFD54F"/><circle cx="0" cy="46" r="2.4" fill="#FFD54F"/>
        <!-- Kantong dada + lencana -->
        <rect x="${w/2 - 26}" y="20" width="15" height="12" rx="2" fill="#2E3E57" stroke="#141414" stroke-width="2.4"/>
        <path d="M -20 22 L -16 30 L -24 25 L -16 25 L -24 30 Z" fill="#FFD54F" stroke="#141414" stroke-width="1.6" stroke-linejoin="round"/>
        <!-- Sabuk + gesper + radio -->
        <rect x="${-o.waistWidth/2 + 1}" y="${h - 16}" width="${o.waistWidth - 2}" height="9" fill="#141414"/>
        <rect x="-6" y="${h - 17}" width="12" height="11" fill="#FFD54F" stroke="#141414" stroke-width="2"/>
        <rect x="${o.waistWidth/2 - 14}" y="${h - 26}" width="9" height="16" rx="2" fill="#37474F" stroke="#141414" stroke-width="2"/>
        <line x1="${o.waistWidth/2 - 8}" y1="${h - 26}" x2="${o.waistWidth/2 - 8}" y2="${h - 34}" stroke="#141414" stroke-width="2.4" stroke-linecap="round"/>
      `
    },
    raksasa: {
      label: 'Napi Raksasa / Kekar',
      bodyWidth: 108,     // bahu sangat lebar
      waistWidth: 80,
      bodyHeight: 90,
      legLength: 50,      // kaki pendek, badan besar
      neck: 3,
      knee: [-10, 10],
      shoe: '#5D4037',
      renderHeadGear: () => `
        <!-- Kepala plontos + bayangan rambut tipis + bekas luka -->
        <path d="M -36 -24 A 44 44 0 0 1 36 -24" stroke="rgba(60,60,60,0.35)" stroke-width="7" fill="none"/>
        <path d="M 18 -34 L 26 -24 M 20 -27 L 25 -31 M 22 -24 L 27 -28" stroke="#8E5A4F" stroke-width="2" stroke-linecap="round"/>
        <circle cx="-14" cy="22" r="1.2" fill="#666"/><circle cx="-6" cy="25" r="1.2" fill="#666"/><circle cx="6" cy="25" r="1.2" fill="#666"/><circle cx="14" cy="22" r="1.2" fill="#666"/>
      `,
      renderBody: (w, h, o) => `
        <!-- Badan besar berbentuk V, singlet bergaris -->
        <path d="${torsoPath(w, o.waistWidth, h, 26, 10)}" fill="#EAECEF" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <line x1="-24" y1="10" x2="-20" y2="${h - 22}" stroke="#CFD4DA" stroke-width="3"/>
        <line x1="-8" y1="8" x2="-7" y2="${h - 22}" stroke="#CFD4DA" stroke-width="3"/>
        <line x1="8" y1="8" x2="7" y2="${h - 22}" stroke="#CFD4DA" stroke-width="3"/>
        <line x1="24" y1="10" x2="20" y2="${h - 22}" stroke="#CFD4DA" stroke-width="3"/>
        <!-- Kerah singlet -->
        <path d="M -20 0 Q 0 18 20 0" fill="none" stroke="#141414" stroke-width="3.5"/>
        <!-- Tato jangkar di dada kanan, tato bintang di bahu kiri -->
        <path d="M 30 18 L 30 32 M 25 22 L 35 22 M 23 28 Q 30 36 37 28" stroke="#28354A" stroke-width="2.6" fill="none" stroke-linecap="round"/>
        <path d="M -38 14 L -35 21 L -42 17 L -34 17 L -41 21 Z" fill="none" stroke="#28354A" stroke-width="2"/>
        <!-- Celana pendek biru -->
        <path d="M ${-o.waistWidth/2 + 1} ${h - 22} L ${o.waistWidth/2 - 1} ${h - 22} L ${o.waistWidth/2 + 2} ${h + 4} L 4 ${h + 4} L 0 ${h - 6} L -4 ${h + 4} L ${-o.waistWidth/2 - 2} ${h + 4} Z" fill="#4A699E" stroke="#141414" stroke-width="3.5" stroke-linejoin="round"/>
      `
    },
    warga: {
      label: 'Warga / Napi Keriting',
      bodyWidth: 54,
      waistWidth: 48,
      bodyHeight: 64,
      legLength: 98,
      neck: 9,
      knee: [9, -5],
      shoe: '#141414',
      renderHeadGear: () => `
        <!-- Rambut Keriting Coklat -->
        <g fill="#9C522B" stroke="#141414" stroke-width="3.8">
          <circle cx="-26" cy="-30" r="16"/>
          <circle cx="0" cy="-38" r="18"/>
          <circle cx="26" cy="-30" r="16"/>
          <circle cx="-12" cy="-26" r="15"/>
          <circle cx="14" cy="-26" r="15"/>
        </g>
      `,
      renderBody: (w, h, o) => `
        <!-- Baju tahanan biru muda -->
        <path d="${torsoPath(w, o.waistWidth, h, 12)}" fill="#6889B8" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <!-- Kerah V + kancing -->
        <path d="M -12 0 L 0 14 L 12 0" fill="#5B79A6" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>
        <line x1="0" y1="14" x2="0" y2="${h - 4}" stroke="#141414" stroke-width="3"/>
        <!-- Lengan baju digulung -->
        <rect x="${-w/2 - 2}" y="10" width="10" height="6" rx="2" fill="#5B79A6" stroke="#141414" stroke-width="2"/>
        <rect x="${w/2 - 8}" y="10" width="10" height="6" rx="2" fill="#5B79A6" stroke="#141414" stroke-width="2"/>
        <!-- Nomor tahanan di dada -->
        <rect x="5" y="22" width="18" height="10" rx="2" fill="#FFF" stroke="#141414" stroke-width="2"/>
        <text x="14" y="30" font-family="sans-serif" font-weight="900" font-size="7" text-anchor="middle" fill="#141414">0412</text>
        <!-- Celana panjang abu-abu di pinggang -->
        <rect x="${-o.waistWidth/2 + 1}" y="${h - 12}" width="${o.waistWidth - 2}" height="12" fill="#5F6B7A" stroke="#141414" stroke-width="3"/>
      `
    },
    cewek: {
      label: 'Perempuan / Warga Biasa',
      bodyWidth: 50,
      waistWidth: 40,
      bodyHeight: 64,
      legLength: 96,
      neck: 9,
      knee: [3, -3],
      shoe: '#8E3558',
      // Rambut belakang (sebahu) digambar di balik kepala.
      renderHairBack: () => `
        <path d="M -46 -4 C -50 -40, -24 -54, 0 -54 C 24 -54, 50 -40, 46 -4 L 48 34 Q 40 44 30 40 L 28 10 L -28 10 L -30 40 Q -40 44 -48 34 Z" fill="#3A2A2E" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      `,
      // Poni menyamping + helai di samping wajah + jepit rambut. Tidak menutupi mata.
      renderHeadGear: () => `
        <path d="M -44 -6 C -44 -40, -16 -50, 4 -48 C 26 -47, 44 -36, 44 -10 C 34 -26, 14 -32, -4 -26 C -18 -22, -32 -20, -44 -6 Z" fill="#3A2A2E" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
        <path d="M -44 -6 Q -48 16 -42 30" stroke="#3A2A2E" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M 44 -10 Q 48 14 42 30" stroke="#3A2A2E" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M 6 -40 Q 18 -36 30 -30" stroke="#5A4448" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <rect x="24" y="-34" width="12" height="5" rx="2" fill="#F48FB1" stroke="#141414" stroke-width="2" transform="rotate(25, 30, -31)"/>
      `,
      renderBody: (w, h, o) => `
        <!-- Blus koral dengan kerah bulat -->
        <path d="${torsoPath(w, o.waistWidth, h, 12)}" fill="#E8735A" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M -11 0 Q 0 12 11 0" fill="#FFFFFF" stroke="#141414" stroke-width="3"/>
        <!-- Lengan pendek -->
        <rect x="${-w/2 - 3}" y="8" width="11" height="9" rx="3" fill="#E8735A" stroke="#141414" stroke-width="2.5"/>
        <rect x="${w/2 - 8}" y="8" width="11" height="9" rx="3" fill="#E8735A" stroke="#141414" stroke-width="2.5"/>
        <!-- Kalung kecil -->
        <circle cx="0" cy="16" r="2.6" fill="#FFD54F" stroke="#141414" stroke-width="1.5"/>
        <!-- Tas selempang -->
        <line x1="${-w/2 + 8}" y1="2" x2="${o.waistWidth/2 - 2}" y2="${h - 14}" stroke="#6D4C41" stroke-width="3"/>
        <rect x="${o.waistWidth/2 - 8}" y="${h - 18}" width="16" height="13" rx="3" fill="#8D6E63" stroke="#141414" stroke-width="2.5"/>
        <!-- Rok A-line biru tua sampai bawah lutut -->
        <path d="M ${-o.waistWidth/2} ${h - 8} L ${o.waistWidth/2} ${h - 8} L ${o.waistWidth/2 + 12} ${h + 30} Q 0 ${h + 36} ${-o.waistWidth/2 - 12} ${h + 30} Z" fill="#33415C" stroke="#141414" stroke-width="3.5" stroke-linejoin="round"/>
      `
    },
    biasa: {
      label: 'Presenter Ruang Pikir',
      bodyWidth: 64,      // kaus oversize: bahu lebar
      waistWidth: 62,     // hampir lurus, tidak menyempit
      bodyHeight: 74,
      legLength: 90,
      neck: 9,
      knee: [-4, 6],
      shoe: '#ECEFF1',
      armOffset: { x: 6, y: 1 }, // tangan keluar dari ujung lengan kaus pendek
      renderHeadGear: () => `
        <!-- Rambut pendek berantakan hitam -->
        <path d="M -44 -10 C -46 -44, 40 -52, 45 -12 L 38 -22 L 32 -14 L 24 -26 L 14 -18 L 4 -28 L -8 -18 L -18 -28 L -28 -18 L -36 -24 Z" fill="#2A2420" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      `,
      renderBody: (w, h, o) => `
        <!-- Celana jeans sedikit terlihat di bawah kaus -->
        <rect x="${-o.waistWidth/2 + 6}" y="${h + 2}" width="${o.waistWidth - 12}" height="10" fill="#3F5F8F" stroke="#141414" stroke-width="3"/>
        <!-- Kaus kuning oversize: lebar, lurus, panjang menutupi pinggul -->
        <path d="M ${-w/2 + 6} 0 L ${w/2 - 6} 0 Q ${w/2} 0 ${w/2} 6 L ${o.waistWidth/2 + 1} ${h + 6} Q 0 ${h + 10} ${-o.waistWidth/2 - 1} ${h + 6} L ${-w/2} 6 Q ${-w/2} 0 ${-w/2 + 6} 0 Z" fill="#FFD21F" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <!-- Kerah bulat (rib) -->
        <path d="M -13 0 Q 0 12 13 0" fill="none" stroke="#141414" stroke-width="3.5"/>
        <path d="M -10 0 Q 0 8 10 0" fill="none" stroke="#C9A100" stroke-width="2"/>
        <!-- Tulisan di dada (sekaligus watermark channel) -->
        <text x="0" y="34" font-family="'Segoe UI', Arial, sans-serif" font-weight="700" font-size="8" letter-spacing="0.1" text-anchor="middle" fill="#2B2B2B" fill-opacity="0.9">RUANG PIKIR</text>
      `,
      // Lengan kaus digambar di atas pangkal tangan, jadi tangan terlihat keluar dari lengan baju.
      renderOverArms: (w) => `
        <!-- Lengan kaus pendek: hanya menutup pangkal tangan, jadi tangan bebas bergerak -->
        <path d="M ${-w/2 + 2} 1 Q ${-w/2 - 7} 2 ${-w/2 - 11} 9 L ${-w/2 - 9} 23 Q ${-w/2 - 3} 25 ${-w/2 + 2} 22 Z" fill="#FFD21F" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
        <path d="M ${w/2 - 2} 1 Q ${w/2 + 7} 2 ${w/2 + 11} 9 L ${w/2 + 9} 23 Q ${w/2 + 3} 25 ${w/2 - 2} 22 Z" fill="#FFD21F" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      `
    },
    // ===== Kostum Penjelajah Gua =====
    penjelajah_gua: {
      label: 'Penjelajah Gua (Raka)',
      bodyWidth: 62,
      waistWidth: 58,
      bodyHeight: 72,
      legLength: 92,
      neck: 9,
      knee: [-6, 8],
      shoe: '#45352B',
      armOffset: { x: 6, y: 1 },
      renderHeadGear: () => `
        <path d="M -44 -12 C -45 -43, 42 -48, 45 -12 L 36 -20 L 27 -14 L 17 -24 L 7 -16 L -5 -25 L -18 -15 L -29 -22 L -38 -17 Z" fill="#292820" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      `,
      renderBody: (w, h, o) => `
        <rect x="${-o.waistWidth/2 + 5}" y="${h + 2}" width="${o.waistWidth - 10}" height="12" fill="#4B5140" stroke="#141414" stroke-width="3"/>
        <path d="M ${-w/2 + 6} 0 L ${w/2 - 6} 0 Q ${w/2} 0 ${w/2} 7 L ${o.waistWidth/2 + 1} ${h + 4} Q 0 ${h + 9} ${-o.waistWidth/2 - 1} ${h + 4} L ${-w/2} 7 Q ${-w/2} 0 ${-w/2 + 6} 0 Z" fill="#59634A" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M -20 8 L -8 19 L -15 ${h + 2} M 20 8 L 8 19 L 15 ${h + 2}" stroke="#C49A5A" stroke-width="5" fill="none" stroke-linecap="round"/>
        <rect x="-9" y="24" width="18" height="13" rx="2" fill="#D9B66D" stroke="#141414" stroke-width="2.5"/>
        <rect x="${-o.waistWidth/2 + 2}" y="${h * 0.56}" width="15" height="19" rx="3" fill="#805A39" stroke="#141414" stroke-width="2.5"/>
        <rect x="${o.waistWidth/2 - 17}" y="${h * 0.56}" width="15" height="19" rx="3" fill="#805A39" stroke="#141414" stroke-width="2.5"/>
        <path d="M -12 0 Q 0 11 12 0" fill="none" stroke="#292820" stroke-width="3"/>
      `,
      renderOverArms: (w) => sleeveCaps(w, '#59634A')
    },
    // ===== Kostum Romawi (v5, video gladiator) =====
    gladiator: {
      label: 'Gladiator (Tunik Kuning Ruang Pikir)',
      bodyWidth: 62,
      waistWidth: 56,
      bodyHeight: 70,
      legLength: 90,
      neck: 8,
      knee: [-4, 6],
      shoe: '#7A4E2D',
      armOffset: { x: 6, y: 1 },
      renderHeadGear: () => `
        <path d="M -44 -10 C -46 -44, 40 -52, 45 -12 L 38 -22 L 32 -14 L 24 -26 L 14 -18 L 4 -28 L -8 -18 L -18 -28 L -28 -18 L -36 -24 Z" fill="#2A2420" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      `,
      renderBody: (w, h, o) => `
        <!-- Tunik kuning sampai paha, sedikit melebar ke bawah -->
        <path d="M ${-w/2 + 6} 0 L ${w/2 - 6} 0 Q ${w/2} 0 ${w/2} 6 L ${o.waistWidth/2 + 6} ${h + 16} Q 0 ${h + 22} ${-o.waistWidth/2 - 6} ${h + 16} L ${-w/2} 6 Q ${-w/2} 0 ${-w/2 + 6} 0 Z" fill="#FFD21F" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M -12 0 Q 0 10 12 0" fill="none" stroke="#141414" stroke-width="3.2"/>
        <!-- Lipatan tunik di bawah sabuk -->
        <path d="M -14 ${h - 2} L -17 ${h + 15} M 0 ${h - 2} L 0 ${h + 18} M 14 ${h - 2} L 17 ${h + 15}" stroke="#C9A100" stroke-width="2.4" fill="none"/>
        <!-- Tulisan di dada (watermark channel) -->
        <text x="0" y="30" font-family="'Segoe UI', Arial, sans-serif" font-weight="600" font-size="9" text-anchor="middle" fill="#2B2B2B" fill-opacity="0.82">Ruang Pikir</text>
        <!-- Sabuk kulit lebar (balteus) + gesper perunggu -->
        <rect x="${-o.waistWidth/2 - 1}" y="${h - 16}" width="${o.waistWidth + 2}" height="12" rx="2" fill="#7A4E2D" stroke="#141414" stroke-width="3"/>
        <rect x="-7" y="${h - 17}" width="14" height="14" rx="2" fill="#E0B400" stroke="#141414" stroke-width="2.2"/>
        <path d="M -20 ${h - 4} L -22 ${h + 8} M -10 ${h - 4} L -11 ${h + 9}" stroke="#7A4E2D" stroke-width="3" stroke-linecap="round"/>
      `,
      renderOverArms: (w) => sleeveCaps(w, '#FFD21F')
    },
    flamma: {
      label: 'Flamma (Gladiator Senior, Berjenggot)',
      bodyWidth: 66,
      waistWidth: 60,
      bodyHeight: 72,
      legLength: 88,
      neck: 7,
      knee: [5, -5],
      shoe: '#5D3A1F',
      armOffset: { x: 6, y: 1 },
      atributBawaan: ['jenggot'],
      renderHeadGear: () => `
        <path d="M -44 -12 C -44 -46, 42 -50, 44 -12 C 30 -30, -20 -32, -44 -12 Z" fill="#1E1A18" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
        <path d="M 22 -30 L 30 -20 M 26 -24 L 31 -28" stroke="#8E5A4F" stroke-width="2" stroke-linecap="round"/>
      `,
      renderBody: (w, h, o) => `
        <path d="M ${-w/2 + 6} 0 L ${w/2 - 6} 0 Q ${w/2} 0 ${w/2} 6 L ${o.waistWidth/2 + 6} ${h + 16} Q 0 ${h + 22} ${-o.waistWidth/2 - 6} ${h + 16} L ${-w/2} 6 Q ${-w/2} 0 ${-w/2 + 6} 0 Z" fill="#9C2B23" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M -12 0 Q 0 10 12 0" fill="none" stroke="#141414" stroke-width="3.2"/>
        <path d="M -14 ${h - 2} L -17 ${h + 15} M 0 ${h - 2} L 0 ${h + 18} M 14 ${h - 2} L 17 ${h + 15}" stroke="#6E1C16" stroke-width="2.4" fill="none"/>
        <!-- bekas luka di dada -->
        <path d="M 8 14 L 22 26 M 12 22 L 16 18" stroke="#F2B8A0" stroke-width="2.4" stroke-linecap="round"/>
        <rect x="${-o.waistWidth/2 - 1}" y="${h - 16}" width="${o.waistWidth + 2}" height="12" rx="2" fill="#4E3018" stroke="#141414" stroke-width="3"/>
        <rect x="-7" y="${h - 17}" width="14" height="14" rx="2" fill="#E0B400" stroke="#141414" stroke-width="2.2"/>
      `,
      renderOverArms: (w) => sleeveCaps(w, '#9C2B23')
    },
    retiarius: {
      label: 'Retiarius (Gladiator Jaring & Trisula)',
      bodyWidth: 58,
      waistWidth: 50,
      bodyHeight: 66,
      legLength: 96,
      neck: 9,
      knee: [6, -4],
      shoe: '#7A4E2D',
      renderHeadGear: () => `
        <g fill="#5B3A22" stroke="#141414" stroke-width="3.6">
          <circle cx="-24" cy="-30" r="14"/><circle cx="0" cy="-38" r="16"/><circle cx="24" cy="-30" r="14"/>
          <circle cx="-10" cy="-27" r="13"/><circle cx="12" cy="-27" r="13"/>
        </g>
        <path d="M -43 -14 Q 0 -26 43 -14 L 42 -21 Q 0 -33 -42 -21 Z" fill="#2E7BC4" stroke="#141414" stroke-width="2.6"/>
      `,
      renderBody: (w, h, o) => `
        <!-- Dada telanjang -->
        <path d="${torsoPath(w, o.waistWidth, h, 12)}" fill="#FFFFFF" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M -10 20 Q -4 26 0 22 Q 4 26 10 20" stroke="#D8D8D8" stroke-width="2.4" fill="none"/>
        <!-- Tali bahu diagonal -->
        <path d="M ${w/2 - 10} 2 L ${-o.waistWidth/2 + 6} ${h - 12}" stroke="#2E7BC4" stroke-width="7" stroke-linecap="round"/>
        <!-- Kain pinggang biru (subligaculum) -->
        <path d="M ${-o.waistWidth/2 - 1} ${h - 14} L ${o.waistWidth/2 + 1} ${h - 14} L ${o.waistWidth/2 + 4} ${h + 12} L 4 ${h + 16} L 0 ${h + 4} L -4 ${h + 16} L ${-o.waistWidth/2 - 4} ${h + 12} Z" fill="#2E7BC4" stroke="#141414" stroke-width="3.5" stroke-linejoin="round"/>
        <rect x="${-o.waistWidth/2 - 1}" y="${h - 16}" width="${o.waistWidth + 2}" height="8" rx="2" fill="#7A4E2D" stroke="#141414" stroke-width="2.6"/>
      `,
      // Pelindung bahu logam (galerus) di bahu kiri
      renderOverArms: (w) => `
        <path d="M ${-w/2 + 14} 2 Q ${-w/2 + 2} -2 ${-w/2 - 8} -12 L ${-w/2 - 15} -6 Q ${-w/2 - 14} 12 ${-w/2 - 10} 26 Q ${-w/2 + 2} 30 ${-w/2 + 12} 20 Z" fill="#AEB6BC" stroke="#141414" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M ${-w/2 - 9} -4 Q ${-w/2 - 8} 10 ${-w/2 - 5} 22" stroke="#D9DEE2" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="${-w/2 + 6}" cy="6" r="1.8" fill="#6F777C"/><circle cx="${-w/2 + 6}" cy="18" r="1.8" fill="#6F777C"/>
        <path d="M ${-w/2 + 10} 4 L ${w/2 - 10} 2" stroke="#7A4E2D" stroke-width="0" fill="none"/>
      `
    },
    wasit: {
      label: 'Wasit Arena (Summa Rudis)',
      bodyWidth: 56,
      waistWidth: 52,
      bodyHeight: 74,
      legLength: 90,
      neck: 9,
      knee: [-3, 3],
      shoe: '#7A4E2D',
      renderHeadGear: () => `
        <!-- Botak di atas, rambut abu-abu di samping -->
        <path d="M -44 -6 Q -46 -22 -36 -30 L -32 -12 Z" fill="#B0B0B0" stroke="#141414" stroke-width="3"/>
        <path d="M 44 -6 Q 46 -22 36 -30 L 32 -12 Z" fill="#B0B0B0" stroke="#141414" stroke-width="3"/>
        <path d="M -20 -38 Q 0 -44 20 -38" stroke="rgba(0,0,0,0.12)" stroke-width="4" fill="none"/>
      `,
      renderBody: (w, h, o) => `
        <!-- Tunik putih panjang sampai lutut dengan dua garis merah (clavi) -->
        <path d="M ${-w/2 + 6} 0 L ${w/2 - 6} 0 Q ${w/2} 0 ${w/2} 6 L ${o.waistWidth/2 + 8} ${h + 30} Q 0 ${h + 36} ${-o.waistWidth/2 - 8} ${h + 30} L ${-w/2} 6 Q ${-w/2} 0 ${-w/2 + 6} 0 Z" fill="#F4F1EA" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M -12 0 L -14 ${h + 32} M 12 0 L 14 ${h + 32}" stroke="#B3261E" stroke-width="5"/>
        <rect x="${-o.waistWidth/2 - 2}" y="${h - 14}" width="${o.waistWidth + 4}" height="6" rx="2" fill="#8D6E63" stroke="#141414" stroke-width="2.2"/>
      `,
      renderOverArms: (w) => sleeveCaps(w, '#F4F1EA')
    },
    lanista: {
      label: 'Lanista (Pemilik Sekolah Gladiator)',
      bodyWidth: 84,
      waistWidth: 90,
      bodyHeight: 78,
      legLength: 76,
      neck: 3,
      knee: [-6, 6],
      shoe: '#5D3A1F',
      renderHeadGear: () => `
        <path d="M -44 -8 Q -46 -34 -30 -40 L -26 -18 Z" fill="#8A8A8A" stroke="#141414" stroke-width="3"/>
        <path d="M 44 -8 Q 46 -34 30 -40 L 26 -18 Z" fill="#8A8A8A" stroke="#141414" stroke-width="3"/>
        <path d="M -24 -40 Q 0 -50 24 -40 L 20 -32 Q 0 -40 -20 -32 Z" fill="#6D8F3A" stroke="#141414" stroke-width="2.4"/>
      `,
      renderBody: (w, h, o) => `
        <!-- Badan gemuk berbalut toga putih berpinggiran ungu -->
        <path d="M ${-w/2 + 14} 0 L ${w/2 - 14} 0 Q ${w/2 + 6} 10 ${o.waistWidth/2} ${h - 10} Q ${o.waistWidth/2 + 2} ${h + 20} 0 ${h + 22} Q ${-o.waistWidth/2 - 2} ${h + 20} ${-o.waistWidth/2} ${h - 10} Q ${-w/2 - 6} 10 ${-w/2 + 14} 0 Z" fill="#F4F1EA" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M ${-w/2 + 10} 2 Q 0 ${h * 0.5} ${o.waistWidth/2 - 4} ${h + 8}" stroke="#6A2C8A" stroke-width="8" fill="none" stroke-linecap="round"/>
        <path d="M ${-w/2 + 18} 10 Q 4 ${h * 0.55} ${o.waistWidth/2 - 14} ${h + 12}" stroke="#D8D3C6" stroke-width="3" fill="none"/>
        <path d="M -10 0 Q 0 8 10 0" fill="none" stroke="#141414" stroke-width="3"/>
      `,
      renderOverArms: (w) => sleeveCaps(w, '#F4F1EA')
    },
    romawi: {
      label: 'Warga Romawi (Toga, Penonton)',
      bodyWidth: 56,
      waistWidth: 52,
      bodyHeight: 68,
      legLength: 92,
      neck: 8,
      knee: [4, -4],
      shoe: '#7A4E2D',
      renderHeadGear: () => `
        <path d="M -44 -10 C -46 -46, 42 -50, 44 -10 C 34 -26, -30 -28, -44 -10 Z" fill="#6D4428" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      `,
      renderBody: (w, h, o) => `
        <path d="M ${-w/2 + 6} 0 L ${w/2 - 6} 0 Q ${w/2} 0 ${w/2} 6 L ${o.waistWidth/2 + 8} ${h + 28} Q 0 ${h + 34} ${-o.waistWidth/2 - 8} ${h + 28} L ${-w/2} 6 Q ${-w/2} 0 ${-w/2 + 6} 0 Z" fill="#F4F1EA" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M ${w/2 - 8} 2 Q 0 ${h * 0.45} ${-o.waistWidth/2 - 2} ${h + 18}" stroke="#D8D3C6" stroke-width="9" fill="none" stroke-linecap="round"/>
        <path d="M ${w/2 - 8} 2 Q 0 ${h * 0.45} ${-o.waistWidth/2 - 2} ${h + 18}" stroke="#141414" stroke-width="2" fill="none" stroke-dasharray="0" opacity="0.5"/>
      `,
      renderOverArms: (w) => sleeveCaps(w, '#F4F1EA')
    },
    rakyat_romawi: {
      label: 'Rakyat Romawi (Tunik Cokelat, Penonton)',
      bodyWidth: 54,
      waistWidth: 50,
      bodyHeight: 66,
      legLength: 94,
      neck: 9,
      knee: [-5, 5],
      shoe: '#5D3A1F',
      renderHeadGear: () => `
        <path d="M -44 -10 C -46 -44, 40 -52, 45 -12 L 36 -20 L 28 -12 L 18 -22 L 6 -14 L -6 -22 L -18 -14 L -30 -22 Z" fill="#1E1A18" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      `,
      renderBody: (w, h, o) => `
        <path d="M ${-w/2 + 6} 0 L ${w/2 - 6} 0 Q ${w/2} 0 ${w/2} 6 L ${o.waistWidth/2 + 5} ${h + 14} Q 0 ${h + 19} ${-o.waistWidth/2 - 5} ${h + 14} L ${-w/2} 6 Q ${-w/2} 0 ${-w/2 + 6} 0 Z" fill="#8A6A45" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M ${-o.waistWidth/2} ${h - 12} Q 0 ${h - 6} ${o.waistWidth/2} ${h - 12}" stroke="#D9C089" stroke-width="3.5" fill="none"/>
        <path d="M -12 0 Q 0 10 12 0" fill="none" stroke="#141414" stroke-width="3"/>
      `,
      renderOverArms: (w) => sleeveCaps(w, '#8A6A45')
    },
    // ===== Kostum Jepang zaman samurai (v9, video ninja) =====
    ninja_hitam: {
      label: 'v9 Ninja Berbaju Hitam (Ruang Pikir)',
      bodyWidth: 60,
      waistWidth: 52,
      bodyHeight: 70,
      legLength: 90,
      neck: 8,
      knee: [-4, 6],
      shoe: '#1B1B1E',
      armOffset: { x: 6, y: 1 },
      // Penutup kepala hitam: menutup kepala dan pipi, wajah tetap terlihat. Ujung kain berkibar di belakang.
      renderHeadGear: (t) => { const k = Math.sin(t * 7); return `
        <path d="M 40 -16 Q 58 ${(-22 + k * 4).toFixed(1)} 74 ${(-14 + k * 6).toFixed(1)} L 72 ${(-6 + k * 6).toFixed(1)} Q 56 -10 42 -6 Z" fill="#30354A" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>
        <path d="M 40 -10 Q 56 ${(-2 + k * 3).toFixed(1)} 68 ${(6 + k * 5).toFixed(1)} L 63 ${(12 + k * 5).toFixed(1)} Q 52 4 40 -2 Z" fill="#30354A" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>
        <path fill-rule="evenodd" d="M 0 -49 C 31 -49 50 -28 50 0 C 50 29 31 49 0 49 C -31 49 -50 29 -50 0 C -50 -28 -31 -49 0 -49 Z M -37 4 A 37 34 0 1 0 37 4 A 37 34 0 1 0 -37 4 Z" fill="#30354A" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
        <path d="M -30 -37 Q 0 -47 30 -37" stroke="#56607E" stroke-width="3" fill="none" stroke-linecap="round"/>
      `; },
      renderBody: (w, h, o) => `
        <path d="M ${-o.waistWidth/2} ${h - 6} L ${o.waistWidth/2} ${h - 6} L ${o.waistWidth/2 + 4} ${h + 18} L 4 ${h + 20} L 0 ${h + 8} L -4 ${h + 20} L ${-o.waistWidth/2 - 4} ${h + 18} Z" fill="#2A2F42" stroke="#141414" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="${torsoPath(w, o.waistWidth, h, 12)}" fill="#30354A" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <!-- Kerah silang -->
        <path d="M -14 0 L 10 ${h - 16}" stroke="#56607E" stroke-width="5" fill="none"/>
        <path d="M 14 0 L -2 22" stroke="#56607E" stroke-width="5" fill="none"/>
        <!-- Ikat pinggang (obi) + simpul -->
        <!-- Ikat pinggang (obi) bertulisan Ruang Pikir (watermark channel) + simpul di samping -->
        <rect x="${-o.waistWidth/2 - 1}" y="${h - 18}" width="${o.waistWidth + 2}" height="13" rx="2" fill="#6A7596" stroke="#141414" stroke-width="3"/>
        <path d="M ${o.waistWidth/2 - 2} ${h - 13} l 7 12 l -10 -3 Z" fill="#6A7596" stroke="#141414" stroke-width="2" stroke-linejoin="round"/>
        <text x="-2" y="${h - 8.2}" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="8.5" letter-spacing="0.3" text-anchor="middle" fill="#FFFFFF">Ruang Pikir</text>
      `,
      renderOverArms: (w) => sleeveCaps(w, '#30354A')
    },
    pedagang: {
      label: 'v9 Pedagang Jepang (Caping + Kimono Pendek Ruang Pikir)',
      bodyWidth: 62,
      waistWidth: 56,
      bodyHeight: 70,
      legLength: 90,
      neck: 8,
      knee: [-4, 6],
      shoe: '#B8925A',
      armOffset: { x: 6, y: 1 },
      atributBawaan: ['caping'],
      renderHeadGear: () => `<path d="M -44 -10 C -46 -44, 40 -52, 45 -12 L 38 -22 L 32 -14 L 24 -26 L 14 -18 L 4 -28 L -8 -18 L -18 -28 L -28 -18 L -36 -24 Z" fill="#2A2420" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>`,
      renderBody: (w, h, o) => kimonoBadan(w, h, o, { kain: '#F0AE5E', kerah: '#A0622A', obi: '#2F74E0', panjang: 16, tulisan: '#FFFFFF', tambalan: '#D98E45' }),
      renderOverArms: (w) => sleeveCaps(w, '#F0AE5E')
    },
    baju_rumah: {
      label: 'v9 Baju Rumah (Yukata Biru)',
      bodyWidth: 62,
      waistWidth: 56,
      bodyHeight: 70,
      legLength: 90,
      neck: 8,
      knee: [-4, 6],
      shoe: '#B8925A',
      armOffset: { x: 6, y: 1 },
      renderHeadGear: () => `<path d="M -44 -10 C -46 -44, 40 -52, 45 -12 L 38 -22 L 32 -14 L 24 -26 L 14 -18 L 4 -28 L -8 -18 L -18 -28 L -28 -18 L -36 -24 Z" fill="#2A2420" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>`,
      renderBody: (w, h, o) => kimonoBadan(w, h, o, { kain: '#3D8FE8', kerah: '#E8E2D4', obi: '#F0AE5E', panjang: 30, motif: '#BFE0FF' }),
      renderOverArms: (w) => sleeveCaps(w, '#3D8FE8')
    },
    penjaga: {
      label: 'v9 Penjaga Kastil (Jingasa + Tombak)',
      bodyWidth: 64,
      waistWidth: 56,
      bodyHeight: 70,
      legLength: 88,
      neck: 8,
      knee: [5, -5],
      shoe: '#2A2A2A',
      armOffset: { x: 6, y: 1 },
      renderHeadGear: () => `
        <path d="M -44 -12 C -44 -40, 42 -44, 44 -12 C 30 -24, -30 -26, -44 -12 Z" fill="#1E1A18" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
        <!-- Topi besi pipih (jingasa) -->
        <path d="M -68 -20 Q 0 -64 68 -20 Q 0 -30 -68 -20 Z" fill="#56607A" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
        <path d="M -50 -27 Q 0 -54 50 -27" stroke="#8C95AC" stroke-width="2.5" fill="none"/>
        <circle cx="0" cy="-40" r="6" fill="#C9A227" stroke="#141414" stroke-width="2"/>
        <path d="M -40 -22 Q -46 10 -34 30 M 40 -22 Q 46 10 34 30" stroke="#5D4037" stroke-width="2" fill="none"/>
      `,
      renderBody: (w, h, o) => `
        <!-- Celana lebar (hakama) abu-abu sampai lutut -->
        <path d="M ${-o.waistWidth/2} ${h - 8} L ${o.waistWidth/2} ${h - 8} L ${o.waistWidth/2 + 12} ${h + 34} L 4 ${h + 36} L 0 ${h + 12} L -4 ${h + 36} L ${-o.waistWidth/2 - 12} ${h + 34} Z" fill="#A3AEC4" stroke="#141414" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M -14 ${h} L -19 ${h + 32} M 14 ${h} L 19 ${h + 32}" stroke="#7E8AA2" stroke-width="2.4"/>
        <path d="${torsoPath(w, o.waistWidth, h, 12)}" fill="#2F63B8" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M -13 0 L 6 22" stroke="#E8E2D4" stroke-width="5"/>
        <path d="M 13 0 L -2 18" stroke="#E8E2D4" stroke-width="4"/>
        <!-- Lambang kastil di dada -->
        <circle cx="16" cy="28" r="7" fill="#E8E2D4" stroke="#141414" stroke-width="2"/>
        <circle cx="16" cy="28" r="3.2" fill="#2F63B8"/>
        <rect x="${-o.waistWidth/2 - 1}" y="${h - 16}" width="${o.waistWidth + 2}" height="9" rx="2" fill="#1E1A18" stroke="#141414" stroke-width="2.6"/>
      `,
      renderOverArms: (w) => sleeveCaps(w, '#2F63B8')
    },
    samurai: {
      label: 'v9 Samurai Berzirah (Katana + Busur Yumi)',
      atributBawaan: ['tabung_panah'],
      bodyWidth: 74,
      waistWidth: 62,
      bodyHeight: 74,
      legLength: 86,
      neck: 6,
      knee: [6, -6],
      shoe: '#2A2A2A',
      armOffset: { x: 8, y: 2 },
      renderHeadGear: () => `
        <!-- Pelindung leher (shikoro) -->
        <path d="M -46 -14 Q -62 4 -58 24 L -40 20 Q -44 2 -38 -10 Z" fill="#323646" stroke="#141414" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M 46 -14 Q 62 4 58 24 L 40 20 Q 44 2 38 -10 Z" fill="#323646" stroke="#141414" stroke-width="3.5" stroke-linejoin="round"/>
        <path d="M -52 6 L -42 4 M -55 15 L -42 12 M 52 6 L 42 4 M 55 15 L 42 12" stroke="#E8352B" stroke-width="2.4"/>
        <!-- Helm kubah hitam (kabuto) -->
        <path d="M -46 -12 C -48 -56, 48 -56, 46 -12 Q 0 -24 -46 -12 Z" fill="#323646" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
        <path d="M -24 -44 Q -28 -30 -30 -17 M 0 -50 L 0 -21 M 24 -44 Q 28 -30 30 -17" stroke="#555A70" stroke-width="2.4" fill="none"/>
        <!-- Hiasan tanduk emas (maedate) -->
        <path d="M -6 -42 Q -28 -62 -36 -84 Q -18 -68 -1 -50 Z" fill="#FFC91F" stroke="#141414" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M 6 -42 Q 28 -62 36 -84 Q 18 -68 1 -50 Z" fill="#FFC91F" stroke="#141414" stroke-width="2.6" stroke-linejoin="round"/>
        <circle cx="0" cy="-42" r="6.5" fill="#FFC91F" stroke="#141414" stroke-width="2.4"/>
      `,
      renderBody: (w, h, o) => {
        const ww = o.waistWidth;
        const rok = [-1, 0, 1].map((i) => `<path d="M ${i * ww / 3 - ww / 6 - 1} ${h - 6} L ${i * ww / 3 + ww / 6 + 1} ${h - 6} L ${i * ww / 3 + ww / 6 + 3 + i * 3} ${h + 28} L ${i * ww / 3 - ww / 6 - 3 + i * 3} ${h + 28} Z" fill="#E8352B" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>`).join('')
          + [h + 4, h + 14, h + 23].map((y) => `<path d="M ${-ww / 2 - 4} ${y} L ${ww / 2 + 4} ${y}" stroke="#3F6BE0" stroke-width="2" stroke-dasharray="3 3"/>`).join('');
        return `
        ${rok}
        <path d="${torsoPath(w, ww, h, 14)}" fill="#E8352B" stroke="#141414" stroke-width="4.5" stroke-linejoin="round"/>
        <path d="M ${-w / 2 + 6} 2 L ${w / 2 - 6} 2 L ${w / 2 - 4} 14 L ${-w / 2 + 4} 14 Z" fill="#323646" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>
        ${[26, 38, 50, 62].map((y) => `<path d="M ${-ww / 2 - 4} ${y} L ${ww / 2 + 4} ${y}" stroke="#A8221A" stroke-width="2.6"/><path d="M ${-ww / 2 + 2} ${y - 6} L ${ww / 2 - 2} ${y - 6}" stroke="#3F6BE0" stroke-width="2" stroke-dasharray="3 3"/>`).join('')}
        <!-- Sarung pedang di pinggang -->
        <path d="M ${-ww / 2 - 6} ${h - 22} L ${-ww / 2 - 24} ${h + 14}" stroke="#141414" stroke-width="7" stroke-linecap="round"/>
        <rect x="${-ww / 2 - 2}" y="${h - 14}" width="${ww + 4}" height="8" rx="2" fill="#E8E2D4" stroke="#141414" stroke-width="2.4"/>
      `; },
      // Pelindung bahu (sode) menggantung dari bahu
      renderOverArms: (w) => [-1, 1].map((sd) => {
        const x0 = sd < 0 ? -w / 2 - 16 : w / 2 - 6;
        return `<rect x="${x0}" y="-2" width="22" height="32" rx="3" fill="#E8352B" stroke="#141414" stroke-width="3.5"/>
          <path d="M ${x0 + 2} 8 L ${x0 + 20} 8 M ${x0 + 2} 18 L ${x0 + 20} 18" stroke="#A8221A" stroke-width="2.4"/>
          <path d="M ${x0 + 4} 4 L ${x0 + 18} 4 M ${x0 + 4} 13 L ${x0 + 18} 13 M ${x0 + 4} 23 L ${x0 + 18} 23" stroke="#3F6BE0" stroke-width="1.8" stroke-dasharray="2.5 2.5"/>`;
      }).join('')
    },
    adik: {
      label: 'v9 Adik (Kimono Rumah, Rambut Diikat)',
      bodyWidth: 54,
      waistWidth: 48,
      bodyHeight: 64,
      legLength: 84,
      neck: 8,
      knee: [3, -3],
      shoe: '#B8925A',
      armOffset: { x: 5, y: 1 },
      renderHeadGear: () => `
        <circle cx="0" cy="-54" r="13" fill="#2A2420" stroke="#141414" stroke-width="3.8"/>
        <path d="M -44 -8 C -46 -46, 44 -50, 44 -8 C 34 -24, 10 -30, 0 -24 C -14 -30, -34 -24, -44 -8 Z" fill="#2A2420" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
        <rect x="-8" y="-46" width="16" height="5" rx="2" fill="#E57373" stroke="#141414" stroke-width="2"/>
      `,
      renderBody: (w, h, o) => kimonoBadan(w, h, o, { kain: '#C76FE0', kerah: '#F4F1EA', obi: '#FFC91F', panjang: 28, motif: '#F0D2FA' }),
      renderOverArms: (w) => sleeveCaps(w, '#C76FE0')
    },
    warga_jepang: wargaJepang('v9 Warga Jepang (Kimono Cokelat)', '#D9934F', '#8E5A2C', 'kuncir'),
    warga_jepang_biru: wargaJepang('v9 Warga Jepang (Kimono Biru, Sanggul)', '#4AA3F0', '#2F74E0', 'sanggul'),
    warga_jepang_abu: wargaJepang('v9 Warga Jepang (Kimono Abu, Tua)', '#BAC3D0', '#7D8696', 'tua'),
    hantu: {
      label: 'Hantu (Kuntilanak)',
      bodyWidth: 46,
      waistWidth: 40,
      bodyHeight: 70,
      legLength: 92,
      neck: 6,
      knee: [0, 0],
      barefoot: true,
      skin: '#CFE8EE',        // kulit pucat kebiruan
      headFill: '#EEF7F9',
      limbColor: '#EEF4F5',   // tangan putih pucat dengan garis tepi hitam
      alwaysFloat: true,      // hantu selalu melayang
      dressLength: 70,        // gaun panjang di bawah badan
      // Rambut hitam panjang sampai pinggang, di balik badan. Berayun saat melayang,
      // berkibar ke belakang saat terbang.
      renderHairBack: (t = 0, motion = '', dir = 1) => {
        const s = Math.sin(t * 2.2) * 4;
        const tr = motion === 'terbang' ? -dir * 30 : 0;
        return `
          <path d="M -46 -2 C -52 -48, 52 -48, 46 -2
            C 50 50, ${54 + s + tr} 110, ${48 + s + tr} 150
            L ${34 + tr} 142 L ${22 + tr + s} 154 L ${8 + tr} 144 L ${-6 + tr + s} 156
            L ${-20 + tr} 144 L ${-34 + tr + s} 154 L ${-48 + tr} 148
            C ${-54 + s + tr} 110, -50 50, -46 -2 Z" fill="#0E0E10" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>
        `;
      },
      // Tirai rambut di kiri-kanan wajah sampai bahu. Mata tetap terlihat di tengah.
      renderHeadGear: (t = 0, motion = '', dir = 1) => {
        const s = Math.sin(t * 2.2 + 1) * 2;
        const tr = motion === 'terbang' ? -dir * 8 : 0;
        return `
          <path d="M -44 -6 C -46 -44, -6 -52, 2 -46 Q -14 -36 -24 -16 Q -28 10 ${-26 + s + tr} 62 L ${-40 + tr} 64 Q -46 30 -44 -6 Z" fill="#0E0E10" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>
          <path d="M 44 -6 C 46 -44, 6 -52, -2 -46 Q 14 -36 24 -16 Q 28 10 ${26 - s + tr} 62 L ${40 + tr} 64 Q 46 30 44 -6 Z" fill="#0E0E10" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>
          <path d="M -36 -24 Q -34 10 -34 50" stroke="#2C2C34" stroke-width="2" fill="none"/>
          <path d="M 36 -24 Q 34 10 34 50" stroke="#2C2C34" stroke-width="2" fill="none"/>
        `;
      },
      // Gaun putih panjang, melebar ke bawah, ujungnya compang-camping dan bergelombang.
      renderBody: (w, h, o, t = 0, motion = '', dir = 1) => {
        // Saat duduk, gaun jatuh di atas lutut (tidak menembus lantai).
        const hemY = motion === 'duduk_samping' ? h + 24 : h + o.dressLength;
        const tr = motion === 'terbang' ? -dir * 22 : 0;
        const half = o.waistWidth / 2 + 20;
        // Ujung gaun: titik zig-zag dari kanan ke kiri, bergerak mengikuti waktu.
        let hem = '';
        const n = 8;
        for (let i = 0; i <= n; i++) {
          const x = half - (2 * half * i) / n + tr * (0.6 + 0.4 * Math.sin(i));
          const y = hemY + (i % 2 ? -9 : 3) + Math.sin(t * 3 + i * 0.9) * 4;
          hem += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
        }
        return `
          <path d="M ${-w/2 + 8} 0 L ${w/2 - 8} 0 Q ${w/2} 0 ${w/2} 10
            L ${half - 2 + tr * 0.4} ${hemY - 12}
            ${hem}
            L ${-half + 2 + tr * 0.4} ${hemY - 12}
            L ${-w/2} 10 Q ${-w/2} 0 ${-w/2 + 8} 0 Z"
            fill="#F2F5F7" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
          <!-- Lipatan gaun -->
          <path d="M -8 20 Q ${-12 + tr * 0.3} ${h + 20} ${-14 + tr * 0.5} ${hemY - 14}" stroke="#C9D3DA" stroke-width="2.5" fill="none"/>
          <path d="M 10 22 Q ${14 + tr * 0.3} ${h + 24} ${16 + tr * 0.5} ${hemY - 16}" stroke="#C9D3DA" stroke-width="2.5" fill="none"/>
          <!-- Leher gaun -->
          <path d="M -10 0 Q 0 8 10 0" fill="none" stroke="#141414" stroke-width="2.5"/>
        `;
      }
    }
  };

  // Alat bantu pose v5: lengan (garis lengkung), tangan (bola), benda di tangan (diputar).
  // v8: saat REK aktif, pose tidak menggambar tapi mencatat titik bahu-siku-tangan dan benda
  // (dipakai untuk peralihan pose yang luwes, lihat campurPose).
  let REK = null;
  const f1 = (v) => (+v).toFixed(1);
  const lenganAsli = (sx, sy, cx, cy, hx, hy) => `<path d="M ${f1(sx)} ${f1(sy)} Q ${f1(cx)} ${f1(cy)} ${f1(hx)} ${f1(hy)}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>`;
  const tgnAsli = (x, y) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="6.5" fill="#141414"/>`;
  const bendaAsli = (key, x, y, sudut, t) => (PROPS[key] ? `<g transform="translate(${f1(x)}, ${f1(y)}) rotate(${f1(sudut)})">${PROPS[key](t)}</g>` : '');
  const lengan = (sx, sy, cx, cy, hx, hy) => { if (REK) { REK.lengan.push([sx, sy, cx, cy, hx, hy].map(Number)); return ''; } return lenganAsli(sx, sy, cx, cy, hx, hy); };
  const tgn = (x, y) => { if (REK) { REK.tgn.push([+x, +y]); return ''; } return tgnAsli(x, y); };
  const benda = (key, x, y, sudut, t) => { if (REK) { REK.benda.push([key, +x, +y, +sudut]); return ''; } return bendaAsli(key, x, y, sudut, t); };

  const ARM_POSES = {
    minum: {
      label: 'Minum dari Cangkir (Tangan ke Mulut)',
      overHead: true,
      render: (w, t, swing = 0, o = {}) => {
        const R = { x: 12, y: -26 + Math.sin(t * 5) * 1.5 }, L = { x: -w/2 - 8, y: 74 };
        return lengan(-w/2 + 4, 18, -w/2 - 14, 45, L.x, L.y) + tgn(L.x, L.y)
          + lengan(w/2 - 4, 18, w/2 + 18, 0, R.x + 10, R.y + 6) + benda(o.pegang || 'cangkir', R.x, R.y + 4, -35, t) + tgn(R.x + 10, R.y + 6);
      }
    },
    // ===== Pose bertarung (v5). Tangan kanan memegang opts.pegang, kiri opts.pegangKiri. =====
    kuda_kuda: {
      label: 'Kuda-kuda (Perisai di Kiri, Pedang Siap di Kanan)',
      render: (w, t, swing = 0, o = {}) => {
        const b = Math.sin(t * 6) * 2;
        const L = { x: -w/2 - 8, y: 34 + b }, R = { x: w/2 + 20, y: 4 + b };
        return lengan(-w/2 + 4, 18, -w/2 - 14, 30, L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 26, 24, R.x, R.y)
          + benda(o.pegang || 'gladius', R.x, R.y, 25, t) + tgn(R.x, R.y)
          + benda(o.pegangKiri || 'perisai', L.x, L.y, -4, t) ;
      }
    },
    tusuk: {
      label: 'Menusuk ke Kanan (Pedang Lurus ke Depan)',
      render: (w, t, swing = 0, o = {}) => {
        const k = Math.max(0, Math.sin(t * 7));
        const R = { x: w/2 + 18 + k * 34, y: 22 - k * 4 }, L = { x: -w/2 - 4, y: 34 };
        return lengan(-w/2 + 4, 18, -w/2 - 12, 30, L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 10 + k * 14, 26, R.x, R.y)
          + benda(o.pegang || 'gladius', R.x, R.y, 90, t) + tgn(R.x, R.y)
          + benda(o.pegangKiri || 'perisai', L.x, L.y, -6, t);
      }
    },
    tangkis: {
      label: 'Menangkis (Perisai di Depan Badan)',
      render: (w, t, swing = 0, o = {}) => {
        const g = Math.sin(t * 30) * 1.2;
        const L = { x: 4 + g, y: 30 }, R = { x: w/2 + 14, y: 46 };
        return lengan(w/2 - 4, 18, w/2 + 18, 34, R.x, R.y) + benda(o.pegang || 'gladius', R.x, R.y, 150, t) + tgn(R.x, R.y)
          + lengan(-w/2 + 4, 18, -w/2 - 6, 34, L.x, L.y) + benda(o.pegangKiri || 'perisai', L.x, L.y, 0, t);
      }
    },
    ayun: {
      label: 'Mengayun Pedang (Tebasan dari Atas)',
      render: (w, t, swing = 0, o = {}) => {
        const k = 0.5 + 0.5 * Math.sin(t * 9);
        const a = (-130 + k * 150) * Math.PI / 180;
        const sx = w/2 - 4, sy = 18;
        const R = { x: sx + Math.cos(a) * 40, y: sy + Math.sin(a) * 40 };
        const L = { x: -w/2 - 6, y: 34 };
        return lengan(-w/2 + 4, 18, -w/2 - 12, 30, L.x, L.y) + lengan(sx, sy, sx + Math.cos(a) * 20 + 6, sy + Math.sin(a) * 20, R.x, R.y)
          + benda(o.pegang || 'gladius', R.x, R.y, a * 180 / Math.PI + 90, t) + tgn(R.x, R.y)
          + benda(o.pegangKiri || 'perisai', L.x, L.y, -4, t);
      }
    },
    lempar_jaring: {
      label: 'Memutar Jaring di Atas Kepala (Retiarius)',
      render: (w, t, swing = 0, o = {}) => {
        const R = { x: w/2 + 34 + Math.cos(t * 12) * 5, y: -52 + Math.sin(t * 12) * 4 };
        const L = { x: -w/2 - 10, y: 44 };
        return lengan(-w/2 + 4, 18, -w/2 - 16, 30, L.x, L.y) + benda(o.pegangKiri || 'trisula', L.x, L.y, 0, t) + tgn(L.x, L.y)
          + lengan(w/2 - 4, 18, w/2 + 36, -6, R.x, R.y) + benda(o.pegang || 'jaring', R.x + 22, R.y + 8, Math.sin(t * 12) * 12, t) + tgn(R.x, R.y);
      }
    },
    tusuk_trisula: {
      label: 'Menusuk dengan Trisula (Dua Tangan)',
      render: (w, t, swing = 0, o = {}) => {
        const k = Math.max(0, Math.sin(t * 6));
        const R = { x: w/2 + 30 + k * 26, y: 24 }, L = { x: w/2 - 2 + k * 22, y: 32 };
        return lengan(-w/2 + 4, 18, -w/2 + 8, 40, L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 16, 28, R.x, R.y)
          + benda(o.pegang || 'trisula', R.x, R.y, 92, t) + tgn(L.x, L.y) + tgn(R.x, R.y);
      }
    },
    tangkis_pedang: {
      label: 'Menangkis dengan Pedang (Pedang Melintang di Atas)',
      render: (w, t, swing = 0, o = {}) => {
        const g = Math.sin(t * 34) * 1.5;
        const R = { x: w/2 + 26 + g, y: -18 }, L = { x: -w/2 - 6, y: 38 };
        return lengan(-w/2 + 4, 18, -w/2 - 12, 30, L.x, L.y) + benda(o.pegangKiri || 'perisai', L.x, L.y, -6, t)
          + lengan(w/2 - 4, 18, w/2 + 30, 6, R.x, R.y) + benda(o.pegang || 'gladius', R.x, R.y, -62, t) + tgn(R.x, R.y);
      }
    },
    adu_pedang: {
      label: 'Adu Kunci Pedang (Mendorong ke Kanan)',
      render: (w, t, swing = 0, o = {}) => {
        const g = Math.sin(t * 40) * 2;
        const R = { x: w/2 + 34 + g, y: 6 }, L = { x: w/2 + 14 + g, y: 18 };
        return lengan(-w/2 + 4, 18, -w/2 + 2, 40, L.x, L.y) + tgn(L.x, L.y)
          + lengan(w/2 - 4, 18, w/2 + 18, 26, R.x, R.y) + benda(o.pegang || 'gladius', R.x, R.y, 40, t) + tgn(R.x, R.y);
      }
    },
    tangkis_trisula: {
      label: 'Menangkis dengan Gagang Trisula (Melintang di Depan)',
      render: (w, t, swing = 0, o = {}) => {
        const g = Math.sin(t * 34) * 1.5;
        const L = { x: -w/2 - 4, y: 4 + g }, R = { x: w/2 + 10, y: 0 + g };
        return lengan(-w/2 + 4, 18, -w/2 - 14, 16, L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 18, 12, R.x, R.y)
          + benda(o.pegang || 'trisula', R.x, R.y, -78, t) + tgn(L.x, L.y) + tgn(R.x, R.y);
      }
    },
    sapu_trisula: {
      label: 'Menyapu Rendah dengan Trisula',
      render: (w, t, swing = 0, o = {}) => {
        const k = 0.5 + 0.5 * Math.sin(t * 8);
        const R = { x: w/2 + 30, y: 50 }, L = { x: w/2 + 6, y: 44 };
        return lengan(-w/2 + 4, 18, -w/2 + 4, 46, L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 22, 40, R.x, R.y)
          + benda(o.pegang || 'trisula', R.x, R.y, 120 + k * 30, t) + tgn(L.x, L.y) + tgn(R.x, R.y);
      }
    },
    angkat_jari: {
      label: 'Angkat Satu Jari (Tanda Menyerah)',
      render: (w, t, swing = 0, o = {}) => {
        const b = Math.sin(t * 3) * 2;
        const R = { x: w/2 + 34, y: -40 + b }, L = { x: -w/2 - 8, y: 74 };
        return lengan(-w/2 + 4, 18, -w/2 - 14, 45, L.x, L.y) + (o.pegangKiri ? benda(o.pegangKiri, L.x, L.y, 0, t) : '') + tgn(L.x, L.y)
          + lengan(w/2 - 4, 18, w/2 + 32, 0, R.x, R.y) + tgn(R.x, R.y)
          + `<line x1="${R.x}" y1="${R.y - 4}" x2="${R.x + 1}" y2="${R.y - 20}" stroke="#141414" stroke-width="4.8" stroke-linecap="round"/>`;
      }
    },
    serahkan: {
      label: 'Menyerahkan / Menerima Benda (Tangan Kanan ke Depan)',
      render: (w, t, swing = 0, o = {}) => {
        const b = Math.sin(t * 3) * 1.5;
        const R = { x: w/2 + 32, y: 18 + b }, L = { x: -w/2 - 8, y: 74 };
        return lengan(-w/2 + 4, 18, -w/2 - 14, 45, L.x, L.y) + (o.pegangKiri ? benda(o.pegangKiri, L.x, L.y, 0, t) : '') + tgn(L.x, L.y)
          + lengan(w/2 - 4, 18, w/2 + 20, 30, R.x, R.y) + (o.pegang ? benda(o.pegang, R.x, R.y, 60, t) : '') + tgn(R.x, R.y);
      }
    },
    // ===== v10: samurai pemanah =====
    tarik_busur: {
      label: 'v10 Menarik Busur (Panah Siap Dilepas)',
      render: (w, t) => {
        // Tangan kiri lurus ke depan memegang busur, tangan kanan menarik tali sampai dekat pipi.
        const k = Math.min(1, 0.6 + 0.4 * Math.abs(Math.sin(t * 2.4))); // tarikan bergetar sedikit
        const B = { x: w/2 + 46, y: 8 };                 // tangan kiri di pegangan busur
        const R = { x: w/2 + 30 - k * 26, y: 4 };        // tangan kanan menarik tali
        const atas = { x: B.x - 4 - k * 4, y: B.y - 112 }, bawah = { x: B.x - 4 - k * 3, y: B.y + 58 };
        return lengan(w/2 - 4, 18, w/2 + 22, 10, B.x, B.y)
          + benda('yumi', B.x, B.y, 0, t)
          + `<path d="M ${f1(atas.x)} ${f1(atas.y)} L ${f1(R.x)} ${f1(R.y)} L ${f1(bawah.x)} ${f1(bawah.y)}" stroke="#F4F1EA" stroke-width="1.8" fill="none"/>`
          + benda('panah', R.x, R.y, 90, t)
          + tgn(B.x, B.y)
          + lengan(-w/2 + 4, 18, -w/2 + 30, 4, R.x, R.y) + tgn(R.x, R.y);
      }
    },
    lepas_panah: {
      label: 'v10 Melepas Panah (Tangan Kanan Terhentak ke Belakang)',
      render: (w, t) => {
        const g = Math.sin(t * 40) * 1.5; // tali bergetar
        const B = { x: w/2 + 46, y: 8 }, R = { x: -w/2 - 6, y: -8 };
        const atas = { x: B.x - 4, y: B.y - 112 }, bawah = { x: B.x - 4, y: B.y + 58 };
        return lengan(w/2 - 4, 18, w/2 + 22, 10, B.x, B.y)
          + benda('yumi', B.x, B.y, 0, t)
          + `<path d="M ${f1(atas.x)} ${f1(atas.y)} Q ${f1(B.x - 6 + g)} ${f1(B.y - 26)} ${f1(bawah.x)} ${f1(bawah.y)}" stroke="#F4F1EA" stroke-width="1.8" fill="none"/>`
          + tgn(B.x, B.y)
          + lengan(-w/2 + 4, 18, -w/2 - 14, 6, R.x, R.y) + tgn(R.x, R.y);
      }
    },
    pegang_busur: {
      label: 'v10 Memegang Busur di Samping (Siaga)',
      render: (w, t) => {
        const b = Math.sin(t * 3) * 1.5;
        const B = { x: -w/2 - 14, y: 46 + b }, R = { x: w/2 + 8, y: 74 };
        return lengan(-w/2 + 4, 18, -w/2 - 16, 36, B.x, B.y) + benda('yumi', B.x, B.y, 8, t)
          + `<path d="M ${f1(B.x - 4 - 8)} ${f1(B.y - 112)} L ${f1(B.x - 4 + 8)} ${f1(B.y + 58)}" stroke="#F4F1EA" stroke-width="1.6"/>` + tgn(B.x, B.y)
          + lengan(w/2 - 4, 18, w/2 + 14, 45, R.x, R.y) + tgn(R.x, R.y);
      }
    },
    cabut_katana: {
      label: 'v10 Mencabut Katana dari Sarung (Bawah ke Atas)',
      render: (w, t, swing = 0, o = {}) => {
        // Siklus 1 detik: tangan kanan di gagang dekat pinggang kiri, lalu menarik pedang ke atas-depan.
        const p = (t % 1), k = p < 0.35 ? 0 : Math.min(1, (p - 0.35) / 0.3);
        const e = 1 - Math.pow(1 - k, 3);
        const R = { x: -w/2 + 10 + e * (w + 18), y: 60 - e * 52 };
        const L = { x: -w/2 + 2, y: 64 };
        return lengan(-w/2 + 4, 18, -w/2 - 10, 44, L.x, L.y) + tgn(L.x, L.y)
          + lengan(w/2 - 4, 18, w/2 - 10 + e * 30, 44 - e * 20, R.x, R.y)
          + benda(o.pegang || 'katana', R.x, R.y, 200 + e * 190, t) + tgn(R.x, R.y);
      }
    },
    tinju_bawah: {
      label: 'v10 Meninju Lantai/Genteng (Pakai Gerak Jongkok)',
      render: (w, t) => {
        const R = { x: w/2 + 18, y: 112 }, L = { x: -w/2 - 22, y: 30 };
        return lengan(-w/2 + 4, 18, -w/2 - 20, 14, L.x, L.y) + tgn(L.x, L.y)
          + lengan(w/2 - 4, 18, w/2 + 24, 70, R.x, R.y) + `<circle cx="${f1(R.x)}" cy="${f1(R.y)}" r="9" fill="#141414"/>`;
      }
    },
    // ===== v9: pose ninja / Jepang =====
    pikul: {
      label: 'v9 Memikul Keranjang di Bahu',
      render: (w, t, swing = 0, o = {}) => {
        const b = Math.sin(t * 4) * 1.5;
        const R = { x: w/2 + 6, y: -3 + b }, L = { x: -w/2 - 8 + swing, y: 74 };
        return benda(o.pegang || 'pikulan_keranjang', 0, -4 + b, 0, t)
          + lengan(-w/2 + 4, 18, -w/2 - 14, 45, L.x, L.y) + tgn(L.x, L.y)
          + lengan(w/2 - 4, 18, w/2 + 18, 10, R.x, R.y) + tgn(R.x, R.y);
      }
    },
    siaga_pikulan: {
      label: 'v9 Kuda-kuda dengan Pikulan (Tongkat Diagonal)',
      render: (w, t, swing = 0, o = {}) => {
        const b = Math.sin(t * 6) * 2;
        const R = { x: w/2 + 16, y: 26 + b }, L = { x: w/2 - 8, y: 40 + b };
        return lengan(-w/2 + 4, 18, -w/2 + 4, 42, L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 18, 30, R.x, R.y)
          + benda(o.pegang || 'pikulan', (R.x + L.x) / 2, (R.y + L.y) / 2, 40, t) + tgn(L.x, L.y) + tgn(R.x, R.y);
      }
    },
    putar_pikulan: {
      label: 'v9 Memutar Pikulan seperti Tongkat',
      render: (w, t, swing = 0, o = {}) => {
        const C = { x: w/2 + 16, y: 22 }, a = t * 900;
        const R = { x: C.x + 6, y: C.y - 3 }, L = { x: C.x - 10, y: C.y + 5 };
        return lengan(-w/2 + 4, 18, -w/2 + 6, 42, L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 16, 30, R.x, R.y)
          + benda(o.pegang || 'pikulan', C.x, C.y, a, t) + tgn(L.x, L.y) + tgn(R.x, R.y);
      }
    },
    tangkis_pikulan: {
      label: 'v9 Menangkis dengan Pikulan (Tegak Miring di Depan Badan)',
      render: (w, t, swing = 0, o = {}) => {
        const g = Math.sin(t * 30) * 1.2;
        const L = { x: w/2 + 2 + g, y: 44 }, R = { x: w/2 + 18 + g, y: 8 };
        return lengan(-w/2 + 4, 18, -w/2 + 8, 44, L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 22, 20, R.x, R.y)
          + benda(o.pegang || 'pikulan', (L.x + R.x) / 2, (L.y + R.y) / 2, 24, t) + tgn(L.x, L.y) + tgn(R.x, R.y);
      }
    },
    siaga_tombak: {
      label: 'v9 Siaga dengan Tombak (Mengarah ke Depan)',
      render: (w, t, swing = 0, o = {}) => {
        const b = Math.sin(t * 5) * 2;
        const R = { x: w/2 + 22, y: 30 + b }, L = { x: w/2, y: 42 + b };
        return lengan(-w/2 + 4, 18, -w/2 + 6, 44, L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 18, 34, R.x, R.y)
          + benda(o.pegang || 'tombak', R.x, R.y, 68, t) + tgn(L.x, L.y) + tgn(R.x, R.y);
      }
    },
    tusuk_tombak: {
      label: 'v9 Menusuk dengan Tombak (Dua Tangan)',
      render: (w, t, swing = 0, o = {}) => {
        const k = Math.max(0, Math.sin(t * 6));
        const R = { x: w/2 + 30 + k * 28, y: 24 }, L = { x: w/2 - 2 + k * 24, y: 32 };
        return lengan(-w/2 + 4, 18, -w/2 + 8, 40, L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 16, 28, R.x, R.y)
          + benda(o.pegang || 'tombak', R.x, R.y, 88, t) + tgn(L.x, L.y) + tgn(R.x, R.y);
      }
    },
    siaga_katana: {
      label: 'v9 Kuda-kuda Katana (Dua Tangan, Ujung ke Depan Atas)',
      render: (w, t, swing = 0, o = {}) => {
        const b = Math.sin(t * 5) * 2;
        const R = { x: w/2 + 12, y: 22 + b }, L = { x: w/2 + 2, y: 30 + b };
        return lengan(-w/2 + 4, 18, -w/2 + 8, 40, L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 14, 30, R.x, R.y)
          + benda(o.pegang || 'katana', R.x, R.y, 30, t) + tgn(L.x, L.y) + tgn(R.x, R.y);
      }
    },
    tebas_katana: {
      label: 'v9 Menebas dengan Katana (Dua Tangan, dari Atas)',
      render: (w, t, swing = 0, o = {}) => {
        const k = 0.5 + 0.5 * Math.sin(t * 9);
        const a = (-120 + k * 150) * Math.PI / 180;
        const sx = w/2 - 4, sy = 18;
        const R = { x: sx + Math.cos(a) * 42, y: sy + Math.sin(a) * 42 };
        const L = { x: R.x - Math.cos(a) * 10, y: R.y - Math.sin(a) * 10 + 4 };
        return lengan(-w/2 + 4, 18, -w/2 + 6, 20, L.x, L.y) + lengan(sx, sy, sx + Math.cos(a) * 20 + 6, sy + Math.sin(a) * 20, R.x, R.y)
          + benda(o.pegang || 'katana', R.x, R.y, a * 180 / Math.PI + 90, t) + tgn(L.x, L.y) + tgn(R.x, R.y);
      }
    },
    tangkis_tangan: {
      label: 'v9 Tangkis Tangan Kosong (Bergantian Cepat)',
      render: (w, t) => {
        const s = Math.sin(t * 16);
        const R = { x: w/2 + 22 + s * 8, y: -6 - Math.max(0, s) * 6 }, L = { x: w/2 + 6 - s * 8, y: 6 + Math.max(0, -s) * 6 };
        return lengan(-w/2 + 4, 18, -w/2 + 2, 30, L.x, L.y) + tgn(L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 18, 24, R.x, R.y) + tgn(R.x, R.y);
      }
    },
    pukul: {
      label: 'v9 Memukul ke Depan (Tangan Kiri Menjaga Dagu)',
      render: (w, t) => {
        const k = Math.max(0, Math.sin(t * 10));
        const R = { x: w/2 + 16 + k * 34, y: 14 }, L = { x: w/2 - 8, y: 8 };
        return lengan(-w/2 + 4, 18, -w/2 + 10, 34, L.x, L.y) + tgn(L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 8 + k * 10, 26, R.x, R.y)
          + `<circle cx="${f1(R.x)}" cy="${f1(R.y)}" r="8" fill="#141414"/>`;
      }
    },
    seimbang: {
      label: 'v9 Tangan Terbuka Menjaga Seimbang (Sapu Kaki / Meluncur)',
      render: (w, t) => {
        const b = Math.sin(t * 8) * 3;
        const L = { x: -w/2 - 34, y: 26 + b }, R = { x: w/2 + 30, y: 34 - b };
        return lengan(-w/2 + 4, 18, -w/2 - 18, 18, L.x, L.y) + tgn(L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 16, 22, R.x, R.y) + tgn(R.x, R.y);
      }
    },
    tangkap_pedang: {
      label: 'v9 Menangkap Pedang dengan Dua Telapak (di Atas Kepala)',
      render: (w, t, swing = 0, o = {}) => {
        const g = Math.sin(t * 30) * 1.2;
        // Di atas kepala (juga kepala yang memanjang saat kaget), jadi telapak tidak tertutup kepala.
        const L = { x: -5, y: -124 + g }, R = { x: 6, y: -124 + g };
        return (o.pegang ? benda(o.pegang, 0, -124, -90, t) : '')
          + lengan(-w/2 + 4, 18, -w/2 - 36, -44, L.x, L.y) + lengan(w/2 - 4, 18, w/2 + 36, -44, R.x, R.y)
          + `<ellipse cx="${f1(L.x)}" cy="${f1(L.y)}" rx="5" ry="9" fill="#141414"/><ellipse cx="${f1(R.x)}" cy="${f1(R.y)}" rx="5" ry="9" fill="#141414"/>`;
      }
    },
    tulis_kuas: {
      label: 'v9 Menulis dengan Kuas (Tangan Kanan ke Meja)',
      render: (w, t, swing = 0, o = {}) => {
        const R = { x: w/2 + 12 + Math.sin(t * 6) * 5, y: 52 + Math.cos(t * 6) * 2 }, L = { x: -w/2 + 4, y: 58 };
        return lengan(-w/2 + 4, 18, -w/2 - 6, 44, L.x, L.y) + tgn(L.x, L.y)
          + lengan(w/2 - 4, 18, w/2 + 14, 40, R.x, R.y) + benda(o.pegang || 'kuas', R.x, R.y - 2, 15, t) + tgn(R.x, R.y);
      }
    },
    lempar: {
      label: 'v9 Melempar (Ayun dari Belakang Bahu ke Depan)',
      render: (w, t, swing = 0, o = {}) => {
        const k = (t * 1.8) % 1, e = k < 0.5 ? k * 2 : 1;
        const a = (-200 + e * 220) * Math.PI / 180, sx = w/2 - 4, sy = 18;
        const R = { x: sx + Math.cos(a) * 44, y: sy + Math.sin(a) * 44 }, L = { x: w/2 + 10, y: 30 };
        return lengan(-w/2 + 4, 18, -w/2 + 10, 34, L.x, L.y) + tgn(L.x, L.y)
          + lengan(sx, sy, sx + Math.cos(a) * 22, sy + Math.sin(a) * 22 - 6, R.x, R.y)
          + (o.pegang && k < 0.5 ? benda(o.pegang, R.x, R.y, 0, t) : '') + tgn(R.x, R.y);
      }
    },
    tabur: {
      label: 'v9 Menabur Paku Besi ke Belakang',
      render: (w, t, swing = 0, o = {}) => {
        const b = Math.sin(t * 9) * 4;
        const R = { x: w/2 + 6, y: 54 + b }, L = { x: -w/2 - 10, y: 60 };
        return lengan(-w/2 + 4, 18, -w/2 - 14, 40, L.x, L.y) + tgn(L.x, L.y)
          + lengan(w/2 - 4, 18, w/2 + 16, 40, R.x, R.y) + benda(o.pegang || 'makibishi_genggam', R.x, R.y + 6, 0, t) + tgn(R.x, R.y);
      }
    },
    jari_bibir: {
      label: 'v9 Jari di Bibir (Rahasia!)',
      overHead: true,
      render: (w, t, swing = 0, o = {}) => {
        const R = { x: 12, y: -24 }, L = { x: -w/2 - 8, y: 74 };
        return lengan(-w/2 + 4, 18, -w/2 - 14, 45, L.x, L.y) + (o.pegangKiri ? benda(o.pegangKiri, L.x, L.y, 0, t) : '') + tgn(L.x, L.y)
          + lengan(w/2 - 4, 18, w/2 + 18, -2, R.x, R.y) + tgn(R.x, R.y)
          + `<line x1="${R.x - 1}" y1="${R.y - 4}" x2="${R.x - 3}" y2="${R.y - 20}" stroke="#141414" stroke-width="4.8" stroke-linecap="round"/>`;
      }
    },
    idle: {
      label: 'Diam / Santai (Idle)',
      render: (w, t, swing = 0) => {
        // swing != 0 saat berjalan: tangan kiri maju saat kaki kanan maju, dan sebaliknya.
        const sway = swing ? 0 : Math.sin(t * 2.5) * 3;
        const lx = -w/2 - 8 + sway + swing;
        const rx = w/2 + 8 - sway - swing;
        const ly = 74 - Math.abs(swing) * 0.3;
        const ry = 74 - Math.abs(swing) * 0.3;
        return `
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 - 14 + swing * 0.5} 45 ${lx} ${ly}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${lx}" cy="${ly + 2}" r="6" fill="#141414"/>
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 14 - swing * 0.5} 45 ${rx} ${ry}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${rx}" cy="${ry + 2}" r="6" fill="#141414"/>
        `;
      }
    },
    pegang_stopwatch: {
      label: 'Pegang Stopwatch / Kartu (Pede)',
      render: (w, t) => {
        const bob = Math.sin(t * 3) * 2.5;
        return `
          <!-- Tangan Kiri Santai -->
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 - 14} 45 ${-w/2 - 8} 74" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${-w/2 - 8}" cy="76" r="6" fill="#141414"/>
          <!-- Tangan Kanan Angkat Stopwatch -->
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 28} 34 ${w/2 + 34} ${-8 + bob}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${w/2 + 34}" cy="${-8 + bob}" r="6" fill="#141414"/>
          <!-- Stopwatch -->
          <g transform="translate(${w/2 + 34}, ${-26 + bob})">
            <rect x="-3" y="-18" width="6" height="6" fill="#CFD8DC" stroke="#141414" stroke-width="2.5"/>
            <circle cx="0" cy="0" r="14" fill="#FFFFFF" stroke="#141414" stroke-width="3.5"/>
            <line x1="0" y1="0" x2="0" y2="-9" stroke="#D50000" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="0" y1="0" x2="6" y2="2" stroke="#141414" stroke-width="2" stroke-linecap="round"/>
          </g>
        `;
      }
    },
    pegang_kartu: {
      cermin: false, // ada tulisan di kartu, jangan dibalik
      label: 'Tunjuk Kartu Sampel (P-618)',
      render: (w, t) => {
        const bob = Math.sin(t * 2.8) * 2;
        return `
          <!-- Tangan Kiri Angkat Kartu P-618 -->
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 - 32} 28 ${-w/2 - 36} ${-16 + bob}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <g transform="translate(${-w/2 - 58}, ${-62 + bob})">
            <rect x="0" y="0" width="44" height="52" rx="3" fill="#FFFFFF" stroke="#141414" stroke-width="3.5"/>
            <rect x="5" y="5" width="34" height="28" fill="#F48FB1" stroke="#141414" stroke-width="2"/>
            <text x="22" y="45" font-family="sans-serif" font-weight="900" font-size="10" text-anchor="middle" fill="#141414">P-618</text>
          </g>
          <!-- Tangan Kanan Santai -->
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 14} 45 ${w/2 + 8} 74" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${w/2 + 8}" cy="76" r="6" fill="#141414"/>
        `;
      }
    },
    mengecat: {
      label: 'Kerja / Mengecat Roller',
      render: (w, t) => {
        const rollY = Math.sin(t * 5) * 16;
        return `
          <!-- Gagang & Roller Cat -->
          <line x1="${-w/2 - 46}" y1="${-58 + rollY}" x2="${w/2 - 4}" y2="42" stroke="#8D6E63" stroke-width="5" stroke-linecap="round"/>
          <rect x="${-w/2 - 68}" y="${-70 + rollY}" width="32" height="14" rx="4" fill="#EC407A" stroke="#141414" stroke-width="3.5" transform="rotate(-20, ${-w/2 - 52}, ${-63 + rollY})"/>
          <!-- Dua Tangan Memegang Gagang -->
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 - 22} 10 ${-w/2 - 18} ${-6 + rollY * 0.4}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <path d="M ${w/2 - 4} 18 Q ${w/2 - 10} 38 ${-2} 28" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
        `;
      }
    },
    kepal_marah: {
      label: 'Kepal Dua Tangan (Mengamuk)',
      render: (w, t) => {
        const shake = Math.sin(t * 28) * 3;
        return `
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 - 34} 10 ${-w/2 - 26 + shake} -24" stroke="#141414" stroke-width="6" stroke-linecap="round" fill="none"/>
          <circle cx="${-w/2 - 26 + shake}" cy="-26" r="7.5" fill="#141414"/>
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 34} 10 ${w/2 + 26 - shake} -24" stroke="#141414" stroke-width="6" stroke-linecap="round" fill="none"/>
          <circle cx="${w/2 + 26 - shake}" cy="-26" r="7.5" fill="#141414"/>
        `;
      }
    },
    pegang_hp: {
      label: 'Pegang HP (Mau Foto)',
      render: (w, t, swing = 0) => {
        const bob = Math.sin(t * 3) * 1.5;
        const lx = -w/2 - 8 + swing;
        return `
          <!-- Tangan kiri santai (ikut berayun saat jalan) -->
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 - 14 + swing * 0.5} 45 ${lx} 74" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${lx}" cy="76" r="6" fill="#141414"/>
          <!-- Tangan kanan mengangkat HP di depan dada -->
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 24} 42 ${w/2 + 8} ${8 + bob}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <g transform="translate(${w/2 + 8}, ${-6 + bob}) rotate(-8)">
            <rect x="-9" y="-16" width="18" height="30" rx="4" fill="#212121" stroke="#141414" stroke-width="2.5"/>
            <rect x="-6" y="-12" width="12" height="20" rx="2" fill="#8FD3FF"/>
            <circle cx="0" cy="11" r="1.6" fill="#555"/>
          </g>
          <circle cx="${w/2 + 8}" cy="${8 + bob}" r="6" fill="#141414"/>
        `;
      }
    },
    menjahit: {
      label: 'Menjahit (Tangan ke Mesin di Kanan)',
      render: (w, t, swing = 0, o = {}) => {
        // Kain didorong pelan ke mesin: kedua tangan maju-mundur sedikit.
        const push = Math.sin(t * 6) * 4;
        // Tangan setinggi permukaan meja jahit (sedikit di bawah pinggang atas).
        const lx = w/2 + 4 + push, ly = 30;
        const rx = w/2 + 32 + push * 0.6, ry = 28;
        return `
          <!-- Tangan kiri menyeberang depan badan, memegang kain -->
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 + 2} 46 ${lx} ${ly}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${lx}" cy="${ly}" r="6" fill="#141414"/>
          <!-- Tangan kanan menjulur ke mesin di samping -->
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 22} 26 ${rx} ${ry}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${rx}" cy="${ry}" r="6" fill="#141414"/>
          <!-- Sepotong kain di antara kedua tangan -->
          <path d="M ${lx - 4} ${ly - 2} L ${rx + 6} ${ry - 4} L ${rx + 8} ${ry + 6} L ${lx - 2} ${ly + 7} Z" fill="${o.warnaKain || '#3a6fb0'}" stroke="#141414" stroke-width="2.2" stroke-linejoin="round" opacity="0.95"/>
        `;
      }
    },
    tunjuk_jelaskan: {
      label: 'Menunjuk / Menjelaskan Sains',
      render: (w, t) => {
        const point = Math.sin(t * 4) * 4;
        return `
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 - 28} -2 ${-w/2 - 46} ${-18 + point}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${-w/2 - 46}" cy="${-18 + point}" r="6" fill="#141414"/>
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 14} 45 ${w/2 + 8} 74" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${w/2 + 8}" cy="76" r="6" fill="#141414"/>
        `;
      }
    },
    // ===== Pose v3 (gerak lincah gaya referensi) =====
    angkat_tangan: {
      label: 'Dua Tangan ke Atas (Girang / Kaget)',
      render: (w, t) => {
        const wv = Math.sin(t * 9) * 5;
        return `
          <path d="M ${-w/2 + 4} 16 Q ${-w/2 - 26} 0 ${-w/2 - 20 - wv} ${-44}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${-w/2 - 20 - wv}" cy="-46" r="7" fill="#141414"/>
          <path d="M ${w/2 - 4} 16 Q ${w/2 + 26} 0 ${w/2 + 20 + wv} ${-44}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${w/2 + 20 + wv}" cy="-46" r="7" fill="#141414"/>
        `;
      }
    },
    lambai: {
      label: 'Melambai',
      render: (w, t, swing = 0) => {
        const a = Math.sin(t * 11) * 12;
        return `
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 - 14 + swing * 0.5} 45 ${-w/2 - 8 + swing} 74" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${-w/2 - 8 + swing}" cy="76" r="6" fill="#141414"/>
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 22} 8 ${w/2 + 22 + a} ${-34}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${w/2 + 22 + a}" cy="-36" r="6.5" fill="#141414"/>
        `;
      }
    },
    garuk_kepala: {
      label: 'Garuk Kepala (Bingung)',
      overHead: true, // tangan terlihat di atas rambut
      render: (w, t) => {
        const s = Math.sin(t * 16) * 3;
        return `
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 - 14} 45 ${-w/2 - 8} 74" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${-w/2 - 8}" cy="76" r="6" fill="#141414"/>
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 30} 4 ${w/2 + 12 + s} ${-56}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${w/2 + 12 + s}" cy="-58" r="6.5" fill="#141414"/>
        `;
      }
    },
    tangan_pinggang: {
      label: 'Tangan di Pinggang (Pede / Menantang)',
      render: (w, t) => {
        const b = Math.sin(t * 3) * 1.5;
        return `
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 - 30} 30 ${-w/2 + 4} ${54 + b}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${-w/2 + 4}" cy="${54 + b}" r="6" fill="#141414"/>
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 30} 30 ${w/2 - 4} ${54 + b}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${w/2 - 4}" cy="${54 + b}" r="6" fill="#141414"/>
        `;
      }
    },
    tutup_mulut: {
      label: 'Tutup Mulut (Takut / Kaget)',
      overHead: true, // tangan digambar di depan wajah
      render: (w, t) => {
        const s = Math.sin(t * 30) * 1.2;
        return `
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 - 18} 0 ${-9 + s} -30" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${-9 + s}" cy="-31" r="7" fill="#141414"/>
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 18} 0 ${9 + s} -30" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${9 + s}" cy="-31" r="7" fill="#141414"/>
        `;
      }
    },
    peluk: {
      label: 'Memeluk ke Samping Kanan (Takut, Peluk Teman / Manekin)',
      render: (w, t) => {
        const s = Math.sin(t * 30) * 1.5;
        return `
          <path d="M ${-w/2 + 4} 18 Q ${w/2} 46 ${w/2 + 40 + s} 30" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${w/2 + 40 + s}" cy="30" r="6" fill="#141414"/>
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 26} 8 ${w/2 + 46 + s} 14" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${w/2 + 46 + s}" cy="14" r="6" fill="#141414"/>
        `;
      }
    },
    dorong: {
      label: 'Mendorong ke Kanan (dipakai dengan gerak "dorong")',
      render: (w, t) => {
        const s = Math.sin(t * 24) * 1.5;
        return `
          <path d="M ${-w/2 + 4} 18 Q ${w/2 + 10} 20 ${w/2 + 38 + s} 6" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${w/2 + 38 + s}" cy="6" r="6.5" fill="#141414"/>
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 22} 36 ${w/2 + 40 + s} 26" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${w/2 + 40 + s}" cy="26" r="6.5" fill="#141414"/>
        `;
      }
    },
    bicara: {
      label: 'Bicara / Menjelaskan (Tangan Bergerak)',
      render: (w, t, swing = 0) => {
        // Tangan kanan berpindah antara dua posisi dengan tekanan di ujung (bukan ayunan rata).
        const k = 0.5 + 0.5 * Math.sin(t * 4.2);
        const e = k * k * (3 - 2 * k);
        const hx = w/2 + 18 + e * 14, hy = 34 - e * 34;
        return `
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 - 14 + swing * 0.5} 45 ${-w/2 - 8 + swing} 74" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${-w/2 - 8 + swing}" cy="76" r="6" fill="#141414"/>
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 26} 30 ${hx} ${hy}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <circle cx="${hx}" cy="${hy}" r="6.5" fill="#141414"/>
        `;
      }
    },
    pegang_benda: {
      label: 'Pegang Benda (pilih benda di "pegang")',
      render: (w, t, swing = 0, o = {}) => {
        const bob = Math.sin(t * 3) * 2;
        const hx = w/2 + 22, hy = 26 + bob;
        const prop = PROPS[o.pegang] ? PROPS[o.pegang](t) : '';
        return `
          <path d="M ${-w/2 + 4} 18 Q ${-w/2 - 14 + swing * 0.5} 45 ${-w/2 - 8 + swing} 74" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          ${o.pegangKiri ? benda(o.pegangKiri, -w/2 - 8 + swing, 76, 0, t) : ''}
          <circle cx="${-w/2 - 8 + swing}" cy="76" r="6" fill="#141414"/>
          <path d="M ${w/2 - 4} 18 Q ${w/2 + 22} 44 ${hx} ${hy}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" fill="none"/>
          <g transform="translate(${hx}, ${hy})">${prop}</g>
          <circle cx="${hx}" cy="${hy}" r="6.5" fill="#141414"/>
        `;
      }
    }
  };

  // Gaya duduk menyamping (kaki & kursi tampak samping, badan & wajah tetap menghadap depan).
  const SIT_PRESETS = {
    kantor:  { label: 'Kursi Kantor (Bersandar Santai)', seat: 'kantor', style: 'santai' },
    bar:     { label: 'Kursi Tinggi + Meja',             seat: 'bar',    style: 'tegak' }
  };

  // Menggambar kursi (lapisan belakang), kaki samping, dan meja (lapisan depan).
  function sideSitParts(o) {
    const { D, sit, legLen, ww, bodyX, hipY, seatTop, GROUND, shoe, skin, barefoot } = o;
    const T = Math.max(26, legLen * 0.45);      // panjang paha (mendatar ke depan)
    const footRestY = GROUND - legLen * 0.38;   // pijakan kaki kursi tinggi
    const W = (s) => s.toFixed(1);

    // ---- Kursi ----
    const backX = bodyX - D * (ww / 2 + 12);
    const frontX = bodyX + D * (T * 0.6);
    const sx1 = Math.min(backX, frontX), sx2 = Math.max(backX, frontX);
    let back = '';
    if (sit.seat === 'kantor') {
      const tilt = -D * 10;
      back += `<g transform="rotate(${tilt}, ${W(backX)}, ${W(seatTop)})">
        <rect x="${W(backX - 4)}" y="${W(seatTop - 62)}" width="8" height="64" rx="3" fill="#455A64" stroke="#141414" stroke-width="3"/>
        <rect x="${W(backX - 7)}" y="${W(seatTop - 64)}" width="14" height="28" rx="5" fill="#546E7A" stroke="#141414" stroke-width="3"/>
      </g>`;
      back += `<rect x="${W(sx1)}" y="${W(seatTop - 2)}" width="${W(sx2 - sx1)}" height="9" rx="3" fill="#546E7A" stroke="#141414" stroke-width="3"/>`;
      const cx = (sx1 + sx2) / 2;
      back += `<line x1="${W(cx)}" y1="${W(seatTop + 6)}" x2="${W(cx)}" y2="${GROUND - 9}" stroke="#37474F" stroke-width="6"/>
               <line x1="${W(cx - 24)}" y1="${GROUND - 7}" x2="${W(cx + 24)}" y2="${GROUND - 7}" stroke="#37474F" stroke-width="5" stroke-linecap="round"/>
               <circle cx="${W(cx - 24)}" cy="${GROUND - 3}" r="4" fill="#212121"/><circle cx="${W(cx + 24)}" cy="${GROUND - 3}" r="4" fill="#212121"/><circle cx="${W(cx)}" cy="${GROUND - 3}" r="4" fill="#212121"/>`;
    } else { // bar: kursi tinggi
      const cx = bodyX;
      back += `<line x1="${W(cx)}" y1="${W(seatTop + 6)}" x2="${W(cx)}" y2="${GROUND - 4}" stroke="#37474F" stroke-width="6"/>
               <line x1="${W(cx - 18)}" y1="${W(footRestY + 4)}" x2="${W(cx + 18)}" y2="${W(footRestY + 4)}" stroke="#37474F" stroke-width="4" stroke-linecap="round"/>
               <ellipse cx="${W(cx)}" cy="${GROUND - 3}" rx="20" ry="4" fill="#37474F" stroke="#141414" stroke-width="2.5"/>
               <rect x="${W(cx - ww / 2 - 6)}" y="${W(seatTop - 2)}" width="${W(ww + 12)}" height="9" rx="4" fill="#B71C1C" stroke="#141414" stroke-width="3"/>`;
    }

    // ---- Kaki menyamping ----
    const footShape = (fx, fy, dangle) => {
      if (barefoot) {
        return dangle
          ? `<path d="M ${W(fx - D * 4)} ${W(fy - 5)} Q ${W(fx + D * 6)} ${W(fy - 7)} ${W(fx + D * 13)} ${W(fy + 3)} Q ${W(fx + D * 4)} ${W(fy + 4)} ${W(fx - D * 4)} ${W(fy + 1)} Z" fill="${skin}" stroke="#141414" stroke-width="2.2" stroke-linejoin="round"/>`
          : `<path d="M ${W(fx - D * 6)} ${W(fy)} L ${W(fx - D * 6)} ${W(fy - 6)} Q ${W(fx)} ${W(fy - 9)} ${W(fx + D * 12)} ${W(fy - 4)} Q ${W(fx + D * 14)} ${W(fy - 1)} ${W(fx + D * 12)} ${W(fy)} Z" fill="${skin}" stroke="#141414" stroke-width="2.2" stroke-linejoin="round"/>`;
      }
      return dangle
        ? `<path d="M ${W(fx - D * 5)} ${W(fy - 6)} Q ${W(fx + D * 6)} ${W(fy - 9)} ${W(fx + D * 16)} ${W(fy + 2)} Q ${W(fx + D * 6)} ${W(fy + 5)} ${W(fx - D * 5)} ${W(fy + 1)} Z" fill="${shoe}" stroke="#141414" stroke-width="2.5" stroke-linejoin="round"/>`
        : `<path d="M ${W(fx - D * 7)} ${W(fy)} L ${W(fx - D * 7)} ${W(fy - 6)} Q ${W(fx)} ${W(fy - 11)} ${W(fx + D * 11)} ${W(fy - 7)} Q ${W(fx + D * 16)} ${W(fy - 5)} ${W(fx + D * 16)} ${W(fy)} Z" fill="${shoe}" stroke="#141414" stroke-width="2.5" stroke-linejoin="round"/>`;
    };
    const stroke = (d) => barefoot
      ? `<path d="${d}" stroke="#141414" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="${d}" stroke="${skin}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
      : `<path d="${d}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    const oneLeg = (far) => {
      const hx = bodyX + D * 4 + (far ? -D * 5 : 0);
      const hy = hipY + (far ? -2 : 0);
      let kx, ky, fx, fy, dangle = false;
      if (sit.seat === 'bar') {
        kx = hx + D * T; ky = hy + 3;
        fx = kx - D * 8; fy = footRestY;
      } else {
        kx = hx + D * T; ky = hy + 2;
        fx = kx + D * 3; fy = GROUND;
      }
      const d = `M ${W(hx)} ${W(hy)} L ${W(kx)} ${W(ky)} L ${W(fx)} ${W(fy - (dangle ? 0 : 3))}`;
      return stroke(d) + footShape(fx, fy, dangle);
    };
    const legs = oneLeg(true) + oneLeg(false);

    // ---- Meja (hanya kursi tinggi), di depan karakter ----
    let front = '';
    if (sit.seat === 'bar') {
      const tx1 = bodyX + D * (T + 14), tx2 = tx1 + D * 52;
      const a = Math.min(tx1, tx2), b = Math.max(tx1, tx2);
      const ty = seatTop - 26;
      front = `<line x1="${W((a + b) / 2)}" y1="${W(ty + 6)}" x2="${W((a + b) / 2)}" y2="${GROUND - 3}" stroke="#4E342E" stroke-width="6"/>
               <ellipse cx="${W((a + b) / 2)}" cy="${GROUND - 3}" rx="16" ry="4" fill="#4E342E" stroke="#141414" stroke-width="2.5"/>
               <rect x="${W(a)}" y="${W(ty)}" width="${W(b - a)}" height="8" rx="2" fill="#8D6E63" stroke="#141414" stroke-width="3"/>`;
    }
    const shadowX = bodyX + D * T * 0.35;
    return { back, legs, front, shadowX };
  }

  // v9: pikulan sepanjang L (dipegang di tengah). potong = ujung atas patah bekas tebasan.
  function pikulanProp(L, potong) {
    const a = L / 2;
    return `<rect x="-3.5" y="${-a}" width="7" height="${L}" rx="3" fill="#E0A764" stroke="#141414" stroke-width="2.4"/>
      <path d="M 0 ${-a + 6} L 0 ${a - 6}" stroke="#8D6440" stroke-width="1.4"/>
      ${potong ? `<path d="M -4 ${-a + 1} L -1.5 ${-a - 6} L 0.5 ${-a - 1} L 4 ${-a - 5} L 4 ${-a + 2} Z" fill="#E8C99A" stroke="#141414" stroke-width="2" stroke-linejoin="round"/>` : ''}`;
  }
  // v9: paku besi bercabang (makibishi), s = skala.
  function pakuBesi(x, y, s = 1, r = 0) {
    return `<path transform="translate(${x}, ${y}) rotate(${r}) scale(${s})" d="M 0 -7 L 2 -2 L 7 0 L 2 2 L 0 7 L -2 2 L -7 0 L -2 -2 Z" fill="#5A5F66" stroke="#141414" stroke-width="1.5" stroke-linejoin="round"/>`;
  }
  // ===== Benda yang dipegang tangan kanan (koordinat: tangan di 0,0) =====
  const PROPS = {
    mangkuk: () => `
      <path d="M -22 -6 Q -20 14 0 16 Q 20 14 22 -6 Z" fill="#8D6E63" stroke="#141414" stroke-width="2.6" stroke-linejoin="round"/>
      <ellipse cx="0" cy="-6" rx="22" ry="5" fill="#E8D8A8" stroke="#141414" stroke-width="2.4"/>
      <circle cx="-7" cy="-7" r="2" fill="#B5894B"/><circle cx="5" cy="-6" r="2" fill="#B5894B"/><circle cx="0" cy="-8" r="1.6" fill="#B5894B"/>
      <path d="M 10 -8 L 26 -30" stroke="#B98A5A" stroke-width="3.5" stroke-linecap="round"/>`,
    cangkir: () => `
      <path d="M -9 -20 L 9 -20 L 7 4 Q 0 7 -7 4 Z" fill="#A1887F" stroke="#141414" stroke-width="2.4" stroke-linejoin="round"/>
      <ellipse cx="0" cy="-20" rx="9" ry="2.6" fill="#7A7468" stroke="#141414" stroke-width="2"/>`,
    bantal: () => `
      <path d="M -26 -16 Q 0 -24 26 -16 Q 32 0 26 16 Q 0 22 -26 16 Q -32 0 -26 -16 Z" fill="#F2F2F2" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>
      <path d="M -14 -6 Q 0 -2 14 -6" stroke="#CFCFCF" stroke-width="2" fill="none"/>`,
    // Pedang pendek Romawi, ujung ke atas (sudut 90 = ke kanan)
    gladius: () => `
      <rect x="-3" y="-4" width="6" height="14" rx="2" fill="#6D4C41" stroke="#141414" stroke-width="2"/>
      <circle cx="0" cy="12" r="4" fill="#E0B400" stroke="#141414" stroke-width="2"/>
      <rect x="-9" y="-9" width="18" height="6" rx="2" fill="#E0B400" stroke="#141414" stroke-width="2"/>
      <path d="M -5.5 -9 L -5.5 -88 L 0 -102 L 5.5 -88 L 5.5 -9 Z" fill="#DDE3E7" stroke="#141414" stroke-width="2.6" stroke-linejoin="round"/>
      <line x1="0" y1="-12" x2="0" y2="-92" stroke="#AEB7BD" stroke-width="1.6"/>
      <path d="M -3 -20 L -3 -80" stroke="#FFFFFF" stroke-width="1.4" opacity="0.7"/>`,
    pedang_kayu: () => `
      <rect x="-3" y="-4" width="6" height="14" rx="2" fill="#5D3A1F" stroke="#141414" stroke-width="2"/>
      <rect x="-9" y="-9" width="18" height="6" rx="2" fill="#8D6E63" stroke="#141414" stroke-width="2"/>
      <path d="M -5.5 -9 L -5.5 -86 L 0 -98 L 5.5 -86 L 5.5 -9 Z" fill="#B98A5A" stroke="#141414" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M -2 -20 Q 1 -30 -1 -42" stroke="#8D6440" stroke-width="1.4" fill="none"/>`,
    // Perisai besar persegi melengkung (scutum), berpusat di tangan
    perisai: () => `
      <rect x="-26" y="-42" width="52" height="84" rx="8" fill="#B3261E" stroke="#141414" stroke-width="3.5"/>
      <rect x="-20" y="-36" width="40" height="72" rx="5" fill="none" stroke="#E0B400" stroke-width="3"/>
      <path d="M -26 -42 Q -30 0 -26 42" stroke="#7E1A14" stroke-width="4" fill="none"/>
      <circle cx="0" cy="0" r="9" fill="#E0B400" stroke="#141414" stroke-width="2.6"/>
      <path d="M 0 -36 L 0 -10 M 0 10 L 0 36" stroke="#E0B400" stroke-width="3"/>`,
    // Trisula (tombak bermata tiga), ujung ke atas
    trisula: () => `
      <line x1="0" y1="70" x2="0" y2="-96" stroke="#8D6E63" stroke-width="5" stroke-linecap="round"/>
      <path d="M -14 -96 L 14 -96 M -14 -96 L -14 -118 M 0 -96 L 0 -126 M 14 -96 L 14 -118" stroke="#C9CED2" stroke-width="4" stroke-linecap="round"/>
      <path d="M -14 -96 L 14 -96" stroke="#141414" stroke-width="1.2"/>
      <path d="M -17 -114 L -14 -122 L -11 -114 M -3 -122 L 0 -130 L 3 -122 M 11 -114 L 14 -122 L 17 -114" fill="#C9CED2" stroke="#141414" stroke-width="1.6"/>`,
    // Jaring bulat (berputar mengikuti sudut)
    jaring: () => {
      const cy = -40, rx = 44, ry = 22;
      const jari = Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return `M 0 ${cy} L ${(Math.cos(a) * rx).toFixed(1)} ${(cy + Math.sin(a) * ry).toFixed(1)}`; }).join(' ');
      const berat = Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2 + 0.31; return `<circle cx="${(Math.cos(a) * rx).toFixed(1)}" cy="${(cy + Math.sin(a) * ry).toFixed(1)}" r="2.6" fill="#4A4A4A" stroke="#141414" stroke-width="1"/>`; }).join('');
      return `
      <path d="M 0 0 Q 4 -20 0 ${cy}" stroke="#B08A5A" stroke-width="2.4" fill="none"/>
      <ellipse cx="0" cy="${cy}" rx="${rx}" ry="${ry}" fill="rgba(222,205,160,0.28)" stroke="#9C7B4F" stroke-width="2.6"/>
      <ellipse cx="0" cy="${cy}" rx="${rx * 0.62}" ry="${ry * 0.62}" fill="none" stroke="#9C7B4F" stroke-width="1.6"/>
      <ellipse cx="0" cy="${cy}" rx="${rx * 0.3}" ry="${ry * 0.3}" fill="none" stroke="#9C7B4F" stroke-width="1.4"/>
      <path d="${jari}" stroke="#9C7B4F" stroke-width="1.4" fill="none"/>
      ${berat}`;
    },
    daun_palem: () => `
      <path d="M 0 6 Q 4 -30 -4 -70" stroke="#4E7A2E" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      ${[-60, -48, -36, -24, -12].map((y, i) => `<path d="M ${-2 + i * 0.6} ${y} q -18 -4 -24 4 M ${-1 + i * 0.6} ${y} q 18 -4 24 4" stroke="#6FA33A" stroke-width="4.5" fill="none" stroke-linecap="round"/>`).join('')}`,
    kantong_koin: () => `
      <path d="M -14 -4 Q -18 22 0 24 Q 18 22 14 -4 Q 6 -10 0 -6 Q -6 -10 -14 -4 Z" fill="#8D6E63" stroke="#141414" stroke-width="2.6"/>
      <path d="M -8 -6 Q 0 -2 8 -6" stroke="#E0B400" stroke-width="2.4" fill="none"/>
      <circle cx="10" cy="-12" r="5" fill="#E0B400" stroke="#141414" stroke-width="1.8"/>
      <circle cx="-6" cy="-14" r="4" fill="#E0B400" stroke="#141414" stroke-width="1.8"/>`,
    senter: () => `
      <polygon points="30,-14 170,-62 170,40 30,2" fill="#FFF3B0" opacity="0.28"/>
      <g transform="rotate(-8)">
        <rect x="-6" y="-7" width="30" height="13" rx="3" fill="#37474F" stroke="#141414" stroke-width="3"/>
        <rect x="22" y="-10" width="9" height="19" rx="2" fill="#546E7A" stroke="#141414" stroke-width="3"/>
        <rect x="30" y="-8" width="3" height="15" fill="#FFF59D"/>
      </g>`,
    gunting: () => `
      <g transform="rotate(-50)">
        <path d="M 0 -4 L 46 -9 L 46 -5 L 2 2 Z" fill="#CFD8DC" stroke="#141414" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M 0 4 L 46 9 L 46 5 L 2 -2 Z" fill="#B0BEC5" stroke="#141414" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="2" cy="0" r="2.5" fill="#141414"/>
        <ellipse cx="-12" cy="-8" rx="9" ry="6" fill="none" stroke="#E53935" stroke-width="4.5"/>
        <ellipse cx="-12" cy="8" rx="9" ry="6" fill="none" stroke="#E53935" stroke-width="4.5"/>
      </g>`,
    tongkat: () => `<line x1="0" y1="-120" x2="0" y2="78" stroke="#8D6E63" stroke-width="6" stroke-linecap="round"/><line x1="0" y1="-120" x2="0" y2="78" stroke="#141414" stroke-width="1.5" stroke-linecap="round" opacity="0.4"/>`,
    palu: () => `
      <line x1="0" y1="8" x2="0" y2="-50" stroke="#8D6E63" stroke-width="6" stroke-linecap="round"/>
      <rect x="-14" y="-66" width="28" height="18" rx="3" fill="#78909C" stroke="#141414" stroke-width="3"/>`,
    kartu_absen: () => `
      <g transform="rotate(-10)">
        <rect x="-6" y="-46" width="28" height="44" rx="2" fill="#F5F0DC" stroke="#141414" stroke-width="2.8"/>
        <rect x="-6" y="-46" width="28" height="7" fill="#4FA3D1"/>
        <line x1="-2" y1="-32" x2="18" y2="-32" stroke="#4FA3D1" stroke-width="1.6"/>
        <line x1="-2" y1="-25" x2="18" y2="-25" stroke="#4FA3D1" stroke-width="1.6"/>
        <line x1="-2" y1="-18" x2="18" y2="-18" stroke="#4FA3D1" stroke-width="1.6"/>
        <line x1="8" y1="-39" x2="8" y2="-4" stroke="#4FA3D1" stroke-width="1.6"/>
      </g>`,
    // ===== v10: busur panjang Jepang (yumi) dan anak panah =====
    // Yumi: tidak simetris, pegangan (0,0) di sepertiga bawah. Ujung atas di y = -112, bawah di y = 58.
    // Talinya digambar oleh pose (karena mengikuti tangan yang menarik).
    yumi: () => `
      <path d="M -4 -112 C 24 -82 20 -22 0 0 C 14 24 12 44 -4 58" stroke="#141414" stroke-width="7.5" fill="none" stroke-linecap="round"/>
      <path d="M -4 -112 C 24 -82 20 -22 0 0 C 14 24 12 44 -4 58" stroke="#3A2626" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M -3 -108 C 19 -80 16 -26 1 -5" stroke="#8C5A5A" stroke-width="1.4" fill="none"/>
      <rect x="-1" y="-8" width="9" height="16" rx="2" fill="#E8352B" stroke="#141414" stroke-width="2" transform="rotate(-10 3 0)"/>
      <circle cx="-4" cy="-112" r="3" fill="#FFC91F" stroke="#141414" stroke-width="1.6"/>
      <circle cx="-4" cy="58" r="3" fill="#FFC91F" stroke="#141414" stroke-width="1.6"/>`,
    // Anak panah: ekor (bulu) di 0,0, ujung ke atas (sudut 90 = ke kanan).
    panah: () => `
      <line x1="0" y1="6" x2="0" y2="-92" stroke="#8D6440" stroke-width="3" stroke-linecap="round"/>
      <path d="M -4.5 -88 L 0 -104 L 4.5 -88 Z" fill="#C9CED2" stroke="#141414" stroke-width="2" stroke-linejoin="round"/>
      <path d="M 0 2 L -7 10 L -7 -6 L 0 -12 Z M 0 2 L 7 10 L 7 -6 L 0 -12 Z" fill="#FFFFFF" stroke="#141414" stroke-width="1.6" stroke-linejoin="round"/>
      <path d="M -6 -1 L 6 -1" stroke="#E8352B" stroke-width="2"/>`,
    // ===== v9: properti Jepang =====
    katana: () => `
      <rect x="-3.5" y="-4" width="7" height="30" rx="2.5" fill="#2B2B2B" stroke="#141414" stroke-width="2"/>
      <path d="M -3.5 2 L 3.5 6 M -3.5 10 L 3.5 14 M -3.5 18 L 3.5 22" stroke="#F2F2F2" stroke-width="1.6"/>
      <ellipse cx="0" cy="-6" rx="10" ry="3.2" fill="#C9A227" stroke="#141414" stroke-width="2"/>
      <path d="M -3 -8 Q -6 -70 4 -132 L 7 -126 Q 2 -70 4 -8 Z" fill="#E3E8EB" stroke="#141414" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M 0 -14 Q -2 -70 5 -122" stroke="#FFFFFF" stroke-width="1.3" fill="none" opacity="0.8"/>`,
    tombak: () => `
      <line x1="0" y1="80" x2="0" y2="-104" stroke="#6D4C41" stroke-width="5" stroke-linecap="round"/>
      <path d="M -5 -104 L 0 -140 L 5 -104 Z" fill="#C9CED2" stroke="#141414" stroke-width="2.4" stroke-linejoin="round"/>
      <rect x="-4" y="-107" width="8" height="8" rx="1" fill="#2B2B2B" stroke="#141414" stroke-width="1.6"/>`,
    // Pikulan sebagai tongkat (dipegang di tengah). _3, _2, _1 = sudah terpotong katana (ujung patah).
    pikulan: () => pikulanProp(150, false),
    pikulan_3: () => pikulanProp(112, true),
    pikulan_2: () => pikulanProp(76, true),
    pikulan_1: () => pikulanProp(30, true),
    // Pikulan melintang di bahu dengan dua keranjang sayur (pakai pose "pikul").
    pikulan_keranjang: (t) => {
      const g = Math.sin(t * 5) * 3;
      const keranjang = (x) => `
        <path d="M ${x} 0 L ${x - 12} 34 M ${x} 0 L ${x + 12} 34" stroke="#8D6E63" stroke-width="2"/>
        <path d="M ${x - 6} 30 Q ${x - 2} 14 ${x + 2} 30 Z" fill="#5CC23A" stroke="#141414" stroke-width="1.8"/>
        <ellipse cx="${x + 6}" cy="30" rx="4" ry="9" fill="#F4F1EA" stroke="#141414" stroke-width="1.8" transform="rotate(20 ${x + 6} 30)"/>
        <path d="M ${x - 18} 32 L ${x + 18} 32 L ${x + 14} 54 L ${x - 14} 54 Z" fill="#E8B866" stroke="#141414" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M ${x - 16} 39 L ${x + 16} 39 M ${x - 15} 46 L ${x + 15} 46" stroke="#9C7B4F" stroke-width="1.6"/>`;
      return `<line x1="-80" y1="0" x2="80" y2="0" stroke="#141414" stroke-width="8" stroke-linecap="round"/>
        <line x1="-79" y1="0" x2="79" y2="0" stroke="#E0A764" stroke-width="4.5" stroke-linecap="round"/>
        ${keranjang(-66 + g)}${keranjang(66 - g)}`;
    },
    lobak: () => `
      <path d="M -2 -2 Q -10 -18 -6 -26 M 0 -2 Q 0 -22 4 -28 M 2 -2 Q 10 -16 12 -22" stroke="#4E7A2E" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M -7 0 Q -9 30 0 48 Q 9 30 7 0 Z" fill="#F4F1EA" stroke="#141414" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M -3 14 L 2 15 M -2 26 L 3 27" stroke="#C9C2B0" stroke-width="1.4"/>`,
    gulungan_peta: () => `
      <rect x="-28" y="-8" width="56" height="16" rx="8" fill="#EFE3C2" stroke="#141414" stroke-width="2.4"/>
      <ellipse cx="-28" cy="0" rx="4" ry="8" fill="#8D6440" stroke="#141414" stroke-width="2"/>
      <ellipse cx="28" cy="0" rx="4" ry="8" fill="#8D6440" stroke="#141414" stroke-width="2"/>
      <rect x="-3" y="-9" width="6" height="18" fill="#C62828" stroke="#141414" stroke-width="1.6"/>`,
    gulungan_sumpah: () => `
      <rect x="-20" y="-66" width="40" height="62" fill="#F4ECD8" stroke="#141414" stroke-width="2.4"/>
      <rect x="-24" y="-70" width="48" height="7" rx="3" fill="#8D6440" stroke="#141414" stroke-width="2"/>
      <rect x="-24" y="-8" width="48" height="7" rx="3" fill="#8D6440" stroke="#141414" stroke-width="2"/>
      ${[-11, -2, 7].map((x) => `<path d="M ${x} -58 L ${x} -30 M ${x - 2} -52 L ${x + 2} -51 M ${x - 2} -42 L ${x + 2} -40" stroke="#2B2B2B" stroke-width="2" stroke-linecap="round"/>`).join('')}
      <circle cx="10" cy="-18" r="5" fill="#C62828" opacity="0.85"/>`,
    kuas: () => `
      <line x1="0" y1="2" x2="0" y2="-38" stroke="#8D6440" stroke-width="4" stroke-linecap="round"/>
      <path d="M -3.5 2 Q 0 20 3.5 2 Z" fill="#141414"/>`,
    makibishi_genggam: () => [[-6, -4], [4, -6], [0, 2], [8, 0]].map(([x, y]) => pakuBesi(x, y, 0.9)).join(''),
    kain: (t) => `<path d="M 0 -4 L 40 ${-10 + Math.sin(t * 5) * 3} L 44 ${16 + Math.sin(t * 5 + 1) * 3} L 2 10 Z" fill="#3a6fb0" stroke="#141414" stroke-width="2.4" stroke-linejoin="round"/>`
  };

  // ===== Atribut tambahan (bisa dipakai kostum apa saja) =====
  // lapis 'bawahWajah' = sebelum ekspresi (jenggot), 'kepala' = di atas rambut, 'badan' = di atas baju.
  // Jenggot panjang bertingkat (dipakai untuk menunjukkan waktu berlalu): n = 2..4.
  const jenggotPanjang = (n) => {
    const p = 56 + n * 34; // ujung jenggot (koordinat kepala)
    return `<path d="M -44 2 Q -50 ${p * 0.6} -14 ${p} Q 0 ${p + 14} 14 ${p} Q 50 ${p * 0.6} 44 2 Q 34 26 22 20 Q 10 30 0 28 Q -10 30 -22 20 Q -34 26 -44 2 Z" fill="#1E1A18" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>
      <path d="M -10 34 Q -14 ${p * 0.7} -6 ${p - 10} M 10 34 Q 14 ${p * 0.7} 6 ${p - 10}" stroke="#3A322C" stroke-width="2.2" fill="none"/>`;
  };
  const ATRIBUT = {
    jenggot_2: { lapis: 'bawahWajah', render: () => jenggotPanjang(2) },
    jenggot_3: { lapis: 'bawahWajah', render: () => jenggotPanjang(3) },
    jenggot_4: { lapis: 'bawahWajah', render: () => jenggotPanjang(4) },
    ransel_penjelajah: { lapis: 'punggung', render: (w, h) => `
      <g transform="translate(${-w / 2 + 2}, 12)">
        <rect x="-8" y="6" width="23" height="${Math.max(34, h * 0.62)}" rx="7" fill="#805A39" stroke="#141414" stroke-width="3.5"/>
        <path d="M -4 17 Q 4 11 12 17 L 11 34 L -3 34 Z" fill="#B7864C" stroke="#141414" stroke-width="2.5"/>
        <path d="M -6 12 L 12 12 M -7 45 L 14 45" stroke="#D5B477" stroke-width="2.5"/>
      </g>` },
    helm_penjelajah: { lapis: 'kepala', render: () => `
      <path d="M -47 -10 C -48 -45 -32 -56 0 -57 C 32 -56 48 -45 47 -10 L 38 -7 C 30 -28 -30 -28 -38 -7 Z" fill="#59634A" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      <path d="M -50 -10 Q 0 -19 50 -10 L 47 -3 Q 0 4 -47 -3 Z" fill="#454C3B" stroke="#141414" stroke-width="3.5"/>
      <rect x="-12" y="-29" width="24" height="12" rx="3" fill="#D9B66D" stroke="#141414" stroke-width="2.5"/>
      <circle cx="0" cy="-23" r="4" fill="#FFF2AE" stroke="#FFF8D6" stroke-width="2"/>
      <path d="M 0 -19 L 0 19 L 24 31 L 48 38" stroke="#FFF2AE" stroke-width="1.8" opacity="0.35" fill="none"/>` },
    // Mahkota daun salam (penyelenggara pertandingan / bangsawan)
    mahkota_daun: { lapis: 'kepala', render: () => `
      <path d="M -40 -22 Q 0 -36 40 -22" stroke="#4E7A2E" stroke-width="3" fill="none"/>
      ${[-36, -26, -16, -6, 6, 16, 26, 36].map((x, i) => { const y = -22 - Math.cos(x / 40 * 1.3) * 10; const r = x < 0 ? -35 : 35; return `<ellipse cx="${x}" cy="${y.toFixed(1)}" rx="7" ry="3.6" fill="${i % 2 ? '#6FA33A' : '#5B8C2E'}" stroke="#2F4A1A" stroke-width="1.4" transform="rotate(${r} ${x} ${y.toFixed(1)})"/>`; }).join('')}` },
    // Helm perunggu terbuka dengan jambul merah (wajah tetap terlihat)
    helm_gladiator: { lapis: 'kepala', render: () => `<g transform="translate(0, -15)">
      <path d="M -46 -8 C -48 -50, 48 -50, 46 -8 L 40 -8 C 38 -36, -38 -36, -40 -8 Z" fill="#C9A227" stroke="#141414" stroke-width="3.6" stroke-linejoin="round"/>
      <path d="M -54 -8 Q 0 -2 54 -8 L 50 -2 Q 0 4 -50 -2 Z" fill="#B08A1E" stroke="#141414" stroke-width="3"/>
      <path d="M -12 -44 Q 0 -78 14 -44 Z" fill="#C62828" stroke="#141414" stroke-width="3"/>
      <path d="M -8 -48 Q -2 -70 2 -46 M 2 -48 Q 6 -68 10 -46" stroke="#E57373" stroke-width="2" fill="none"/>
      <path d="M -40 -8 L -42 14 Q -36 18 -32 10 L -32 -8 Z" fill="#C9A227" stroke="#141414" stroke-width="3"/>
      <path d="M 40 -8 L 42 14 Q 36 18 32 10 L 32 -8 Z" fill="#C9A227" stroke="#141414" stroke-width="3"/></g>` },
    // Helm secutor: menutup seluruh kepala, hanya dua lubang mata kecil
    helm_secutor: { lapis: 'kepala', render: () => `
      <ellipse cx="0" cy="-4" rx="48" ry="50" fill="#BFC5CA" stroke="#141414" stroke-width="4.5"/>
      <path d="M 0 -54 Q 6 -30 0 -4" stroke="#8C9297" stroke-width="5" fill="none"/>
      <path d="M -2 -56 Q 0 -66 4 -56" fill="#8C9297" stroke="#141414" stroke-width="2.4"/>
      <circle cx="-15" cy="-3" r="6.5" fill="#141414"/><circle cx="15" cy="-3" r="6.5" fill="#141414"/>
      <circle cx="-14" cy="-3" r="2.2" fill="#FFFFFF"/><circle cx="16" cy="-3" r="2.2" fill="#FFFFFF"/>
      <path d="M -30 26 Q 0 40 30 26" stroke="#8C9297" stroke-width="3" fill="none"/>
      <circle cx="-30" cy="10" r="2.5" fill="#8C9297"/><circle cx="30" cy="10" r="2.5" fill="#8C9297"/>` },
    // v10: tabung anak panah di punggung (bulu panah terlihat di atas bahu kiri).
    tabung_panah: { lapis: 'punggung', render: (w) => `
      <g transform="translate(${-w / 2 - 4}, 6) rotate(-32)">
        ${[-6, 0, 6].map((x, i) => `<line x1="${x}" y1="-2" x2="${x}" y2="-30" stroke="#8D6440" stroke-width="2.4"/><path d="M ${x - 4} -24 L ${x} -36 L ${x + 4} -24 Z" fill="${i % 2 ? '#FFFFFF' : '#E8352B'}" stroke="#141414" stroke-width="1.6" stroke-linejoin="round"/>`).join('')}
        <rect x="-11" y="-4" width="22" height="66" rx="5" fill="#2B2E3A" stroke="#141414" stroke-width="3"/>
        <rect x="-11" y="10" width="22" height="6" fill="#FFC91F" stroke="#141414" stroke-width="1.8"/>
        <rect x="-11" y="44" width="22" height="6" fill="#FFC91F" stroke="#141414" stroke-width="1.8"/>
      </g>` },
    // v9: caping bambu (pedagang). Pinggir bawah di atas alis, jadi ekspresi tetap terlihat.
    caping: { lapis: 'kepala', render: () => `
      <path d="M -30 -16 Q -40 20 -26 36 M 30 -16 Q 40 20 26 36" stroke="#8D6E63" stroke-width="2" fill="none"/>
      <path d="M -80 -18 Q 0 -88 80 -18 Q 0 -27 -80 -18 Z" fill="#F5CD6E" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      <path d="M 0 -56 L -44 -24 M 0 -56 L -16 -22 M 0 -56 L 16 -22 M 0 -56 L 44 -24" stroke="#B8924A" stroke-width="2.4" fill="none"/>
      <circle cx="0" cy="-56" r="4" fill="#B8924A" stroke="#141414" stroke-width="2"/>` },
    jenggot:     { lapis: 'bawahWajah', render: () => `<path d="M -42 4 Q -46 48 0 56 Q 46 48 42 4 Q 34 26 22 20 Q 10 30 0 28 Q -10 30 -22 20 Q -34 26 -42 4 Z" fill="#1E1A18" stroke="#141414" stroke-width="3" stroke-linejoin="round"/>` },
    ikat_kepala: { lapis: 'kepala', render: () => `<path d="M -43 -12 Q 0 -24 43 -12 L 41 -22 Q 0 -34 -41 -22 Z" fill="#E53935" stroke="#141414" stroke-width="3" stroke-linejoin="round"/><path d="M 40 -18 L 54 -26 L 52 -12 Z" fill="#E53935" stroke="#141414" stroke-width="2.5" stroke-linejoin="round"/>` },
    topi_satpam: { lapis: 'kepala', render: () => `
      <path d="M -44 -20 C -44 -56, 44 -56, 44 -20 Z" fill="#1F2A3A" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      <path d="M -48 -20 Q 0 -12 50 -20 Q 34 -8 -46 -16 Z" fill="#111821" stroke="#141414" stroke-width="3.5"/>
      <path d="M -6 -42 L 0 -48 L 6 -42 L 4 -32 L -4 -32 Z" fill="#FFD54F" stroke="#141414" stroke-width="2"/>` },
    kacamata:    { lapis: 'kepala', render: () => `<g fill="rgba(255,255,255,0.15)" stroke="#141414" stroke-width="3"><circle cx="-15" cy="-3" r="11"/><circle cx="15" cy="-3" r="11"/></g><line x1="-4" y1="-4" x2="4" y2="-4" stroke="#141414" stroke-width="3"/>` },
    topi_koboi: { lapis: 'kepala', render: () => `
      <path d="M -64 -18 Q 0 -31 64 -18 Q 40 1 0 -3 Q -40 1 -64 -18 Z" fill="#6F4328" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      <path d="M -34 -19 C -36 -52 -28 -60 0 -60 C 28 -60 36 -52 34 -19 Z" fill="#8D5A36" stroke="#141414" stroke-width="4" stroke-linejoin="round"/>
      <path d="M -33 -28 Q 0 -34 33 -28 L 32 -21 Q 0 -27 -32 -21 Z" fill="#C98D4E" stroke="#141414" stroke-width="2.5"/>` },
    rompi_kulit: { lapis: 'badan', render: (w, h) => `
      <path d="M ${-w / 2 + 5} 3 L -12 7 L -5 16 L -13 ${h - 4} L ${-w / 2 + 12} ${h - 2} Z" fill="#79502E" stroke="#141414" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M ${w / 2 - 5} 3 L 12 7 L 5 16 L 13 ${h - 4} L ${w / 2 - 12} ${h - 2} Z" fill="#79502E" stroke="#141414" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M -12 8 L -5 16 M 12 8 L 5 16" stroke="#C98D4E" stroke-width="2.4" fill="none"/>
      <circle cx="-20" cy="${h * 0.48}" r="2" fill="#E0B97A"/><circle cx="20" cy="${h * 0.48}" r="2" fill="#E0B97A"/>` },
    tali_id:     { lapis: 'badan', render: (w, h) => `<path d="M -12 0 L -14 ${h * 0.62} M 12 0 L -4 ${h * 0.62}" stroke="#1565C0" stroke-width="2.6" fill="none"/><rect x="-20" y="${h * 0.62}" width="15" height="19" rx="2" fill="#FFFFFF" stroke="#141414" stroke-width="2.2"/><rect x="-17" y="${h * 0.62 + 3}" width="9" height="7" fill="#90CAF9"/>` }
  };

  // ===== Efek komik di sekitar karakter (bergerak mengikuti waktu) =====
  // 'kepala' digambar relatif ke kepala, 'lantai' relatif ke lantai.
  // v8: angka acak yang selalu sama untuk seed + indeks yang sama (bentuk efek beda tiap benturan).
  const acak = (seed, i) => { const x = Math.sin(seed * 127.1 + i * 311.7 + 0.5) * 43758.5453; return x - Math.floor(x); };
  const bintangAcak = (seed, n, rLuar, rDalam) => Array.from({ length: n * 2 }, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2 + acak(seed, 99) * 0.6;
    const r = i % 2 ? rDalam * (0.8 + acak(seed, i) * 0.4) : rLuar * (0.65 + acak(seed, i) * 0.55);
    return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(' ');
  const EFEK = {
    // Kilat benturan gaya komik di depan tangan kanan (lapis 'depan' = koordinat badan).
    // v8: seedEfek > 0 = bentuk duri acak (beda tiap benturan).
    benturan: { lapis: 'depan', render: (t, w, seed = 0) => {
      const s = 0.85 + Math.abs(Math.sin(t * 22)) * 0.3;
      if (seed) return `<g transform="translate(${w / 2 + 52}, 16) scale(${s.toFixed(2)}) rotate(${(acak(seed, 7) * 40 - 20).toFixed(1)})"><polygon points="${bintangAcak(seed, 8, 36, 14)}" fill="#FFD54F" stroke="#141414" stroke-width="3" stroke-linejoin="round"/><polygon points="${bintangAcak(seed + 3, 8, 20, 8)}" fill="#FFFFFF"/></g>`;
      const pts = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; const r = i % 2 ? 14 : 34; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(' ');
      const pts2 = Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2 + 0.2; const r = i % 2 ? 8 : 20; return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(' ');
      return `<g transform="translate(${w / 2 + 52}, 16) scale(${s.toFixed(2)})"><polygon points="${pts}" fill="#FFD54F" stroke="#141414" stroke-width="3" stroke-linejoin="round"/><polygon points="${pts2}" fill="#FFFFFF"/></g>`;
    } },
    // Zzz tidur: huruf Z melayang naik ke kanan atas kepala lalu memudar
    zzz: { lapis: 'kepala', render: (t) => [0, 1, 2].map((i) => {
      const p = ((t * 0.7) + i / 3) % 1;
      const x = 20 + p * 18 + Math.sin(p * 6) * 6, y = -46 - p * 80, s = 0.7 + p * 0.8;
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="'Segoe UI Black', 'Arial Black', sans-serif" font-weight="900" font-size="${(22 * s).toFixed(1)}" fill="#FFFFFF" stroke="#141414" stroke-width="${(4 * s).toFixed(1)}" paint-order="stroke" opacity="${(p < 0.8 ? 1 : (1 - p) / 0.2).toFixed(2)}" transform="rotate(-12 ${x.toFixed(1)} ${y.toFixed(1)})">Z</text>`;
    }).join('') },
    // Jejak tebasan pedang: busur putih memudar di depan badan (lapis 'depan')
    jejak_tebasan: { lapis: 'depan', render: (t, w) => {
      const cx = w / 2 + 6, cy = -6, r = 92;
      const a0 = -150 * Math.PI / 180, a1 = 10 * Math.PI / 180;
      const p = (a) => `${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
      const q = (a) => `${(cx + Math.cos(a) * (r - 26)).toFixed(1)} ${(cy + Math.sin(a) * (r - 26)).toFixed(1)}`;
      return `<path d="M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)} L ${q(a1)} A ${r - 26} ${r - 26} 0 0 0 ${q(a0)} Z" fill="rgba(255,255,255,0.75)" stroke="rgba(255,255,255,0.0)"/>
              <path d="M ${p(a0)} A ${r} ${r} 0 0 1 ${p(a1)}" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    } },
    // Garis kecepatan di belakang badan (lapis 'belakang')
    garis_cepat: { lapis: 'belakang', render: (t, w) => [-10, 12, 34, 56].map((y, i) => {
      const g = (t * 6 + i * 0.3) % 1;
      return `<line x1="${-w / 2 - 20 - g * 20}" y1="${y}" x2="${-w / 2 - 80 - g * 30}" y2="${y}" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="${(0.9 - g * 0.6).toFixed(2)}"/>`;
    }).join('') },
    keringat: { lapis: 'kepala', render: (t) => {
      const d = (k) => { const p = ((t * 1.4 + k) % 1); return { y: -26 + p * 30, o: p < 0.85 ? 1 : (1 - p) / 0.15 }; };
      const a = d(0), b = d(0.5);
      return `<path d="M 40 ${a.y - 9} Q 45 ${a.y} 40 ${a.y + 4} Q 35 ${a.y} 40 ${a.y - 9} Z" fill="#4FC3F7" stroke="#141414" stroke-width="2" opacity="${a.o.toFixed(2)}"/>
              <path d="M -42 ${b.y - 7} Q -38 ${b.y} -42 ${b.y + 3} Q -46 ${b.y} -42 ${b.y - 7} Z" fill="#4FC3F7" stroke="#141414" stroke-width="2" opacity="${b.o.toFixed(2)}"/>`;
    } },
    garis_kaget: { lapis: 'kepala', render: (t) => {
      const g = 4 + Math.sin(t * 30) * 2;
      return [[-58, -40, -48, -30], [-30, -66, -24, -54], [0, -72, 0, -60], [30, -66, 24, -54], [58, -40, 48, -30]]
        .map(([a, b, c, d]) => `<line x1="${a * (1 + g / 60)}" y1="${b * (1 + g / 60)}" x2="${c}" y2="${d}" stroke="#141414" stroke-width="4" stroke-linecap="round"/>`).join('');
    } },
    seru: { lapis: 'kepala', render: (t) => { const s = 1 + Math.max(0, Math.sin(t * 8)) * 0.12;
      return `<g transform="translate(46, -62) scale(${s.toFixed(2)})"><path d="M -5 -26 L 5 -26 L 3 4 L -3 4 Z" fill="#E53935" stroke="#141414" stroke-width="2.5" stroke-linejoin="round"/><circle cx="0" cy="13" r="5" fill="#E53935" stroke="#141414" stroke-width="2.5"/></g>`; } },
    tanya: { lapis: 'kepala', render: (t) => { const r = Math.sin(t * 3) * 8;
      return `<g transform="translate(48, -64) rotate(${r.toFixed(1)})"><text x="0" y="0" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="34" text-anchor="middle" fill="#FFFFFF" stroke="#141414" stroke-width="3" paint-order="stroke">?</text></g>`; } },
    pusing: { lapis: 'kepala', render: (t) => [0, 2.1, 4.2].map((k) => {
      const a = t * 4 + k, x = Math.cos(a) * 40, y = -52 + Math.sin(a) * 9;
      return `<path transform="translate(${x.toFixed(1)}, ${y.toFixed(1)}) scale(0.9)" d="M 0 -8 L 2.4 -2.4 L 8 -2 L 3.6 1.8 L 5 8 L 0 4.6 L -5 8 L -3.6 1.8 L -8 -2 L -2.4 -2.4 Z" fill="#FFD54F" stroke="#141414" stroke-width="1.8" stroke-linejoin="round"/>`;
    }).join('') },
    // ===== v8: efek benturan sekali jalan (tAksi = detik sejak benturan, seedEfek = variasi) =====
    hantam: { lapis: 'depan', render: (t, w, seed = 1, ta = 0) => {
      if (ta < 0 || ta > 0.26) return '';
      const s = ta < 0.04 ? (ta / 0.04) * 1.25 : 1.25 - (ta - 0.04) / 0.22 * 1.1;
      const warna = ['#FFD54F', '#FFFFFF', '#FFB74D'][Math.floor(acak(seed, 5) * 3)];
      const n = 7 + Math.floor(acak(seed, 6) * 5);
      const garis = Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 + acak(seed, 20 + i); const r1 = 46 * s, r2 = (70 + acak(seed, 30 + i) * 30) * s;
        return `<line x1="${(Math.cos(a) * r1).toFixed(1)}" y1="${(Math.sin(a) * r1).toFixed(1)}" x2="${(Math.cos(a) * r2).toFixed(1)}" y2="${(Math.sin(a) * r2).toFixed(1)}" stroke="#141414" stroke-width="4" stroke-linecap="round"/>`; }).join('');
      return `<g transform="translate(${(w / 2 + 50 + acak(seed, 8) * 16 - 8).toFixed(1)}, ${(12 + acak(seed, 9) * 16 - 8).toFixed(1)}) rotate(${(acak(seed, 10) * 60).toFixed(1)})">${garis}<g transform="scale(${Math.max(0, s).toFixed(2)})"><polygon points="${bintangAcak(seed, n, 44, 16)}" fill="${warna}" stroke="#141414" stroke-width="3.5" stroke-linejoin="round"/><polygon points="${bintangAcak(seed + 2, n, 22, 9)}" fill="#FFFFFF"/></g></g>`;
    } },
    serpihan: { lapis: 'depan', render: (t, w, seed = 1, ta = 0) => {
      if (ta < 0 || ta > 0.7) return '';
      return Array.from({ length: 8 }, (_, i) => {
        const vx = (acak(seed, i) * 2 - 0.4) * 160, vy = -(120 + acak(seed, i + 10) * 160), g = 620;
        const x = w / 2 + 44 + vx * ta, y = 10 + vy * ta + 0.5 * g * ta * ta, r = (acak(seed, i + 20) * 2 - 1) * 900 * ta;
        const L = 6 + acak(seed, i + 30) * 10;
        return `<rect x="${(-L / 2).toFixed(1)}" y="-2.5" width="${L.toFixed(1)}" height="5" rx="1.5" fill="${i % 2 ? '#B98A5A' : '#8D6440'}" stroke="#141414" stroke-width="1.6" transform="translate(${x.toFixed(1)}, ${y.toFixed(1)}) rotate(${r.toFixed(0)})" opacity="${(ta < 0.55 ? 1 : (0.7 - ta) / 0.15).toFixed(2)}"/>`;
      }).join('');
    } },
    retak: { lapis: 'lantai', render: (ta, w, seed = 1) => {
      if (ta < 0) return '';
      const k = Math.min(1, ta / 0.12);
      return Array.from({ length: 5 }, (_, i) => {
        const a = Math.PI + (i / 4) * Math.PI + (acak(seed, i) - 0.5) * 0.4, L = (34 + acak(seed, i + 5) * 40) * k;
        const mx = Math.cos(a) * L * 0.5 + (acak(seed, i + 9) - 0.5) * 10, my = Math.sin(a) * L * 0.18;
        return `<path d="M 0 0 L ${mx.toFixed(1)} ${my.toFixed(1)} L ${(Math.cos(a) * L).toFixed(1)} ${(Math.sin(a) * L * 0.3).toFixed(1)}" stroke="#141414" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      }).join('');
    } },
    debu_hantam: { lapis: 'lantai', render: (ta) => {
      if (ta < 0 || ta > 0.5) return '';
      const k = ta / 0.5;
      return Array.from({ length: 6 }, (_, i) => {
        const sd = i < 3 ? -1 : 1, j = i % 3;
        const x = sd * (24 + k * (50 + j * 18)), y = -4 - k * (6 + j * 7) - Math.sin(k * Math.PI) * 6, r = 8 + k * (10 + j * 4);
        return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#D9CBB4" stroke="#141414" stroke-width="2" opacity="${(0.95 * (1 - k)).toFixed(2)}"/>`;
      }).join('');
    } },
    // v10: anak panah menancap di lantai/genteng satu per satu (tiap 0,08 detik), lalu tetap.
    panah_menancap: { lapis: 'lantai', render: (ta, w, seed = 1) => Array.from({ length: 7 }, (_, i) => {
      const muncul = i * 0.08;
      if (ta < muncul) return '';
      const x = (acak(seed, i) * 2 - 1) * 90, r = -25 + acak(seed, i + 7) * 20, goyang = Math.exp(-(ta - muncul) * 14) * Math.sin((ta - muncul) * 60) * 6;
      return `<g transform="translate(${x.toFixed(1)}, ${(acak(seed, i + 14) * 6).toFixed(1)}) rotate(${(r + goyang).toFixed(1)})">
        <line x1="0" y1="0" x2="0" y2="-46" stroke="#8D6440" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M 0 -42 L -6 -36 L -6 -50 L 0 -56 Z M 0 -42 L 6 -36 L 6 -50 L 0 -56 Z" fill="#FFFFFF" stroke="#141414" stroke-width="1.4" stroke-linejoin="round"/>
        <path d="M -5 -46 L 5 -46" stroke="#E8352B" stroke-width="1.8"/>
        <ellipse cx="0" cy="1" rx="6" ry="2" fill="rgba(0,0,0,0.25)"/></g>`;
    }).join('') },
    // v9: paku besi (makibishi) berserakan di lantai, tetap di tempat.
    makibishi: { lapis: 'lantai', render: (ta, w, seed = 1) => Array.from({ length: 9 }, (_, i) =>
      pakuBesi((acak(seed, i) * 2 - 1) * 80, -1 + acak(seed, i + 9) * 6, 1.1, acak(seed, i + 18) * 90)).join('') },
    debu: { lapis: 'lantai', render: (t) => [-1, 1].map((sd) => [0, 0.33, 0.66].map((k) => {
      const p = (t * 1.6 + k) % 1, r = 7 + p * 14, x = sd * (26 + p * 34), y = -6 - p * 10;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#D9CBB4" stroke="#141414" stroke-width="2" opacity="${(0.9 * (1 - p)).toFixed(2)}"/>`;
    }).join('')).join('') }
  };

  // ===== Aksi badan (squash & stretch, lompat, pingsan) dari waktu aksi a (detik) =====
  const easeOut = (k) => 1 - Math.pow(1 - k, 3);
  const clamp01 = (k) => Math.max(0, Math.min(1, k));
  // v8: lewat sedikit lalu kembali (follow-through)
  const easeOutBack = (k, c = 1.4) => 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2);
  // v8: crouch = pinggul turun (px) sementara kaki tetap di lantai, jadi lutut menekuk sendiri;
  // slide = badan dan kaki terdorong menyamping (px).
  function aksiBadan(motion, a, t, dir) {
    const r = { sx: 1, sy: 1, hop: 0, hsx: 1, hsy: 1, htilt: 0, lean: 0, shake: 0, rot: 0, scale: 1, lift: 0, crouch: 0, slide: 0, kakiR: 0, kakiL: 0, pivot: 0, armSwing: 0 };
    if (motion === 'kaget') {
      // Antisipasi (jongkok sedikit) → melonjak, kepala memanjang → mendarat → tetap tegang.
      if (a < 0.08) { const k = a / 0.08; r.crouch = 10 * k; r.sy = 1 - 0.05 * k; r.hsy = 1 - 0.08 * k; r.hsx = 1 + 0.06 * k; }
      else if (a < 0.32) { const k = (a - 0.08) / 0.24; r.hop = 30 * Math.sin(k * Math.PI); r.sy = 1 + 0.1 * Math.sin(k * Math.PI); r.sx = 1 - 0.06 * Math.sin(k * Math.PI); r.hsy = 1.22 - 0.06 * k; r.hsx = 0.9; }
      else if (a < 0.44) { const k = (a - 0.32) / 0.12; r.sy = 1 - 0.1 * Math.sin(k * Math.PI); r.sx = 1 + 0.07 * Math.sin(k * Math.PI); r.hsy = 1.16; r.hsx = 0.92; }
      else { const d = a - 0.44, w = Math.exp(-d * 5) * Math.cos(d * 22); r.hsy = 1.12 + 0.05 * w; r.hsx = 0.93 - 0.03 * w; r.shake = Math.sin(t * 34) * 1.2; }
    } else if (motion === 'lompat') {
      // v8: ancang-ancang jongkok, melayang mengikuti parabola dengan lutut ditekuk, mendarat dengan lutut meredam.
      const p = (a % 0.72) / 0.72;
      if (p < 0.18) { const k = p / 0.18; r.crouch = 20 * Math.sin(k * Math.PI * 0.5) * (k < 0.85 ? 1 : (1 - k) / 0.15); r.hsy = 1 - 0.05 * k; r.hsx = 1 + 0.04 * k; }
      else if (p < 0.82) { const k = (p - 0.18) / 0.64; r.hop = 58 * 4 * k * (1 - k); r.lift = Math.sin(k * Math.PI); r.sy = 1 + 0.05 * Math.sin(k * Math.PI); r.hsy = 1.05; r.hsx = 0.97; }
      else { const k = (p - 0.82) / 0.18; r.crouch = 18 * Math.sin(k * Math.PI); r.hsy = 1 - 0.07 * Math.sin(k * Math.PI); r.hsx = 1 + 0.05 * Math.sin(k * Math.PI); }
    } else if (motion === 'pingsan') {
      // Kaku sebentar, lalu jatuh ke belakang (berlawanan arah hadap) dan memantul sekali.
      if (a < 0.25) { r.shake = Math.sin(t * 40) * 1.5; r.hsy = 1.08; }
      else { const k = clamp01((a - 0.25) / 0.38); const fall = k * k; const bounce = a > 0.63 ? Math.exp(-(a - 0.63) * 9) * Math.sin((a - 0.63) * 30) * 6 : 0;
        r.rot = -dir * (86 * fall + bounce); r.hop = 22 * fall; }
    } else if (motion === 'muncul') {
      const k = clamp01(a / 0.4); r.scale = k < 0.6 ? easeOut(k / 0.6) * 1.15 : 1.15 - 0.15 * easeOut((k - 0.6) / 0.4);
    } else if (motion === 'dorong') {
      r.lean = dir * 22; r.shake = Math.sin(t * 24) * 1.2; r.sy = 0.97 + Math.sin(t * 6) * 0.01;
    } else if (motion === 'gemetar') {
      r.shake = Math.sin(t * 46) * 2.4; r.hsy = 1.04; r.sy = 0.97;
    } else if (motion === 'bicara') {
      r.htilt = Math.sin(t * 3.1) * 4; r.hop = Math.abs(Math.sin(t * 6.3)) * 2; r.hsy = 1 + Math.abs(Math.sin(t * 6.3)) * 0.025;
    } else if (motion === 'lari') {
      r.lean = dir * 10;
    } else if (motion === 'seruduk') {
      r.lean = dir * 24;
    } else if (motion === 'siaga') {
      // Melompat-lompat kecil di tempat seperti petarung
      // v8: kuda-kuda: lutut menekuk dan memantul, berat badan bergeser (bukan melompat lurus seperti bidak).
      const b = Math.sin(t * 6);
      r.crouch = 9 + Math.abs(b) * 5; r.lean = dir * (5 + b * 2.5); r.htilt = -b * 1.5;
    } else if (motion === 'terpental') {
      // Kena hantaman: kepala memipih, badan terlempar ke belakang lalu pulih
      if (a < 0.12) { const k = a / 0.12; r.lean = -dir * 30 * k; r.hop = 14 * k; r.hsx = 1 + 0.12 * k; r.hsy = 1 - 0.12 * k; r.shake = Math.sin(t * 50) * 3; }
      else { const k = clamp01((a - 0.12) / 0.5); r.lean = -dir * (30 - 22 * easeOut(k)); r.hop = 14 * (1 - k) * (1 - k); r.hsx = 1.12 - 0.12 * k; r.hsy = 0.88 + 0.12 * k; }
    } else if (motion === 'meliuk') {
      // Meliuk ke belakang menghindari tebasan (kepala dan badan condong jauh ke belakang)
      const k = clamp01(a / 0.15);
      r.lean = -dir * 34 * k; r.htilt = -dir * 14 * k; r.sy = 1 - 0.06 * k;
    } else if (motion === 'menghindar') {
      // Menunduk menghindar
      const k = clamp01(a / 0.12);
      r.crouch = 30 * easeOutBack(k, 1.2); r.sy = 1 - 0.04 * k; r.lean = -dir * 14 * k; r.htilt = -dir * 8 * k;
    } else if (motion === 'sapu_kaki') {
      // v9: jongkok rendah, kaki kanan menyapu jauh ke depan, badan condong ke belakang.
      const k = easeOut(clamp01(a / 0.22));
      r.crouch = 34 * k; r.kakiR = 52 * k; r.kakiL = -12 * k; r.lean = -dir * 10 * k; r.htilt = -dir * 6 * k;
    } else if (motion === 'meluncur') {
      // v9: meluncur di genteng: badan condong ke belakang, kaki depan lurus, sedikit bergetar.
      r.crouch = 16; r.kakiR = 30; r.kakiL = -6; r.lean = -dir * 20; r.htilt = -dir * 10; r.shake = Math.sin(t * 40) * 1.2;
    } else if (motion === 'salto') {
      // v9: salto ke belakang: ancang-ancang, berputar 360 derajat di udara (lutut ditekuk), mendarat meredam.
      if (a < 0.1) { r.crouch = 18 * (a / 0.1); }
      else if (a < 0.6) { const k = (a - 0.1) / 0.5, e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        r.hop = 80 * 4 * k * (1 - k); r.rot = -dir * 360 * e; r.pivot = 95; r.lift = 1; }
      else { const d = a - 0.6, dd = Math.exp(-d * 7); r.crouch = 24 * dd; r.hsx = 1 + 0.1 * dd; r.hsy = 1 - 0.1 * dd; }
    } else if (motion === 'rebah') {
      const k = easeOut(clamp01(a / 0.55));
      r.rot = -dir * 90 * k; r.pivot = 62; r.hop = 5 * Math.sin(k * Math.PI);
      r.hsx = 1 + 0.06 * Math.sin(k * Math.PI); r.hsy = 1 - 0.04 * Math.sin(k * Math.PI);
    } else if (motion === 'telentang') {
      r.rot = -dir * 90; r.pivot = 62; r.hop = Math.sin(t * 2.4) * 1.5;
      r.htilt = Math.sin(t * 1.3) * 2;
    } else if (motion === 'duduk_dari_rebah') {
      const k = easeOut(clamp01(a / 0.45));
      r.rot = -dir * 90 * (1 - k); r.pivot = 62;
      r.hop = 5 * Math.sin(k * Math.PI); r.crouch = 32 * k;
      r.lean = dir * 8 * (1 - k);
    } else if (motion === 'bangun_dari_rebah') {
      const k = easeOut(clamp01(a / 0.8));
      r.rot = -dir * 90 * (1 - k); r.pivot = 62;
      r.hop = 7 * Math.sin(k * Math.PI); r.crouch = k < 0.72 ? 12 * Math.sin(k * Math.PI / 0.72) : 0;
      r.lean = dir * 12 * (1 - k);
    } else if (motion === 'jatuh' || motion === 'jatuh_terlentang') {
      const k = easeOut(clamp01((a - 0.08) / 0.42));
      const bounce = a > 0.5 ? Math.exp(-(a - 0.5) * 8) * Math.sin((a - 0.5) * 28) * 4 : 0;
      r.crouch = a < 0.08 ? 14 * (a / 0.08) : 0;
      r.rot = -dir * (86 * k + bounce); r.pivot = 62;
      r.hop = 14 * Math.sin(k * Math.PI) * (1 - k * 0.55);
      r.hsx = 1 + 0.08 * Math.sin(k * Math.PI); r.hsy = 1 - 0.07 * Math.sin(k * Math.PI);
    } else if (motion === 'jatuh_tersungkur') {
      const k = easeOut(clamp01((a - 0.06) / 0.36));
      const bounce = a > 0.42 ? Math.exp(-(a - 0.42) * 9) * Math.sin((a - 0.42) * 30) * 3 : 0;
      r.crouch = a < 0.06 ? 12 * (a / 0.06) : 0;
      r.rot = dir * (82 * k + bounce); r.pivot = 62;
      r.hop = 9 * Math.sin(k * Math.PI) * (1 - k * 0.6);
      r.hsx = 1 + 0.06 * Math.sin(k * Math.PI); r.hsy = 1 - 0.05 * Math.sin(k * Math.PI);
    } else if (motion === 'berguling') {
      const k = clamp01(a / 1.7);
      const tumble = Math.abs(Math.sin(k * Math.PI * 4));
      r.rot = -dir * (720 * k + 90 * clamp01((a - 1.35) / 0.35)); r.pivot = 62;
      r.slide = dir * 90 * k; r.hop = 11 * tumble + 3 * Math.sin(k * Math.PI);
      r.lift = 0.65 * tumble; r.armSwing = Math.sin(t * 27) * 24 * (1 - k);
      r.kakiR = Math.sin(t * 25) * 18 * (1 - k); r.kakiL = -Math.sin(t * 25) * 18 * (1 - k);
      r.hsx = 1 + 0.07 * tumble; r.hsy = 1 - 0.05 * tumble;
    } else if (motion === 'merangkak') {
      const crawl = Math.sin(t * 10);
      r.crouch = 34 + Math.abs(crawl) * 5; r.lean = dir * 8;
      r.slide = dir * Math.min(a * 18, 110); r.armSwing = crawl * 16;
      r.kakiR = crawl * 10; r.kakiL = -crawl * 10; r.shake = Math.sin(t * 20) * 1.2;
    } else if (motion === 'merayap') {
      const crawl = Math.sin(t * 8);
      r.crouch = 44 + Math.abs(crawl) * 3; r.lean = dir * 3;
      r.slide = dir * Math.min(a * 10, 70); r.armSwing = crawl * 13;
      r.kakiR = crawl * 7; r.kakiL = -crawl * 7; r.shake = Math.sin(t * 16) * 0.8;
    } else if (motion === 'jongkok') {
      const k = easeOutBack(clamp01(a / 0.18), 1.2);
      r.crouch = 30 * k; r.lean = dir * 12 * k;
    } else if (motion === 'bangkit') {
      // Dari membungkuk/jongkok ke berdiri: tahan sebentar, dorong naik, lewat sedikit, lalu tenang.
      if (a < 0.12) { r.crouch = 34; r.lean = dir * 20; }
      else { const k = clamp01((a - 0.12) / 0.45), e = easeOutBack(k, 1.3); r.crouch = 34 * (1 - e); r.lean = dir * 20 * (1 - e); r.sy = 1 + 0.03 * Math.sin(k * Math.PI); r.htilt = dir * 6 * (1 - k); }
    } else if (motion === 'mendarat') {
      const d = Math.exp(-a * 7);
      r.crouch = 26 * d * (a < 0.05 ? a / 0.05 : 1); r.hsx = 1 + 0.1 * d; r.hsy = 1 - 0.12 * d; r.sy = 1 - 0.03 * d; r.lean = dir * 6 * d;
    } else if (motion === 'kena') {
      // v8: kena pukul (dir = arah hadap korban, terdorong ke belakang): tertahan sesaat (hit-stop),
      // terdorong dengan kepala tersentak dan kaki terseret, lalu goyang dan pulih.
      const D = -dir;
      if (a < 0.07) { r.lean = D * 8; r.hsx = 1.14; r.hsy = 0.86; r.crouch = 4; }
      else if (a < 0.26) { const k = easeOut((a - 0.07) / 0.19); r.slide = D * 30 * k; r.lean = D * (6 + 14 * k); r.htilt = D * 24 * k; r.crouch = 4 + 14 * k; r.hsx = 1.14 - 0.1 * k; r.hsy = 0.86 + 0.1 * k; }
      else { const d = a - 0.26, k = clamp01(d / 0.5), wob = Math.exp(-d * 7) * Math.cos(d * 20); r.slide = D * 30; r.lean = D * (20 * (1 - easeOut(k)) + 5 * wob); r.htilt = D * (24 * (1 - easeOut(k)) + 8 * wob); r.crouch = 18 * (1 - k); }
    }
    return r;
  }

  // ===== Gaya 3D mengkilap (v4) =====
  // Pencahayaan otomatis lewat filter SVG: bentuk diburamkan jadi "kubah", lalu diberi cahaya
  // dari kiri atas (diffuse = pinggir lebih gelap, melengkung ke belakang; specular = kilap).
  // Berlaku untuk semua kostum tanpa menggambar ulang. Matikan dengan opts.datar = true.
  const filter3d = (id, blur, tinggi, k2, kilap, eksp) => `
    <filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="b"/>
      <feDiffuseLighting in="b" surfaceScale="${tinggi}" diffuseConstant="1" lighting-color="#ffffff" result="d"><feDistantLight azimuth="225" elevation="50"/></feDiffuseLighting>
      <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="0.55" k2="${k2}" k3="0" k4="0" result="s"/>
      <feSpecularLighting in="b" surfaceScale="${tinggi}" specularConstant="${kilap}" specularExponent="${eksp}" lighting-color="#ffffff" result="sp"><feDistantLight azimuth="225" elevation="52"/></feSpecularLighting>
      <feComposite in="sp" in2="SourceAlpha" operator="in" result="sp2"/>
      <feComposite in="s" in2="sp2" operator="arithmetic" k1="0" k2="1" k3="0.55" k4="0" result="o"/>
      <feComposite in="o" in2="SourceAlpha" operator="in"/>
    </filter>`;
  const DEFS_3D = `<defs>
    ${filter3d('ej3dKepala', 9, 5, 0.58, 0.85, 18)}
    ${filter3d('ej3dBadan', 6, 4, 0.6, 0.55, 24)}
    ${filter3d('ej3dRambut', 4, 3, 0.6, 0.7, 30)}
  </defs>`;

  // Garis kepala berbentuk telur: lebar di tiap ketinggian dikali (1 - telur * y/44),
  // jadi telur > 0 = atas lebih lebar dan dagu menyempit.
  function kepalaTelur(telur) {
    const pts = [];
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      const y = -Math.cos(a) * 44;
      const x = Math.sin(a) * 44 * (1 - telur * (y / 44));
      pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return `M ${pts.join(' L ')} Z`;
  }

  // ===== v8: peralihan pose tangan yang luwes =====
  // Kedua pose "direkam" (titik bahu, siku, tangan, dan benda), lalu titik-titiknya digeser dengan
  // kurva ancang-ancang, lewat sedikit, lalu kembali. Benda menempel di titik tangan dan sudutnya
  // sedikit tertinggal (ikut-terbawa). Pose lama yang menulis lengan sebagai string ikut ditangkap.
  const RE_LENGAN = /<path d="M\s*(-?[\d.]+)\s+(-?[\d.]+)\s+Q\s*(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)\s+(-?[\d.]+)"\s+stroke="#141414"\s+stroke-width="5\.5"[^>]*\/>/g;
  const RE_TANGAN = /<circle cx="(-?[\d.]+)"\s+cy="(-?[\d.]+)"\s+r="6(?:\.5)?"\s+fill="#141414"\s*\/>/g;
  function rekamPose(pose, w, t, swing, o) {
    REK = { lengan: [], tgn: [], benda: [] };
    let sisa = '';
    try { sisa = pose.render(w, t, swing, o) || ''; } catch (e) { sisa = ''; }
    const r = REK; REK = null;
    sisa = sisa.replace(RE_LENGAN, (m, a, b, c, d, e, f) => { r.lengan.push([a, b, c, d, e, f].map(Number)); return ''; });
    sisa = sisa.replace(RE_TANGAN, (m, x, y) => { r.tgn.push([+x, +y]); return ''; });
    r.sisa = sisa;
    const sisi = { L: null, R: null };
    r.lengan.forEach((l) => { const k = l[0] < 0 ? 'L' : 'R'; if (!sisi[k]) sisi[k] = { l, tgn: false, benda: [] }; });
    const dekat = (x, y) => { let best = null, bd = 1e9; ['L', 'R'].forEach((k) => { if (sisi[k]) { const d = Math.hypot(sisi[k].l[4] - x, sisi[k].l[5] - y); if (d < bd) { bd = d; best = k; } } }); return [best, bd]; };
    r.tgn.forEach(([x, y]) => { const [k, d] = dekat(x, y); if (k && d < 16) sisi[k].tgn = true; });
    r.benda.forEach(([key, x, y, a]) => { const [k] = dekat(x, y); if (k) sisi[k].benda.push({ key, dx: x - sisi[k].l[4], dy: y - sisi[k].l[5], a }); });
    r.sisi = sisi;
    return r;
  }
  // Kurva peralihan: mundur sedikit dulu (ancang-ancang), lalu lewat sedikit (ikut-terbawa).
  const kurvaPeralihan = (p) => {
    if (p <= 0) return 0; if (p >= 1) return 1;
    const c = 1.1 * 1.525;
    return p < 0.5 ? (Math.pow(2 * p, 2) * ((c + 1) * 2 * p - c)) / 2 : (Math.pow(2 * p - 2, 2) * ((c + 1) * (p * 2 - 2) + c) + 2) / 2;
  };
  const selisihSudut = (a, b) => { let d = (b - a) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return d; };
  function campurPose(dari, ke, w, t, swing, o, tp, dur) {
    const k = kurvaPeralihan(clamp01(tp / dur));
    const kb = kurvaPeralihan(clamp01((tp - 0.04) / dur)); // benda sedikit tertinggal
    const A = rekamPose(dari, w, t, swing, o), B = rekamPose(ke, w, t, swing, o);
    const utama = k < 0.5 ? A : B;
    let out = '', geserSisa = null;
    ['L', 'R'].forEach((s) => {
      const a = A.sisi[s] || B.sisi[s], b = B.sisi[s] || A.sisi[s];
      if (!a) return;
      const l = a.l.map((v, i) => v + (b.l[i] - v) * k);
      out += lenganAsli(...l);
      const dom = k < 0.5 ? a : b;
      // Benda pose tujuan langsung ada di tangan sejak awal peralihan (ikut bergerak bersama tangan);
      // benda yang hanya ada di pose asal hilang di tengah peralihan.
      const bA = A.sisi[s] ? A.sisi[s].benda : [], bB = B.sisi[s] ? B.sisi[s].benda : [];
      bB.forEach((tj) => {
        const asal = bA.find((q) => q.key === tj.key);
        let dx = tj.dx, dy = tj.dy, sudut = tj.a;
        if (asal) { dx = asal.dx + (tj.dx - asal.dx) * kb; dy = asal.dy + (tj.dy - asal.dy) * kb; sudut = asal.a + selisihSudut(asal.a, tj.a) * kb; }
        out += bendaAsli(tj.key, l[4] + dx, l[5] + dy, sudut, t);
      });
      if (k < 0.5) bA.filter((q) => !bB.find((tj) => tj.key === q.key)).forEach((q) => { out += bendaAsli(q.key, l[4] + q.dx, l[5] + q.dy, q.a, t); });
      if (dom.tgn) out += tgnAsli(l[4], l[5]);
      if (s === 'R' && utama.sisi.R) geserSisa = [l[4] - utama.sisi.R.l[4], l[5] - utama.sisi.R.l[5]];
    });
    // Benda yang digambar langsung di string pose (stopwatch, HP, ...) ikut tangan kanan.
    if (utama.sisa.trim()) out += geserSisa ? `<g transform="translate(${f1(geserSisa[0])}, ${f1(geserSisa[1])})">${utama.sisa}</g>` : utama.sisa;
    return out;
  }

  function renderCharacterSVG(opts = {}) {
    const outfitKey = opts.outfit || 'ilmuwan';
    const exprKey = opts.expression || 'pede';
    const poseKey = opts.pose || 'pegang_stopwatch';
    const motionKey = opts.motion || 'napas';
    const t = typeof opts.time === 'number' ? opts.time : 0;
    const dir = opts.dir === -1 ? -1 : 1; // arah gerak: 1 ke kanan, -1 ke kiri
    // v3: waktu sejak aksi dimulai (kaget, pingsan, muncul), atribut, efek, benda, lirikan mata.
    const tAksi = typeof opts.tAksi === 'number' ? opts.tAksi : t;
    const atribut = Array.isArray(opts.atribut) ? opts.atribut : (opts.atribut ? [opts.atribut] : []);
    const efek = Array.isArray(opts.efek) ? opts.efek : (opts.efek ? [opts.efek] : []);
    const lirik = typeof opts.lirik === 'number' ? Math.max(-1, Math.min(1, opts.lirik)) : 0;
    const datar = !!opts.datar;
    // v8: variasi bentuk efek benturan, dan peralihan pose (poseDari ke pose selama durPose detik).
    const seedEfek = typeof opts.seedEfek === 'number' ? opts.seedEfek : 0;
    const tPose = typeof opts.tPose === 'number' ? opts.tPose : 99;
    const durPose = typeof opts.durPose === 'number' ? opts.durPose : 0.24;
    const f3 = (id) => (datar ? '' : ` filter="url(#${id})"`);

    const outfit = OUTFITS[outfitKey] || OUTFITS.ilmuwan;
    const expr = EXPRESSIONS[exprKey] || EXPRESSIONS.pede;
    const pose = ARM_POSES[poseKey] || ARM_POSES.idle;
    const atributSemua = [...(outfit.atributBawaan || []), ...atribut];

    const w = outfit.bodyWidth;
    const ww = outfit.waistWidth || w;
    const h = outfit.bodyHeight;
    const GROUND = 128;
    const legLen = outfit.legLength || (GROUND - h);
    const neck = outfit.neck == null ? 8 : outfit.neck;
    const knee = outfit.knee || [0, 0];
    const shoe = outfit.shoe || '#141414';
    const skin = outfit.skin || '#FFFFFF';

    // ---- Jenis gerak ----
    const sideSit = motionKey === 'duduk_samping';
    const sit = SIT_PRESETS[opts.sit] || SIT_PRESETS.kantor;
    const flying = motionKey === 'terbang';
    // Duduk mengalahkan melayang (hantu pun bisa duduk di kursi).
    const floating = !sideSit && (flying || motionKey === 'melayang' || !!outfit.alwaysFloat);
    const running = motionKey === 'lari' || motionKey === 'seruduk';
    const walking = (motionKey === 'jalan' || running) && !floating;
    const act = aksiBadan(motionKey, tAksi, t, dir);
    // v8: badan sedikit memantul saat pose tangan berganti (ikut terbawa gerak tangan).
    if (opts.poseDari && opts.poseDari !== poseKey && tPose < 0.22) { const k = Math.max(0, tPose) / 0.22; act.sy *= 1 - 0.035 * Math.sin(k * Math.PI); act.sx *= 1 + 0.02 * Math.sin(k * Math.PI); act.crouch += 4 * Math.sin(k * Math.PI); }
    // Reaksi kepala tanpa mengubah gerak badan (mis. kaget sambil tetap duduk).
    if (opts.reaksi) { const rk = aksiBadan(opts.reaksi, tAksi, t, dir); act.hsx *= rk.hsx; act.hsy *= rk.hsy; act.shake += rk.shake; act.htilt += rk.htilt; }
    // Kepala ekspresif (v6): bentuk kepala mengikuti ekspresi (kaget/heran = memanjang seperti telur,
    // marah/ngeden = memipih). tEkspresi = detik sejak ekspresi berganti → memantul seperti per.
    // opts.kepala = bentuk sendiri; opts.kepalaEkspresif = false mematikan.
    const bentuk = opts.kepala || (opts.kepalaEkspresif === false ? null : expr.kepala) || null;
    let telur = 0;
    const teK = typeof opts.tEkspresi === 'number' ? Math.max(0, opts.tEkspresi) : 99;
    const pegas = 1 - Math.exp(-teK * 9) * Math.cos(teK * 22); // 0 → melonjak lewat 1 → tenang di 1
    if (bentuk) {
      act.hsx *= 1 + ((bentuk.sx ?? 1) - 1) * pegas;
      act.hsy *= 1 + ((bentuk.sy ?? 1) - 1) * pegas;
      telur = (bentuk.telur ?? 0) * Math.min(1.3, pegas);
      // Miring bawaan ekspresi; opts.miringBalik = true membalik ke sisi lain.
      if (typeof opts.miring !== 'number') act.htilt += (bentuk.miring ?? 0) * pegas * (opts.miringBalik ? -1 : 1);
    }
    // Miring kepala sendiri (derajat, + = ke kanan layar, - = ke kiri), juga memantul.
    if (typeof opts.miring === 'number') act.htilt += opts.miring * pegas;
    // Kepala menunduk/miring (derajat, + = ke kanan layar), mis. terkantuk-kantuk.
    if (typeof opts.angguk === 'number') act.htilt += opts.angguk;
    const isBlinking = (t % 3.4) > 3.22;
    const rageShakeX = motionKey === 'getar_marah' ? Math.sin(t * 35) * 2.5 : 0;

    // Jalan: satu siklus penuh (kiri + kanan) = 1 detik.
    const phase = t * Math.PI * 2 * (running ? 1.7 : 1);
    const stride = running ? Math.min(28, legLen * 0.3) : Math.min(18, legLen * 0.2);
    const liftMax = running ? Math.min(24, legLen * 0.24) : Math.min(14, legLen * 0.14);
    let footR = walking ? Math.sin(phase) * stride : 0;
    let footL = walking ? -Math.sin(phase) * stride : 0;
    const liftR = walking ? Math.max(0, Math.cos(phase)) * liftMax : 0;
    const liftL = walking ? Math.max(0, -Math.cos(phase)) * liftMax : 0;

    // Melayang: seluruh badan naik dari lantai dan naik-turun pelan.
    // Terbang: lebih cepat, condong ke depan, kaki terseret ke belakang.
    const hover = floating ? 24 + Math.sin(t * (flying ? 3.2 : 2.0)) * 6 : 0;
    if (floating) {
      footR = Math.sin(t * 2.0 + 0.6) * 3 - (flying ? dir * 10 : 0);
      footL = Math.sin(t * 2.0 + 2.2) * 3 - (flying ? dir * 14 : 0);
    }

    const bob = walking ? -(1 - Math.abs(Math.sin(phase))) * (running ? 7 : 3.5) : 0;
    // Gerak dorong: kaki belakang mundur jauh, kaki depan menahan.
    if (motionKey === 'dorong') { footL = -dir * 22; footR = dir * 4; }
    // v9: posisi kaki dari gerak (sapu kaki, meluncur): + = ke arah hadap.
    if (act.kakiR) footR = act.kakiR;
    if (act.kakiL) footL = act.kakiL;
    // Lompat girang: kaki menekuk ke atas saat di udara.
    const tuck = act.lift * 10;
    const breatheY = walking || floating ? 0 : Math.sin(t * 3.2) * 2.5;
    const sitLean = sit.style === 'santai' ? -dir * 9 : 0;
    const lean = (sideSit ? sitLean : flying ? dir * 14 : walking ? dir * 3 : 0) + act.lean;
    const armSwing = walking ? Math.sin(phase) * (running ? 18 : 10) : flying ? -dir * 8 : act.armSwing;

    const sideSeatH = sit.seat === 'bar' ? Math.max(60, legLen * 0.85) : Math.max(28, legLen * 0.5);
    const sideSeatTop = GROUND - sideSeatH;
    const bodyX = sideSit ? -dir * 6 : 0;
    const bodyTop = sideSit ? sideSeatTop - h + 6 : GROUND - legLen - h + bob + act.crouch;
    const hipX = Math.max(10, ww * 0.26);
    const hipY = bodyTop + h - 4;
    const side = sideSit ? sideSitParts({ D: dir, sit, legLen, ww, bodyX, hipY, seatTop: sideSeatTop, GROUND, shoe, skin, barefoot: !!outfit.barefoot }) : null;
    const headY = -(44 + neck) + 4;

    const leg = (side, kneeOff, footDx, lift) => {
      const hx = side * hipX;
      const fx = side * (hipX + 2) + footDx * dir;
      const fy = GROUND - lift;
      // v8: kaki lentur (rubber-hose) dengan panjang tetap: makin dekat pinggul ke kaki
      // (jongkok, kaki diangkat), makin jauh lutut menekuk ke depan.
      const panjangKaki = legLen + 4;
      // Tekukan dari jongkok (pinggul turun) dibuat jelas; tekukan dari kaki diangkat saat jalan dibuat halus.
      const tekukDari = (j, f) => (j < panjangKaki ? 2 * Math.sqrt(3 * j * (panjangKaki - j) / 8) * f : 0);
      const jarakJongkok = Math.hypot(fx - hx, GROUND - hipY);
      const tekukJ = tekukDari(jarakJongkok, 0.85);
      const tekuk = tekukJ + Math.max(0, tekukDari(Math.hypot(fx - hx, fy - hipY), 0.45) - tekukDari(jarakJongkok, 0.45));
      const kx = hx + side * 6 + kneeOff * 1.6 + footDx * dir * 0.5 + dir * (tekuk + lift * 0.3);
      const ky = (hipY + fy) / 2 - lift * 0.3;
      const dLeg = (end) => `M ${hx} ${hipY} Q ${kx} ${ky} ${fx} ${fy - end}`;
      const legStroke = outfit.barefoot
        ? `<path d="${dLeg(6)}" stroke="#141414" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
           <path d="${dLeg(6)}" stroke="${skin}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
        : `<path d="${dLeg(3)}" stroke="#141414" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
      let foot;
      if (outfit.barefoot && floating) {
        // Kaki telanjang menggantung, jari menunjuk ke bawah.
        foot = `<path d="M ${fx - 5} ${fy - 8} Q ${fx - 6} ${fy + 2} ${fx + side * 2} ${fy + 8} Q ${fx + 6} ${fy + 2} ${fx + 5} ${fy - 8} Z" fill="${skin}" stroke="#141414" stroke-width="2.2" stroke-linejoin="round"/>`;
      } else if (outfit.barefoot) {
        foot = `<path d="M ${fx - side * 6} ${fy} L ${fx - side * 6} ${fy - 6} Q ${fx} ${fy - 9} ${fx + side * 12} ${fy - 4} Q ${fx + side * 14} ${fy - 1} ${fx + side * 12} ${fy} Z" fill="${skin}" stroke="#141414" stroke-width="2.2" stroke-linejoin="round"/>`;
      } else {
        const heel = fx - side * 7;
        const tip = fx + side * 15;
        const tilt = lift * 0.25;
        foot = `<path d="M ${heel} ${fy} L ${heel} ${fy - 6} Q ${fx} ${fy - 11} ${tip - side * 5} ${fy - 7 + tilt} Q ${tip} ${fy - 5 + tilt} ${tip} ${fy + tilt} Z" fill="${shoe}" stroke="#141414" stroke-width="2.5" stroke-linejoin="round"/>`;
      }
      return legStroke + foot;
    };

    // Bayangan: makin kecil dan pudar saat badan makin tinggi dari lantai.
    const baseRx = Math.max(30, ww * 0.75);
    const shadowRx = floating ? baseRx * (0.75 - hover * 0.006) : baseRx + (walking ? Math.abs(Math.sin(phase)) * 6 : 0);
    const shadowOp = floating ? 0.14 : 0.25;
    const shadowW = (sideSit ? 52 : shadowRx) * (1 - Math.min(0.4, act.hop / 110));
    const shadowCx = (side ? side.shadowX : 0) + act.slide;

    // Pose tangan; warna tangan pucat untuk hantu.
    // Pangkal tangan bisa digeser per kostum (mis. kaus oversize: tangan keluar dari ujung lengan kaus).
    const armOff = outfit.armOffset || { x: 0, y: 0 };
    const argPose = { pegang: opts.pegang, pegangKiri: opts.pegangKiri, dir, warnaKain: opts.warnaKain };
    // v8: menghadap kiri (dir = -1) = tangan, senjata, dan efek depan/belakang ikut dibalik ke kiri,
    // jadi senjata selalu mengarah ke lawan. opts.cerminTangan = false mematikan.
    const cermin = dir === -1 && pose.cermin !== false && opts.cerminTangan !== false;
    const poseDari = opts.poseDari && opts.poseDari !== poseKey ? ARM_POSES[opts.poseDari] : null;
    const beralih = !!poseDari && tPose < durPose + 0.08;
    let arms = beralih
      ? campurPose(poseDari, pose, w + 2 * armOff.x, t, armSwing, argPose, tPose, durPose)
      : pose.render(w + 2 * armOff.x, t, armSwing, argPose);
    if (outfit.limbColor) {
      // Tangan berwarna (mis. hantu putih pucat) tetap bergaris tepi hitam:
      // salinan hitam yang sedikit lebih tebal di bawah, salinan berwarna di atas.
      const tepi = arms
        .replace(/stroke-width="([0-9.]+)"/g, (m, v) => `stroke-width="${(parseFloat(v) + 3.2).toFixed(1)}"`)
        .replace(/<circle([^>]*?) r="([0-9.]+)"([^>]*?)fill="#141414"/g, (m, a, r, b) => `<circle${a} r="${(parseFloat(r) + 1.6).toFixed(1)}"${b}fill="#141414"`);
      const warna = arms.replace(/stroke="#141414"/g, `stroke="${outfit.limbColor}"`).replace(/fill="#141414"/g, `fill="${outfit.limbColor}"`);
      arms = tepi + warna;
    }

    const overHead = beralih && tPose < durPose * 0.5 ? !!poseDari.overHead : !!pose.overHead;
    // v8: menghadap kiri (dir = -1) = tangan, senjata, dan efek depan/belakang ikut dibalik ke kiri,
    // jadi senjata selalu mengarah ke lawan. opts.cerminTangan = false mematikan.
    const balik = cermin ? ' scale(-1, 1)' : '';
    // v8: ekspresi bermata besar (kaget/syok/takut) hanya +-0,5 detik, lalu versi mata titik.
    // opts.mataBesar = true memaksa mata besar terus.
    const wajah = expr.reda && !opts.mataBesar && teK >= (expr.lamaMelotot || 0.5) ? expr.reda(isBlinking) : expr.renderFace(isBlinking, t);
    return `
      <svg viewBox="-120 -165 240 315" width="100%" height="100%" overflow="visible" style="overflow:visible" xmlns="http://www.w3.org/2000/svg">
        ${datar ? '' : DEFS_3D}
        <!-- Bayangan Lantai -->
        <ellipse cx="${shadowCx.toFixed(1)}" cy="${GROUND + 2}" rx="${shadowW.toFixed(1)}" ry="7" fill="rgba(0,0,0,${shadowOp})"/>

        <g transform="translate(0, ${GROUND - act.pivot}) rotate(${act.rot.toFixed(1)}) translate(0, ${act.pivot}) scale(${(act.sx * act.scale).toFixed(3)}, ${(act.sy * act.scale).toFixed(3)}) translate(0, ${-GROUND})">
        ${efek.filter((k) => EFEK[k] && EFEK[k].lapis === 'lantai').map((k) => `<g transform="translate(${act.slide.toFixed(1)}, ${GROUND})">${EFEK[k].render(tAksi, w, seedEfek)}</g>`).join('')}
        <g transform="translate(${(rageShakeX + act.shake + act.slide).toFixed(2)}, ${(-hover - act.hop).toFixed(2)})">
          <!-- Kaki -->
          ${side ? side.back + side.legs : leg(-1, knee[0], footL, liftL + tuck) + leg(1, knee[1], footR, liftR + tuck)}

          <!-- Badan & Tangan -->
          <g transform="translate(${bodyX}, ${bodyTop + breatheY}) rotate(${lean}, 0, ${h})">
            <line x1="0" y1="2" x2="0" y2="${-neck - 2}" stroke="#141414" stroke-width="7" stroke-linecap="round"/>
            ${outfit.renderHairBack ? `<g transform="translate(0, ${headY})"><g${f3('ej3dRambut')}>${outfit.renderHairBack(t, motionKey, dir)}</g></g>` : ''}
            <g transform="scale(${cermin ? -1 : 1}, 1)">${efek.filter((k) => EFEK[k] && EFEK[k].lapis === 'belakang').map((k) => EFEK[k].render(t, w, seedEfek, tAksi)).join('')}</g>
            ${atributSemua.filter((k) => ATRIBUT[k] && ATRIBUT[k].lapis === 'punggung').map((k) => `<g transform="scale(${cermin ? -1 : 1}, 1)">${ATRIBUT[k].render(w, h)}</g>`).join('')}
            <g${f3('ej3dBadan')}>${outfit.renderBody(w, h, outfit, t, motionKey, dir)}</g>
            ${atributSemua.filter((k) => ATRIBUT[k] && ATRIBUT[k].lapis === 'badan').map((k) => ATRIBUT[k].render(w, h)).join('')}
            ${overHead ? '' : `<g transform="translate(0, ${armOff.y})${balik}">${arms}</g>`}
            <g transform="scale(${cermin ? -1 : 1}, 1)">${efek.filter((k) => EFEK[k] && EFEK[k].lapis === 'depan').map((k) => EFEK[k].render(t, w, seedEfek, tAksi)).join('')}</g>
            ${outfit.renderOverArms ? `<g${f3('ej3dBadan')}>${outfit.renderOverArms(w, h, outfit, t, motionKey, dir)}</g>` : ''}

            <!-- Kepala Bulat: bisa memipih/memanjang (squash & stretch) dari pangkal leher -->
            <g transform="translate(0, ${headY}) rotate(${act.htilt.toFixed(1)}, 0, 40) translate(0, 40) scale(${act.hsx.toFixed(3)}, ${act.hsy.toFixed(3)}) translate(0, -40)">
              ${Math.abs(telur) < 0.005
                ? `<circle cx="0" cy="0" r="44" fill="${opts.wajah || expr.tint || outfit.headFill || '#FFFFFF'}" stroke="#141414" stroke-width="4.8"${f3('ej3dKepala')}/>`
                : `<path d="${kepalaTelur(telur)}" fill="${opts.wajah || expr.tint || outfit.headFill || '#FFFFFF'}" stroke="#141414" stroke-width="4.8" stroke-linejoin="round"${f3('ej3dKepala')}/>`}
              <path d="M -38 18 A 42 42 0 0 0 38 18 A 42 36 0 0 1 -38 18 Z" fill="rgba(0,0,0,0.06)"/>
              ${atributSemua.filter((k) => ATRIBUT[k] && ATRIBUT[k].lapis === 'bawahWajah').map((k) => ATRIBUT[k].render()).join('')}
              <g transform="translate(${(lirik * 9).toFixed(1)}, 0)">${wajah}</g>
              <g${f3('ej3dRambut')}>${outfit.renderHeadGear(t, motionKey, dir)}</g>
              ${atributSemua.filter((k) => ATRIBUT[k] && ATRIBUT[k].lapis === 'kepala').map((k) => ATRIBUT[k].render()).join('')}
              ${efek.filter((k) => EFEK[k] && EFEK[k].lapis === 'kepala').map((k) => EFEK[k].render(t, w, seedEfek, tAksi)).join('')}
            </g>
            ${overHead ? `<g transform="translate(0, ${armOff.y})${balik}">${arms}</g>` : ''}
          </g>
          ${side ? side.front : ''}
        </g>
        </g>
      </svg>
    `;
  }

  return {
    EXPRESSIONS,
    OUTFITS,
    ARM_POSES,
    SIT_PRESETS,
    PROPS,
    ATRIBUT,
    EFEK,
    renderCharacterSVG
  };
})();
