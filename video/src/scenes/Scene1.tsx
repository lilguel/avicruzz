import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, W } from "../theme";
import { Birrete } from "../components/Icons";
import { pop, range } from "../anim";
import { wordFrame } from "../timing";

const CAPS = [
  { x: 190, c: COLORS.g1, n: 1 },
  { x: 540, c: COLORS.g2, n: 2 },
  { x: 890, c: COLORS.g3, n: 3 },
];

/** Escena 1 · Gancho: tres birretes, uno por generación. */
export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const t0 = wordFrame(0, "tres") - 4;
  const tNo = wordFrame(0, "ninguna");
  return (
    <svg style={{ overflow: "visible" }} width={W} height={800} viewBox={`0 0 ${W} 800`}>
      {/* línea que conecta las tres generaciones */}
      <line
        x1={200}
        y1={560}
        x2={200 + range(f, t0 + 40, t0 + 70) * 680}
        y2={560}
        stroke="#ffffff22"
        strokeWidth={6}
        strokeDasharray="4 14"
        strokeLinecap="round"
      />
      {CAPS.map((cap, i) => {
        const s = t0 + i * 20;
        const t = pop(f, s, 9, 150, 0.8);
        const bob = Math.sin((f + i * 14) / 12) * 10;
        const split = range(f, tNo, tNo + 14) * [-40, 50, -20][i]; // "ninguna aprendió igual": cada uno por su lado
        const ring = range(f, s, s + 22);
        return (
          <g key={i} transform={`translate(${cap.x} ${340 + bob + split})`}>
            <circle r={130 * ring} fill="none" stroke={cap.c} strokeWidth={5 * (1 - ring) + 0.1} opacity={1 - ring} />
            <circle r={140} fill={cap.c} opacity={0.12 * t} />
            <g transform={`scale(${t * 0.82}) rotate(${(1 - t) * 40})`}>
              <Birrete color={cap.c} />
            </g>
            <g transform={`translate(0 ${200 - split})`} opacity={t}>
              <circle r={36} fill={cap.c} />
              <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={COLORS.bg}>
                {cap.n}
              </text>
            </g>
          </g>
        );
      })}
      {[365, 715].map((x, i) => {
        const t = pop(f, tNo + 10 + i * 8, 8, 200, 0.6);
        return (
          <g key={x} transform={`translate(${x} ${300 + (i ? -20 : 20)}) scale(${t}) rotate(${(1 - t) * 30})`} opacity={t}>
            <text textAnchor="middle" y={30} fontFamily={FONT} fontWeight={900} fontSize={110} fill={COLORS.white}>
              ≠
            </text>
          </g>
        );
      })}
    </svg>
  );
};
