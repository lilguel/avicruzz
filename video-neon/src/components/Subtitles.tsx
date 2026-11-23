import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { FPS, LEAD, SCENES, Word } from "../timing";
import { pop } from "../anim";

type Chunk = { words: Word[]; start: number; end: number };

function chunkify(words: Word[]): Chunk[] {
  const chunks: Word[][] = [[]];
  let chars = 0;
  for (const w of words) {
    const cur = chunks[chunks.length - 1];
    if (cur.length && (cur.length >= 3 || chars + w.display.length > 20)) {
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
  const ok = chunks.filter((c) => c.length);
  return ok.map((c, i) => ({
    words: c,
    start: LEAD + Math.round(c[0].start * FPS) - 3,
    end: i < ok.length - 1 ? LEAD + Math.round(ok[i + 1][0].start * FPS) - 3 : LEAD + Math.round(c[c.length - 1].end * FPS) + 20,
  }));
}

/** Subtítulo en cristal oscuro con borde neón, 2–3 palabras, sobre la zona segura inferior. */
export const Subtitles: React.FC<{ sceneIdx: number; accent: string }> = ({ sceneIdx, accent }) => {
  const f = useCurrentFrame();
  const chunks = React.useMemo(() => chunkify(SCENES[sceneIdx].words), [sceneIdx]);
  const chunk = chunks.find((c) => f >= c.start && f < c.end);
  if (!chunk) return null;
  const t = pop(f, chunk.start, 18, 260, 0.6);
  return (
    <div style={{ position: "absolute", left: 60, width: 840, top: 1385, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: `translateY(${(1 - t) * 24}px) scale(${0.9 + 0.1 * t})`,
          opacity: Math.min(1, t * 2.5),
          display: "flex",
          gap: 16,
          padding: "14px 34px 16px",
          background: "rgba(5,8,20,0.88)",
          border: `2px solid ${accent}`,
          borderRadius: 999,
          boxShadow: `0 0 28px ${accent}55`,
        }}
      >
        {chunk.words.map((w, i) => {
          const ws = LEAD + Math.round(w.start * FPS);
          const next = chunk.words[i + 1];
          const active = f >= ws && (!next || f < LEAD + Math.round(next.start * FPS));
          return (
            <span key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: active ? accent : C.white, whiteSpace: "nowrap" }}>
              {w.display}
            </span>
          );
        })}
      </div>
    </div>
  );
};
