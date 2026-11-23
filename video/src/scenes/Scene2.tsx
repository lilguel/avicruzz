import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONT, MONO, W } from "../theme";
import { Book, Clock, Gear } from "../components/Icons";
import { easeInOut, phaseOpacity, pop, range, seeded } from "../anim";
import { wordFrame } from "../timing";
import { interpolateColors } from "remotion";

const A = COLORS.g1;
const SC = 1;

// Cada línea de código: lista de [texto, color]
type Seg = [string, string];
const CODE: Seg[][] = [
  [["def ", "#C792EA"], ["total", "#82AAFF"], ["(items):", COLORS.white]],
  [["  s = ", COLORS.white], ["0", A]],
  [["  for ", "#C792EA"], ["x ", COLORS.white], ["in ", "#C792EA"], ["items:", COLORS.white]],
  [["    s += x.price", COLORS.white]],
  [["  return ", "#C792EA"], ["s", COLORS.white]],
  [["print(", "#82AAFF"], ["totl", COLORS.red], ["(items))", "#82AAFF"]],
];

const Books: React.FC<{ f: number; start: number }> = ({ f, start }) => {
  const books = [
    { w: 520, h: 76, c: A, x: 0 },
    { w: 460, h: 70, c: "#FFD27A", x: 26 },
    { w: 500, h: 74, c: "#C77F0C", x: -22 },
    { w: 430, h: 68, c: A, x: 18 },
    { w: 470, h: 72, c: "#FFD27A", x: -14 },
    { w: 400, h: 66, c: "#C77F0C", x: 8 },
  ];
  return (
    <g>
      {books.map((b, i) => {
        const s = start + i * 8;
        const t = pop(f, s, 8, 170, 0.8);
        const y = 700 - i * 76 - (1 - t) * 700;
        return (
          <g key={i} transform={`translate(${540 + b.x} ${y}) rotate(${(1 - t) * (i % 2 ? 14 : -14)})`} opacity={range(f, s, s + 3)}>
            <Book w={b.w} h={b.h} color={b.c} />
          </g>
        );
      })}
    </g>
  );
};

const TOTAL_CHARS = CODE.reduce((a, l) => a + l.reduce((b, s) => b + s[0].length, 0), 0);

const CodeWindow: React.FC<{ f: number; start: number; errAt: number; fixAt: number }> = ({ f, start, errAt, fixAt }) => {
  const typed = Math.floor(Math.max(0, f - start) * 1.15);
  let remaining = typed;
  const fixed = f >= fixAt;
  const errT = pop(f, errAt, 10, 180, 0.6);
  const fixP = range(f, fixAt, fixAt + 10);
  const barColor = interpolateColors(fixP, [0, 1], [COLORS.red, COLORS.green]);
  return (
    <g>
      <rect x={110} y={10} width={860} height={420} rx={26} fill="#161a22" stroke={A} strokeWidth={5} />
      <path d="M110 36 a26 26 0 0 1 26 -26 H944 a26 26 0 0 1 26 26 V70 H110Z" fill="#1d222c" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={150 + i * 34} cy={40} r={9} fill={[COLORS.red, A, COLORS.green][i]} />
      ))}
      <text x={540} y={48} textAnchor="middle" fontFamily={MONO} fontSize={24} fill={COLORS.gray}>
        main.py
      </text>
      {CODE.map((line, li) => {
        const lineLen = line.reduce((a, s) => a + s[0].length, 0);
        const shown = Math.max(0, Math.min(lineLen, remaining));
        remaining -= lineLen;
        let used = 0;
        const isErrLine = li === CODE.length - 1;
        return (
          <g key={li} transform={`translate(0 ${118 + li * 50})`}>
            <text x={140} fontFamily={MONO} fontSize={26} fill={COLORS.grayMid}>
              {li + 1}
            </text>
            <text x={190} fontFamily={MONO} fontSize={33} xmlSpace="preserve" style={{ whiteSpace: "pre" }}>
              {line.map((seg, si) => {
                const take = Math.max(0, Math.min(seg[0].length, shown - used));
                used += seg[0].length;
                const txt = isErrLine && si === 1 && fixed ? (take >= seg[0].length ? "total" : "total".slice(0, take)) : seg[0].slice(0, take);
                return (
                  <tspan key={si} fill={isErrLine && si === 1 && fixed ? COLORS.green : seg[1]}>
                    {txt}
                  </tspan>
                );
              })}
              {shown > 0 && shown < lineLen && Math.floor(f / 5) % 2 === 0 && <tspan fill={A}>▌</tspan>}
            </text>
          </g>
        );
      })}
      {/* barra de error → éxito */}
      {f >= errAt && (
        <g transform={`translate(110 ${430 - 70 * Math.min(1, errT)})`} opacity={Math.min(1, errT * 2)}>
          <rect width={860} height={70} rx={0} fill={barColor} fillOpacity={0.22} />
          <rect width={10} height={70} fill={barColor} />
          <text x={34} y={46} fontFamily={MONO} fontSize={30} fill={barColor} fontWeight={500}>
            {fixed ? "✓ 0 errores · todo bien" : "✕ NameError: 'totl' no existe"}
          </text>
        </g>
      )}
    </g>
  );
};

