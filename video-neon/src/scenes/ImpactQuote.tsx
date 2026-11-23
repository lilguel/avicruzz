import React from "react";
import { AbsoluteFill, Freeze, useCurrentFrame } from "remotion";
import { Dashboard } from "./Dashboard";
import { FONT, NEON, glow } from "../theme";
import { SCENES } from "../timing";
import { easeInOut, pop, range } from "../anim";

/** Escena 5 · Frase de impacto: escena anterior congelada con backdropFilter blur(12px) + caja azul neón. */
export const ImpactQuote: React.FC = () => {
  const f = useCurrentFrame();
  const blur = range(f, 0, 14, 0, 12, easeInOut);
  const t = pop(f, 8, 20, 200, 0.8);
  return (
    <AbsoluteFill>
      <Freeze frame={SCENES[3].frames - 1}>
        <Dashboard />
      </Freeze>
      <AbsoluteFill style={{ backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`, background: `rgba(0,0,0,${0.18 + blur * 0.025})` }} />
      <div style={{ position: "absolute", left: 60, width: 840, top: 560, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${0.88 + 0.12 * Math.min(1, t)})`,
            opacity: Math.min(1, t * 2),
            width: 800,
            boxSizing: "border-box",
            padding: "56px 50px",
            borderRadius: 32,
            border: `3px solid ${NEON.blue}`,
            background: "rgba(5,8,20,0.78)",
            boxShadow: `${glow(NEON.blue, 50, "99")}, inset 0 0 50px ${NEON.blue}22`,
            textAlign: "center",
            fontFamily: FONT,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 26, letterSpacing: 6, color: NEON.blue, marginBottom: 24 }}>[ VEREDICTO ]</div>
          <div style={{ fontWeight: 800, fontSize: 66, lineHeight: 1.12, color: "#fff" }}>
            LA IA NO REEMPLAZA AL QUE <span style={{ color: NEON.green, textShadow: glow(NEON.green, 24, "88") }}>ENTIENDE</span>.
          </div>
          <div style={{ fontWeight: 800, fontSize: 66, lineHeight: 1.12, color: "#fff", marginTop: 20 }}>
            REEMPLAZA AL QUE <span style={{ color: NEON.orange, textShadow: glow(NEON.orange, 24, "88") }}>SOLO COPIA</span>.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
