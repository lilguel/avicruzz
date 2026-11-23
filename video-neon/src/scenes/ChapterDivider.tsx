import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { getLength, getPointAtLength } from "@remotion/paths";
import { C, FONT, NEON } from "../theme";
import { easeInOut, pop, range } from "../anim";

const CHAPTER = "[ GANARON · PERDIERON ]";
const PATH = "M 100 1010 C 300 860, 430 1230, 620 1070 S 860 880, 905 1120";
const LEN = getLength(PATH);

/** Escena 2 · Divisor de capítulo: corte brusco a blanco, píldora negra y línea curva con punto guía. */
export const ChapterDivider: React.FC = () => {
  const f = useCurrentFrame();
  const t = pop(f, 3, 18, 240);
  const p = range(f, 8, 8 + 70, 0, 1, easeInOut);
  const pt = getPointAtLength(PATH, LEN * p) ?? { x: 100, y: 1010 };
  return (
    <AbsoluteFill style={{ backgroundColor: C.white }}>
      <div style={{ position: "absolute", left: 60, width: 840, top: 640, textAlign: "center", opacity: Math.min(1, t * 2) }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: "#000" }}>CAPÍTULO 01</div>
      </div>
      <div style={{ position: "absolute", left: 60, width: 840, top: 720, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${0.85 + 0.15 * Math.min(1, t)})`,
            opacity: Math.min(1, t * 2),
            background: "#000",
            color: C.white,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 50,
            padding: "26px 52px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            letterSpacing: 1,
          }}
        >
          {CHAPTER}
        </div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={PATH} fill="none" stroke="#00000014" strokeWidth={6} strokeLinecap="round" />
        <path d={PATH} fill="none" stroke="#000" strokeWidth={6} strokeLinecap="round" strokeDasharray={LEN} strokeDashoffset={LEN * (1 - p)} />
        <circle cx={pt.x} cy={pt.y} r={34} fill={NEON.blue} opacity={0.18} />
        <circle cx={pt.x} cy={pt.y} r={17} fill="#000" stroke="#fff" strokeWidth={4} />
      </svg>
    </AbsoluteFill>
  );
};
