import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Card, Win } from "../components/ui";
import { C, TITLE, TONES, hard } from "../theme";
import { LEAD, wordFrame } from "../timing";
import { pop } from "../anim";

const GENS = ["SIN IA", "IA EN EL BOLSILLO", "IA DESDE EL INICIO"];

/** Escena 1 · Hook: "3 GENERACIONES" gigante + pregunta en un input + ✓✗ por generación. */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const tone = TONES.violet;
  const tTres = LEAD;
  const tNing = wordFrame(0, "ninguna") - 4;
  const tGan = wordFrame(0, "ganaron") - 2;
  const tPer = wordFrame(0, "perdieron") - 2;
  const slam = (s: number) => 1 + 1.4 * Math.pow(1 - Math.min(1, Math.max(0, (f - s) / 7)), 2);
  const shake = (s: number) => (f >= s && f < s + 12 ? Math.sin((f - s) * 2.6) * 12 * (1 - (f - s) / 12) : 0);
  const sh = shake(tTres) + shake(tNing);

  return (
    <AbsoluteFill>
      <Backdrop tone={tone} />
      <AbsoluteFill style={{ transform: `translate(${sh}px, ${-sh * 0.5}px)` }}>
        {/* 3 gigante + píldoras de generación */}
        <div style={{ position: "absolute", left: 60, top: 300, width: 840, display: "flex", gap: 30, alignItems: "center" }}>
          {f >= tTres - 2 && (
            <div style={{ transform: `scale(${slam(tTres - 2)})`, transformOrigin: "left center" }}>
              <span style={{ fontFamily: TITLE, fontSize: 400, lineHeight: 0.9, color: C.white, textShadow: hard(C.ink, 14), letterSpacing: -10 }}>3</span>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {GENS.map((g, i) => {
              const t = pop(f, tTres + 14 + i * 8, 16, 300, 0.6);
              const ok = f >= tGan + i * 7;
              const bad = f >= tPer + i * 7;
              return (
                <div key={i} style={{ transform: `translateX(${(1 - Math.min(1, t)) * 200}px)`, opacity: Math.min(1, t * 3) }}>
                  <Card fill={C.paper} shadow={C.ink} d={6} radius={14} style={{ padding: "0 18px", height: 88, width: 520, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: TITLE, fontSize: g.length > 12 ? 27 : 34, color: C.ink }}>
                      [{i + 1}] {g}
                    </span>
                    <span style={{ display: "flex", gap: 8 }}>
                      <Mark show={ok} f={f} s={tGan + i * 7} char="✓" bg={C.lime} fg={C.ink} />
                      <Mark show={bad} f={f} s={tPer + i * 7} char="✗" bg={C.violet} fg={C.white} />
                    </span>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ position: "absolute", left: 60, top: 700, width: 840 }}>
          {f >= tTres + 6 && (
            <div style={{ transform: `scale(${slam(tTres + 6)})`, transformOrigin: "left center" }}>
              <span style={{ fontFamily: TITLE, fontSize: 112, lineHeight: 1, color: C.white, textShadow: hard(C.ink, 8), letterSpacing: -3 }}>GENERACIONES</span>
            </div>
          )}
        </div>

        <div style={{ position: "absolute", left: 60, top: 840, width: 840 }}>
          {f >= tNing && (
            <div style={{ transform: `rotate(-2deg) scale(${slam(tNing)})`, transformOrigin: "left center", display: "inline-block" }}>
              <div style={{ background: C.lime, border: `5px solid ${C.ink}`, borderRadius: 16, boxShadow: hard(C.ink, 10), padding: "8px 30px 12px", fontFamily: TITLE, fontSize: 66, lineHeight: 1.08, color: C.ink }}>
                NINGUNA APRENDIÓ
                <br />
                IGUAL
              </div>
            </div>
          )}
        </div>

        {/* input con la pregunta clave */}
        <div style={{ position: "absolute", left: 60, top: 1100, width: 840 }}>
          <Win f={f} start={tNing + 20} title="pregunta.txt" lines={[{ t: "> ¿cuál sobrevive?", k: "cmd" }]} tone={tone} height={170} fontSize={40} cps={26} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Mark: React.FC<{ show: boolean; f: number; s: number; char: string; bg: string; fg: string }> = ({ show, f, s, char, bg, fg }) => (
  <div
    style={{
      width: 50,
      height: 50,
      borderRadius: 10,
      border: `3px solid ${C.ink}`,
      background: show ? bg : "transparent",
      color: fg,
      fontFamily: TITLE,
      fontSize: 32,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${show ? Math.min(1.3, pop(f, s, 12, 380)) : 1})`,
      opacity: show ? 1 : 0.35,
      boxSizing: "border-box",
    }}
  >
    {show ? char : ""}
  </div>
);
