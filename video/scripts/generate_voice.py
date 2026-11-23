"""Genera un MP3 por escena con edge-tts, mide su duración y los tiempos de cada palabra.

Salida:
  public/audio/<id>.mp3
  data/timing.json   (duración y palabras con tiempos, por escena)
  TIEMPOS.md         (tabla legible, útil si quieres grabar tu propia voz)

Uso:  python3 scripts/generate_voice.py [--voice es-BO-MarceloNeural]
"""
import argparse, asyncio, json, os, subprocess, unicodedata
from pathlib import Path
import edge_tts

ROOT = Path(__file__).resolve().parent.parent
TICKS = 10_000_000  # edge-tts: unidades de 100 ns


def norm(s: str) -> str:
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn").strip(".,;:¿?¡!\"'")


def probe_duration(path: Path) -> float:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(path)]
    )
    return float(out.decode().strip())


async def synth(text, voice, rate, out_mp3, proxy):
    comm = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary", proxy=proxy)
    words = []
    with open(out_mp3, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append(
                    {
                        "text": chunk["text"],
                        "start": chunk["offset"] / TICKS,
                        "end": (chunk["offset"] + chunk["duration"]) / TICKS,
                    }
                )
    return words


def find_anchor(words, anchor, from_idx):
    a = norm(anchor)
    for i in range(from_idx, len(words)):
        if norm(words[i]["text"]) == a:
            return i
    for i in range(0, len(words)):
        if norm(words[i]["text"]) == a:
            return i
    raise SystemExit(f"Ancla '{anchor}' no encontrada en la narración")


async def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice")
    args = ap.parse_args()
    script = json.loads((ROOT / "data/script.json").read_text())
    voice = args.voice or script["voice"]
    proxy = os.environ.get("HTTPS_PROXY") or None
    lead, tail, fps = script["leadSeconds"], script["tailSeconds"], script["fps"]

    scenes_out, t0 = [], 0.0
    for sc in script["scenes"]:
        mp3 = ROOT / "public/audio" / f"{sc['id']}.mp3"
        words = await synth(sc["text"], voice, sc.get("rate", "+0%"), mp3, proxy)
        dur = probe_duration(mp3)
        frames = round((lead + dur + tail) * fps)
        toks = sc["text"].split()
        if len(toks) == len(words):
            for w, tk in zip(words, toks):
                w["display"] = tk
        else:
            for w in words:
                w["display"] = w["text"]
        kws, cursor = [], 0
        for k in sc["keywords"]:
            idx = find_anchor(words, k["anchor"], cursor)
            cursor = idx
            kws.append({**k, "wordIndex": idx, "at": round(words[idx]["start"], 3)})
        scenes_out.append(
            {
                "id": sc["id"],
                "title": sc["title"],
                "audio": f"audio/{sc['id']}.mp3",
                "audioSeconds": round(dur, 3),
                "startSeconds": round(t0, 3),
                "frames": frames,
                "words": [{**w, "start": round(w["start"], 3), "end": round(w["end"], 3)} for w in words],
                "keywords": kws,
            }
        )
        t0 += frames / fps
        print(f"{sc['id']}: audio {dur:5.2f}s -> escena {frames/fps:5.2f}s")

    total = sum(s["frames"] for s in scenes_out)
    (ROOT / "data/timing.json").write_text(
        json.dumps({"fps": fps, "leadSeconds": lead, "voice": voice, "totalFrames": total, "scenes": scenes_out}, ensure_ascii=False, indent=1)
    )

    md = [f"# Tiempos por escena (voz: {voice})\n", "| Escena | Inicio | Fin | Duración | Voz dura | Texto |", "|---|---|---|---|---|---|"]
    src = {s["id"]: s for s in script["scenes"]}
    for s in scenes_out:
        a, b = s["startSeconds"], s["startSeconds"] + s["frames"] / fps
        md.append(f"| {s['id']} · {s['title']} | {a:.1f}s | {b:.1f}s | {b-a:.1f}s | {s['audioSeconds']:.1f}s | {src[s['id']]['text']} |")
    md.append(f"\n**Total: {total/fps:.1f} s** ({total} frames a {fps} fps). La voz empieza {lead}s después del inicio de cada escena.")
    (ROOT / "TIEMPOS.md").write_text("\n".join(md) + "\n")
    print(f"TOTAL {total/fps:.1f}s")


asyncio.run(main())
