import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Card, ItemCard, Meter, Pill, Stamp, TermLine, Win, fitTitle } from "../components/ui";
import { C, MONO, TITLE, TONES, ToneName, hard } from "../theme";
import { FPS, LEAD, wordFrame } from "../timing";
import { pop, range } from "../anim";

type Phase = { title: string; lines: TermLine[] };
export type GenConfig = {
  sceneIdx: number;
  step: number;
  pill: string;
  introTitle: string;
  tones: [ToneName, ToneName, ToneName]; // intro, lo bueno, lo malo
  meter: { value: number; note: string };
  win: { intro: Phase; good: Phase; bad: Phase };
  good: { text: string; at: string }[];
  bad: { text: string; at: string }[];
};

const ITEM_Y = 995;

/** Escena de generación: intro (medidor de IA) → ✓ LO BUENO → ✗ LO MALO, con corte brusco de fondo en cada fase. */
export const GenScene: React.FC<{ cfg: GenConfig }> = ({ cfg }) => {
  const f = useCurrentFrame();
  const i = cfg.sceneIdx;
  const tBueno = wordFrame(i, "bueno") - 4;
  const tMalo = wordFrame(i, "malo") - 4;
  const phase = f >= tMalo ? 2 : f >= tBueno ? 1 : 0;
  const tone = TONES[cfg.tones[phase]];
  const phaseStart = [0, tBueno, tMalo][phase];

  // golpe de pantalla al cambiar de fase
  const since = f - phaseStart;
  const shake = phase > 0 && since < 12 ? Math.sin(since * 2.6) * 14 * (1 - since / 12) : 0;

  const goodItems = cfg.good.map((g) => ({ ...g, start: wordFrame(i, g.at) - 4 }));
  const badItems = cfg.bad.map((g) => ({ ...g, start: wordFrame(i, g.at) - 4 }));
  const nGood = goodItems.filter((g) => f >= g.start).length;
  const nBad = badItems.filter((g) => f >= g.start).length;

  const win = [cfg.win.intro, cfg.win.good, cfg.win.bad][phase];
  const winStart = [LEAD + 10, tBueno + 8, tMalo + 8][phase];

  const { size, lines } = fitTitle(cfg.introTitle, 840, 124, 2);
  const titleStart = 4;

  return (
    <AbsoluteFill>
      <Backdrop tone={tone} />
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${-shake * 0.6}px)` }}>
        {/* cabecera: paso + marcador */}
        <div style={{ position: "absolute", left: 60, top: 300, width: 840, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ transform: `scale(${Math.min(1, pop(f, 2))})`, transformOrigin: "left center" }}>
            <Pill size={42} shadow={tone.shadow}>
              [{cfg.step}] {cfg.pill}
            </Pill>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <Pill size={40} fill={C.lime} shadow={tone.shadow}>
              ✓ {nGood}
            </Pill>
            <Pill size={40} fill={C.violet} color={C.white} shadow={tone.shadow}>
              ✗ {nBad}
            </Pill>
          </div>
        </div>

        {/* zona de título / sello */}
        <div style={{ position: "absolute", left: 60, top: 400, width: 840, height: 240, display: "flex", alignItems: "center" }}>
          {phase === 0 ? (
            <div>
              {lines.map((l, li) => {
                const t = pop(f, titleStart + li * 5, 16, 300, 0.6);
                const last = li === lines.length - 1;
                return (
                  <div key={li} style={{ transform: `translateY(${(1 - Math.min(1, t)) * 70}px)`, opacity: Math.min(1, t * 3), marginBottom: 6 }}>
                    <span
                      style={{
                        display: "inline-block",
                        fontFamily: TITLE,
                        fontSize: size,
                        lineHeight: 1.02,
                        letterSpacing: -2,
                        color: last ? C.ink : tone.fg,
                        background: last ? C.lime : "transparent",
                        border: last ? `5px solid ${C.ink}` : "none",
                        boxShadow: last ? hard(tone.name === "coal" ? C.violet : C.ink, 10) : "none",
                        padding: last ? "0 22px 6px" : 0,
                        transform: last ? "rotate(-2deg)" : "none",
                        textShadow: !last && tone.name === "violet" ? hard(C.ink, 6) : "none",
                      }}
                    >
                      {l}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <Stamp f={f} start={phaseStart} good={phase === 1} tone={tone} />
          )}
        </div>

        {/* terminal con typewriter */}
        <div style={{ position: "absolute", left: 60, top: 665, width: 840 }}>
          <Win f={f} start={winStart} title={win.title} lines={win.lines} tone={tone} height={300} />
        </div>

        {/* medidor (intro) o checklist (bueno / malo) */}
        <div style={{ position: "absolute", left: 60, top: ITEM_Y, width: 840 }}>
          {phase === 0 && (
            <MeterCard f={f} end={tBueno - 10} value={cfg.meter.value} note={cfg.meter.note} tone={tone} />
          )}
        </div>
        {phase === 1 &&
          goodItems.map((g, k) => (
            <div key={k} style={{ position: "absolute", left: 60, top: ITEM_Y + k * 112 }}>
              <ItemCard f={f} start={g.start} text={g.text} kind="good" tone={tone} />
            </div>
          ))}
        {phase === 2 &&
          badItems.map((g, k) => (
            <div key={k} style={{ position: "absolute", left: 60, top: ITEM_Y + k * 112 }}>
              <ItemCard f={f} start={g.start} text={g.text} kind="bad" tone={tone} />
            </div>
          ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const MeterCard: React.FC<{ f: number; end: number; value: number; note: string; tone: (typeof TONES)[ToneName] }> = ({ f, end, value, note, tone }) => {
  const start = LEAD + 14;
  const p = range(f, start, Math.max(start + 20, end), 0, value);
  const t = pop(f, start - 4);
  return (
    <div style={{ opacity: Math.min(1, t * 2), transform: `translateY(${(1 - Math.min(1, t)) * 50}px)` }}>
      <Card fill={C.paper} shadow={tone.shadow} style={{ padding: "24px 30px", boxSizing: "border-box", width: 840 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: C.ink }}>USO DE IA ESTUDIANDO</span>
          <span style={{ fontFamily: TITLE, fontSize: 92, color: C.ink, lineHeight: 1 }}>{Math.round(p * 100)}%</span>
        </div>
        <div style={{ marginTop: 14, height: 58, border: `3px solid ${C.ink}`, borderRadius: 14, background: "#fff", overflow: "hidden" }}>
          <div style={{ width: `${p * 100}%`, height: "100%", background: C.lime, borderRight: p > 0.01 ? `3px solid ${C.ink}` : "none" }} />
        </div>
        <div style={{ marginTop: 12, fontFamily: MONO, fontWeight: 500, fontSize: 25, color: "#444" }}>{note}</div>
      </Card>
    </div>
  );
};
