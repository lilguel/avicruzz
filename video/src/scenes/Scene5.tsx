import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, RAINBOW, W } from "../theme";
import { Birrete } from "../components/Icons";
import { easeInOut, pop, range } from "../anim";
import { wordFrame } from "../timing";

const LINES = [
  { c: COLORS.g1, y: 90, from: -1 },
  { c: COLORS.g2, y: 300, from: 1 },
  { c: COLORS.g3, y: 510, from: -1 },
];
const YC = 330; // línea final

/** Escena 5 · Cierre: tres colores convergen en una línea brillante; luego los tres birretes. */
export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const tJoin = 18;
  const tMerge = wordFrame(4, "reemplaza") - 12;
  const tQ = wordFrame(4, "generación") - 8;
  const glow = 0.6 + Math.sin(f / 5) * 0.2;
  const shine = ((f * 28) % (W + 600)) - 300;

  return (
    <svg style={{ overflow: "visible" }} width={W} height={800} viewBox={`0 0 ${W} 800`}>
      <defs>
        <linearGradient id="rb" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={COLORS.g1} />
          <stop offset="0.5" stopColor={COLORS.g2} />
          <stop offset="1" stopColor={COLORS.g3} />
        </linearGradient>
        <linearGradient id="shine" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* tres líneas entrando desde los lados */}
      {LINES.map((l, i) => {
        const enter = range(f, tJoin + i * 8, tJoin + i * 8 + 18);
        const merge = range(f, tMerge, tMerge + 26, 0, 1, easeInOut);
        const y = l.y + (YC - l.y) * merge;
        const x1 = l.from < 0 ? -50 : W + 50;
        const xa = l.from < 0 ? -50 + enter * (W + 100) * 0.55 : W + 50 - enter * (W + 100) * 0.55;
        return (
          <g key={i} opacity={1 - merge * 0.0}>
            <line x1={x1} y1={y} x2={xa} y2={y} stroke={l.c} strokeWidth={14 + merge * 6} strokeLinecap="round" />
            <circle cx={xa} cy={y} r={14 + merge * 4} fill={l.c} />
          </g>
        );
      })}

      {/* línea única brillante */}
      {f >= tMerge + 16 && (
        <g opacity={range(f, tMerge + 16, tMerge + 26)}>
          <line x1={0} y1={YC} x2={W} y2={YC} stroke="url(#rb)" strokeWidth={80} opacity={0.18 * glow} strokeLinecap="round" />
          <line x1={0} y1={YC} x2={W} y2={YC} stroke="url(#rb)" strokeWidth={30} opacity={0.35 * glow} strokeLinecap="round" />
          <line x1={0} y1={YC} x2={W} y2={YC} stroke="url(#rb)" strokeWidth={14} strokeLinecap="round" />
          <rect x={shine} y={YC - 7} width={300} height={14} fill="url(#shine)" />
        </g>
      )}

      {/* tres birretes: "¿de qué generación eres?" */}
      {[COLORS.g1, COLORS.g2, COLORS.g3].map((c, i) => {
        const t = pop(f, tQ + i * 6, 9, 150, 0.8);
        const hi = Math.floor(Math.max(0, f - tQ - 24) / 18) % 3 === i && f > tQ + 24;
        return (
          <g key={i} transform={`translate(${190 + i * 350} ${YC + 170 + Math.sin((f + i * 10) / 9) * 8}) scale(${t * 0.68 * (hi ? 1.18 : 1)})`} opacity={t}>
            <circle r={150} fill={c} opacity={hi ? 0.25 : 0.1} />
            <Birrete color={c} />
          </g>
        );
      })}
    </svg>
  );
};
