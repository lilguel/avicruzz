// ============ TEMA: cambia colores aquí ============
export const COLORS = {
  bg: "#0F1115",
  g1: "#F5A623", // Generación 1 · ámbar
  g2: "#22D3EE", // Generación 2 · cian
  g3: "#A78BFA", // Generación 3 · violeta
  white: "#F4F5F7",
  gray: "#6B7280",
  grayDark: "#2A2E37",
  grayMid: "#4B5563",
  red: "#EF4444",
  green: "#22C55E",
} as const;

export type ColorKey = "g1" | "g2" | "g3" | "white" | "rainbow";

export const RAINBOW = `linear-gradient(90deg, ${COLORS.g1}, ${COLORS.g2}, ${COLORS.g3})`;

export const FONT = "Montserrat, Inter, system-ui, sans-serif";
export const MONO = "'JetBrains Mono', 'DejaVu Sans Mono', Menlo, monospace";

export const W = 1080;
export const H = 1920;

// Zonas (px). TikTok tapa el borde inferior (~450px) y el lateral derecho.
export const LAYOUT = {
  chipY: 215, // chip "GENERACIÓN n"
  stageTop: 300, // arranca la ilustración (alto 800)
  stageH: 800,
  keywordCenterY: 1190, // palabras clave grandes
  captionY: 1395, // subtítulo karaoke
};

export const accentOf = (c: ColorKey): string =>
  c === "white" || c === "rainbow" ? COLORS.white : COLORS[c];
