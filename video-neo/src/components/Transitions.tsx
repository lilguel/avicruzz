import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, H } from "../theme";
import { SCENE_STARTS } from "../timing";
import { easeInOut, range } from "../anim";

const HALF = 9;
const STRIPS = [C.lime, C.ink, C.violet, C.paper, C.lime];

/** Cinco barras horizontales que cruzan la pantalla en el corte entre escenas. */
export const Transitions: React.FC = () => {
  const f = useCurrentFrame();
  const h = H / STRIPS.length;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {SCENE_STARTS.slice(1).map((b, bi) => {
        if (f < b - HALF - 8 || f > b + HALF + 8) return null;
        return STRIPS.map((c, i) => {
          const s = b - HALF + i * 2;
          const p = range(f, s, s + HALF * 2 - 4, 0, 1, easeInOut);
          const dir = i % 2 ? -1 : 1;
          const x = dir * (-1200 + p * 2400);
          return (
            <div
              key={`${bi}-${i}`}
              style={{ position: "absolute", left: 0, width: 1080, top: i * h - 1, height: h + 2, background: c, borderTop: i ? `4px solid ${C.ink}` : "none", transform: `translateX(${x}px)` }}
            />
          );
        });
      })}
    </AbsoluteFill>
  );
};
