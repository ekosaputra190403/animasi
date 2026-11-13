"""Master audio video "Mesin Jahit yang Menyala Jam Dua Belas Malam" (72 detik).

VO (vo/vo_narator.mp3) + musik latar (YouTube Audio Library, The Mini Vandals, tanpa atribusi)
+ efek suara. Musik mengecil otomatis saat narator bicara (dari vo/kata.json).
Efek baru disintesis dengan numpy; sebagian memakai file dari hantu-belanda/sfx dan pedoman-video/musik.

Jalankan (dari remotion-composer):
  ../.venv/Scripts/python.exe -I projects/lembur-pabrik/audio/make_audio.py
Hasil: public/lembur-pabrik/master.wav (dinormalkan ke -14 LUFS, puncak -1 dBTP).
"""
import json
import os
import subprocess
import wave

import numpy as np

SR = 48000
DUR = 72.0
N = int(SR * DUR)
HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
ROOT = os.path.dirname(os.path.dirname(PROJ))  # remotion-composer
PEDOMAN = os.path.normpath(os.path.join(ROOT, "..", "..", "pedoman-video", "musik"))
SFX_LAMA = os.path.join(ROOT, "public", "hantu-belanda", "sfx")
OUT_DIR = os.path.join(ROOT, "public", "lembur-pabrik")
rng = np.random.default_rng(7)


def muat(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def db(x):
    return 10 ** (x / 20)


def rms(x):
    return float(np.sqrt(np.mean(np.square(x)) + 1e-12))


def bandpass(x, lo, hi):
    """Saring frekuensi lewat FFT (mono atau stereo)."""
    mono = x.ndim == 1
    a = x[:, None] if mono else x
    F = np.fft.rfft(a, axis=0)
    f = np.fft.rfftfreq(a.shape[0], 1 / SR)
    m = ((f >= lo) & (f <= hi)).astype(np.float32)
    y = np.fft.irfft(F * m[:, None], n=a.shape[0], axis=0).astype(np.float32)
    return y[:, 0] if mono else y


def env(n, a=0.005, r=0.05):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / max(r, 1e-4))
    return e.astype(np.float32)


def stereo(m, pan=0.0):
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    return np.stack([m * l * 1.414, m * r * 1.414], axis=1).astype(np.float32)


def sinus(f, d, decay=0.1, a=0.002):
    n = int(SR * d)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) * env(n, a, decay)).astype(np.float32)


def derau(d, lo=20, hi=20000, decay=0.05, a=0.002):
    n = int(SR * d)
    return (bandpass(rng.standard_normal(n).astype(np.float32), lo, hi) * env(n, a, decay)).astype(np.float32)


master = np.zeros((N, 2), np.float32)
musik = np.zeros((N, 2), np.float32)


def taruh(buf, clip, at, gain_db=0.0, pan=0.0):
    if clip.ndim == 1:
        clip = stereo(clip, pan)
    i = int(at * SR)
    if i >= N:
        return
    j = min(N, i + len(clip))
    buf[i:j] += clip[: j - i] * db(gain_db)


def J(*xs):
    """Jumlahkan klip mono yang panjangnya berbeda (yang pendek diberi diam di belakang)."""
    n = max(len(x) for x in xs)
    out = np.zeros(n, np.float32)
    for x in xs:
        out[: len(x)] += x
    return out


def norm(x, peak_db=-1.0):
    p = np.max(np.abs(x)) + 1e-9
    return x * db(peak_db) / p


# ---------------------------------------------------------------- efek suara sintesis
def klik(f=2500, d=0.02):
    return norm(J(sinus(f, d, 0.004), derau(d, 2000, 8000, 0.003) * 0.6))


def detak():
    return norm(J(derau(0.03, 2500, 7000, 0.006), sinus(2100, 0.03, 0.01) * 0.7))


def dentang_menit():
    return norm(J(sinus(620, 0.5, 0.12), sinus(930, 0.5, 0.08) * 0.5, sinus(90, 0.2, 0.05) * 0.8))


