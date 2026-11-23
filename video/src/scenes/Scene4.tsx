import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, MONO, W } from "../theme";
import { Brain, Shield } from "../components/Icons";
import { easeInOut, pop, range } from "../anim";
import { wordFrame } from "../timing";

const V = COLORS.g3;
const CENTER = { x: 540, y: 330 };

const BLOCKS = [
  { x: 190, y: 100, label: "API", speed: 0.021 },
  { x: 890, y: 100, label: "DATOS", speed: 0.017 },
  { x: 120, y: 330, label: "INTERFAZ", speed: 0.013 },
  { x: 960, y: 330, label: "LÓGICA", speed: 0.024 },
  { x: 190, y: 560, label: "PRUEBAS", speed: 0.019 },
  { x: 890, y: 560, label: "ÉTICA", speed: 0.015 },
];

/** Escena 4 · Generación 3: diagrama de nodos que se arma solo + escudo de verificación. */
export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const tCenter = wordFrame(3, "llega") - 10;
  const tNodes = wordFrame(3, "educación") - 4;
  const tSyn = wordFrame(3, "sintaxis");
  const tMenos = wordFrame(3, "menos");
  const tSys = wordFrame(3, "sistemas");
  const tShield = wordFrame(3, "verificar") - 4;
  const tDir = wordFrame(3, "dirige") - 12;

  const centerT = pop(f, tCenter, 9, 130);
  const dirT = range(f, tDir, tDir + 18, 0, 1, easeInOut);
  const pulse = 1 + Math.sin(f / 5) * 0.03 + dirT * 0.18;
  const BW = 230;
  const BH = 118;

  return (
    <svg style={{ overflow: "visible" }} width={W} height={800} viewBox={`0 0 ${W} 800`}>
      {/* conexiones */}
      {BLOCKS.map((b, i) => {
        const s = tNodes + i * 6;
        const p = range(f, s, s + 16);
        const x2 = CENTER.x + (b.x - CENTER.x) * p;
        const y2 = CENTER.y + (b.y - CENTER.y) * p;
        const dash = (f * 2.2) % 40;
        return (
          <g key={i}>
            <line x1={CENTER.x} y1={CENTER.y} x2={x2} y2={y2} stroke={V} strokeWidth={6 + dirT * 4} opacity={0.35} />
            <line x1={CENTER.x} y1={CENTER.y} x2={x2} y2={y2} stroke="#fff" strokeWidth={4} strokeDasharray="2 38" strokeDashoffset={-dash} strokeLinecap="round" opacity={p > 0.9 ? 0.9 : 0} />
          </g>
        );
      })}

      {/* bloques trabajando en paralelo */}
      {BLOCKS.map((b, i) => {
        const s = tNodes + i * 6 + 8;
        const t = pop(f, s, 10, 150);
        const prog = ((f - s) * b.speed * (1 + dirT * 1.2)) % 1;
        const done = Math.floor(((f - s) * b.speed * (1 + dirT * 1.2)) % 3);
        return (
          <g key={i} transform={`translate(${b.x} ${b.y}) scale(${t})`} opacity={Math.min(1, t * 2)}>
            <rect x={-BW / 2} y={-BH / 2} width={BW} height={BH} rx={22} fill="#161a22" stroke={V} strokeWidth={5} />
            <text y={-12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={b.label.length > 6 ? 30 : 36} fill={COLORS.white}>
              {b.label}
            </text>
            <rect x={-80} y={20} width={160} height={14} rx={7} fill="#ffffff18" />
            <rect x={-80} y={20} width={Math.max(8, 160 * Math.min(1, prog))} height={14} rx={7} fill={V} />
            <circle cx={BW / 2 - 24} cy={-BH / 2 + 24} r={8} fill={done === 0 ? V : COLORS.green} opacity={0.5 + 0.5 * Math.sin(f / 4 + i)} />
          </g>
        );
      })}

      {/* "memorizar sintaxis" importa menos */}
      {f >= tSyn - 8 && (
        <g
          transform={`translate(540 ${700 - range(f, tMenos, tMenos + 18) * 20}) scale(${pop(f, tSyn - 8, 10, 150) * (1 - range(f, tMenos, tMenos + 18) * 0.55)})`}
          opacity={(1 - range(f, tMenos, tMenos + 18)) * 0.9}
        >
          <text textAnchor="middle" fontFamily={MONO} fontWeight={500} fontSize={64} fill={COLORS.gray}>
            {"{ ; ( ) => }"}
          </text>
        </g>
      )}

      {/* figura central (el ingeniero que dirige) */}
      <g transform={`translate(${CENTER.x} ${CENTER.y}) scale(${centerT * pulse})`}>
        <circle r={150 + dirT * 30} fill={V} opacity={0.12 + dirT * 0.12} />
        <path
          d="M0 -108 L94 -54 V54 L0 108 L-94 54 V-54 Z"
          fill="#161a22"
          stroke={V}
          strokeWidth={9}
          strokeLinejoin="round"
        />
        <g transform="scale(0.85)">
          <Brain color={V} fill={`${V}25`} />
        </g>
        {f > tSys && f < tSys + 40 && (
          <circle r={110 + range(f, tSys, tSys + 40) * 90} fill="none" stroke={V} strokeWidth={5} opacity={1 - range(f, tSys, tSys + 40)} />
        )}
      </g>

      {/* escudo de verificación */}
      {f >= tShield && (
        <g transform={`translate(540 ${640}) scale(${pop(f, tShield, 9, 140) * 0.95})`}>
          <circle r={140} fill={V} opacity={0.18} />
          <Shield color={V} check={range(f, tShield + 10, tShield + 26)} />
        </g>
      )}
    </svg>
  );
};
