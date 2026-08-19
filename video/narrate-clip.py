#!/usr/bin/env python3
"""Turn a raw Playwright screen-recording into a demo clip WITH AI voiceover.

  narrate-clip.py <video.webm> <captions.json|NONE> <out.mp4>

- Scales/pads to 1280x800 @25fps.
- Speaks every caption (captions.json, written by support/narration.js) at its
  recorded timestamp, with a small fade in/out per line so speech never pops.

VOICE ENGINES (auto-picked in this order):
  1. Google Cloud TTS  — set GOOGLE_TTS_KEY=<api key>. Neural Indian-English
     voices; free tier 1M chars/month BUT requires billing (a card) on the
     project. Voice: GOOGLE_TTS_VOICE (default en-IN-Neural2-A; male …-B).
  2. edge-tts          — FREE, no card, no key: Microsoft neural voices.
     Install once:  .venv/bin/pip install edge-tts
     Voice: EDGE_TTS_VOICE (default en-IN-NeerjaNeural; male en-IN-PrabhatNeural).
  3. macOS `say`       — offline fallback. VOICE="Rishi (Enhanced)" etc.
  NARRATE=0 skips speech entirely (silent track).

MUSIC BED (optional): put a royalty-free track at e2e/music.mp3 (or MUSIC=path)
and it is looped quietly (7%) under the whole clip — fills the silent stretches
between actions. YouTube Audio Library is a good free source.
"""
import base64
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"command failed: {' '.join(map(str, cmd))}\n{r.stderr[-800:]}")
    return r.stdout


def duration(path):
    out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
               "-of", "default=noprint_wrappers=1:nokey=1", path])
    return float(out.strip())


def pick_say_voice():
    v = os.environ.get("VOICE")
    if v:
        return v
    try:
        voices = subprocess.run(["say", "-v", "?"], capture_output=True, text=True).stdout
        for cand in ("Rishi (Enhanced)", "Rishi"):
            if cand in voices:
                return cand
    except Exception:
        pass
    return None


def tts_google(text, wav_out):
    key = os.environ["GOOGLE_TTS_KEY"]
    voice = os.environ.get("GOOGLE_TTS_VOICE", "en-IN-Neural2-A")
    body = json.dumps({
        "input": {"text": text},
        "voice": {"languageCode": "en-IN", "name": voice},
        "audioConfig": {"audioEncoding": "LINEAR16", "speakingRate": 0.97,
                        "sampleRateHertz": 44100},
    }).encode()
    req = urllib.request.Request(
        "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + key,
        data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        audio = json.loads(r.read())["audioContent"]
    open(wav_out, "wb").write(base64.b64decode(audio))


def find_edge_tts():
    here = os.path.dirname(os.path.abspath(__file__))
    venv_bin = os.path.join(here, ".venv", "bin", "edge-tts")
    if os.path.exists(venv_bin):
        return venv_bin
    return shutil.which("edge-tts")


def tts_edge(text, wav_out, exe):
    voice = os.environ.get("EDGE_TTS_VOICE", "en-IN-NeerjaNeural")
    mp3 = wav_out + ".mp3"
    # NB: must be the --rate=-4% form — argparse eats "-4%" as a flag otherwise.
    rate = os.environ.get("EDGE_TTS_RATE", "-4%")
    run([exe, "--voice", voice, f"--rate={rate}", "--text", text,
         "--write-media", mp3])
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", mp3,
         "-ar", "44100", "-ac", "2", wav_out])
    os.unlink(mp3)


def tts_say(text, wav_out, voice, rate):
    aiff = wav_out + ".aiff"
    cmd = ["say", "-r", str(rate), "-o", aiff]
    if voice:
        cmd += ["-v", voice]
    cmd.append(text)
    run(cmd)
    run(["ffmpeg", "-y", "-loglevel", "error", "-i", aiff,
         "-ar", "44100", "-ac", "2", wav_out])
    os.unlink(aiff)


