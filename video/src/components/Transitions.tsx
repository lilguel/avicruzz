import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, H, RAINBOW, W } from "../theme";
import { SCENE_STARTS } from "../timing";
import { easeInOut, range } from "../anim";

const HALF = 9; // frames de cada mitad del barrido
const WIPE_COLORS = [COLORS.g1, COLORS.g2, COLORS.g3, RAINBOW];

/** Barrido de color en diagonal sobre cada corte entre escenas. */
export const Transitions: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {SCENE_STARTS.slice(1).map((b, i) => {
        if (f < b - HALF - 2 || f > b + HALF + 2) return null;
        const p = range(f, b - HALF, b + HALF, 0, 1, easeInOut);
        const x = -2400 + p * (2400 + W + 600);
        const col = WIPE_COLORS[i];
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                top: -200,
                height: H + 400,
                width: 2100,
                left: x - 260,
                transform: "skewX(-14deg)",
                background: "#ffffff",
                opacity: 0.9,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -200,
                height: H + 400,
                width: 2100,
                left: x,
                transform: "skewX(-14deg)",
                background: col,
              }}
            />
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
