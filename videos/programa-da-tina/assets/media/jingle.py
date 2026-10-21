import sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def note_hz(n):
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    name, octave = n[:-1], int(n[-1])
    return 440.0 * 2 ** ((names[name] + 12 * (octave + 1) - 69) / 12)


def brass(freq, dur, amp=1.0, release=0.12):
    n = int((dur + release) * SR)
    t = np.arange(n) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t) * np.clip(t / 0.25, 0, 1)
    phase = 2 * np.pi * freq * np.cumsum(vib) / SR
    # brightness opens on the attack, then settles
    bright = 0.35 + 0.65 * np.exp(-t / 0.08)
    out = np.zeros(n)
    for k in range(1, 14):
        if freq * k > 14000:
            break
        out += np.sin(k * phase + rng.uniform(0, 6.28)) * (bright ** (k - 1)) / k ** 0.9
    for det in (0.997, 1.003):
        out += 0.35 * np.sin(phase * det) + 0.15 * np.sin(2 * phase * det)
    env = np.clip(t / 0.018, 0, 1)
    env *= np.where(t < dur, 1.0, np.exp(-(t - dur) / (release / 3)))
    return out * env * amp


def chord(notes, dur, amp=1.0, release=0.12):
    parts = [brass(note_hz(x), dur, amp / len(notes) ** 0.6, release) for x in notes]
    return np.sum(parts, axis=0)


def noise_hit(dur, decay, hp=0.0, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = rng.standard_normal(n)
    if hp:
        x = np.diff(np.concatenate([[0], x]))  # brighten
        if hp > 1:
            x = np.diff(np.concatenate([[0], x]))
    return x * np.exp(-t / decay) * amp


def snare(amp=1.0):
    n = int(0.18 * SR)
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.03)
    return (0.6 * body + noise_hit(0.18, 0.045, hp=1)) * amp


def kick(amp=1.0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 90 * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12) * amp


def crash(dur=1.6, amp=1.0):
    return noise_hit(dur, 0.55, hp=2, amp=amp) * 0.5


def harp_gliss(start_note, steps, step_dt, direction=1, amp=0.35):
    scale = [0, 2, 4, 7, 9]  # pentatonic sparkle
    base = note_hz(start_note)
    total = int((steps * step_dt + 0.8) * SR)
    out = np.zeros(total)
    for i in range(steps):
        idx = i if direction > 0 else steps - 1 - i
        semis = 12 * (idx // 5) + scale[idx % 5]
        f = base * 2 ** (semis / 12)
        n = int(0.8 * SR)
        t = np.arange(n) / SR
        tone = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t / 0.25)
        s = int(i * step_dt * SR)
        out[s:s + n] += tone
    return out * amp


def place(buf, clip, at):
    s = int(at * SR)
    e = min(len(buf), s + len(clip))
    buf[s:e] += clip[: e - s]


def master(buf, fade_out):
    n = len(buf)
    f = int(fade_out * SR)
    buf[n - f:] *= np.linspace(1, 0, f) ** 2
    # gentle saturation, then normalise to -3 dBFS
    buf = np.tanh(buf * 1.2)
    buf /= np.max(np.abs(buf)) / 0.7
    left = buf
    right = np.roll(buf, 12)
    return np.stack([left, right], axis=1)


def write(path, stereo):
    data = (stereo * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


G = ["G3", "B3", "D4", "G4"]
C = ["C3", "C4", "E4", "G4", "C5"]

# Intro: snare pickup, ta ta ta, TAAA with crash and an upward harp sparkle
intro = np.zeros(int(1.9 * SR))
for i, t0 in enumerate(np.arange(0.0, 0.22, 0.045)):
    place(intro, snare(0.25 + i * 0.08), t0)
place(intro, harp_gliss("C5", 14, 0.05, 1, 0.22), 0.05)
for t0 in (0.25, 0.42, 0.59):
    place(intro, chord(G, 0.1, 1.0, 0.06), t0)
    place(intro, snare(0.5), t0)
place(intro, chord(C, 0.95, 1.4, 0.25), 0.80)
place(intro, kick(1.0), 0.80)
place(intro, crash(1.1, 0.8), 0.80)
write(sys.argv[1], master(intro, 0.35))

# Outro: ta-DAAA with crash and a downward harp sparkle
outro = np.zeros(int(2.2 * SR))
place(outro, chord(G, 0.12, 1.0, 0.06), 0.0)
place(outro, snare(0.5), 0.0)
place(outro, chord(C, 1.3, 1.4, 0.4), 0.22)
place(outro, kick(1.0), 0.22)
place(outro, crash(1.6, 0.8), 0.22)
place(outro, harp_gliss("C5", 12, 0.05, -1, 0.2), 0.3)
write(sys.argv[2], master(outro, 0.6))