def ketuk():
    return norm(J(sinus(240, 0.12, 0.035), derau(0.05, 300, 2500, 0.01) * 0.5))


def langkah(keras=1.0):
    return norm(J(sinus(85, 0.12, 0.03), derau(0.08, 200, 3000, 0.015) * 0.7 * keras))


def gedebuk():
    return norm(J(sinus(60, 0.4, 0.09), derau(0.3, 40, 600, 0.06) * 0.8))


def kain():
    d = 0.25
    n = int(SR * d)
    e = np.sin(np.linspace(0, np.pi, n)).astype(np.float32)
    return norm(bandpass(rng.standard_normal(n).astype(np.float32), 500, 3500) * e)


def tiup():
    d = 0.5
    n = int(SR * d)
    e = np.sin(np.linspace(0, np.pi, n)).astype(np.float32) ** 0.7
    return norm(bandpass(rng.standard_normal(n).astype(np.float32), 300, 2200) * e)


def kertas():
    d = 0.4
    n = int(SR * d)
    e = (np.abs(np.sin(np.linspace(0, 9 * np.pi, n))) * np.sin(np.linspace(0, np.pi, n))).astype(np.float32)
    return norm(bandpass(rng.standard_normal(n).astype(np.float32), 1200, 6000) * e)


def batuk():
    out = np.zeros(int(SR * 0.55), np.float32)
    for k, at in enumerate([0.0, 0.26]):
        d = 0.16
        n = int(SR * d)
        b = bandpass(rng.standard_normal(n).astype(np.float32), 180, 1600) * env(n, 0.004, 0.06) + sinus(170 - k * 20, d, 0.05) * 0.5
        i = int(at * SR)
        out[i : i + n] += b
    return norm(out)


def nada_rendah(d=1.8):
    n = int(SR * d)
    t = np.arange(n) / SR
    e = np.sin(np.pi * t / d) ** 2
    return norm(((np.sin(2 * np.pi * 55 * t) + 0.6 * np.sin(2 * np.pi * 82.4 * t)) * e).astype(np.float32))


def denting_hantu(d=1.2):
    n = int(SR * d)
    t = np.arange(n) / SR
    e = np.minimum(1, t / 0.05) * np.exp(-t / 0.5)
    s = np.sin(2 * np.pi * 1320 * t) + 0.6 * np.sin(2 * np.pi * 1980 * t + 0.4 * np.sin(2 * np.pi * 5 * t))
    return norm((s * e).astype(np.float32))


def cekrek():
    out = np.zeros(int(SR * 0.3), np.float32)
    out[: int(SR * 0.02)] += klik(1500, 0.02)
    c = J(sinus(1800, 0.2, 0.05) * 0.5, klik(900, 0.02))
    i = int(SR * 0.08)
    out[i : i + len(c)] += c
    return norm(out)


def angin(d):
    n = int(SR * d)
    t = np.arange(n) / SR
    x = bandpass(rng.standard_normal(n).astype(np.float32), 80, 500)
    am = 0.6 + 0.4 * np.sin(2 * np.pi * 0.23 * t) * np.sin(2 * np.pi * 0.11 * t + 1)
    fade = np.minimum(1, np.minimum(t / 0.6, (d - t) / 0.6))
    return norm(stereo((x * am * fade).astype(np.float32), 0) + stereo(np.roll(x, 900) * am * fade * 0.6, 0.6))


def dengung_monitor(d):
    n = int(SR * d)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * 60 * t) + 0.5 * np.sin(2 * np.pi * 120 * t) + 0.08 * rng.standard_normal(n)
    fade = np.minimum(1, np.minimum(t / 0.3, (d - t) / 0.3))
    return norm((s * fade).astype(np.float32))


