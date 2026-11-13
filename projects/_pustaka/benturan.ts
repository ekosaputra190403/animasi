// v8 (2026-11-11): alat benturan tingkat adegan, dipakai bersama Karakter (motion "kena", efek "hantam").
// Satu benturan = { t: detik kena, kuat: 0..1.5, arah: 1 (pukulan ke kanan) / -1 (ke kiri) }.

export type Benturan = { t: number; kuat?: number; arah?: 1 | -1 };

const TAHAN = 0.1; // hit-stop: gerak berhenti 0,1 detik (3 frame) tepat saat kena
const KEJAR = 0.12; // lalu menyusul dalam 0,12 detik supaya tetap sinkron dengan suara

// Waktu animasi dengan hit-stop. Pakai hasilnya untuk t/tAksi karakter, bukan untuk audio.
export function waktuHitStop(t: number, daftar: Benturan[]): number {
  let out = t;
  for (const b of daftar) {
    const d = t - b.t;
    if (d <= 0) continue;
    if (d < TAHAN) out -= d; // diam di titik kena
    else if (d < TAHAN + KEJAR) out -= TAHAN * (1 - (d - TAHAN) / KEJAR); // menyusul
  }
  return out;
}

// Guncangan kamera searah pukulan (px dan derajat), meredam cepat.
export function guncangArah(t: number, daftar: Benturan[]): { x: number; y: number; r: number } {
  let x = 0, y = 0, r = 0;
  for (const b of daftar) {
    const d = t - b.t;
    if (d < 0 || d > 0.6) continue;
    const k = (b.kuat ?? 1) * Math.exp(-d * 12), arah = b.arah ?? 1;
    x += arah * 26 * k * Math.cos(d * 70);
    y += 7 * k * Math.sin(d * 55);
    r += arah * 1.6 * k * Math.sin(d * 60);
  }
  return { x, y, r };
}

// Kilat putih tipis di seluruh layar (opacity 0..0,25) untuk benturan kuat.
export function kilatLayar(t: number, daftar: Benturan[]): number {
  let o = 0;
  for (const b of daftar) {
    const d = t - b.t;
    if (d >= 0 && d < 0.08 && (b.kuat ?? 1) >= 1) o = Math.max(o, 0.25 * (1 - d / 0.08));
  }
  return o;
}

// Detik sejak benturan terakhir (untuk tAksi motion "kena" dan efek sekali jalan), atau -1 kalau belum ada.
export function sejakBenturan(t: number, daftar: Benturan[]): { d: number; ke: number } {
  let d = -1, ke = -1;
  daftar.forEach((b, i) => { if (t >= b.t) { d = t - b.t; ke = i; } });
  return { d, ke };
}
