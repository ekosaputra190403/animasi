# Naskah: Hantu Lawang Sewu yang Mau Didengar (60 detik, 9:16)

Pemeran (dari pustaka karakter):
- **Hantu**: kostum `hantu` (kuntilanak), ekspresi `seram` / `sedih` / `kalem`, gerak `melayang` / `terbang`.
- **Turis**: kostum `biasa` (kaus kuning @BobEjoo, sekaligus watermark).
- **Teman turis (perempuan)**: kostum `cewek`, ikut datang, cemas di lobi, menyusul ke tangga.
- **Narator**: pria, suara saja (ElevenLabs).

Pesan tersirat: kalau datang ke tempat orang lain, sapa dulu. Mereka mungkin sudah lama di sana.

Struktur mengikuti pola 6 beat di PEDOMAN.md (aksi aneh, tertawaan, bukti awal, petunjuk, klimaks, penjelasan).

| Beat | Waktu | Latar | Visual | Suara / dialog | Caption |
|---|---|---|---|---|---|
| 1. Aksi aneh | 0–7 | Gedung, malam | Turis (main HP) dan temannya (cewek) berjalan menuju gedung. Pintu berderit terbuka sendiri, hantu mengintip dari ambang pintu (close-up), lalu mundur menghilang. Transisi: kamera menembus pintu. | Hantu: "Lagi-lagi kamu." Narator: "Ternyata dia sudah biasa diganggu turis." | LAGI-LAGI / KAMU |
| 2. Tertawaan | 7–17 | Lobi | Turis dan teman masuk lewat pintu lobi; hantu sudah menunggu dekat meja resepsionis. Close-up turis tertawa, close-up hantu capek, close-up teman cemas. Turis jalan ke kanan menuju lorong; teman tidak ikut. Transisi: whip pan. | Turis: "Hantu? Cuma cerita. Foto sebentar, kok." Hantu: "Semua orang bilang begitu." Teman: "Kamu yakin nggak apa-apa?" | HANTU? / CUMA CERITA / ... |
| 3. Bukti awal | 17–23 | Lorong | Turis masuk sambil memotret. Lampu berkedip, tiga pintu terbanting (kamera berguncang). Hantu muncul. | SFX pintu terbanting. Turis: "Eh... eh... EH!" Narator: "Oke. Hantunya beneran ada." | EH... / BENERAN ADA |
| 4. Petunjuk | 23–32 | Lorong | Hantu mencoba tawa "hihihi", serak lalu batuk. Turis heran. Hantu tiba-tiba melesat mendekat → turis teriak dan kabur. Transisi: whip pan. | Hantu: "Hihihi... uhuk!" Narator: "Tawanya sudah lama tidak dipakai." Turis: "Aaaaa!" | HIHIHI / UHUK / AAAAA! |
| 5. Klimaks | 32–38 | Tangga | Turis lari menuruni tangga, hantu terbang mengejar. Teman menyusul dari bawah. | Hantu: "Tunggu! Saya cuma mau ngobrol!" Teman: "Dia... cuma mau ngobrol?" | TUNGGU! / MAU NGOBROL |
| 6. Penjelasan | 38–56.5 | Tangga | Hantu melayang di tangga, sedih (close-up), bercerita. Turis tetap menjaga jarak, lalu melambai menyapa dari bordes; hantu kaget lalu tersenyum. Turis dan teman pergi; kamera mendekat ke hantu yang tersenyum sendirian. Fade ke hitam. | Hantu: "Sudah seratus tahun saya di sini..." Narator: "Ternyata dia kesepian. Kalau datang ke tempat orang lain, sapa dulu. Mereka mungkin sudah lama di sana." | SERATUS TAHUN / KESEPIAN / SAPA DULU |

Catatan:
- Lawang Sewu ada di Semarang. Hantu di sana adalah legenda, bukan fakta, jadi narasi tidak menyebutnya sebagai kejadian nyata.
- Adegan kejar-kejaran (beat 5) sudah pernah dibuat drafnya dengan karakter lama (`assets/renders/kejar_v2.mp4`). Adegan ini akan dibuat ulang dengan karakter dari pustaka.
- Latar setiap adegan dibuat ulang dari gambar referensi yang dicari pemilik (4 latar: gedung malam, lobi, lorong, tangga).
- Adegan jendela sore dihapus atas permintaan pemilik (2026-11-08); kalimat penutup pindah ke akhir adegan tangga.
- Tidak ada adegan duduk di video ini (pemilik menilai pose duduk jelek).

## Suara (SFX) yang sudah dibuat
File di `remotion-composer/public/hantu-belanda/sfx/`, dibuat sendiri dengan ffmpeg (gratis, tanpa masalah lisensi).
- `dengung.wav`: dengung rendah + angin malam, untuk suasana mencekam (beat 1, lebih pelan di beat 2).
- `derit-pintu.wav`: pintu tua berderit terbuka sendiri (beat 1).
- `whoosh.wav`: desir saat hantu melayang/terbang (beat 1, bisa dipakai lagi di beat 5).
- `sting.wav`: nada sumbang bergema untuk momen kaget/close-up hantu (beat 1).
