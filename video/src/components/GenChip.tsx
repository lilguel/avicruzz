import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, LAYOUT, W } from "../theme";
import { pop } from "../anim";

const GEN = [COLORS.g1, COLORS.g2, COLORS.g3];

/** Chip superior "GENERACIÓN n" con tres puntos que indican en cuál vamos. */
export const GenChip: React.FC<{ gen: 1 | 2 | 3 }> = ({ gen }) => {
  const f = useCurrentFrame();
  const t = pop(f, 6, 12, 160);
  const color = GEN[gen - 1];
  return (
    <div
      style={{
        position: "absolute",
        top: LAYOUT.chipY,
        left: 0,
        width: W - 120,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${(1 - t) * -50}px)`,
        opacity: Math.min(1, t * 2),
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "16px 34px",
          borderRadius: 60,
          border: `3px solid ${color}`,
          background: `${color}1c`,
          boxShadow: `0 0 40px ${color}44`,
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          {GEN.map((c, i) => (
            <div
              key={i}
              style={{
                width: i + 1 === gen ? 26 : 14,
                height: 14,
                borderRadius: 8,
                background: c,
                opacity: i + 1 === gen ? 1 : 0.4,
                alignSelf: "center",
              }}
            />
          ))}
        </div>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color, letterSpacing: 3 }}>GENERACIÓN {gen}</span>
      </div>
    </div>
  );
};
