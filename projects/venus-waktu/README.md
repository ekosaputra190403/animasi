# Proyek Venus — Ruang Pikir

Komposisi Remotion vertikal sekitar 56,2 detik untuk cerita tentang panjang hari, tahun, dan arah Matahari di Venus.

**Status:** Revisi audit v2 — masih draf untuk ditinjau; belum ada MP4 final yang disetujui.

## Tinjau animasi sebelum render

Jalankan dari folder `remotion-composer`:

```powershell
npx remotion studio projects\venus-waktu\index.tsx
```

Pilih komposisi `Venus`, lalu scrub seluruh timeline untuk meninjau gerak, framing, transisi, dan sinkronisasi audio. Koreksi sampai disetujui sebelum menjalankan render MP4.

Thumbnail YouTube 1280 × 720 tersedia sebagai `thumbnail.png`; versi vektor yang dapat diedit ada di `thumbnail.svg`.

## Audio dan subtitle

- Musik misterius dan whoosh sudah berada di `public\venus-waktu`.
- VO ElevenLabs yang sudah ada sudah disalin ke `public\venus-waktu\narasi.mp3` dan dipasang mulai frame 0.
- Presenter memakai pose bicara, gerak mulut animatif, gestur penjelasan, dan ekspresi yang berubah mengikuti isi narasi.
- Lokasi 3D benar-benar berganti setiap 5 detik lewat crossfade 0,8 detik: observatorium, permukaan Venus, antariksa dalam, laboratorium rotasi, orbit Matahari, dek kalender, horizon siang, observatorium awan, peta retrograde, platform permukaan, horizon Venus, lalu observatorium penutup.
- Venus memakai tekstur permukaan dan awan yang berputar, atmosfer yang berdenyut, cahaya dan bayangan dinamis, serta gerak dolly kamera.
- Presenter aktif menunjuk dan memperagakan konsep, mengangguk, melirik grafik, berpindah posisi mengikuti fokus adegan, dan bereaksi kaget saat retrograde diungkap. HUD dan presenter ikut bergerak bersama kamera.
- Hook tiga detik pertama memperlihatkan orbit dan rotasi Venus dengan label "Rotasi Venus lebih lama dari satu tahunnya?".
- Perbandingan 225 vs 243 hari divisualisasikan sebagai dua garis waktu yang bergerak; tahun mencapai finis lebih dulu dengan 18 hari rotasi tersisa.
- Label membedakan rotasi sideris (243 hari), satu orbit (225 hari), satu hari Matahari (sekitar 117 hari dari terbit ke terbit lagi), serta siang/malam (sekitar 58,4 hari masing-masing).
- Kamera punya pull-back nyata (wide 0,90–0,94×) dan push-in close-up (1,10–1,12×), bukan sekadar perubahan framing tipis.
- Kalender tahun baru diperbesar dengan kisi tanggal dan animasi lembar; jam rotasi ditempatkan di sisi kiri agar tidak tertutup presenter.
- Subtitle diturunkan ke area bawah layar, terpisah dari grafik utama.
- Shot berganti setiap sekitar 2,4 detik dengan gerak push-in, pull-back, dan tracking.
- Demonstrasi retrograde memperlihatkan orbit maju dan permukaan Venus berputar mundur.
- Angka 243, 225, dan 117 dihitung saat diperkenalkan. Palet biru tua-emas dijaga konsisten; pergantian tidak memakai wipe radial, dan empat aksen whoosh dipakai hanya pada perubahan besar.
- Caption lama berisi maksimal dua kata per tampilan dan cocok dengan VO lama. VO koreksi belum dibuat; `vo/kata.json` harus ditranskripsi ulang setelah MP3 pengganti tersedia, lalu diperiksa bersama preview sebelum render.

```powershell
python projects\venus-waktu\transcribe_vo.py
```

Skrip memakai Faster-Whisper lokal dan mengisi `projects\venus-waktu\vo\kata.json`. Jika modul belum tersedia di Python yang dipakai terminal:

```powershell
python -m pip install faster-whisper
```

- Periksa kata yang dikenali di `vo\kata.json` terhadap `naskah.txt`, terutama nama/angka, sebelum render.
- Kata terakhir VO berakhir sekitar 55,94 detik; komposisi dipangkas menjadi 56,2 detik dan kartu penutup tampil di atas kalimat terakhir agar tidak ada dead air panjang.
- Belum ada MP4 hasil render. Tinjau still/animasi dan subtitle di Studio, lalu koreksi sampai disetujui sebelum render.

## Struktur

- `Template.tsx` — 12 lokasi Three.js yang berubah sesuai beat, Venus bertekstur dengan rotasi dan atmosfer dinamis, demonstrasi retrograde, HUD animatif, transisi, musik/SFX, dan presenter aktif dari rig katalog.
- `scene.config.ts` — 6 beat, lokasi baru maksimal tiap 5 detik, dan shot kamera sekitar setiap 2,4 detik.
- `naskah.md` — naskah lengkap, gag visual, shot list, dan status produksi.
- `naskah.txt` — narasi bersih siap disalin ke ElevenLabs.
- `Caption.tsx` — subtitle dua kata dengan penekanan kata kunci.
- `transcribe_vo.py` — pembuat timing kata dari VO menggunakan model lokal.
- `vo/kata.json` — timestamp subtitle yang dihasilkan skrip transkripsi.
- `sumber.md` — sumber serta batas klaim fakta.
