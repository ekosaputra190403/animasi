"""Musik latar video gladiator, disintesis sendiri (bebas hak cipta). Hasil: audio/musik.wav (68,6 s, 48 kHz stereo).

Nada dasar D minor. Bagian (waktu video):
  0–3,1    kotak musik pagi (kamar)            3,1–13,06  epik: genderang + senar + brass
  13,06–25,55 tegang: drone + detak genderang    25,55–29,66 duel: cepat, hentakan brass tiap benturan
  29,66–40,24 lucu: pizzicato jenaka              40,24–50,9 kembali epik (diampuni, hadiah)
  50,9–59,5 epik-jenaka (Flamma 4x, gong di skrip efek)  59,5–66,6 pertanyaan → megah di "duel lagi"
  66,6–68,6 kotak musik lagi (loop ke awal)
"""
import os
import wave

import numpy as np

SR = 48000
DUR = 68.6
N = int(SR * DUR)
HERE = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(5)
L = np.zeros(N, np.float32)
R = np.zeros(N, np.float32)


def f(nama):
    """Nama nada → frekuensi (mis. 'D3', 'F#4', 'Bb2')."""
    urut = {"C": -9, "C#": -8, "Db": -8, "D": -7, "D#": -6, "Eb": -6, "E": -5, "F": -4, "F#": -3, "Gb": -3, "G": -2, "G#": -1, "Ab": -1, "A": 0, "A#": 1, "Bb": 1, "B": 2}
    n, o = nama[:-1], int(nama[-1])
    return 440.0 * 2 ** ((urut[n] + (o - 4) * 12) / 12)


def taruh(x, at, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i + len(x) <= 0:
        return
    j = min(N, i + len(x))
    l, r = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
    L[i:j] += x[: j - i] * gain * l
    R[i:j] += x[: j - i] * gain * r


def adsr(n, a, d, s, rl):
    t = np.arange(n) / SR
    dur = n / SR
    e = np.where(t < a, t / max(a, 1e-4), np.where(t < a + d, 1 - (1 - s) * (t - a) / max(d, 1e-4), s))
    e = e * np.clip((dur - t) / max(rl, 1e-4), 0, 1)
    return e.astype(np.float32)


def gergaji(fr, d, harm=10, detune=0.0):
    n = int(SR * d)
    t = np.arange(n) / SR
    x = np.zeros(n, np.float32)
    for k in range(1, harm + 1):
        if fr * k > 9000:
            break
        x += (np.sin(2 * np.pi * fr * k * (1 + detune) * t) / k).astype(np.float32)
    return x


# ---------------------------------------------------------------- instrumen
def senar(fr, d, kuat=1.0):  # senar gesek: dua gergaji sedikit sumbang
    x = (gergaji(fr, d, 8, 0.0) + gergaji(fr, d, 8, 0.004)) * 0.5
    return x * adsr(len(x), 0.04, 0.1, 0.8, 0.08) * kuat


def brass(fr, d, kuat=1.0):  # tiupan brass: gergaji + attack lebih lambat + vibrato tipis
    n = int(SR * d)
    t = np.arange(n) / SR
    x = np.zeros(n, np.float32)
    for k in range(1, 9):
        x += (np.sin(2 * np.pi * fr * k * t * (1 + 0.003 * np.sin(2 * np.pi * 5.5 * t))) / (k ** 0.9)).astype(np.float32)
    return x * adsr(n, 0.07, 0.15, 0.7, 0.12) * kuat * 0.6


def pad(fr, d, kuat=1.0):
    x = (gergaji(fr, d, 5, 0.0) + gergaji(fr, d, 5, 0.006) + gergaji(fr / 2, d, 4, 0.002)) / 3
    return x * adsr(len(x), 0.6, 0.3, 0.85, 0.8) * kuat


def petik(fr, d=0.35, kuat=1.0):  # pizzicato
    n = int(SR * d)
    t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * fr * t) + 0.4 * np.sin(4 * np.pi * fr * t) + 0.15 * np.sin(6 * np.pi * fr * t)) * np.exp(-t / 0.09)
    return (x * kuat).astype(np.float32)


def kotak_musik(fr, d=0.9, kuat=1.0):
    n = int(SR * d)
    t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * fr * t) + 0.3 * np.sin(2 * np.pi * fr * 4.02 * t) * np.exp(-t / 0.08)) * np.exp(-t / 0.45)
    return (x * kuat).astype(np.float32)


