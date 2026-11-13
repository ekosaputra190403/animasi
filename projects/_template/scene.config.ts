// Satu-satunya file yang perlu diisi untuk video baru.
// Semua nilai waktu dalam detik. Koordinat: lebar 1080, tinggi 1920, lantai di GROUND_Y.

export const SCENE = {
  id: "contoh-video",
  durationSec: 13,
  groundY: 1420,
  // Latar: "ruangan" (dinding + lantai datar) atau "foto" (lihat Template.tsx)
  background: "3d" as "ruangan" | "3d",
  wallColor: "#4A3E33",
  floorColor: "#5B4B3C",
  // Gerak kamera: daftar shot. Kamera bergerak dari satu shot ke shot berikutnya.
  // zoom 1.0 = normal, 1.1 = dekat. dx = geser horizontal dalam piksel.
  shots: [
    { at: 0, zoom: 1.0, dx: 0 },
    { at: 4, zoom: 1.08, dx: -40 },
    { at: 8, zoom: 1.03, dx: 30 },
  ],
  // Karakter. "tipe" memilih bentuk badan dari preset di bawah.
  characters: [
    { id: "a", tipe: "utama", x: 300, expr: "marah", gerak: "jalan" as const, from: 0, to: 8 },
    { id: "b", tipe: "kedua", x: 620, expr: "kaget", gerak: "diam" as const, from: 0, to: 13 },
  ],
  // Caption: satu sampai dua kata sekaligus, tengah-bawah.
  captions: [
    { words: ["TUNGGU!"], start: 1.0, end: 2.0 },
    { words: ["SAYA", "CUMA"], start: 3.0, end: 5.0 },
  ],
};
