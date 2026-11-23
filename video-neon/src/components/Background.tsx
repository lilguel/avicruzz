import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, H, NEON, W } from "../theme";
import { seeded } from "../anim";

/** Negro puro con luz ambiental azul oscuro; opcionalmente líneas verticales y orbes que suben. */
export const Background: React.FC<{ accent?: string; lines?: boolean; orbs?: boolean }> = ({ accent = NEON.blue, lines = false, orbs = false }) => {
  const f = useCurrentFrame();
  const colors = [NEON.cyan, NEON.purple, NEON.green, NEON.blue, NEON.orange];
  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <AbsoluteFill style={{ background: `radial-gradient(1100px 1500px at 50% 35%, ${C.ambient}, #000 72%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(900px 500px at 50% 105%, ${accent}22, transparent 70%)` }} />
      {lines && (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="vl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {Array.from({ length: 10 }, (_, i) => {
            const x = 54 + i * 108;
            const y = (((f * (2 + (i % 4)) + i * 400) % (H + 700)) - 500);
            return (
              <g key={i}>
                <line x1={x} y1={0} x2={x} y2={H} stroke="#fff" strokeOpacity={0.07} strokeWidth={1.5} />
                <rect x={x - 1.5} y={y} width={3} height={420} fill="url(#vl)" opacity={0.45} />
              </g>
            );
          })}
        </svg>
      )}
      {orbs &&
        Array.from({ length: 16 }, (_, i) => {
          const size = 16 + seeded(i + 3) * 60;
          const x = seeded(i + 11) * W;
          const speed = 0.8 + seeded(i + 31) * 1.8;
          const y = H + 100 - (((f * speed + seeded(i + 51) * (H + 300)) % (H + 300)));
          const c = colors[i % colors.length];
          const op = 0.35 + 0.35 * Math.sin(f / 30 + i);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x + Math.sin(f / 60 + i) * 18 - size / 2,
                top: y,
                width: size,
                height: size,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${c} 0%, ${c}55 40%, transparent 70%)`,
                filter: `blur(${size > 50 ? 6 : 2}px)`,
                opacity: op,
              }}
            />
          );
        })}
    </AbsoluteFill>
  );
};
