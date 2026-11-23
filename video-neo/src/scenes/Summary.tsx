import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Card } from "../components/ui";
import { C, MONO, TITLE, TONES, hard } from "../theme";
import { LEAD, wordFrame } from "../timing";
import { pop } from "../anim";

const ROWS = [
  { n: 1, name: "SIN IA", good: "FUNDAMENTOS · PACIENCIA", bad: "LENTITUD · HORAS EN FOROS" },
  { n: 2, name: "IA EN EL BOLSILLO", good: "APRENDES EN SEGUNDOS", bad: "COPIAR SIN ENTENDER" },
  { n: 3, name: "IA DESDE EL INICIO", good: "DISEÑAR · VERIFICAR · DIRIGIR", bad: "NADIE SABE QUÉ ENSEÑAR" },
];

/** Escena 5 · Cierre: cheat-sheet "GUÁRDALO" + pregunta final. */
export const Summary: React.FC = () => {
  const f = useCurrentFrame();
  const tCard = LEAD + 4;
  const tEnt = wordFrame(4, "entiende") - 4;
  const tCop = wordFrame(4, "copia") - 4;
  const tGuar = wordFrame(4, "guárdalo") - 4;
  const tQ = wordFrame(4, "generación") - 4;
  const saved = f >= tGuar;
  const tone = saved ? TONES.violet : TONES.coal;
  const slam = (s: number) => 1 + 1.3 * Math.pow(1 - Math.min(1, Math.max(0, (f - s) / 7)), 2);
  const sh = f >= tGuar && f < tGuar + 12 ? Math.sin((f - tGuar) * 2.6) * 14 * (1 - (f - tGuar) / 12) : 0;
  const cardT = pop(f, tCard);

  return (
    <AbsoluteFill>
      <Backdrop tone={tone} />
      <AbsoluteFill style={{ transform: `translate(${sh}px, ${-sh * 0.6}px)` }}>
        <div style={{ position: "absolute", left: 60, top: 300, width: 840, transform: `translateY(${(1 - Math.min(1, cardT)) * 80}px)`, opacity: Math.min(1, cardT * 3) }}>
          <Card fill={C.paper} shadow={tone.shadow} d={10} style={{ overflow: "hidden" }}>
            <div style={{ background: C.ink, padding: "18px 30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: TITLE, fontSize: 66, color: C.lime, transform: saved ? `scale(${slam(tGuar)})` : "none", transformOrigin: "left center", display: "inline-block" }}>
                {saved ? "GUÁRDALO ↓" : "CHEAT-SHEET"}
              </span>
              <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, color: C.gray }}>gen.md</span>
            </div>
            {ROWS.map((r, i) => {
              const t = pop(f, tCard + 12 + i * 10, 16, 300, 0.6);
              return (
                <div key={i} style={{ padding: "22px 30px", borderTop: i ? `3px solid ${C.ink}` : "none", transform: `translateX(${(1 - Math.min(1, t)) * -120}px)`, opacity: Math.min(1, t * 3), height: 200, boxSizing: "border-box" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ background: C.lime, border: `3px solid ${C.ink}`, borderRadius: 10, fontFamily: TITLE, fontSize: 38, padding: "0 14px", color: C.ink }}>{r.n}</span>
                    <span style={{ fontFamily: TITLE, fontSize: 46, color: C.ink }}>{r.name}</span>
                  </div>
                  <div style={{ marginTop: 14, fontFamily: MONO, fontWeight: 700, fontSize: 29, color: C.ink, lineHeight: 1.5 }}>
                    <div><span style={{ background: C.lime, padding: "0 8px", marginRight: 10 }}>✓</span>{r.good}</div>
                    <div><span style={{ background: C.violet, color: C.white, padding: "0 8px", marginRight: 10 }}>✗</span>{r.bad}</div>
                  </div>
                </div>
              );
            })}
            <div style={{ background: C.lime, borderTop: `3px solid ${C.ink}`, padding: "14px 28px", display: "flex", gap: 18, fontFamily: TITLE, fontSize: 56, color: C.ink, height: 108, boxSizing: "border-box", alignItems: "center" }}>
              {f >= tEnt && <span style={{ display: "inline-block", transform: `scale(${slam(tEnt)})` }}>ENTIENDE.</span>}
              {f >= tCop && <span style={{ display: "inline-block", transform: `scale(${slam(tCop)})`, background: C.ink, color: C.lime, padding: "0 14px" }}>NO COPIES.</span>}
            </div>
          </Card>
        </div>

        {f >= tQ && (
          <div style={{ position: "absolute", left: 60, top: 1180, width: 840 }}>
            <div style={{ transform: `rotate(-2deg) scale(${slam(tQ)})`, transformOrigin: "left center", background: C.lime, border: `5px solid ${C.ink}`, borderRadius: 18, boxShadow: hard(C.ink, 12), padding: "10px 32px 14px", fontFamily: TITLE, fontSize: 60, lineHeight: 1.03, color: C.ink, whiteSpace: "nowrap" }}>
              ¿DE QUÉ
              <br />
              GENERACIÓN ERES?
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
