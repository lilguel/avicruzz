import React from "react";
import { BODY, C, MONO, TITLE, Tone, hard } from "../theme";
import { FPS } from "../timing";
import { pop, range } from "../anim";

/** Ajusta tamaño de fuente y saltos de línea para que quepa en `maxW`. */
export function fitTitle(text: string, maxW: number, maxSize: number, maxLines = 2, charW = 0.74) {
  const words = text.split(" ");
  for (let size = maxSize; size >= 40; size -= 4) {
    const lines: string[] = [""];
    for (const w of words) {
      const cur = lines[lines.length - 1];
      const next = cur ? cur + " " + w : w;
      if (cur && next.length * charW * size > maxW) lines.push(w);
      else lines[lines.length - 1] = next;
    }
    if (lines.length <= maxLines && Math.max(...lines.map((l) => l.length)) * charW * size <= maxW) return { size, lines };
  }
  return { size: 40, lines: [text] };
}

export const Card: React.FC<{
  fill: string;
  shadow: string;
  d?: number;
  radius?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ fill, shadow, d = 8, radius = 16, style, children }) => (
  <div
    style={{
      background: fill,
      border: `3px solid ${C.ink}`,
      borderRadius: radius,
      boxShadow: hard(shadow, d),
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{ children: React.ReactNode; fill?: string; color?: string; shadow?: string; size?: number; style?: React.CSSProperties }> = ({
  children,
  fill = C.lime,
  color = C.ink,
  shadow = C.ink,
  size = 40,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 26px",
      background: fill,
      color,
      border: `3px solid ${C.ink}`,
      borderRadius: 60,
      boxShadow: hard(shadow, 5),
      fontFamily: TITLE,
      fontSize: size,
      letterSpacing: 0.5,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

export type TermLine = { t: string; k: "cmd" | "ok" | "err" | "out" };

const lineColor = (k: TermLine["k"]) => (k === "ok" ? C.lime : k === "err" ? C.violetLight : k === "out" ? C.gray : C.white);

/** Ventana de editor/terminal estilo macOS con máquina de escribir y cursor lima. */
export const Win: React.FC<{
  f: number;
  start: number;
  title: string;
  lines: TermLine[];
  tone: Tone;
  height?: number;
  cps?: number;
  fontSize?: number;
}> = ({ f, start, title, lines, tone, height = 300, cps = 40, fontSize = 33 }) => {
  const cpf = cps / FPS;
  const pause = Math.round(FPS * 0.18);
  let t0 = start;
  const timed = lines.map((l) => {
    const s = t0;
    t0 += Math.ceil(l.t.length / cpf) + pause;
    return { ...l, s };
  });
  const typing = timed.findIndex((l) => f >= l.s && (f - l.s) * cpf < l.t.length);
  const cursorLine = typing >= 0 ? typing : Math.max(0, timed.filter((l) => f >= l.s).length - 1);
  const blink = typing >= 0 || Math.floor(f / (FPS / 2)) % 2 === 0;
  const enter = pop(f, start - 4);
  return (
    <div style={{ transform: `translateY(${(1 - Math.min(1, enter)) * 40}px)`, opacity: Math.min(1, enter * 2) }}>
      <Card fill={C.ink} shadow={tone.shadow} style={{ height, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: C.paper, borderBottom: `3px solid ${C.ink}` }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c, border: `2px solid ${C.ink}` }} />
          ))}
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.ink, marginLeft: 12 }}>{title}</span>
        </div>
        <div style={{ padding: "22px 26px", fontFamily: MONO, fontWeight: 500, fontSize, lineHeight: 1.55, whiteSpace: "pre" }}>
          {timed.map((l, i) => {
            const n = Math.max(0, Math.min(l.t.length, Math.floor((f - l.s) * cpf)));
            if (f < l.s) return null;
            const txt = l.t.slice(0, n);
            const prompt = l.k === "cmd" && /^[$>]/.test(txt);
            return (
              <div key={i} style={{ color: lineColor(l.k) }}>
                {prompt ? (
                  <>
                    <span style={{ color: C.lime }}>{txt[0]}</span>
                    {txt.slice(1)}
                  </>
                ) : (
                  txt
                )}
                {i === cursorLine && blink && <span style={{ display: "inline-block", width: 18, height: fontSize, background: C.lime, verticalAlign: "text-bottom", marginLeft: 3 }} />}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

/** Tarjeta de checklist (lo bueno = lima, lo malo = papel con ✗ violeta). */
export const ItemCard: React.FC<{ f: number; start: number; text: string; kind: "good" | "bad"; tone: Tone; width?: number }> = ({
  f,
  start,
  text,
  kind,
  tone,
  width = 840,
}) => {
  const t = pop(f, start, 18, 300, 0.55);
  if (f < start) return null;
  const mark = pop(f, start + 6, 14, 340);
  const fs = Math.min(44, (width - 170) / (text.length * 0.74));
  const good = kind === "good";
  return (
    <div style={{ transform: `translateX(${(1 - Math.min(1, t)) * -140}px)`, opacity: Math.min(1, t * 3) }}>
      <Card fill={good ? C.lime : C.paper} shadow={tone.shadow} d={8} style={{ width, height: 98, display: "flex", alignItems: "center", gap: 22, padding: "0 22px", boxSizing: "border-box" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: good ? C.ink : C.violet,
            color: good ? C.lime : C.white,
            fontFamily: TITLE,
            fontSize: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${Math.max(0, mark)})`,
            flexShrink: 0,
          }}
        >
          {good ? "✓" : "✗"}
        </div>
        <span style={{ fontFamily: TITLE, fontSize: fs, color: C.ink, letterSpacing: 0.3, whiteSpace: "nowrap" }}>{text}</span>
      </Card>
    </div>
  );
};

/** Sello gigante "LO BUENO / LO MALO" que golpea la pantalla. */
export const Stamp: React.FC<{ f: number; start: number; good: boolean; tone: Tone }> = ({ f, start, good, tone }) => {
  if (f < start) return null;
  const k = spring3(f, start);
  return (
    <div style={{ transform: `rotate(-3deg) scale(${k})`, transformOrigin: "left center", display: "inline-block" }}>
      <div
        style={{
          display: "inline-block",
          background: good ? C.lime : C.violet,
          color: good ? C.ink : C.white,
          border: `5px solid ${C.ink}`,
          borderRadius: 20,
          boxShadow: hard(tone.name === "coal" ? C.lime : C.ink, 12),
          padding: "6px 36px 10px",
          fontFamily: TITLE,
          fontSize: 98,
          letterSpacing: -1,
          lineHeight: 1.1,
          whiteSpace: "nowrap",
        }}
      >
        {good ? "✓ LO BUENO" : "✗ LO MALO"}
      </div>
    </div>
  );
};

// golpe seco: llega grande y se asienta sin rebote elástico
const spring3 = (f: number, start: number) => 1 + 1.6 * Math.pow(1 - range(f, start, start + 6, 0, 1), 2);

/** Medidor "USO DE IA" que se llena. */
export const Meter: React.FC<{ f: number; start: number; end: number; value: number; tone: Tone; label: string }> = ({ f, start, end, value, tone, label }) => {
  const p = range(f, start, end, 0, value);
  const t = pop(f, start - 4);
  return (
    <div style={{ opacity: Math.min(1, t * 2), transform: `translateY(${(1 - Math.min(1, t)) * 50}px)` }}>
      <Card fill={C.paper} shadow={tone.shadow} style={{ height: 250, padding: "26px 30px", boxSizing: "border-box", width: 840 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.ink }}>{label}</span>
          <span style={{ fontFamily: TITLE, fontSize: 96, color: C.ink, lineHeight: 1 }}>{Math.round(p * 100)}%</span>
        </div>
        <div style={{ marginTop: 18, height: 62, border: `3px solid ${C.ink}`, borderRadius: 14, background: "#fff", overflow: "hidden" }}>
          <div style={{ width: `${p * 100}%`, height: "100%", background: C.lime, borderRight: p > 0.01 ? `3px solid ${C.ink}` : "none" }} />
        </div>
      </Card>
    </div>
  );
};
