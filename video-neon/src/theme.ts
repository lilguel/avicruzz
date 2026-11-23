// ============ TEMA "Dark Neon Explainer": cambia colores y marca aquí ============
export const NEON = {
  cyan: "#00E5FF",
  purple: "#A855F7",
  green: "#22C55E",
  orange: "#F59E0B",
  blue: "#2563EB",
} as const;

export const C = {
  black: "#000000",
  ambient: "#050814",
  card: "#0B0F19",
  white: "#FFFFFF",
  text: "#E6EAF2",
  muted: "#8A93A6",
  line: "#1B2233",
} as const;

export const FONT = "'Plus Jakarta Sans', Inter, system-ui, sans-serif";
export const W = 1080;
export const H = 1920;

/** Marca / CTA final (escena 6) */
export const BRAND = { mark: "3G", name: "INGENIERÍA × IA", cta: ["¿DE QUÉ", "GENERACIÓN ERES?"], sub: "Cuéntalo en los comentarios" };

export const glow = (c: string, r = 30, a = "66") => `0 0 ${r}px ${c}${a}`;
