import type { CSSProperties } from "react";

/**
 * Gradient backgrounds matched to the All Hands library:
 *   - red→pink (warm)
 *   - purple→cream (cool)
 *   - black→red (drama)
 */
type GradientName = "red-pink" | "purple-cream" | "black-red" | "red-soft";

const gradients: Record<GradientName, string> = {
  "red-pink": "linear-gradient(155deg, #e90130 0%, #f7c3cf 70%, #faf9f6 100%)",
  "purple-cream":
    "linear-gradient(160deg, #616290 0%, #cfcfe2 60%, #faf9f6 100%)",
  "black-red": "linear-gradient(160deg, #000000 0%, #2a0008 60%, #e90130 100%)",
  "red-soft":
    "radial-gradient(120% 80% at 30% 20%, #ff385f 0%, #e90130 50%, #b00125 100%)",
};

export function GradientBg({
  variant,
  className,
  style,
}: {
  variant: GradientName;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{ ...style, background: gradients[variant] }}
      aria-hidden
    />
  );
}

export const GRADIENT_NAMES: GradientName[] = [
  "red-pink",
  "purple-cream",
  "black-red",
  "red-soft",
];

/**
 * Subtle noise/grain overlay — adds the "with texture" feel from the library.
 * Layer on top of solid or gradient backgrounds.
 */
export function NoiseOverlay({
  opacity = 0.06,
  className,
}: {
  opacity?: number;
  className?: string;
}) {
  // SVG-based fractal noise — no external assets, scales to any size.
  return (
    <svg
      className={className}
      style={{ opacity, mixBlendMode: "multiply" }}
      aria-hidden
    >
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
        <feColorMatrix
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0.5 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}