def mesin_jahit(d, laju=12.0, gema=False):
    """Mesin jahit industri: dengung motor + ketukan jarum `laju` kali per detik."""
    n = int(SR * d)
    t = np.arange(n) / SR
    motor = 0.35 * np.sin(2 * np.pi * 95 * t) + 0.2 * np.sin(2 * np.pi * 190 * t) + 0.1 * np.sin(2 * np.pi * 285 * t)
    motor *= 0.8 + 0.2 * np.sin(2 * np.pi * laju * t)
    x = motor.astype(np.float32)
    tus = norm(J(derau(0.012, 1800, 6000, 0.003), sinus(150, 0.03, 0.008) * 0.8)) * 0.6
    for k in np.arange(0, d, 1 / laju):
        i = int(k * SR)
        j = min(n, i + len(tus))
        x[i:j] += tus[: j - i]
    fade = np.minimum(1, np.minimum(t / 0.08, (d - t) / 0.08)).astype(np.float32)
    x *= fade
    if gema:  # mesin jauh di ujung ruangan: lebih redup + gema
        x = bandpass(x, 60, 2500)
        y = x.copy()
        for dl, g in [(0.07, 0.5), (0.15, 0.35), (0.26, 0.22)]:
            s = int(dl * SR)
            y[s:] += x[:-s] * g
        x = y
    return norm(x)


# ---------------------------------------------------------------- file yang sudah ada
def file_sfx(nama):
    return norm(muat(os.path.join(SFX_LAMA, nama)))


WHOOSH = norm(muat(os.path.join(PEDOMAN, "sfx-whoosh-kamera-pendek.mp3")))
WHOOSH_BESAR = file_sfx("whoosh.wav")


def halus(x, d=0.7):
    """Whoosh transisi yang lembut: frekuensi tinggi dipotong, dipendekkan, masuk-keluar pelan."""
    x = x[: int(d * SR)]
    x = bandpass(x, 60, 3200)
    n = len(x)
    t = np.arange(n) / SR
    f = np.minimum(1, np.minimum(t / 0.12, (d - t) / 0.25)).clip(0, 1).astype(np.float32)
    return norm(x * f[:, None])


# Revisi 2026-11-10 (pemilik: efek transisi mengganggu): whoosh hanya di 4 perpindahan besar,
# 16–19 dB di bawah suara narator, dan dilembutkan. Whoosh di gerakan kamera kecil dihapus.
WHOOSH_T = halus(WHOOSH_BESAR, 0.8)
BANTING = file_sfx("pintu-banting.wav")
STING = file_sfx("sting.wav")
KEDIP = file_sfx("lampu-kedip.wav")
DERIT = file_sfx("derit-pintu.wav")
NEON = file_sfx("dengung.wav")

# ---------------------------------------------------------------- VO
vo = muat(os.path.join(PROJ, "vo", "vo_narator.mp3"))
vo = vo / (np.max(np.abs(vo)) + 1e-9) * db(-3)
REF = rms(vo[vo[:, 0] ** 2 > 1e-4]) if np.any(vo[:, 0] ** 2 > 1e-4) else rms(vo)  # RMS saat bicara
taruh(master, vo, 0.0)

# ---------------------------------------------------------------- musik latar
def potong(path, mulai, d, fade_in=0.5, fade_out=1.0):
    x = muat(path)[int(mulai * SR) : int((mulai + d) * SR)]
    n = len(x)
    t = np.arange(n) / SR
    f = np.minimum(1, np.minimum(t / max(fade_in, 1e-3), (d - t) / max(fade_out, 1e-3))).astype(np.float32)
    x = x * f[:, None]
    return x / (rms(x) + 1e-9)  # RMS = 1


obon = potong(os.path.join(PEDOMAN, "spooky-obon-fog.mp3"), 6.0, 47.2, 0.05, 1.6)  # tegang 0–47,2
drift = potong(os.path.join(PEDOMAN, "spooky-drifting-memories.mp3"), 50.0, 26.5, 1.2, 1.4)  # haru 45,9–72
taruh(musik, obon, 0.0)
taruh(musik, drift, 45.9)

