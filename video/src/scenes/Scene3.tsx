import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, MONO, W } from "../theme";
import { Brain, Bulb, CopyIcon, Phone, Sparkle } from "../components/Icons";
import { easeInOut, phaseOpacity, pop, range } from "../anim";
import { wordFrame } from "../timing";

const C = COLORS.g2;
const G = COLORS.grayMid;

const Classroom: React.FC<{ f: number }> = ({ f }) => {
  const lines = ["E = m·c²", "a² + b² = c²", "x = (−b ± √Δ) / 2a"];
  return (
    <g>
      <rect x={120} y={30} width={840} height={340} rx={16} fill="#1b1f27" stroke={G} strokeWidth={9} />
      <rect x={100} y={370} width={880} height={22} rx={8} fill={COLORS.grayDark} />
      {[0, 1, 2].map((i) => (
        <clipPath id={`chalk${i}`} key={i}>
          <rect x={160} y={70 + i * 100} width={range(f, 12 + i * 22, 40 + i * 22) * 760} height={90} />
        </clipPath>
      ))}
      {lines.map((l, i) => (
        <text key={i} x={170} y={140 + i * 100} fontFamily={MONO} fontSize={62} fill={COLORS.gray} clipPath={`url(#chalk${i})`}>
          {l}
        </text>
      ))}
      {[210, 540, 870].map((x, i) => {
        const t = pop(f, 6 + i * 6, 12, 140);
        return (
          <g key={i} transform={`translate(${x} ${600 + (1 - t) * 120})`} opacity={t}>
            {/* silla */}
            <rect x={-60} y={-70} width={120} height={20} rx={8} fill={COLORS.grayDark} />
            {/* mesa */}
            <rect x={-110} y={-30} width={220} height={26} rx={8} fill={COLORS.grayDark} stroke={G} strokeWidth={4} />
            <line x1={-80} y1={-4} x2={-80} y2={90} stroke={G} strokeWidth={7} strokeLinecap="round" />
            <line x1={80} y1={-4} x2={80} y2={90} stroke={G} strokeWidth={7} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
};

const TaskCard: React.FC<{ f: number; tTareas: number; tResuelve: number }> = ({ f, tTareas, tResuelve }) => {
  const rows = 5;
  const solved = f >= tResuelve;
  const day = Math.min(3, 1 + Math.floor(range(f, tTareas + 8, tResuelve - 4, 0, 3, (x) => x)));
  const counterPop = pop(f, tResuelve + 10, 8, 200, 0.6);
  return (
    <g>
      <rect x={-210} y={-250} width={420} height={500} rx={28} fill="#161a22" stroke={solved ? C : G} strokeWidth={7} />
      <rect x={-170} y={-212} width={170} height={20} rx={10} fill={solved ? C : COLORS.gray} />
      {Array.from({ length: rows }, (_, i) => {
        const tick = range(f, tResuelve + i * 4, tResuelve + i * 4 + 6);
        return (
          <g key={i} transform={`translate(-170 ${-150 + i * 76})`}>
            <rect width={48} height={48} rx={12} fill="none" stroke={tick > 0 ? C : G} strokeWidth={6} />
            <path d="M10 25 L21 36 L40 12" fill="none" stroke={C} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={50} strokeDashoffset={50 * (1 - tick)} />
            <rect x={72} y={8} width={230 - (i % 3) * 40} height={14} rx={7} fill={solved ? "#ffffff30" : "#ffffff18"} />
            <rect x={72} y={30} width={150 - (i % 2) * 40} height={12} rx={6} fill="#ffffff14" />
          </g>
        );
      })}
      {/* contador: DÍAS → SEG */}
      <g transform={`translate(0 ${-300})`}>
        {!solved ? (
          <text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={70} fill={COLORS.gray}>
            {day} {day === 1 ? "DÍA" : "DÍAS"}
          </text>
        ) : (
          <g transform={`scale(${0.6 + 0.4 * counterPop})`}>
            <text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={78} fill={C}>
              3 SEG
            </text>
          </g>
        )}
      </g>
    </g>
  );
};

const Balance: React.FC<{ f: number; t0: number; tSettle: number }> = ({ f, t0, tSettle }) => {
  const settle = range(f, tSettle, tSettle + 30, 0, 1, easeInOut);
  const theta = Math.sin((f - t0) / 6) * 15 * (1 - settle) * range(f, t0, t0 + 10) + settle * 13;
  const rad = (theta * Math.PI) / 180;
  const L = 330;
  const lx = 540 - L * Math.cos(rad);
  const ly = 200 - L * Math.sin(rad);
  const rx = 540 + L * Math.cos(rad);
  const ry = 200 + L * Math.sin(rad);
  const Pan: React.FC<{ x: number; y: number; color: string; label: string; children: React.ReactNode }> = ({ x, y, color, label, children }) => (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0 L-115 170 M0 0 L115 170" stroke={color} strokeWidth={5} opacity={0.7} />
      <path d="M-135 170 H135 Q110 228 0 228 Q-110 228 -135 170 Z" fill={color} fillOpacity={0.25} stroke={color} strokeWidth={7} strokeLinejoin="round" />
      <g transform="translate(0 92)">{children}</g>
      <text y={296} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={color} letterSpacing={2}>
        {label}
      </text>
    </g>
  );
  const sc = pop(f, t0 - 2, 10, 140);
  return (
    <g transform={`translate(540 400) scale(${0.9 * sc}) translate(-540 -400)`} opacity={Math.min(1, sc * 2)}>
      <path d="M540 200 L480 640 H600 Z" fill={COLORS.grayDark} stroke={C} strokeWidth={6} strokeLinejoin="round" />
      <rect x={440} y={640} width={200} height={22} rx={10} fill={C} />
      <line x1={lx} y1={ly} x2={rx} y2={ry} stroke={C} strokeWidth={14} strokeLinecap="round" />
      <circle cx={540} cy={200} r={20} fill={C} />
      <Pan x={lx} y={ly} color={COLORS.gray} label="COPIAR">
        <g transform="scale(0.9)">
          <CopyIcon color={COLORS.gray} />
        </g>
      </Pan>
      <Pan x={rx} y={ry} color={C} label="ENTENDER">
        <g transform="scale(0.8)">
          <Brain color={C} fill={`${C}22`} />
        </g>
      </Pan>
    </g>
  );
};

/** Escena 3 · Generación 2: aula gris + celular cian, tarea que se resuelve, balanza, bombilla. */
export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const tBols = wordFrame(2, "bolsillo") - 6;
  const tTar = wordFrame(2, "tareas") - 4;
  const tRes = wordFrame(2, "resuelve");
  const tDil = wordFrame(2, "dilema") - 8;
  const tEnt = wordFrame(2, "entender");
  const tLuz = wordFrame(2, "luz") - 10;

  const classroomOpacity = phaseOpacity(f, 0, tLuz) * (f < tBols ? 1 : f < tDil ? 0.22 : 0.1);
  const phoneT = pop(f, tBols, 10, 130);
  const phoneOut = range(f, tDil, tDil + 12);
  const moveLeft = range(f, tTar, tTar + 16, 0, 1, easeInOut);
  const phoneX = 540 - moveLeft * 290;
  const phoneS = 0.92 - moveLeft * 0.3;
  const phoneY = 410 - (1 - phoneT) * -500;

  const halo = 0.14 + Math.sin(f / 7) * 0.05;
  const lit = range(f, tLuz, tLuz + 6) * (0.9 + 0.1 * Math.sin(f / 4));
  const bulbT = pop(f, tLuz - 4, 10, 130);

  return (
    <svg style={{ overflow: "visible" }} width={W} height={800} viewBox={`0 0 ${W} 800`}>
      <g opacity={classroomOpacity}>
        <Classroom f={f} />
      </g>

      {/* celular que brilla */}
      <g opacity={(1 - phoneOut) * Math.min(1, phoneT * 2)} transform={`translate(${phoneX} ${phoneY}) scale(${phoneS})`}>
        <circle r={330} fill={C} opacity={halo} />
        {[0, 1, 2].map((i) => {
          const p = ((f + i * 20) % 60) / 60;
          return <circle key={i} r={150 + p * 230} fill="none" stroke={C} strokeWidth={5} opacity={(1 - p) * 0.5} />;
        })}
        <Phone color={C}>
          <g transform={`translate(0 -110) scale(${1 + Math.sin(f / 5) * 0.12}) rotate(${f * 1.5})`}>
            <Sparkle color={C} size={1.1} />
          </g>
          <rect x={-90} y={-20} width={140} height={34} rx={17} fill="#ffffff22" />
          <rect x={-40} y={32} width={130} height={34} rx={17} fill={C} fillOpacity={0.55} />
          <rect x={-90} y={84} width={range(f % 70, 0, 40) * 170 + 10} height={26} rx={13} fill={C} fillOpacity={0.35} />
          <rect x={-90} y={124} width={range((f + 25) % 70, 0, 40) * 120 + 10} height={26} rx={13} fill={C} fillOpacity={0.25} />
        </Phone>
      </g>

      {/* tarea que se resuelve sola */}
      {f >= tTar && f < tDil + 10 && (
        <g
          transform={`translate(${720} ${430 + (1 - pop(f, tTar + 4, 12, 140)) * 600}) scale(${0.95 - range(f, tDil, tDil + 10) * 0.2})`}
          opacity={1 - range(f, tDil, tDil + 10)}
        >
          <TaskCard f={f} tTareas={tTar} tResuelve={tRes} />
        </g>
      )}

      {/* balanza: atajo vs herramienta */}
      {f >= tDil - 2 && f < tLuz + 4 && (
        <g opacity={phaseOpacity(f, tDil, tLuz + 4, 8)}>
          <Balance f={f} t0={tDil} tSettle={tEnt} />
        </g>
      )}

      {/* bombilla */}
      {f >= tLuz - 6 && (
        <g transform={`translate(540 360)`} opacity={Math.min(1, bulbT * 2)}>
          <circle r={420 * lit} fill={C} opacity={0.14 * lit} />
          <circle r={260 * lit} fill={C} opacity={0.16 * lit} />
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2 + f / 90;
            const r1 = 220 + Math.sin(f / 6 + i) * 10;
            const r2 = r1 + 70 * lit + (i % 2) * 24;
            return (
              <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} stroke={C} strokeWidth={9} strokeLinecap="round" opacity={lit} />
            );
          })}
          <g transform={`scale(${1.55 * bulbT}) translate(0 -20)`}>
            <Bulb color={C} lit={lit} />
          </g>
          {[[-300, -190], [310, -150], [-260, 190], [300, 200]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${(0.5 + 0.5 * Math.sin(f / 6 + i * 2)) * lit * 0.9})`}>
              <Sparkle color="#fff" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
};
