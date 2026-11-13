# Naskah VO — Hantu Lawang Sewu yang Mau Didengar (60 detik)

Ada 4 suara. Rekam per suara (satu file per suara), urut dari atas ke bawah,
dengan jeda kira-kira 1 detik di antara baris. Nanti saya potong dan cocokkan otomatis.

| Suara | Karakter | Saran suara di ElevenLabs |
|---|---|---|
| NARATOR | pencerita (tidak tampil) | pria dewasa, santai, sedikit jenaka |
| HANTU | kuntilanak | perempuan, pelan, serak, agak berbisik; jangan terlalu seram, dia sebenarnya kesepian |
| TURIS | orang biasa (kaus @BobEjoo) | pria muda, santai, sok berani |
| PEREMPUAN | cewek penanya | perempuan muda, penasaran |

## Urutan lengkap

| # | Detik | Suara | Teks | Cara bicara |
|---|---|---|---|---|
| 1 | 0–5 | HANTU | Lagi-lagi kamu. | kesal, datar, serak |
| 2 | 0–5 | NARATOR | Ternyata dia sudah biasa diganggu turis. | santai, sedikit geli |
| 3 | 5–14 | TURIS | Hantu? Ah, cuma cerita. Foto sebentar, kok. | tertawa meremehkan |
| 4 | 5–14 | HANTU | Semua orang bilang begitu. | capek, menghela napas |
| 5 | 5–14 | PEREMPUAN | Kamu yakin nggak apa-apa? | cemas |
| 6 | 14–22 | TURIS | Eh... eh... EH! | kaget, makin panik (opsional) |
| 7 | 14–22 | NARATOR | Oke. Hantunya beneran ada. | datar, lucu |
| 8 | 22–28 | HANTU | Hihihi... hihi... uhuk! Uhuk, uhuk! | tawa seram yang serak, lalu batuk |
| 9 | 22–28 | NARATOR | Tawanya sudah lama tidak dipakai. | pelan, menahan tawa |
| 10 | 28–42 | TURIS | Aaaaa! | teriak sambil lari (opsional) |
| 11 | 28–42 | HANTU | Tunggu! Saya cuma mau ngobrol! | berteriak, memohon |
| 12 | 28–42 | PEREMPUAN | Dia... cuma mau ngobrol? | heran |
| 13 | 42–60 | HANTU | Sudah seratus tahun saya di sini. Tidak ada yang pernah mau dengar cerita saya. | sedih, pelan, tulus |
| 14 | 42–60 | NARATOR | Ternyata dia kesepian. | lembut |
| 15 | 42–60 | NARATOR | Kalau datang ke tempat orang lain, sapa dulu. Mereka mungkin sudah lama di sana. | hangat, penutup, tidak menggurui |

Baris 6 dan 10 opsional: kalau direkam, adegan lebih hidup; kalau tidak, diganti efek suara.

## File siap tempel
- `vo_narator.txt`, `vo_hantu.txt`, `vo_turis.txt`, `vo_perempuan.txt`: dengan tag ekspresi ElevenLabs v3 (mis. [laughs], [sighs]).
- `*_polos.txt`: teks yang sama tanpa tag, untuk model ElevenLabs lain.

## Setelah rekam
Simpan hasilnya dengan nama `vo_narator.mp3`, `vo_hantu.mp3`, `vo_turis.mp3`, `vo_perempuan.mp3`
di folder ini (`projects/hantu-belanda/vo/`) atau kirim di chat. Saya cocokkan per kata dengan Whisper,
lalu caption dan animasi mengikuti waktu suaranya.
