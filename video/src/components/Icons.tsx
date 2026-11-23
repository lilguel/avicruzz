import React from "react";
import { COLORS } from "../theme";

// Todos los íconos están centrados en (0,0). Úsalos dentro de <g transform="translate(x y) scale(s)">.

export const Birrete: React.FC<{ color: string }> = ({ color }) => (
  <g>
    {/* base del gorro */}
    <path d="M-86 10 V72 Q0 122 86 72 V10 L0 48 Z" fill={color} />
    <path d="M-86 10 V72 Q0 122 86 72 V10 L0 48 Z" fill="#000" opacity={0.32} />
    {/* tablero */}
    <path d="M0 -66 L156 -8 L0 50 L-156 -8 Z" fill={color} />
    <path d="M0 -66 L156 -8 L0 50 L-156 -8 Z" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} strokeLinejoin="round" />
    {/* borla */}
    <path d="M0 -8 L128 8 V88" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    <rect x={116} y={84} width={24} height={46} rx={10} fill={color} />
    <circle cx={0} cy={-8} r={11} fill="#fff" opacity={0.85} />
  </g>
);

export const Book: React.FC<{ w: number; h: number; color: string; stripe?: string }> = ({ w, h, color, stripe = "#0F1115" }) => (
  <g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={color} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="#000" opacity={0.12} />
    <rect x={-w / 2 + 18} y={-h / 2} width={14} height={h} fill={stripe} opacity={0.35} />
    <rect x={-w / 2 + 52} y={-h / 2 + h * 0.3} width={w * 0.38} height={h * 0.12} rx={4} fill={stripe} opacity={0.5} />
    <rect x={-w / 2 + 52} y={-h / 2 + h * 0.56} width={w * 0.24} height={h * 0.1} rx={4} fill={stripe} opacity={0.35} />
    <rect x={w / 2 - 14} y={-h / 2 + 8} width={6} height={h - 16} rx={3} fill="#fff" opacity={0.35} />
  </g>
);

export const gearPath = (R: number, r: number, teeth: number) => {
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  const P = (rad: number, a: number) => `${(Math.cos(a) * rad).toFixed(1)} ${(Math.sin(a) * rad).toFixed(1)}`;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    pts.push(P(r, a - step * 0.3), P(R, a - step * 0.17), P(R, a + step * 0.17), P(r, a + step * 0.3));
  }
  return `M${pts.join("L")}Z`;
};

export const Gear: React.FC<{ R: number; color: string; teeth?: number; rotate?: number; hole?: number }> = ({
  R,
  color,
  teeth = 12,
  rotate = 0,
  hole = 0.35,
}) => (
  <g transform={`rotate(${rotate})`}>
    <path d={gearPath(R, R * 0.8, teeth)} fill={color} />
    <circle r={R * hole} fill={COLORS.bg} />
  </g>
);

export const Clock: React.FC<{ r: number; color: string; minute: number }> = ({ r, color, minute }) => (
  <g>
    <circle r={r} fill={COLORS.bg} stroke={color} strokeWidth={10} />
    {Array.from({ length: 12 }, (_, i) => (
      <line key={i} x1={0} y1={-r + 14} x2={0} y2={-r + (i % 3 === 0 ? 30 : 22)} stroke={color} strokeWidth={i % 3 === 0 ? 6 : 4} strokeLinecap="round" transform={`rotate(${i * 30})`} />
    ))}
    <line x1={0} y1={0} x2={0} y2={-r * 0.78} stroke={COLORS.white} strokeWidth={6} strokeLinecap="round" transform={`rotate(${minute})`} />
    <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke={color} strokeWidth={9} strokeLinecap="round" transform={`rotate(${minute / 12})`} />
    <circle r={9} fill={color} />
  </g>
);

export const Sparkle: React.FC<{ color: string; size?: number }> = ({ color, size = 1 }) => (
  <path
    transform={`scale(${size})`}
    d="M0 -50 Q6 -6 50 0 Q6 6 0 50 Q-6 6 -50 0 Q-6 -6 0 -50 Z"
    fill={color}
  />
);

export const Brain: React.FC<{ color: string; fill?: string; sw?: number }> = ({ color, fill, sw = 7 }) => (
  <g fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path
      d="M0 -60 C-30 -78 -76 -62 -80 -26 C-102 -14 -96 26 -76 36 C-76 62 -36 76 -10 60 C-4 68 4 68 10 60 C36 76 76 62 76 36 C96 26 102 -14 80 -26 C76 -62 30 -78 0 -60 Z"
      fill={fill ?? "none"}
    />
    <path d="M0 -60 C-9 -20 9 20 0 60" />
    <path d="M-46 -30 C-30 -42 -20 -22 -36 -10" />
    <path d="M-62 10 C-46 0 -30 14 -46 26" />
    <path d="M46 -30 C30 -42 20 -22 36 -10" />
    <path d="M62 10 C46 0 30 14 46 26" />
  </g>
);

export const Bulb: React.FC<{ color: string; lit: number }> = ({ color, lit }) => (
  <g>
    <path
      d="M-40 68 C-40 36 -92 28 -92 -22 A92 92 0 1 1 92 -22 C92 28 40 36 40 68 Z"
      fill={color}
      fillOpacity={0.08 + lit * 0.82}
      stroke={color}
      strokeWidth={8}
      strokeLinejoin="round"
    />
    <path d="M-24 68 V30 L-12 8 L0 30 L12 8 L24 30 V68" fill="none" stroke={lit > 0.5 ? "#fff" : color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={0.5 + lit * 0.5} />
    <rect x={-40} y={74} width={80} height={16} rx={7} fill={color} />
    <rect x={-32} y={96} width={64} height={14} rx={7} fill={color} />
    <rect x={-18} y={116} width={36} height={14} rx={7} fill={color} />
  </g>
);

export const Shield: React.FC<{ color: string; check: number }> = ({ color, check }) => (
  <g>
    <path d="M0 -110 L90 -76 V10 C90 70 40 104 0 124 C-40 104 -90 70 -90 10 V-76 Z" fill={color} fillOpacity={0.18} stroke={color} strokeWidth={9} strokeLinejoin="round" />
    <path
      d="M-40 4 L-10 36 L44 -28"
      fill="none"
      stroke="#fff"
      strokeWidth={16}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={140}
      strokeDashoffset={140 * (1 - check)}
    />
  </g>
);

export const CopyIcon: React.FC<{ color: string }> = ({ color }) => (
  <g fill="none" stroke={color} strokeWidth={9} strokeLinejoin="round">
    <rect x={-52} y={-52} width={72} height={86} rx={12} />
    <rect x={-20} y={-30} width={72} height={86} rx={12} fill={COLORS.bg} />
  </g>
);

export const Phone: React.FC<{ color: string; children?: React.ReactNode }> = ({ color, children }) => (
  <g>
    <rect x={-130} y={-260} width={260} height={520} rx={46} fill="#0b1317" stroke={color} strokeWidth={9} />
    <rect x={-112} y={-242} width={224} height={484} rx={34} fill={color} fillOpacity={0.08} />
    <rect x={-34} y={-232} width={68} height={16} rx={8} fill={color} opacity={0.7} />
    {children}
  </g>
);
