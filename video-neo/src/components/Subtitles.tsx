import React from "react";
import { useCurrentFrame } from "remotion";
import { BODY, C, hard } from "../theme";
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

/** Lower-third: píldora negra con sombra lima, 2–3 palabras, entrada pop. Sobre la zona segura inferior. */
export const Subtitles: React.FC<{ sceneIdx: number }> = ({ sceneIdx }) => {
  const f = useCurrentFrame();
  const chunks = React.useMemo(() => chunkify(SCENES[sceneIdx].words), [sceneIdx]);
  const chunk = chunks.find((c) => f >= c.start && f < c.end);
  if (!chunk) return null;
  const t = pop(f, chunk.start, 14, 380, 0.5);
  return (
    <div style={{ position: "absolute", left: 60, width: 840, top: 1368, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: `scale(${0.7 + 0.3 * t}) rotate(${(1 - t) * -3}deg)`,
          opacity: Math.min(1, t * 3),
          display: "flex",
          gap: 18,
          padding: "16px 38px 18px",
          background: C.ink,
          border: `4px solid ${C.lime}`,
          borderRadius: 22,
          boxShadow: hard(C.lime, 8),
        }}
      >
        {chunk.words.map((w, i) => {
          const ws = LEAD + Math.round(w.start * FPS);
          const next = chunk.words[i + 1];
          const active = f >= ws && (!next || f < LEAD + Math.round(next.start * FPS));
          return (
            <span key={i} style={{ fontFamily: BODY, fontWeight: 800, fontSize: 60, letterSpacing: -0.5, color: active ? C.lime : C.white, whiteSpace: "nowrap" }}>
              {w.display}
            </span>
          );
        })}
      </div>
    </div>
  );
};
