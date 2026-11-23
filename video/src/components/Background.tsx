import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, H, W } from "../theme";
import { seeded } from "../anim";

/** Fondo oscuro con rejilla en movimiento, resplandor y formas flotantes del color de la generación. */
export const Background: React.FC<{ accent: string }> = ({ accent }) => {
  const f = useCurrentFrame();
  const shapes = Array.from({ length: 16 }, (_, i) => {
    const x = seeded(i + 1) * W;
    const size = 18 + seeded(i + 40) * 46;
    const speed = 0.5 + seeded(i + 80) * 1.3;
    const y = (((seeded(i + 120) * H - f * speed) % (H + 200)) + (H + 200)) % (H + 200) - 100;
    const kind = i % 3;
    const rot = f * (1 + seeded(i) * 2) * (i % 2 ? 1 : -1);
    return { x, y, size, kind, rot, i };
  });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 700px at ${50 + Math.sin(f / 40) * 12}% ${28 + Math.cos(f / 55) * 5}%, ${accent}30, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${accent}12 2px, transparent 2px), linear-gradient(90deg, ${accent}12 2px, transparent 2px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `${f * 0.6}px ${f * 1.1}px`,
          maskImage: "radial-gradient(ellipse at 50% 35%, black 10%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 35%, black 10%, transparent 75%)",
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {shapes.map((s) => (
          <g key={s.i} transform={`translate(${s.x} ${s.y}) rotate(${s.rot})`} opacity={0.16} fill="none" stroke={accent} strokeWidth={4}>
            {s.kind === 0 && <circle r={s.size / 2} />}
            {s.kind === 1 && <rect x={-s.size / 2} y={-s.size / 2} width={s.size} height={s.size} rx={6} />}
            {s.kind === 2 && <path d={`M${-s.size / 2} 0H${s.size / 2}M0 ${-s.size / 2}V${s.size / 2}`} />}
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};
