"""Gabungkan 4 rekaman VO jadi satu trek narasi + waktu caption.

Masukan : vo_narator.mp3, vo_hantu.mp3, vo_turis.mp3, vo_perempuan.mp3, stt.json (Whisper per kata)
Keluaran: ../../../public/hantu-belanda/narasi.wav  (trek gabungan)
          ../timing.ts                              (waktu baris + potongan caption 1–2 kata)

Jalankan dari folder ini:  python make_vo.py
"""
import json
import os
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.normpath(os.path.join(HERE, "..", "..", "..", "public", "hantu-belanda"))
STT = json.load(open(os.path.join(HERE, "stt.json"), encoding="utf-8"))

# (id, file, mulai di rekaman, selesai di rekaman, posisi di video, teks naskah, caption khusus)
# Batas potongan diambil dari deteksi hening; posisi di video mengikuti adegan di naskah.md.
LINES = [
    (1, "vo_hantu", 0.00, 1.44, 2.60, "Lagi-lagi kamu.", None),
    (2, "vo_narator", 0.00, 2.61, 4.30, "Ternyata dia sudah biasa diganggu turis.", None),
    (3, "vo_turis", 0.00, 4.64, 7.60, "Hantu? Cuma cerita. Foto sebentar, kok.", None),
    (4, "vo_hantu", 1.88, 4.19, 12.50, "Semua orang bilang begitu.", None),
    (5, "vo_perempuan", 0.00, 1.73, 15.10, "Kamu yakin nggak apa-apa?", None),
    (6, "vo_turis", 5.05, 6.97, 18.20, "Eh... eh... EH!", [("EH...", 0.0, 0.7), ("EH...", 0.75, 1.3), ("EH!", 1.4, 1.92)]),
    (7, "vo_narator", 3.05, 5.43, 20.50, "Oke. Hantunya beneran ada.", None),
    (8, "vo_hantu", 4.55, 9.12, 23.40, "Hihihi... hihi... uhuk! Uhuk, uhuk!", [("HIHIHI...", 0.0, 1.8), ("HIHI...", 1.8, 2.25), ("UHUK!", 2.25, 3.3), ("UHUK UHUK!", 3.3, 4.57)]),
    (9, "vo_narator", 5.82, 8.44, 28.20, "Tawanya sudah lama tidak dipakai.", None),
    (10, "vo_turis", 7.05, 8.15, 31.30, "Aaaaa!", [("AAAAA!", 0.0, 1.1)]),
    (11, "vo_hantu", 9.48, 11.95, 33.00, "Tunggu! Saya cuma mau ngobrol!", None),
    (12, "vo_perempuan", 1.90, 3.96, 35.90, "Dia... cuma mau ngobrol?", None),
    (13, "vo_hantu", 12.44, 17.40, 40.50, "Sudah seratus tahun saya di sini. Tidak ada yang pernah mau dengar cerita saya.", None),
    (14, "vo_narator", 8.91, 10.26, 46.20, "Ternyata dia kesepian.", None),
    (15, "vo_narator", 10.72, 15.22, 50.00, "Kalau datang ke tempat orang lain, sapa dulu. Mereka mungkin sudah lama di sana.", None),
]
TOTAL = 56.5

SPEAKER = {"vo_narator": "narator", "vo_hantu": "hantu", "vo_turis": "turis", "vo_perempuan": "perempuan"}


def clean(w: str) -> str:
    return w.strip(".,?!…").strip()


def word_times(line):
    """Waktu tiap kata naskah (relatif awal baris), memakai urutan kata Whisper di potongan itu."""
    _, f, a, b, _, text, _ = line
    script = [w for w in text.replace("...", " ").split() if clean(w)]
    heard = [w for w in STT[f] if w["s"] >= a - 0.05 and w["e"] <= b + 0.1]
    # Kata "Ah" / tawa pendek sering tidak terdengar Whisper: buang kata naskah yang tidak ada
    # pasangannya dengan membagi waktu rata berdasarkan panjang huruf bila jumlah tidak sama.
    if len(heard) == len(script):
        return [(script[i], heard[i]["s"] - a, heard[i]["e"] - a) for i in range(len(script))]
    dur = b - a
    total_chars = sum(len(clean(w)) for w in script)
    out, t = [], 0.0
    for w in script:
        d = dur * len(clean(w)) / total_chars
        out.append((w, t, t + d))
        t += d
    return out


def chunks(times):
    """Potongan caption 1–2 kata: dua kata kalau keduanya pendek, satu kata kalau panjang."""
    res, i = [], 0
    while i < len(times):
        w, s, e = times[i]
        if i + 1 < len(times) and len(clean(w)) + len(clean(times[i + 1][0])) <= 11 and not w.endswith((".", "?", "!", ",")):
            w2, _, e2 = times[i + 1]
            res.append((f"{w} {w2}", s, e2))
            i += 2
        else:
            res.append((w, s, e))
            i += 1
    return [(clean_caption(t), s, e) for t, s, e in res]


def clean_caption(t: str) -> str:
    return t.replace(",", "").replace(".", "").upper().strip()


def main():
    os.makedirs(PUBLIC, exist_ok=True)
    # 1) trek gabungan: potong tiap baris, geser ke posisinya, campur.
    inputs, filters = [], []
    for k, (lid, f, a, b, pos, _, _) in enumerate(LINES):
        inputs += ["-i", os.path.join(HERE, f + ".mp3")]
        filters.append(f"[{k}:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,afade=t=out:st={b - a - 0.04:.2f}:d=0.04,adelay={int(pos * 1000)}:all=1[a{k}]")
    mix = "".join(f"[a{k}]" for k in range(len(LINES)))
    filters.append(f"{mix}amix=inputs={len(LINES)}:normalize=0,apad,atrim=0:{TOTAL},alimiter=limit=0.89[out]")
    out_wav = os.path.join(PUBLIC, "narasi.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(filters), "-map", "[out]", "-ar", "44100", out_wav], check=True)

    # 2) timing.ts: baris + potongan caption dengan waktu di video.
    lines_ts, caps = [], []
    for line in LINES:
        lid, f, a, b, pos, text, custom = line
        lines_ts.append(f'  {{ id: {lid}, speaker: "{SPEAKER[f]}", start: {pos:.2f}, end: {pos + b - a:.2f} }},')
        cs = custom if custom else chunks(word_times(line))
        for t, s, e in cs:
            caps.append(f'  ["{t}", {pos + s:.2f}, {pos + e:.2f}, {lid}],')
    ts = (
        "// Dibuat oleh vo/make_vo.py — jangan edit manual.\n"
        f"export const TOTAL = {TOTAL};\n"
        "export type Speaker = \"narator\" | \"hantu\" | \"turis\" | \"perempuan\";\n"
        "export const LINES: { id: number; speaker: Speaker; start: number; end: number }[] = [\n"
        + "\n".join(lines_ts)
        + "\n];\n// [teks, mulai, selesai, id baris]\nexport const CAPTIONS: [string, number, number, number][] = [\n"
        + "\n".join(caps)
        + "\n];\n"
    )
    open(os.path.join(HERE, "..", "timing.ts"), "w", encoding="utf-8").write(ts)
    print("ok", out_wav)


if __name__ == "__main__":
    main()
