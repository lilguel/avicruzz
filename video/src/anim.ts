import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./timing";

/** Entrada con rebote suave: 0 → 1 (con ligero overshoot). */
export const pop = (frame: number, start: number, damping = 11, stiffness = 150, mass = 0.7) =>
  spring({ frame: frame - start, fps: FPS, config: { damping, stiffness, mass } });

/** Entrada suave sin rebote. */
export const soft = (frame: number, start: number) =>
  spring({ frame: frame - start, fps: FPS, config: { damping: 22, stiffness: 120, mass: 0.8 } });

export const ease = Easing.bezier(0.22, 0.9, 0.25, 1);
export const easeInOut = Easing.inOut(Easing.cubic);

export const range = (frame: number, a: number, b: number, from = 0, to = 1, easing = ease) =>
  interpolate(frame, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Opacidad de una "fase": entra en `from`, sale en `to` (opcional). */
export const phaseOpacity = (frame: number, from: number, to?: number, fade = 8) => {
  const a = range(frame, from, from + fade, 0, 1, Easing.linear);
  const b = to === undefined ? 1 : range(frame, to - fade, to, 1, 0, Easing.linear);
  return Math.min(a, b);
};

export const seeded = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