def genderang(kuat=1.0, nada_awal=95, nada_akhir=48):  # taiko
    n = int(SR * 0.7)
    t = np.arange(n) / SR
    fr = nada_akhir + (nada_awal - nada_akhir) * np.exp(-t / 0.05)
    x = np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t / 0.22)
    x += rng.standard_normal(n) * np.exp(-t / 0.02) * 0.3
    return (x * kuat).astype(np.float32)


def tabuh_kecil(kuat=1.0):  # rebana / snare kecil
    n = int(SR * 0.18)
    t = np.arange(n) / SR
    x = rng.standard_normal(n) * np.exp(-t / 0.035) + np.sin(2 * np.pi * 220 * t) * np.exp(-t / 0.03) * 0.5
    return (x * kuat * 0.5).astype(np.float32)


def simbal(kuat=1.0):
    n = int(SR * 1.6)
    t = np.arange(n) / SR
    x = rng.standard_normal(n).astype(np.float32)
    x = np.diff(np.concatenate([[0], x])).astype(np.float32)  # buang frekuensi rendah
    return (x * np.exp(-t / 0.5) * kuat * 0.25).astype(np.float32)


# ---------------------------------------------------------------- bagian-bagian
D_MINOR = {"i": ["D3", "F3", "A3"], "VI": ["Bb2", "D3", "F3"], "VII": ["C3", "E3", "G3"], "v": ["A2", "C3", "E3"], "iv": ["G2", "Bb2", "D3"], "III": ["F2", "A2", "C3"]}


def akor(nama, at, d, alat, kuat=1.0, oktaf=1.0):
    for k, n in enumerate(D_MINOR[nama]):
        taruh(alat(f(n) * oktaf, d, kuat), at, 1.0, (k - 1) * 0.35)


# 0–3,1 dan 66,6–68,6: kotak musik pagi (D mayor lembut)
def melodi_pagi(t0, t1):
    nada = ["F#5", "A5", "D6", "A5", "F#5", "E5", "D5", "E5"]
    i = 0
    t = t0
    while t < t1 - 0.2:
        taruh(kotak_musik(f(nada[i % len(nada)])), t, 0.35, 0.3)
        if i % 4 == 0:
            taruh(kotak_musik(f("D4"), 1.4), t, 0.25, -0.3)
        t += 0.36
        i += 1
melodi_pagi(0.05, 3.1)
melodi_pagi(66.65, 68.6)

