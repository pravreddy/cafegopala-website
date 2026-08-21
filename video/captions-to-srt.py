#!/usr/bin/env python3
"""captions-to-srt.py <captions.json> <out.srt>

Converts a walkthrough's captions.json (list of {dt: ms-from-start, text})
into a YouTube-ready .srt subtitle file. Each caption runs until the next one
starts (minus a 200ms gap); the last one shows for 6 seconds.
"""
import json, sys

def ts(ms):
    ms = max(0, int(ms))
    h, ms = divmod(ms, 3600_000); m, ms = divmod(ms, 60_000); s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"

src, dst = sys.argv[1], sys.argv[2]
caps = json.load(open(src))
lines = []
for i, c in enumerate(caps):
    start = c["dt"]
    end = caps[i+1]["dt"] - 200 if i+1 < len(caps) else start + 6000
    if end <= start: end = start + 1500
    lines += [str(i+1), f"{ts(start)} --> {ts(end)}", c["text"].strip(), ""]
open(dst, "w").write("\n".join(lines))
print(f"wrote {dst} ({len(caps)} captions)")
