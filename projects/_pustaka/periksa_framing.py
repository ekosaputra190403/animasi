"""Pengecek framing otomatis: mencari karakter yang terpotong separuh di pinggir layar.

Cara kerja: komposisi dirender cepat (GIF kecil, tiap N frame) dengan
--props '{"periksaFraming":true}'. Dalam mode itu setiap <Karakter> mengukur gambarnya
di layar (sudah termasuk zoom/geser kamera) dan mencetak baris "FRAMING|...". Skrip ini
mengumpulkan baris itu dan melaporkan rentang waktu bermasalah.

Pemakaian (dari folder remotion-composer):
    python projects/_pustaka/periksa_framing.py projects/<video>/index.tsx <IdKomposisi>
Opsi:
    --step 5      periksa tiap 5 frame (default 5 = 6 kali per detik)
    --min 0.3     hanya laporkan masalah yang berlangsung minimal 0.3 detik
                  (karakter yang lewat pinggir layar dengan cepat tidak dihitung)

Aturan "terpotong":
    - kiri/kanan : bagian karakter yang terlihat antara 5% dan 95% lebarnya
    - atas       : kepala terpotong (bagian atas gambar lebih dari 30 px di atas layar)
Karakter yang transparan (opacity < 0.05) tidak diperiksa.
Hasil juga disimpan ke <folder video>/periksa-framing.txt. Kode keluar 1 kalau ada masalah.
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile

FPS = 30
W, H = 1080, 1920


def run_render(entry: str, comp: str, step: int) -> list:
    npx = shutil.which("npx") or "npx"
    out = os.path.join(tempfile.gettempdir(), "periksa_framing.gif")
    cmd = [
        npx, "remotion", "render", entry, comp, out,
        "--codec=gif", f"--every-nth-frame={step}", "--scale=0.1",
        "--props", '{"periksaFraming":true}', "--log=verbose", "--concurrency=2",
    ]
    print("Merender untuk pemeriksaan (cepat, ukuran kecil)...", flush=True)
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    text = proc.stdout + proc.stderr
    if proc.returncode != 0:
        print(text[-3000:])
        sys.exit("Render gagal; lihat pesan di atas.")
    rows = []
    for m in re.finditer(r"FRAMING\|(\d+)\|([^|]+)\|(-?\d+)\|(-?\d+)\|(-?\d+)\|(-?\d+)\|([\d.]+)\|([\d.]+)", text):
        f, name, l, r, t, b, vw, vh = m.groups()
        rows.append((int(f), name, int(l), int(r), int(t), int(b), float(vw), float(vh)))
    return rows


def problems(row):
    f, name, l, r, t, b, vw, vh = row
    out = []
    if 0.05 < vw < 0.95:
        if l < 0 and r > 0:
            out.append(("terpotong di pinggir KIRI", vw))
        if r > W and l < W:
            out.append(("terpotong di pinggir KANAN", vw))
    if t < -30 and b > 0 and vw > 0.05:
        out.append(("kepala terpotong di ATAS", vh))
    return out


def fmt(sec: float) -> str:
    return f"{int(sec // 60):02d}:{sec % 60:05.2f}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("entry")
    ap.add_argument("comp")
    ap.add_argument("--step", type=int, default=5)
    ap.add_argument("--min", type=float, default=0.3)
    a = ap.parse_args()

    rows = run_render(a.entry, a.comp, a.step)
    if not rows:
        sys.exit("Tidak ada data FRAMING. Pastikan komposisi memakai <Karakter> dari projects/_pustaka/Karakter.tsx.")

    # Kumpulkan frame bermasalah per (karakter, jenis), lalu gabungkan yang berurutan.
    hits = {}
    for row in sorted(set(rows)):
        for kind, frac in problems(row):
            hits.setdefault((row[1], kind), []).append((row[0], frac))
    ranges = []
    for (name, kind), lst in hits.items():
        lst.sort()
        start, prev, fracs = lst[0][0], lst[0][0], [lst[0][1]]
        for f, frac in lst[1:] + [(None, None)]:
            if f is not None and f - prev <= a.step:
                prev = f
                fracs.append(frac)
                continue
            dur = (prev - start + a.step) / FPS
            if dur >= a.min:
                ranges.append((start / FPS, (prev + a.step) / FPS, name, kind, min(fracs)))
            if f is not None:
                start, prev, fracs = f, f, [frac]
    ranges.sort()

    lines = [f"Pemeriksaan framing: {a.comp} ({a.entry})", f"Diperiksa tiap {a.step} frame; masalah minimal {a.min} detik.", ""]
    if not ranges:
        lines.append("OK: tidak ada karakter yang terpotong separuh di pinggir layar.")
    else:
        lines.append(f"Ditemukan {len(ranges)} masalah:")
        for s, e, name, kind, frac in ranges:
            lines.append(f"  {fmt(s)} - {fmt(e)}  {name:<8} {kind} (paling sedikit terlihat {frac * 100:.0f}%)")
    report = "\n".join(lines)
    print(report)
    out_txt = os.path.join(os.path.dirname(os.path.abspath(a.entry)), "periksa-framing.txt")
    open(out_txt, "w", encoding="utf-8").write(report + "\n")
    print(f"\nLaporan disimpan: {out_txt}")
    sys.exit(1 if ranges else 0)


if __name__ == "__main__":
    main()
