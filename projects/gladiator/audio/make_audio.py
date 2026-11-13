"""Audio sementara video gladiator (68,6 s): VO (dengan jeda duel 4 s) + sorak penonton + efek suara.
Musik latar: audio/musik.py (disintesis sendiri, bebas hak cipta) → audio/musik.wav, dicampur di sini.

Aturan pemilik (2026-11-10): whoosh transisi sedikit & halus (maks. ±4, 16–19 dB di bawah VO).
Waktu di skrip ini = waktu video (sudah termasuk sisipan duel 25,55–29,66 s).

Jalankan (dari remotion-composer):  ../.venv/Scripts/python.exe -I projects/gladiator/audio/make_audio.py
Hasil: public/gladiator/master.wav (-14 LUFS, puncak -1 dBTP).
"""
import os
import subprocess
import wave

import numpy as np

SR = 48000
DUR = 68.6
N = int(SR * DUR)
HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
ROOT = os.path.dirname(os.path.dirname(PROJ))
PEDOMAN = os.path.normpath(os.path.join(ROOT, "..", "..", "pedoman-video", "musik"))
OUT = os.path.join(ROOT, "public", "gladiator")
rng = np.random.default_rng(11)


def muat(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


db = lambda x: 10 ** (x / 20)
rms = lambda x: float(np.sqrt(np.mean(np.square(x)) + 1e-12))


def bandpass(x, lo, hi):
    mono = x.ndim == 1
    a = x[:, None] if mono else x
    F = np.fft.rfft(a, axis=0)
    f = np.fft.rfftfreq(a.shape[0], 1 / SR)
    y = np.fft.irfft(F * ((f >= lo) & (f <= hi))[:, None], n=a.shape[0], axis=0).astype(np.float32)
    return y[:, 0] if mono else y


def norm(x):
    return x / (np.max(np.abs(x)) + 1e-9)


def stereo(m, pan=0.0):
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    return np.stack([m * l * 1.414, m * r * 1.414], axis=1).astype(np.float32)


def J(*xs):
    n = max(len(x) for x in xs)
    o = np.zeros(n, np.float32)
    for x in xs:
        o[: len(x)] += x
    return o


def nada(fs, d, decay, a=0.002):
    n = int(SR * d)
    t = np.arange(n) / SR
    e = np.minimum(1, t / a) * np.exp(-t / decay)
    return (sum(np.sin(2 * np.pi * f * t + i) / (i + 1) for i, f in enumerate(fs)) * e).astype(np.float32)


def derau(d, lo, hi, decay):
    n = int(SR * d)
    t = np.arange(n) / SR
    return (bandpass(rng.standard_normal(n).astype(np.float32), lo, hi) * np.exp(-t / decay)).astype(np.float32)


# ---------------------------------------------------------------- efek
DENG = norm(J(nada([1240, 1870, 2630, 3410], 0.9, 0.22), derau(0.08, 2000, 9000, 0.02) * 0.8))  # benturan logam
DENG_K = norm(J(nada([1500, 2200, 3100], 0.5, 0.12), derau(0.05, 2500, 9000, 0.015) * 0.6))  # benturan kecil
GONG = norm(nada([98, 196.5, 294, 392.7, 523], 3.0, 1.1, 0.01))
def koin():
    o = np.zeros(int(SR * 0.7), np.float32)
    for i, f in enumerate([3200, 4100, 3600, 4800]):
        c = nada([f, f * 1.5], 0.35, 0.08)
        j = int(i * 0.07 * SR)
        o[j : j + len(c)] += c
    return norm(o)
KACHING = koin()
GEDEBUK = norm(J(nada([58], 0.5, 0.12), derau(0.3, 30, 500, 0.08)))
TAP = norm(J(nada([90], 0.15, 0.03), derau(0.08, 200, 3000, 0.02) * 0.7))
def alarm(d):
    n = int(SR * d)
    t = np.arange(n) / SR
    on = ((t * 4) % 1 < 0.5).astype(np.float32)
    return norm((np.sin(2 * np.pi * 1320 * t) + 0.5 * np.sin(2 * np.pi * 1760 * t)) * on * 0.6)
def whoosh(d=0.7):
    n = int(SR * d)
    t = np.arange(n) / SR
    e = np.sin(np.pi * t / d) ** 2
    return norm(bandpass(rng.standard_normal(n).astype(np.float32) * e, 150, 2600))
def sorak_dasar(d):
    """Gemuruh penonton: derau bandpass + modulasi lambat (stereo lebar)."""
    n = int(SR * d)
    t = np.arange(n) / SR
    l = bandpass(rng.standard_normal(n).astype(np.float32), 250, 2800)
    r = bandpass(rng.standard_normal(n).astype(np.float32), 250, 2800)
    am = 0.7 + 0.3 * np.sin(2 * np.pi * 0.37 * t) * np.sin(2 * np.pi * 0.21 * t + 1)
    return np.stack([l * am, r * am], axis=1).astype(np.float32)
def sorak_ledak(d=1.6):
    n = int(SR * d)
    t = np.arange(n) / SR
    e = np.minimum(1, t / 0.08) * np.exp(-t / 0.7)
    x = sorak_dasar(d)
    return (x * e[:, None]).astype(np.float32)


# ---------------------------------------------------------------- VO
vo = muat(os.path.join(PROJ, "vo", "vo_narator_aksi.wav"))
vo = vo / (np.max(np.abs(vo)) + 1e-9) * db(-3)
REF = rms(vo[vo[:, 0] ** 2 > 1e-4])
master = np.zeros((N, 2), np.float32)
master[: min(N, len(vo))] += vo[:N]


def efek(clip, at, rel_db, pan=0.0):
    c = clip if clip.ndim == 2 else stereo(clip, pan)
    c = c / (rms(c) + 1e-9) * REF * db(rel_db)
    i = int(at * SR)
    j = min(N, i + len(c))
    if i < N:
        master[i:j] += c[: j - i]


# Musik latar buatan sendiri (audio/musik.py): mengecil ±8 dB saat narator bicara (dari amplop VO).
musik = muat(os.path.join(HERE, "musik.wav"))[:N]
musik = np.pad(musik, ((0, N - len(musik)), (0, 0)))
amp = np.abs(vo[:N, 0]) if len(vo) >= N else np.pad(np.abs(vo[:, 0]), (0, N - len(vo)))
kk = int(0.3 * SR)
cs = np.concatenate([[0.0], np.cumsum(amp, dtype=np.float64)])
ii = np.arange(N)
lo2, hi2 = np.clip(ii - kk, 0, N), np.clip(ii + kk, 0, N)
env = ((cs[hi2] - cs[lo2]) / np.maximum(1, hi2 - lo2)).astype(np.float32)
bicara = np.clip(env / (np.percentile(env[env > 0], 60) + 1e-9), 0, 1)
gain_musik = db(-11) * (1 - (1 - db(-8)) * bicara)
master += musik / (rms(musik) + 1e-9) * (gain_musik * REF)[:, None]

# Sorak penonton sepanjang adegan arena (lebih pelan di kamar/barak/lorong), naik saat aksi.
sorak = sorak_dasar(DUR)
t = np.arange(N) / SR
lvl = np.full(N, db(-60), np.float32)
def zona(a, b, d):
    m = (t >= a) & (t < b)
    lvl[m] = db(d)
zona(3.2, 7.32, -16)     # dinding rebah, Colosseum terlihat
zona(13.06, 17.5, -24)   # dari lorong (teredam)
zona(17.5, 20.2, -28)
zona(20.2, 22.62, -26)   # dalam helm
zona(22.62, 25.55, -18)
zona(25.55, 29.66, -12)  # duel aksi tanpa narasi: penonton bergemuruh
zona(29.66, 34.9, -18)
zona(34.9, 40.24, -20)
zona(40.24, 46.68, -17)
zona(46.68, 59.48, -19)
zona(59.48, 65.0, -20)
zona(65.0, 66.6, -12)    # penonton meneriakkan namamu
zona(66.6, 67.45, -18)
k = int(0.35 * SR)
c = np.concatenate([[0.0], np.cumsum(lvl, dtype=np.float64)])
idx = np.arange(N)
lo, hi = np.clip(idx - k, 0, N), np.clip(idx + k, 0, N)
lvl = ((c[hi] - c[lo]) / np.maximum(1, hi - lo)).astype(np.float32)
master += sorak / (rms(sorak) + 1e-9) * (lvl * REF)[:, None]

# ---- Bagian 1
efek(alarm(1.3), 0.3, -10, 0.4)
efek(whoosh(0.4), 2.0, -18)                         # baju berubah (pop)
for i, a in enumerate([3.3, 3.45, 3.62, 3.78]):
    efek(GEDEBUK, a, -6 - i, (-1) ** i * 0.5)       # empat dinding rebah
efek(sorak_ledak(2.2), 3.7, -8)
efek(TAP, 8.0, -14); efek(TAP, 8.6, -16)            # sendok di mangkuk
efek(nada([660, 990], 0.5, 0.15), 11.2, -14)        # "ting" rontgen
efek(nada([140, 95], 0.6, 0.2), 12.6, -8)           # sendawa (nada rendah)
efek(norm(derau(1.1, 80, 900, 0.6)), 13.35, -10)    # jeruji gerbang terangkat (gemuruh rantai)
for i in range(8):
    efek(DENG_K, 13.4 + i * 0.13, -20, 0.3)
efek(whoosh(0.8), 21.9, -18)                        # lubang helm membesar
# ---- Bagian 2 + duel
efek(whoosh(0.5), 22.8, -16)                        # jaring dilempar
efek(TAP, 23.45, -12, -0.4)                         # jaring menyangkut
efek(DENG, 24.05, -2)                               # trisula menghantam perisai (waktu membeku)
efek(DENG, 25.05, -4)
efek(sorak_ledak(), 25.1, -10)
# duel: 25,55 + (0,33 / 1,02 / sapuan 1,6 / tebasan 2,3 / adu kunci 2,85–3,85)
efek(DENG, 25.55 + 0.33, -3, -0.2)
efek(whoosh(0.35), 25.55 + 0.75, -16)
efek(DENG, 25.55 + 1.02, -3, 0.2)
efek(whoosh(0.5), 25.55 + 1.45, -18)
efek(GEDEBUK, 25.55 + 2.1, -10)
efek(whoosh(0.35), 25.55 + 2.2, -16)
for tb in [2.85, 3.15, 3.5, 3.85]:
    efek(DENG_K, 25.55 + tb, -8, (-1) ** int(tb * 10) * 0.2)
efek(sorak_ledak(1.8), 25.55 + 3.9, -9)
efek(whoosh(0.5), 29.45, -17)                       # whip pan ke serudukan
efek(GEDEBUK, 30.35, -4)                            # lawan jatuh
efek(sorak_ledak(), 30.4, -9)
efek(TAP, 32.1, -10); efek(TAP, 32.35, -10)         # tongkat wasit diketuk
efek(nada([1800, 2400], 0.4, 0.1), 37.88, -14)      # "ting" label harga tepat di kata "mahal"
efek(KACHING, 39.45, -2)                            # lanista lega
efek(sorak_ledak(2.0), 43.4, -8)                    # boleh hidup
# ---- Bagian 3
efek(KACHING, 46.75, -8)                            # uang hadiah
efek(nada([523, 659, 784], 1.2, 0.5), 50.9, -10)    # pedang kayu (fanfare kecil)
for i in range(4):
    efek(GONG, 53.14 + i * 1.585, -4)               # gong tiap jump cut
efek(nada([1500], 0.25, 0.06), 62.3, -14, -0.5)     # papan PENSIUN muncul (kata "pensiun")
efek(nada([1100], 0.25, 0.06), 64.2, -14, 0.5)      # perisai DUEL LAGI muncul (kata "duel")
efek(whoosh(0.5), 65.1, -16)                        # papan dibuang
efek(sorak_ledak(2.0), 65.2, -6)
efek(whoosh(0.8), 66.7, -18)                        # Colosseum → miniatur
efek(alarm(0.5), 68.15, -10, 0.4)                   # alarm berbunyi lagi (loop)

os.makedirs(OUT, exist_ok=True)
tmp = os.path.join(OUT, "master-mentah.wav")
x = np.clip(master / (np.max(np.abs(master)) + 1e-9) * db(-3), -1, 1)
with wave.open(tmp, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype("<i2").tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1:LRA=11", "-ar", str(SR), os.path.join(OUT, "master.wav")], check=True)
os.remove(tmp)
print("selesai")
