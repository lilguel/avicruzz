import React from "react";
import { C, FONT, NEON, glow } from "../theme";
import { LineIcon } from "./Icons";
import { pop, range } from "../anim";

export type CardData = {
  color: string;
  icon: "book" | "phone" | "nodes";
  gen: string;
  sub: string;
  anchor: string;
  metrics: [string, number][];
  gain: string;
  lose: string;
};

/** Tarjeta: ícono + título, gráfico de barras animado en secuencia y caja inferior con punto de color. */
export const DeckCard: React.FC<{ d: CardData; f: number; t0: number }> = ({ d, f, t0 }) => {
  const rel = f - t0;
  const head = pop(f, t0 + 2, 18, 240);
  return (
    <div
      style={{
        width: 840,
        height: 900,
        boxSizing: "border-box",
        background: C.card,
        border: `2px solid ${d.color}`,
        borderRadius: 36,
        boxShadow: `${glow(d.color, 44, "66")}, inset 0 0 60px ${d.color}14`,
        padding: 40,
        display: "flex",
        flexDirection: "column",
        fontFamily: FONT,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: Math.min(1, head * 2), transform: `translateY(${(1 - Math.min(1, head)) * 30}px)` }}>
        <div style={{ width: 96, height: 96, borderRadius: 24, border: `2px solid ${d.color}`, background: `${d.color}14`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: glow(d.color, 22, "55") }}>
          <LineIcon kind={d.icon} color={d.color} size={58} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 56, color: C.white, lineHeight: 1.05 }}>{d.gen}</div>
          <div style={{ fontWeight: 700, fontSize: 30, color: d.color, letterSpacing: 3 }}>{d.sub}</div>
        </div>
      </div>

      <div style={{ marginTop: 34, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {d.metrics.map(([label, v], k) => {
          const s = 10 + k * 12;
          const show = range(rel, s, s + 10);
          const fill = range(rel, s + 6, s + 40, 0, v / 100);
          const col = k === 2 ? NEON.orange : d.color;
          return (
            <div key={k} style={{ opacity: show, transform: `translateX(${(1 - show) * -40}px)` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 28, color: C.text, letterSpacing: 1 }}>{label}</span>
                <span style={{ fontWeight: 800, fontSize: 40, color: col }}>{Math.round(fill * 100)}</span>
              </div>
              <div style={{ height: 38, borderRadius: 19, background: "#141A2A", border: `1px solid ${C.line}`, overflow: "hidden" }}>
                <div style={{ width: `${fill * 100}%`, height: "100%", borderRadius: 19, background: `linear-gradient(90deg, ${col}88, ${col})`, boxShadow: glow(col, 18, "aa") }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 26, borderRadius: 24, background: `${d.color}12`, border: `1px solid ${d.color}55`, padding: "20px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { label: "GANA", text: d.gain, col: d.color, at: 52 },
          { label: "PIERDE", text: d.lose, col: NEON.orange, at: 66 },
        ].map((r, i) => {
          const t = pop(rel, r.at, 18, 260);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: Math.min(1, t * 2), transform: `translateY(${(1 - Math.min(1, t)) * 20}px)` }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: r.col, boxShadow: glow(r.col, 16, "cc"), flexShrink: 0 }} />
              <span style={{ fontWeight: 800, fontSize: 26, color: r.col, letterSpacing: 2, width: 118, flexShrink: 0 }}>{r.label}</span>
              <span style={{ fontWeight: 500, fontSize: 33, color: C.text, lineHeight: 1.2 }}>{r.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