# Musik mengecil saat narator bicara (dari kata.json), lalu naik lagi di jeda dan di akhir tanpa narasi.
kata = json.load(open(os.path.join(PROJ, "vo", "kata.json"), encoding="utf-8"))
aktif = np.zeros(N, np.float32)
for s, e, _ in kata:
    aktif[int(max(0, s - 0.12) * SR) : int(min(DUR, e + 0.18) * SR)] = 1
k = int(0.25 * SR)
c = np.concatenate([[0.0], np.cumsum(aktif, dtype=np.float64)])
idx = np.arange(N)
lo, hi = np.clip(idx - k // 2, 0, N), np.clip(idx + k // 2, 0, N)
aktif = ((c[hi] - c[lo]) / np.maximum(1, hi - lo)).astype(np.float32)  # rata-rata bergerak 0,25 s
t_all = np.arange(N) / SR
dasar = np.full(N, db(-11), np.float32)  # musik 11 dB di bawah VO saat tidak ada narasi
dasar[t_all >= 63.9] = db(-1.5)  # akhir tanpa narasi (64–72 s): musik penuh supaya tidak sunyi
gain = dasar * (1 - (1 - db(-9)) * aktif)  # turun 9 dB saat bicara
master += musik * (gain * REF)[:, None]

# Radio karyawan memutar lagu pelan (seperti dari radio kecil) sampai dimatikan di 17,3 s.
radio = muat(os.path.join(PEDOMAN, "spooky-drifting-memories.mp3"))[int(20 * SR) : int(31.3 * SR)]
radio = bandpass(radio.mean(axis=1), 400, 3200)
radio = radio / (rms(radio) + 1e-9)
fr = np.minimum(1, np.arange(len(radio)) / (0.3 * SR)).astype(np.float32)
taruh(master, radio * fr * REF, 6.08, -17, 0.3)

# ---------------------------------------------------------------- jadwal efek suara
R = REF


def efek(clip, at, rel_db, pan=0.0):
    """rel_db: kekuatan efek relatif terhadap RMS suara narator."""
    c = clip if clip.ndim == 2 else stereo(clip, pan)
    taruh(master, c / (rms(c) + 1e-9) * R, at, rel_db)


# 0–3: angin malam di luar pabrik + whoosh drone
efek(angin(3.4), 0.0, -10)
# 3–6: pos satpam — dengung monitor, lampu mesin berkedip, ketukan, whoosh masuk monitor
efek(dengung_monitor(3.1), 3.0, -20)
efek(KEDIP[: int(0.6 * SR)], 4.0, -12, 0.2)
efek(ketuk(), 4.65, -6, 0.1)
efek(ketuk(), 4.9, -6, 0.1)
efek(WHOOSH_T, 5.35, -18)
# 6–12,9: mesin jahit karyawan berjalan, berhenti mendadak saat tersentak
efek(mesin_jahit(6.17, 12), 6.08, -14, -0.1)
efek(gedebuk(), 12.25, -12)
# 12,9–14,6: detak jarum detik + dentang jarum menit
for i in range(10):
    efek(detak(), 12.92 + i / 15, -10)
efek(dentang_menit(), 13.6, -4)
for i in range(2):
    efek(detak(), 14.1 + i * 0.5, -12)
# 14,6: whip pan → mesin tua menyala dan terus berbunyi (bergema, jauh)
efek(WHOOSH_T, 14.3, -16)
efek(KEDIP[: int(0.5 * SR)], 15.15, -10, 0.4)
efek(mesin_jahit(25.2, 10, gema=True), 15.15, -17, 0.4)
# 17,3: radio dimatikan; lari ke manekin
efek(klik(1800, 0.03), 17.3, -6, 0.3)
for i in range(6):
    efek(langkah(), 17.65 + i * 0.24, -11, -0.3)
# 20–24: kaget dua kali (whoosh kecil + sting kecil)
efek(STING[: int(0.7 * SR)], 22.5, -18)
efek(STING[: int(0.7 * SR)], 23.5, -17)
# 24,5–26,1: mengendap di lorong, neon berdengung
efek(NEON[: int(1.7 * SR)], 24.5, -18, 0.2)
for i in range(3):
    efek(langkah(0.5), 24.7 + i * 0.5, -16)
# 26,1–30,6: lompat girang
for i in range(3):
    efek(langkah(1.2), 27.73 + i * 0.62, -12)
efek(nada_rendah(1.4), 29.2, -8)
# 30,6–34,7: kamera masuk ke celah mesin, kartu ditarik, ditiup, terbatuk
efek(WHOOSH_T, 30.7, -17)
efek(kertas(), 31.2, -10)
efek(tiup(), 32.5, -8)
efek(batuk(), 33.05, -9)
# 34,7–40,3: nada rendah saat kolom kosong terlihat
efek(nada_rendah(), 34.7, -8)
efek(kertas(), 36.3, -14)
efek(nada_rendah(), 38.1, -6)
# 40,3: mesin di belakang berbunyi lagi → kilat neon, hantu, baju beterbangan (guncangan)
efek(mesin_jahit(0.5, 12, gema=True), 40.28, -10, 0.2)
efek(STING, 40.74, -7)
efek(KEDIP[: int(0.4 * SR)], 40.76, -6)
efek(mesin_jahit(5.8, 30), 40.78, -12, -0.2)
for i in range(6):
    efek(kain(), 40.9 + i * 0.55, -14, (-1) ** i * 0.4)
# 44: pingsan (jatuh) + selimut dilempar
efek(gedebuk(), 44.62, -3)
efek(kain(), 45.25, -10)
# 46,5–50,8: musik berganti haru (diatur di musik); mesin tua pelan
efek(mesin_jahit(4.8, 6, gema=True), 46.54, -20)
# 50,8–53,9: siuman; hantu menunjuk
# 53,9–55,5: lari ke mesin absen + cekrek
for i in range(4):
    efek(langkah(), 54.0 + i * 0.24, -9)
efek(cekrek(), 55.08, -2)
# 55,5–59,3: hantu melambai lalu menjahit lagi sendirian (jauh)
efek(mesin_jahit(1.9, 8, gema=True), 57.4, -18)
# 59,3–64: kamera menembus pintu ke luar; angin; satpam membuka pintu
efek(WHOOSH_T, 59.3, -16)
efek(angin(12.2), 59.8, -14)
efek(DERIT, 61.65, -6, 0.2)
# 64–66: karyawan lari keluar (langkah menjauh)
for i in range(7):
    efek(langkah(), 64.2 + i * 0.22, -7 - i * 1.6, 0.2 + i * 0.1)
# 66–70: hantu muncul di lorong, satpam membalas melambai, sadar, pintu dibanting
efek(denting_hantu(), 66.35, -10, -0.3)
efek(STING[: int(1.0 * SR)], 68.15, -12)
efek(BANTING, 68.93, 4)
efek(gedebuk(), 68.95, -4)
# 70–72: drone mundur; lampu jendela padam lalu menyala lagi
efek(klik(1400, 0.03), 70.55, -10)
efek(klik(1400, 0.03), 71.25, -10)
efek(denting_hantu(0.9), 71.25, -14)

# ---------------------------------------------------------------- simpan + normalkan loudness
os.makedirs(OUT_DIR, exist_ok=True)
tmp = os.path.join(OUT_DIR, "master-mentah.wav")
x = np.clip(master / (np.max(np.abs(master)) + 1e-9) * db(-3), -1, 1)
with wave.open(tmp, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((x * 32767).astype("<i2").tobytes())
out = os.path.join(OUT_DIR, "master.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1:LRA=11", "-ar", str(SR), out], check=True)
os.remove(tmp)
print("selesai:", out)
