import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, Tone, W } from "../theme";

/** Trama de semitonos: puntos que se achican al alejarse de la esquina. */
const Halftone: React.FC<{ corner: "tl" | "tr" | "bl" | "br"; color: string; opacity: number; scale?: number; drift: number }> = ({
  corner,
  color,
  opacity,
  scale = 1,
  drift,
}) => {
  const dots = React.useMemo(() => {
    const pitch = 38;
    const R = 760 * scale;
    const out: { x: number; y: number; r: number }[] = [];
    for (let j = 0; j * pitch < R; j++) {
      for (let i = 0; i * pitch < R; i++) {
        const x = i * pitch + (j % 2 ? pitch / 2 : 0);
        const y = j * pitch * 0.87;
        const d = Math.hypot(x, y) / R;
        const r = 17 * Math.pow(Math.max(0, 1 - d), 1.15);
        if (r > 1.6) out.push({ x, y, r });
      }
    }
    return out;
  }, [scale]);
  const flipX = corner === "tr" || corner === "br";
  const flipY = corner === "bl" || corner === "br";
  return (
    <svg
      width={W}
      height={H}
      style={{ position: "absolute", inset: 0, opacity }}
    >
      <g transform={`translate(${flipX ? W : 0} ${flipY ? H : 0}) scale(${flipX ? -1 : 1} ${flipY ? -1 : 1}) translate(${drift} ${drift})`}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={color} />
        ))}
      </g>
    </svg>
  );
};

/** Fondo del tono actual: color liso + micro-cuadrícula + semitonos en esquinas. */
export const Backdrop: React.FC<{ tone: Tone }> = ({ tone }) => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 50) * 10;
  return (
    <AbsoluteFill style={{ backgroundColor: tone.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${tone.grid} 2px, transparent 2px), linear-gradient(90deg, ${tone.grid} 2px, transparent 2px)`,
          backgroundSize: "54px 54px",
          backgroundPosition: `${f * 0.25}px ${f * 0.25}px`,
        }}
      />
      <Halftone corner="tr" color={tone.dots} opacity={tone.dotsOpacity} drift={drift} />
      <Halftone corner="bl" color={tone.dots} opacity={tone.dotsOpacity * 0.8} scale={0.8} drift={-drift} />
    </AbsoluteFill>
  );
};
