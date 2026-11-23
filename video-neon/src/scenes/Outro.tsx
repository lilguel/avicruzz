import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { BRAND, C, FONT, NEON, glow } from "../theme";
import { FPS } from "../timing";
import { pop } from "../anim";

const Chevron: React.FC<{ i: number; f: number }> = ({ i, f }) => {
  const wave = Math.max(0, Math.sin((f / FPS) * ((Math.PI * 2) / 1.1) - i * 0.95));
  return (
    <svg width={150} height={70} viewBox="0 0 150 70" style={{ display: "block", margin: "-8px auto", opacity: 0.18 + 0.82 * wave, transform: `translateY(${wave * 10}px)` }}>
      <path d="M15 12 L75 56 L135 12" fill="none" stroke={NEON.blue} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${NEON.blue})` }} />
    </svg>
  );
};

/** Escena 6 · Outro / CTA: marca centrada, brillo azul en la base y 3 chevrons en cascada. */
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const logo = pop(f, 4, 16, 200, 0.8);
  const txt = pop(f, 14, 18, 240);
  const sub = pop(f, 26, 18, 240);
  return (
    <AbsoluteFill>
      <Background accent={NEON.blue} />
      <AbsoluteFill style={{ background: `radial-gradient(1000px 520px at 50% 100%, ${NEON.blue}88, transparent 70%)`, opacity: 0.7 + 0.15 * Math.sin(f / 18) }} />
      <div style={{ position: "absolute", left: 60, width: 840, top: 400, textAlign: "center", fontFamily: FONT }}>
        <div style={{ transform: `scale(${Math.min(1.05, logo)})`, opacity: Math.min(1, logo * 2), display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <svg width={190} height={190} viewBox="-100 -100 200 200">
            <path d="M0 -88 L76 -44 V44 L0 88 L-76 44 V-44 Z" fill={`${NEON.blue}22`} stroke={NEON.blue} strokeWidth={6} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 ${14 + Math.sin(f / 10) * 5}px ${NEON.blue})` }} />
            <text textAnchor="middle" y={22} fontFamily={FONT} fontWeight={800} fontSize={64} fill="#fff">{BRAND.mark}</text>
          </svg>
          <div style={{ fontWeight: 700, fontSize: 30, letterSpacing: 6, color: NEON.blue }}>{BRAND.name}</div>
        </div>
        <div style={{ marginTop: 70, opacity: Math.min(1, txt * 2), transform: `translateY(${(1 - Math.min(1, txt)) * 50}px)` }}>
          {BRAND.cta.map((l, i) => (
            <div key={i} style={{ fontWeight: 800, fontSize: i ? 84 : 96, lineHeight: 1.05, color: C.white, textShadow: i ? glow(NEON.blue, 40, "99") : "none", whiteSpace: "nowrap" }}>{l}</div>
          ))}
        </div>
        <div style={{ marginTop: 34, fontWeight: 500, fontSize: 38, color: C.text, opacity: Math.min(1, sub * 2) }}>{BRAND.sub}</div>
        <div style={{ marginTop: 40 }}>
          {[0, 1, 2].map((i) => (
            <Chevron key={i} i={i} f={f} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