# 3,1–13,06: epik (100 bpm). Colosseum terlihat → genderang besar + senar ostinato + brass.
bpm = 100.0
ketuk = 60 / bpm
urut_akor = ["i", "VI", "VII", "i", "iv", "VI", "v", "i"]
t = 3.15
b = 0
while t < 13.0:
    kuat = 1.0 if t < 7.32 else 0.6  # barak: lebih pelan
    if b % 2 == 0:
        taruh(genderang(kuat), t, 0.9)
    if b % 4 == 3:
        taruh(genderang(kuat * 0.7, 120, 60), t + ketuk * 0.5, 0.7)
    # ostinato senar: D-D-F-D (seperenam belas)
    for s, n in enumerate(["D3", "D3", "F3", "D3"]):
        taruh(senar(f(n), ketuk / 4 * 0.9, 0.5 * kuat), t + s * ketuk / 4, 0.8, -0.4)
    if b % 4 == 0:
        a = urut_akor[(b // 4) % len(urut_akor)]
        akor(a, t, ketuk * 4, pad, 0.35 * kuat)
        if t < 7.32:
            akor(a, t, ketuk * 1.5, brass, 0.55, 2.0)
    t += ketuk
    b += 1
taruh(simbal(1.2), 3.6, 0.8)

# 13,06–25,55: tegang — drone rendah + detak genderang seperti jantung, makin cepat
taruh(pad(f("D2"), 12.6, 0.5), 13.06, 0.9)
taruh(pad(f("A2"), 12.6, 0.3), 13.06, 0.9, 0.3)
t = 13.1
jeda = 0.75
while t < 25.4:
    taruh(genderang(0.8, 80, 45), t, 0.8)
    taruh(genderang(0.5, 70, 42), t + 0.18, 0.6)
    t += jeda
    jeda = max(0.42, jeda * 0.975)
for tt, n in [(22.6, "F3"), (23.84, "G3"), (24.05, "A3")]:
    taruh(senar(f(n), 1.2, 0.6), tt, 0.7)

# 25,55–29,66: duel — 150 bpm, senar berlari, brass menghentak di tiap benturan
ketuk = 60 / 150.0
t = 25.55
b = 0
lari = ["D4", "E4", "F4", "A4", "G4", "F4", "E4", "C#4"]
while t < 29.6:
    taruh(genderang(1.0), t, 0.8)
    taruh(tabuh_kecil(1.0), t + ketuk / 2, 0.7, 0.3)
    for s in range(4):
        taruh(senar(f(lari[(b * 4 + s) % len(lari)]), ketuk / 4 * 0.9, 0.55), t + s * ketuk / 4, 0.8, -0.3)
    t += ketuk
    b += 1
for tb in [0.33, 1.02, 2.85]:
    akor("i", 25.55 + tb, 0.5, brass, 0.8, 2.0)
taruh(simbal(1.0), 25.55 + 1.02, 0.8)
akor("VI", 25.55 + 3.4, 0.7, brass, 0.8, 2.0)

# 29,66–40,24: lucu — pizzicato jenaka (D minor, 120 bpm, lompatan nada)
ketuk = 0.5
t = 29.7
jenaka = ["D3", "A3", "F3", "A3", "D4", "C4", "A3", "F3", "E3", "G3", "Bb3", "G3", "A3", "C#4", "E4", "A3"]
i = 0
while t < 40.2:
    taruh(petik(f(jenaka[i % len(jenaka)])), t, 0.55, 0.35)
    if i % 2 == 0:
        taruh(petik(f("D2" if (i // 8) % 2 == 0 else "A2"), 0.4, 1.0), t, 0.5, -0.35)
    if i % 4 == 2:
        taruh(tabuh_kecil(0.6), t, 0.4)
    t += ketuk / 2
    i += 1

# 40,24–50,9: kembali epik (diampuni, hadiah) — lebih terang (F mayor ke D minor)
ketuk = 60 / 100.0
t = 40.3
b = 0
akor_terang = ["III", "VII", "i", "VI"]
while t < 50.85:
    if b % 2 == 0:
        taruh(genderang(0.8), t, 0.8)
    for s, n in enumerate(["F3", "A3", "C4", "A3"]):
        taruh(senar(f(n), ketuk / 4 * 0.9, 0.4), t + s * ketuk / 4, 0.7, -0.3)
    if b % 4 == 0:
        a = akor_terang[(b // 4) % len(akor_terang)]
        akor(a, t, ketuk * 4, pad, 0.35)
        akor(a, t, ketuk * 1.2, brass, 0.45, 2.0)
    t += ketuk
    b += 1

# 50,9–59,5: epik-jenaka (Flamma 4x): genderang + petikan menggelikan, naik nada tiap potongan
for i in range(4):
    t0 = 53.14 + i * 1.585
    naik = 2 ** (i * 2 / 12)
    for s, n in enumerate(["D3", "F3", "A3", "D4"]):
        taruh(petik(f(n) * naik, 0.3), t0 + 0.2 + s * 0.12, 0.6, 0.3)
    taruh(genderang(0.9), t0, 0.8)
    akor("i", t0, 1.2, pad, 0.3, naik)
taruh(pad(f("D3"), 2.3, 0.3), 50.9, 0.8)
for s, n in enumerate(["D4", "F4", "A4"]):
    taruh(brass(f(n), 0.8, 0.5), 50.9 + s * 0.25, 0.7)

# 59,5–66,6: pertanyaan (pelan, menggantung) → megah saat "duel lagi" (video 64,2) sampai 66,6
taruh(pad(f("A2"), 4.7, 0.35), 59.5, 0.8)
for k, n in enumerate(["E4", "G4", "A4", "C#5"]):
    taruh(petik(f(n), 0.5), 59.6 + k * 0.9, 0.5, 0.2)
ketuk = 60 / 120.0
t = 64.2
b = 0
while t < 66.5:
    taruh(genderang(1.0), t, 0.9)
    if b % 2 == 1:
        taruh(tabuh_kecil(1.0), t, 0.6)
    t += ketuk
    b += 1
akor("i", 64.2, 1.0, brass, 0.9, 2.0)
akor("VI", 65.2, 0.6, brass, 0.9, 2.0)
akor("VII", 65.8, 0.8, brass, 0.9, 2.0)
taruh(simbal(1.3), 64.2, 0.9)

# ---------------------------------------------------------------- simpan
x = np.stack([L, R], axis=1)
x = x / (np.max(np.abs(x)) + 1e-9) * 0.9
with wave.open(os.path.join(HERE, "musik.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((x * 32767).astype("<i2").tobytes())
print("musik selesai")
