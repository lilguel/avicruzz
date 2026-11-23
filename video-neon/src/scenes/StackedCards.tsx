import React from "react";
import { AbsoluteFill, spring, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { CardData, DeckCard } from "../components/DeckCard";
import { NEON } from "../theme";
import { FPS, wordFrame } from "../timing";
import { pop } from "../anim";

// ============ CONTENIDO DE LAS TARJETAS (máx. 4) — editar aquí ============
// `anchor` = palabra de la narración en la que la tarjeta sube al frente.
export const CARDS: CardData[] = [
  { color: NEON.cyan, icon: "book", gen: "GENERACIÓN 1", sub: "SIN IA", anchor: "uno",
    metrics: [["FUNDAMENTOS", 90], ["VELOCIDAD", 25], ["DEPENDENCIA DE IA", 0]],
    gain: "Fundamentos y paciencia", lose: "Velocidad" },
  { color: NEON.purple, icon: "phone", gen: "GENERACIÓN 2", sub: "IA EN EL BOLSILLO", anchor: "dos",
    metrics: [["FUNDAMENTOS", 55], ["VELOCIDAD", 85], ["DEPENDENCIA DE IA", 75]],
    gain: "Velocidad brutal", lose: "Riesgo de copiar sin entender" },
  { color: NEON.green, icon: "nodes", gen: "GENERACIÓN 3", sub: "IA DESDE EL INICIO", anchor: "tres",
    metrics: [["FUNDAMENTOS", 70], ["VELOCIDAD", 95], ["DEPENDENCIA DE IA", 90]],
    gain: "Poder para dirigir sistemas", lose: "Nadie sabe aún cómo enseñarla" },
];

/** Escena 3 · Tarjetas apiladas con profundidad: la actual sale, la siguiente sube con spring de poco rebote. */
export const StackedCards: React.FC = () => {
  const f = useCurrentFrame();
  const starts = CARDS.map((c, i) => (i === 0 ? 4 : wordFrame(2, c.anchor) - 8));
  // posición continua del mazo: 0 = primera al frente, 1 = segunda…
  const pos = starts.slice(1).reduce(
    (acc, s) => acc + spring({ frame: f - s, fps: FPS, config: { damping: 24, stiffness: 120, mass: 1 } }),
    0,
  );
  const intro = pop(f, 0, 20, 160, 0.9);
  const accent = CARDS[Math.min(CARDS.length - 1, Math.round(pos))].color;

  return (
    <AbsoluteFill>
      <Background accent={accent} />
      <div style={{ position: "absolute", left: 60, top: 400, width: 840, height: 900, perspective: 1800, transform: `translateY(${(1 - Math.min(1, intro)) * 500}px)`, opacity: Math.min(1, intro * 2) }}>
        {CARDS.map((c, j) => {
          const d = j - pos; // >0: detrás · 0: al frente · <0: saliendo
          if (d < -1.05 || d > 3) return null;
          const out = Math.max(0, -d);
          const behind = Math.max(0, d);
          const y = behind * -150 + out * 760;
          const scale = 1 - behind * 0.075 + out * 0.1;
          const opacity = d >= 0 ? Math.max(0, 1 - behind * 0.42) : Math.max(0, 1 - out * 1.5);
          return (
            <div
              key={j}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 100 - Math.round(d * 10),
                transform: `translateY(${y}px) scale(${scale}) rotateX(${behind * -3 + out * 14}deg)`,
                transformOrigin: "50% 100%",
                opacity,
                filter: `brightness(${1 - behind * 0.22})`,
              }}
            >
              <DeckCard d={c} f={f} t0={starts[j]} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
