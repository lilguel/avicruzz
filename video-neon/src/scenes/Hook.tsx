import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { C, FONT, NEON, glow } from "../theme";
import { LEAD } from "../timing";
import { pop, range } from "../anim";

const LINES = [
  { text: "3 GENERACIONES", size: 90, grad: false },
  { text: "1 VERDAD", size: 148, grad: true },
  { text: "INCÓMODA", size: 148, grad: true },
];

/** Escena 1 · Gancho: líneas verticales finas + orbes que suben; título con fade + slide vertical. */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const eyebrow = pop(f, 2);
  return (
    <AbsoluteFill>
      <Background lines orbs accent={NEON.cyan} />
      <div style={{ position: "absolute", left: 60, width: 840, top: 340, display: "flex", justifyContent: "center", opacity: Math.min(1, eyebrow * 2) }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: NEON.cyan, border: `2px solid ${NEON.cyan}88`, borderRadius: 999, padding: "10px 28px", boxShadow: glow(NEON.cyan, 24, "44") }}>
          INGENIERÍA DE SOFTWARE × IA
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, width: 840, top: 560, textAlign: "center" }}>
        {LINES.map((l, i) => {
          const s = LEAD + i * 9;
          const t = range(f, s, s + 22);
          return (
            <div key={i} style={{ opacity: t, transform: `translateY(${(1 - t) * 90}px)`, lineHeight: 1.0, marginBottom: i === 0 ? 18 : 0 }}>
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: l.size,
                  letterSpacing: -2,
                  ...(l.grad
                    ? { backgroundImage: `linear-gradient(90deg, ${NEON.cyan}, ${NEON.purple})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: `drop-shadow(0 0 22px ${NEON.purple}66)` }
                    : { color: C.white, textShadow: glow(NEON.cyan, 30, "55") }),
                }}
              >
                {l.text}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
