// Waktu dari rekaman VO ElevenLabs Bajak Laut Ruang Pikir (59.5s VO + 2.5s Loop Ending)
export const FPS = 30;
export const DURASI = 62.0;

// [mulai, selesai] tiap shot dalam detik (12 shot Bajak Laut)
export const SHOT: [number, number][] = [
  [0.0, 4.30],   // 1. Hook + Dinding kamar roboh jadi dek kapal
  [4.30, 6.80],  // 2. Pilih bergabung
  [6.80, 11.20], // 3. Kontrak konstitusi tertulis memanjang
  [11.20, 16.50],// 4. Voting demokrasi & pecat kapten
  [16.50, 22.80],// 5. Papan harga klaim asuransi menyala
  [22.80, 26.80],// 6. Bendera tengkorak hitam ramah
  [26.80, 31.20],// 7. Bendera merah berkibar + petir
  [31.20, 37.00],// 8. Makan biskuit ulat di gelap gulita (X-Ray)
  [37.00, 42.50],// 9. Kapal dagang musuh langsung ciut
  [42.50, 48.20],// 10. Twist peti harta isi dokumen akuntansi
  [48.20, 55.20],// 11. Porsi jarahan terbesar & juru tulis tetap
  [55.20, 62.00] // 12. CTA Pensiun / Gas Lagi + Zoom out ke botol miniatur (Loop)
];

export const CAPTION: { [key: number]: string } = {
  0: "GABUNG / LAUT?",
  1: "PILIH GABUNG",
  2: "KONSTITUSI RAPI",
  3: "VOTING DEMOKRASI",
  4: "KLAIM ASURANSI",
  5: "PERINGATAN SOPAN",
  6: "TIDAK ADA AMPUN",
  7: "BISKUIT ULAT",
  8: "LANGSUNG CIUT",
  9: "DOKUMEN AKUNTANSI",
  10: "PORSI TERBESAR",
  11: "PENSIUN / GAS LAGI?"
};
