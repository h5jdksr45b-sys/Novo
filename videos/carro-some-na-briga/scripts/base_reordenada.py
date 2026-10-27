"""Abertura nova: fala do 'ligando' primeiro, pergunta do carro depois. Mesmo corte de silêncio no resto."""
import json, subprocess, sys
src, out_dir = sys.argv[1], sys.argv[2]
old = json.load(open(f"{out_dir}/mapa.json"))["segments"]
keep = [[3.742, 8.48], [0.182, 3.547], [8.50, 14.601]] + [[s["src_in"], s["src_out"]] for s in old[2:]]
t = 0; segs = []
for a, b in keep: segs.append({"src_in": a, "src_out": b, "out_in": round(t, 3)}); t += b - a
json.dump({"segments": segs, "duration": round(t, 3)}, open(f"{out_dir}/mapa.json", "w"), indent=1)
fc = ""
for i, (a, b) in enumerate(keep):
    fc += f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS,scale=1080:1920:flags=lanczos,fps=30[v{i}];"
    fc += f"[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={b-a-0.012:.3f}:d=0.012[a{i}];"
fc += "".join(f"[v{i}][a{i}]" for i in range(len(keep))) + f"concat=n={len(keep)}:v=1:a=1[v][a]"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", fc, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", f"{out_dir}/base.mp4"], check=True)
print("duração", round(t, 2))
