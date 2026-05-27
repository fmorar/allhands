import type { ReactNode } from "react";
import { PatternFill } from "./patterns";

type CardTone = "red" | "purple" | "black" | "offwhite";
type CardPattern = "zigzag" | "scallop" | "leaf-row" | "dots" | "sun" | "grid" | "none";

const tone: Record<CardTone, { bg: string; fg: string; accent: string }> = {
  red: { bg: "var(--latam-red)", fg: "#ffffff", accent: "#000000" },
  purple: { bg: "var(--latam-purple)", fg: "#ffffff", accent: "#000000" },
  black: { bg: "var(--latam-black)", fg: "#ffffff", accent: "var(--latam-red)" },
  offwhite: { bg: "var(--latam-offwhite)", fg: "#000000", accent: "var(--latam-red)" },
};

/**
 * Brand colored card with an optional faint pattern overlay.
 * Use for metric cards, callouts, agenda items, or section dividers.
 */
export function BrandCard({
  tone: t = "offwhite",
  pattern = "none",
  patternOpacity = 0.12,
  children,
  className,
}: {
  tone?: CardTone;
  pattern?: CardPattern;
  patternOpacity?: number;
  children?: ReactNode;
  className?: string;
}) {
  const c = tone[t];
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-black/5 ${className ?? ""}`}
      style={{ background: c.bg, color: c.fg }}
    >
      {pattern !== "none" ? (
        <PatternFill
          pattern={pattern}
          colors={
            t === "offwhite"
              ? ["red", "offwhite"]
              : t === "red"
              ? ["black", "red"]
              : t === "purple"
              ? ["black", "purple"]
              : ["red", "black"]
          }
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: patternOpacity }}
        />
      ) : null}
      <div className="relative">{children}</div>
    </div>
  );
}

export const CARD_TONES: CardTone[] = ["red", "purple", "black", "offwhite"];
