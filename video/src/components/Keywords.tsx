import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, LAYOUT, RAINBOW, W, accentOf, ColorKey } from "../theme";
import { LEAD, FPS, SCENES, Keyword } from "../timing";
import { pop, range } from "../anim";

const MAX_W = 930;
const CHAR_W = 0.7; // ancho medio de una mayúscula Montserrat Black (en em), medido

function wrap(words: string[], size: number) {
  const lines: string[][] = [[]];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    const len = (cur.join(" ").length + (cur.length ? 1 : 0) + w.length) * CHAR_W * size;
    if (cur.length && len > MAX_W) lines.push([w]);
    else cur.push(w);
  }
  const widest = Math.max(...lines.map((l) => l.join(" ").length * CHAR_W * size));
  return { lines, widest };
}

function layoutWords(text: string) {
  const words = text.split(" ");
  for (const [maxLines, sizes] of [
    [2, [150, 134, 120, 108, 96, 86]],
    [3, [104, 92, 84]],
  ] as [number, number[]][]) {
    for (const size of sizes) {
      const { lines, widest } = wrap(words, size);
      if (lines.length <= maxLines && widest <= MAX_W) return { size, lines };
    }
  }
  return { size: 72, lines: [words] };
}

const wordColorStyle = (color: ColorKey, idx: number): React.CSSProperties => {
  if (color === "rainbow")
    return { backgroundImage: RAINBOW, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" };
  if (color === "white") return { color: COLORS.white };
  return { color: COLORS[color] };
};

type Group = { items: Keyword[]; start: number; end: number; isLast: boolean };

function buildGroups(sceneIdx: number): Group[] {
  const sc = SCENES[sceneIdx];
  const groups: { items: Keyword[]; start: number }[] = [];
  for (const k of sc.keywords) {
    const start = LEAD + Math.round(k.at * FPS) - 3; // el golpe visual cae sobre la palabra
    if (k.append && groups.length) groups[groups.length - 1].items.push(k);
    else groups.push({ items: [k], start });
  }
  return groups.map((g, i) => ({
    ...g,
    end: i < groups.length - 1 ? groups[i + 1].start : sc.frames,
    isLast: i === groups.length - 1,
  }));
}

const KeywordLine: React.FC<{ kw: Keyword; frame: number; start: number; accent: string }> = ({ kw, frame, start, accent }) => {
  const { size, lines } = layoutWords(kw.text);
  let n = 0;
  return (
    <div style={{ textAlign: "center", marginBottom: 6 }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", justifyContent: "center", gap: size * 0.22, lineHeight: 1.04 }}>
          {line.map((w, wi) => {
            const k = n++;
            const t = pop(frame, start + k * 3, 9, 170, 0.65);
            const op = range(frame, start + k * 3, start + k * 3 + 4, 0, 1);
            return (
              <span
                key={wi}
                style={{
                  display: "inline-block",
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: size,
                  letterSpacing: -2,
                  opacity: op,
                  transform: `translateY(${(1 - t) * 90}px) scale(${0.35 + 0.65 * t}) rotate(${(1 - t) * -5}deg)`,
                  textShadow: kw.color === "rainbow" ? undefined : `0 0 46px ${kw.color === "white" ? "#ffffff30" : accentOf(kw.color) + "66"}`,
                  filter: kw.color === "rainbow" ? "drop-shadow(0 0 22px #ffffff25)" : undefined,
                  ...wordColorStyle(kw.color, k),
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
      <div
        style={{
          height: 10,
          borderRadius: 5,
          margin: "16px auto 0",
          width: `${range(frame, start + 6, start + 20) * 46}%`,
          background: kw.color === "white" || kw.color === "rainbow" ? RAINBOW : accentOf(kw.color),
          boxShadow: `0 0 24px ${accent}88`,
        }}
      />
    </div>
  );
};

/** Palabras clave grandes en la zona central, sincronizadas con la voz. */
export const Keywords: React.FC<{ sceneIdx: number; accent: string }> = ({ sceneIdx, accent }) => {
  const frame = useCurrentFrame();
  const groups = buildGroups(sceneIdx);
  return (
    <>
      {groups.map((g, gi) => {
        if (frame < g.start - 1 || frame > g.end) return null;
        const exit = g.isLast ? 0 : range(frame, g.end - 7, g.end, 0, 1);
        return (
          <div
            key={gi}
            style={{
              position: "absolute",
              left: (W - MAX_W) / 2 - 10,
              width: MAX_W + 20,
              top: LAYOUT.keywordCenterY,
              transform: `translateY(-50%) translateY(${-exit * 60}px) scale(${1 + exit * 0.08})`,
              opacity: 1 - exit,
            }}
          >
            {g.items.map((kw, ki) => (
              <KeywordLine
                key={ki}
                kw={kw}
                frame={frame}
                start={LEAD + Math.round(kw.at * FPS) - 3}
                accent={accent}
              />
            ))}
          </div>
        );
      })}
    </>
  );
};
