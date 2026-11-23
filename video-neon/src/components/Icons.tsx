import React from "react";

/** Íconos lineales (stroke) en caja 48×48. */
export const LineIcon: React.FC<{ kind: "book" | "phone" | "nodes" | "bolt"; color: string; size?: number }> = ({ kind, color, size = 56 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    {kind === "book" && (
      <>
        <path d="M24 12 C18 8 11 8 6 10 V38 C11 36 18 36 24 40 C30 36 37 36 42 38 V10 C37 8 30 8 24 12 Z" />
        <path d="M24 12 V40" />
      </>
    )}
    {kind === "phone" && (
      <>
        <rect x="13" y="4" width="22" height="40" rx="5" />
        <path d="M21 9 H27" />
        <path d="M24 20 L25.6 24.4 L30 26 L25.6 27.6 L24 32 L22.4 27.6 L18 26 L22.4 24.4 Z" />
      </>
    )}
    {kind === "nodes" && (
      <>
        <circle cx="24" cy="24" r="6" />
        <circle cx="8" cy="10" r="4" />
        <circle cx="40" cy="10" r="4" />
        <circle cx="8" cy="38" r="4" />
        <circle cx="40" cy="38" r="4" />
        <path d="M11 12 L19 20 M37 12 L29 20 M11 36 L19 28 M37 36 L29 28" />
      </>
    )}
    {kind === "bolt" && <path d="M26 4 L10 27 H23 L21 44 L38 20 H25 Z" />}
  </svg>
);