const Keyboard: React.FC<{ f: number; start: number }> = ({ f, start }) => {
  const rows = [12, 11, 9];
  const lit = Math.floor((f - start) / 3);
  return (
    <g transform="translate(0 0)">
      {rows.map((n, r) =>
        Array.from({ length: n }, (_, i) => {
          const idx = r * 12 + i;
          const on = f > start && Math.floor(seeded(lit + 1) * 33) === idx;
          const keyW = 62;
          const x = 540 - (n * (keyW + 10)) / 2 + i * (keyW + 10) + (r === 1 ? 14 : r === 2 ? 40 : 0) + 5;
          return <rect key={idx} x={x} y={10 + r * 62} width={keyW} height={50} rx={10} fill={on ? A : "#1d222c"} stroke={on ? A : "#2f3541"} strokeWidth={3} />;
        }),
      )}
    </g>
  );
};

const Wall: React.FC<{ f: number; start: number }> = ({ f, start }) => {
  const rows = [
    { y: 740, n: 5, off: 0 },
    { y: 690, n: 4, off: 80 },
    { y: 640, n: 5, off: 0 },
  ];
  let k = 0;
  return (
    <g>
      {rows.map((row, r) =>
        Array.from({ length: row.n }, (_, i) => {
          const idx = k++;
          const t = pop(f, start + idx * 3, 11, 160, 0.7);
          const bw = 170;
          const x = 540 - (5 * (bw + 8)) / 2 + row.off + i * (bw + 8) + bw / 2 + 4;
          return (
            <g key={idx} transform={`translate(${x + (1 - t) * (idx % 2 ? 400 : -400)} ${row.y})`} opacity={Math.min(1, t * 2)}>
              <rect x={-bw / 2} y={-22} width={bw} height={44} rx={6} fill={r === 0 ? "#C77F0C" : r === 1 ? A : "#FFD27A"} />
              <rect x={-bw / 2 + 8} y={-14} width={bw - 16} height={8} rx={4} fill="#fff" opacity={0.18} />
            </g>
          );
        }),
      )}
    </g>
  );
};

/** Escena 2 · Generación 1: libros → código → reloj/error → fundamentos y paciencia. */
export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const tBooks = 8;
  const tCode = wordFrame(1, "escribía") - 4;
  const tErr = wordFrame(1, "depurando") + 6;
  const tFix = wordFrame(1, "pero") - 14;
  const tFound = wordFrame(1, "fundamentos") - 6;
  const tPat = wordFrame(1, "paciencia") - 8;

  const phaseA = phaseOpacity(f, 0, tCode + 6, 10);
  const phaseB = phaseOpacity(f, tCode, tFix + 16, 10);
  const phaseC = phaseOpacity(f, tFound);
  const clockT = pop(f, tCode + 22, 10, 150);
  const gearRot = f * 1.1;

  return (
    <svg style={{ overflow: "visible" }} width={W} height={800} viewBox={`0 0 ${W} 800`}>
      {/* A · libros */}
      <g opacity={phaseA} transform={`translate(0 ${range(f, tCode, tCode + 12, 0, 40)})`}>
        <Books f={f} start={tBooks} />
      </g>

      {/* B · código + teclado + reloj */}
      <g opacity={phaseB} transform={`translate(0 ${(1 - phaseB) * 30})`}>
        <CodeWindow f={f} start={tCode + 10} errAt={tErr} fixAt={tFix - 4} />
        <g transform="translate(0 510)">
          <Keyboard f={f} start={tCode + 14} />
        </g>
        <g transform={`translate(870 110) scale(${clockT})`}>
          <Clock r={86} color={A} minute={(f - tCode) * 16} />
        </g>
      </g>

      {/* C · fundamentos (ladrillos) + paciencia (engranes) */}
      <g opacity={phaseC}>
        <Wall f={f} start={tFound} />
        <g transform={`translate(${440} ${300}) scale(${pop(f, tPat, 10, 120)})`}>
          <Gear R={150} color={A} teeth={14} rotate={gearRot} />
        </g>
        <g transform={`translate(${690} ${400}) scale(${pop(f, tPat + 6, 10, 120)})`}>
          <Gear R={90} color="#FFD27A" teeth={10} rotate={-gearRot * 1.4 + 12} hole={0.3} />
        </g>
      </g>
    </svg>
  );
};
