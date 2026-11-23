// ============ TEMA: cambia colores aquí ============
export const C = {
  coal: "#111315", // negro carbón
  paper: "#F3F3EE", // blanco hueso
  violet: "#635BFF", // violeta eléctrico
  lime: "#A3E635", // acento verde lima
  ink: "#0A0A0A", // tinta / bordes
  white: "#FFFFFF",
  violetLight: "#B4B0FF",
  gray: "#8B9096",
} as const;

export const TITLE = "'Archivo Black', Montserrat, Impact, sans-serif";
export const BODY = "Montserrat, Inter, system-ui, sans-serif";
export const MONO = "'JetBrains Mono', 'DejaVu Sans Mono', Menlo, monospace";

export const W = 1080;
export const H = 1920;

/** Zona segura 9:16: libre 15% arriba, 20% abajo y 15% a la derecha. */
export const SAFE = { left: 60, right: 918, top: 290, bottom: 1536, width: 858 - 18 };

export type ToneName = "coal" | "paper" | "violet";
export type Tone = {
  name: ToneName;
  bg: string;
  fg: string; // color de texto sobre el fondo
  shadow: string; // sombra dura de las tarjetas
  grid: string;
  dots: string;
  dotsOpacity: number;
};

export const TONES: Record<ToneName, Tone> = {
  coal: { name: "coal", bg: C.coal, fg: C.paper, shadow: C.lime, grid: "#ffffff0d", dots: C.violet, dotsOpacity: 0.6 },
  paper: { name: "paper", bg: C.paper, fg: C.ink, shadow: C.ink, grid: "#0a0a0a12", dots: C.ink, dotsOpacity: 0.16 },
  violet: { name: "violet", bg: C.violet, fg: C.white, shadow: C.ink, grid: "#ffffff16", dots: C.ink, dotsOpacity: 0.35 },
};

export const hard = (color: string, d = 8) => `${d}px ${d}px 0 ${color}`;