def find_music():
    m = os.environ.get("MUSIC")
    if m and os.path.exists(m):
        return m
    here = os.path.dirname(os.path.abspath(__file__))
    cand = os.path.join(here, "music.mp3")
    return cand if os.path.exists(cand) else None


def main():
    vid, caps_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
    vf = ("scale=1280:800:force_original_aspect_ratio=decrease,"
          "pad=1280:800:(ow-iw)/2:(oh-ih)/2:color=0xFCF4E2")

    captions = []
    if caps_path != "NONE" and os.path.exists(caps_path):
        try:
            captions = json.load(open(caps_path))
        except Exception:
            captions = []

    use_google = bool(os.environ.get("GOOGLE_TTS_KEY"))
    edge_exe = None if use_google else find_edge_tts()
    narrate = (bool(captions) and os.environ.get("NARRATE", "1") != "0"
               and (use_google or edge_exe or shutil.which("say")))

    if not narrate:
        run(["ffmpeg", "-y", "-loglevel", "error", "-i", vid,
             "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
             "-vf", vf, "-r", "25", "-pix_fmt", "yuv420p",
             "-c:v", "libx264", "-c:a", "aac", "-shortest", out])
        return

    say_voice = None if use_google else pick_say_voice()
    rate = os.environ.get("RATE", "160")
    music = find_music()

    with tempfile.TemporaryDirectory() as td:
        # 1) speak each caption
        segs = []
        for i, c in enumerate(captions):
            wav = os.path.join(td, f"c{i}.wav")
            text = str(c["text"])
            if use_google:
                tts_google(text, wav)
            elif edge_exe:
                tts_edge(text, wav, edge_exe)
            else:
                tts_say(text, wav, say_voice, rate)
            segs.append((max(0, int(c["dt"])), wav, duration(wav)))

        # 1b) NEVER let two lines overlap — if a line's speech runs past the
        # next line's start, push the next line back (a slight visual lag is
        # far better than two voices talking over each other / garble).
        GAP = 250  # ms of breathing room between lines
        fixed = []
        cursor = 0
        for off, wav, d in segs:
            off = max(off, cursor)
            fixed.append((off, wav, d))
            cursor = off + int(d * 1000) + GAP
        segs = fixed

        # 2) extend the video if the last line would be cut off
        vdur = duration(vid)
        need = max(vdur, max(off / 1000 + d for off, _, d in segs) + 0.6)
        pad = need - vdur

        # 3) per-line fades + place each line at its timestamp; optional music bed
        inputs = ["-i", vid]
        for _, wav, _d in segs:
            inputs += ["-i", wav]
        n_music = None
        if music:
            n_music = len(inputs) // 2  # index of the music input below
            inputs += ["-stream_loop", "-1", "-i", music]
        fc, mix = [], []
        for i, (off, _wav, d) in enumerate(segs):
            fo = max(0.0, d - 0.08)
            fc.append(f"[{i + 1}:a]afade=t=in:d=0.05,afade=t=out:st={fo:.2f}:d=0.08,"
                      f"adelay={off}|{off}[a{i}]")
            mix.append(f"[a{i}]")
        n_in = len(segs)
        if music:
            fc.append(f"[{n_in + 1}:a]volume=0.07,afade=t=in:d=1.5[bed]")
            mix.append("[bed]")
            n_in += 1
        fc.append(f"{''.join(mix)}amix=inputs={n_in}:normalize=0[voice]")
        vpad = f",tpad=stop_mode=clone:stop_duration={pad:.2f}" if pad > 0.05 else ""
        fc.append(f"[0:v]{vf}{vpad}[v]")
        run(["ffmpeg", "-y", "-loglevel", "error", *inputs,
             "-filter_complex", ";".join(fc),
             "-map", "[v]", "-map", "[voice]",
             "-r", "25", "-pix_fmt", "yuv420p",
             "-c:v", "libx264", "-c:a", "aac", "-t", f"{need:.2f}", out])


if __name__ == "__main__":
    main()
