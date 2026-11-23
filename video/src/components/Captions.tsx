import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, LAYOUT } from "../theme";
import { FPS, LEAD, SCENES, Word } from "../timing";
import { pop } from "../anim";

type Chunk = { words: Word[]; start: number; end: number };

function chunkify(words: Word[]): Chunk[] {
  const chunks: Word[][] = [[]];
  let chars = 0;
  for (const w of words) {
    const cur = chunks[chunks.length - 1];
    if (cur.length && (cur.length >= 3 || chars + w.display.length > 24)) {
      chunks.push([]);
      chars = 0;
    }
    chunks[chunks.length - 1].push(w);
    chars += w.display.length + 1;
    if (/[.,:;?!]$/.test(w.display)) {
      chunks.push([]);
      chars = 0;
    }
  }
  return chunks
    .filter((c) => c.length)
    .map((c, i, all) => ({
      words: c,
      start: LEAD + Math.round(c[0].start * FPS) - 2,
      end: i < all.length - 1 ? LEAD + Math.round(all[i + 1][0].start * FPS) - 2 : LEAD + Math.round(c[c.length - 1].end * FPS) + 14,
    }));
}

/** Subtítulo estilo karaoke (3 palabras), en la franja central-baja, sobre la zona segura de TikTok. */
export const Captions: React.FC<{ sceneIdx: number; accent: string }> = ({ sceneIdx, accent }) => {
  const frame = useCurrentFrame();
  const chunks = React.useMemo(() => chunkify(SCENES[sceneIdx].words), [sceneIdx]);
  const chunk = chunks.find((c) => frame >= c.start && frame < c.end);
  if (!chunk) return null;
  const t = pop(frame, chunk.start, 12, 200, 0.6);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        width: 900,
        top: LAYOUT.captionY,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        transform: `translateY(${(1 - t) * 26}px) scale(${0.92 + 0.08 * t})`,
        opacity: Math.min(1, t * 1.6),
      }}
    >
      {chunk.words.map((w, i) => {
        const ws = LEAD + Math.round(w.start * FPS);
        const active = frame >= ws && (i === chunk.words.length - 1 || frame < LEAD + Math.round(chunk.words[i + 1].start * FPS));
        const spoken = frame >= ws;
        const wt = pop(frame, ws, 10, 220, 0.5);
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 60,
              letterSpacing: -1,
              color: active ? accent : spoken ? COLORS.white : "#ffffff55",
              transform: active ? `scale(${1 + 0.14 * Math.min(1, wt)})` : "scale(1)",
              display: "inline-block",
              margin: "0 17px",
              textShadow: "0 4px 24px #000a",
            }}
          >
            {w.display}
          </span>
        );
      })}
    </div>
  );
};
