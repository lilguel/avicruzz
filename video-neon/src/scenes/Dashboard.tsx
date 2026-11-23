import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { C, FONT, NEON, glow } from "../theme";
import { LEAD, wordFrame } from "../timing";
import { easeInOut, pop, range } from "../anim";

// ============ DATOS DEL DASHBOARD (estimación ilustrativa) ============
const GENS = [
  { name: "GEN 1 · SIN IA", color: NEON.cyan },
  { name: "GEN 2 · IA EN EL BOLSILLO", color: NEON.purple },
  { name: "GEN 3 · IA DESDE EL INICIO", color: NEON.green },
];
const GROUPS = [
  { label: "FUNDAMENTOS", cx: 220, v: [90, 55, 70] },
  { label: "VELOCIDAD", cx: 480, v: [25, 85, 95] },
  { label: "DEPENDENCIA", cx: 740, v: [0, 75, 90] },
];
const BASE = 1130; // línea base del gráfico (coordenadas del mundo)
const MAXH = 560;
const BAR_W = 62;
const BAR_STEP = 80;

type Cam = { cx: number; cy: number; s: number };
type Box = { x: number; y: number; w: number; h: number; label: string };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Escena 4 · Dashboard oscuro con cámara virtual (scale + translate) y recuadro azul neón sobre el dato clave. */
export const Dashboard: React.FC = () => {
  const f = useCurrentFrame();
  const tDatos = wordFrame(3, "datos") - 6;
  const tVel = wordFrame(3, "velocidad") - 16;
  const tFun = wordFrame(3, "fundamentos") - 16;
  const tDep = wordFrame(3, "dependencia") - 16;
  const tRem = wordFrame(3, "reemplazable") - 30;

  // keyframes de cámara: se mueve hacia cada punto durante 38 frames desde su `t`
  const WIDE: Cam = { cx: 480, cy: 830, s: 1 };
  const cams: { t: number; c: Cam }[] = [
    { t: 0, c: { cx: 480, cy: 800, s: 0.96 } },
    { t: tDatos, c: WIDE },
    { t: tVel, c: { cx: 480, cy: 905, s: 1.5 } },
    { t: tFun, c: { cx: 220, cy: 905, s: 1.5 } },
    { t: tDep, c: { cx: 740, cy: 905, s: 1.5 } },
    { t: tRem, c: WIDE },
  ];
  const MOVE = 38;
  let cam = cams[0].c;
  for (let i = 1; i < cams.length; i++) {
    const k = range(f, cams[i].t, cams[i].t + MOVE, 0, 1, easeInOut);
    if (k > 0) cam = { cx: lerp(cams[i - 1].c.cx, cams[i].c.cx, k), cy: lerp(cams[i - 1].c.cy, cams[i].c.cy, k), s: lerp(cams[i - 1].c.s, cams[i].c.s, k) };
  }
  // pequeña deriva para que nunca esté estático
  const drift = { x: Math.sin(f / 70) * 6, y: Math.cos(f / 90) * 6 };

  // recuadro de enfoque: una sola caja que se desplaza entre los datos clave
  const boxes: { t: number; b: Box }[] = [
    { t: tVel, b: { x: 342, y: 535, w: 276, h: 690, label: "VELOCIDAD ▲" } },
    { t: tFun, b: { x: 82, y: 535, w: 276, h: 690, label: "FUNDAMENTOS" } },
    { t: tDep, b: { x: 602, y: 535, w: 276, h: 690, label: "DEPENDENCIA" } },
    { t: tRem, b: { x: 770, y: 575, w: 96, h: 570, label: "EL RIESGO" } },
  ];
  let box: Box | null = null;
  for (let i = 0; i < boxes.length; i++) {
    const k = range(f, boxes[i].t, boxes[i].t + 26, 0, 1, easeInOut);
    if (k <= 0) continue;
    if (i === 0) box = { ...boxes[0].b, w: boxes[0].b.w * k };
    else {
      const a = boxes[i - 1].b, b = boxes[i].b;
      box = { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k), label: k > 0.5 ? b.label : a.label };
    }
  }

  const panelIn = pop(f, 0, 20, 180);
  const grow = (g: number, k: number) => range(f, 14 + g * 10 + k * 5, 14 + g * 10 + k * 5 + 40);
  const callout = pop(f, tRem + 40, 16, 240);
  const pulse = 0.6 + 0.4 * Math.sin(f / 7);

  return (
    <AbsoluteFill>
      <Background accent={NEON.blue} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          height: 1920,
          transformOrigin: "0 0",
          transform: `translate(${540 + drift.x}px, ${840 + drift.y}px) scale(${cam.s}) translate(${-cam.cx}px, ${-cam.cy}px)`,
          opacity: Math.min(1, panelIn * 2),
        }}
      >
        {/* panel */}
        <div style={{ position: "absolute", left: 60, top: 330, width: 840, height: 1000, borderRadius: 28, background: C.card, border: `2px solid ${NEON.blue}66`, boxShadow: glow(NEON.blue, 40, "33") }} />
        <div style={{ position: "absolute", left: 96, top: 352, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.white }}>MI LECTURA</div>
        <div style={{ position: "absolute", left: 96, top: 402, fontFamily: FONT, fontWeight: 500, fontSize: 24, color: C.muted }}>ingeniería × IA · nivel 0–100</div>
        <div style={{ position: "absolute", right: 130, top: 360, display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 700, fontSize: 22, color: NEON.green }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: NEON.green, opacity: pulse, boxShadow: glow(NEON.green, 14, "cc") }} />
          EN VIVO
        </div>

        {/* leyenda */}
        <div style={{ position: "absolute", left: 96, top: 450, display: "flex", gap: 22 }}>
          {GENS.map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: FONT, fontWeight: 700, fontSize: 19, color: C.text, opacity: range(f, 8 + i * 4, 18 + i * 4) }}>
              <div style={{ width: 16, height: 16, borderRadius: 5, background: g.color, boxShadow: glow(g.color, 12, "aa") }} />
              {["GEN 1", "GEN 2", "GEN 3"][i]}
            </div>
          ))}
        </div>

        {/* cuadrícula */}
        {[0, 25, 50, 75, 100].map((v) => (
          <React.Fragment key={v}>
            <div style={{ position: "absolute", left: 120, width: 760, top: BASE - (v / 100) * MAXH, height: 1, background: C.line }} />
            <div style={{ position: "absolute", left: 80, top: BASE - (v / 100) * MAXH - 12, fontFamily: FONT, fontSize: 18, color: C.muted, fontWeight: 500 }}>{v}</div>
          </React.Fragment>
        ))}

        {/* barras */}
        {GROUPS.map((g, gi) =>
          g.v.map((val, k) => {
            const h = (val / 100) * MAXH * grow(gi, k);
            const x = g.cx - 111 + k * BAR_STEP;
            const col = GENS[k].color;
            const risk = gi === 2 && k === 2 && f > tRem + 30;
            const c = risk ? NEON.orange : col;
            return (
              <React.Fragment key={`${gi}-${k}`}>
                <div style={{ position: "absolute", left: x, top: BASE - h, width: BAR_W, height: h, borderRadius: "10px 10px 0 0", background: `linear-gradient(180deg, ${c}, ${c}55)`, boxShadow: glow(c, risk ? 26 : 16, risk ? `${Math.round(60 + pulse * 100).toString(16)}` : "77") }} />
                <div style={{ position: "absolute", left: x - 10, width: BAR_W + 20, top: BASE - h - 36, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: c, opacity: grow(gi, k) > 0.7 ? 1 : 0 }}>{val}</div>
              </React.Fragment>
            );
          }),
        )}
        {GROUPS.map((g) => (
          <div key={g.label} style={{ position: "absolute", left: g.cx - 130, width: 260, top: BASE + 18, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.text, letterSpacing: 1 }}>
            {g.label}
          </div>
        ))}

        <div style={{ position: "absolute", left: 96, top: 1218, fontFamily: FONT, fontWeight: 500, fontSize: 21, color: C.muted }}>Estimación ilustrativa · mi opinión, no un estudio</div>

        {/* callout final */}
        {f >= tRem + 40 && (
          <div style={{ position: "absolute", left: 60, width: 840, top: 1262, display: "flex", justifyContent: "center", transform: `scale(${0.8 + 0.2 * Math.min(1, callout)})`, opacity: Math.min(1, callout * 2) }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: NEON.orange, background: `${NEON.orange}1f`, border: `2px solid ${NEON.orange}`, borderRadius: 999, padding: "10px 30px", boxShadow: glow(NEON.orange, 26, "66"), whiteSpace: "nowrap" }}>
              SIN CRITERIO = REEMPLAZABLE
            </div>
          </div>
        )}

        {/* focus box azul neón */}
        {box && (
          <div style={{ position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h }}>
            <div style={{ position: "absolute", inset: 0, border: `3px solid ${NEON.blue}`, borderRadius: 14, boxShadow: `${glow(NEON.blue, 26, "dd")}, inset 0 0 30px ${NEON.blue}44`, background: `${NEON.blue}0f` }} />
            {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b], i) => (
              <div key={i} style={{ position: "absolute", [a ? "right" : "left"]: -8, [b ? "bottom" : "top"]: -8, width: 22, height: 22, background: "#fff", borderRadius: 4, boxShadow: glow(NEON.blue, 12, "ff") }} />
            ))}
            <div style={{ position: "absolute", left: 0, top: -52, background: NEON.blue, color: "#fff", fontFamily: FONT, fontWeight: 800, fontSize: 24, padding: "6px 16px", borderRadius: 10, whiteSpace: "nowrap", boxShadow: glow(NEON.blue, 18, "aa") }}>{box.label}</div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

