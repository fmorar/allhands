/**
 * Faithful SVG re-creations of the All Hands DS pattern library
 * (Patterns & Geometry frame in Figma). Each pattern is a `<pattern>` tile
 * inside an SVG, so it composes cleanly over any background.
 *
 * To use:
 *   <DsPattern name="prehispanic" tone="dark" className="absolute inset-0" />
 */
import type { CSSProperties } from "react";

export type DsPatternName =
  | "prehispanic"
  | "natura"
  | "leafs"
  | "lines"
  | "zigzag"
  | "curves"
  | "sun"
  | "sparkle"
  | "flower";

export type DsTone = "dark" | "light" | "red" | "purple" | "multi";

type Palette = {
  bg: string;
  primary: string;
  secondary: string;
  tertiary: string;
};

const PALETTES: Record<DsTone, Palette> = {
  // Pattern reads dark on a light surface.
  dark: {
    bg: "transparent",
    primary: "rgba(0,0,0,0.78)",
    secondary: "rgba(0,0,0,0.55)",
    tertiary: "rgba(0,0,0,0.35)",
  },
  // Pattern reads light on a dark surface.
  light: {
    bg: "transparent",
    primary: "rgba(255,255,255,0.85)",
    secondary: "rgba(255,255,255,0.55)",
    tertiary: "rgba(255,255,255,0.30)",
  },
  // Radiant Red ramp per the guide:
  // FFF0F3 · FFCDD5 · FF9BAD · FF6685 · FF2D58 · E90130 · C10028 · 9B001F · 720016 · 4A000E
  red: {
    bg: "transparent",
    primary: "#e90130",
    secondary: "#C10028",
    tertiary: "#9B001F",
  },
  // Latam Purple ramp per the guide:
  // F4F4FA · E5E5F4 · CBCCE6 · B1B2DC · 9B9DCF · 7C7DB8 · 616290 · 4D4D72 · 383954 · 23243B
  purple: {
    bg: "transparent",
    primary: "#616290",
    secondary: "#4D4D72",
    tertiary: "#383954",
  },
  // The DS "Color=Light Red" / multi variants stack red + purple + cream.
  multi: {
    bg: "transparent",
    primary: "#e90130",
    secondary: "#616290",
    tertiary: "#faf9f6",
  },
};

export function DsPattern({
  name,
  tone = "dark",
  scale = 1,
  rotate = 0,
  opacity = 1,
  className,
  style,
}: {
  name: DsPatternName;
  tone?: DsTone;
  scale?: number;
  rotate?: number;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const pal = PALETTES[tone];
  const id = `ds-${name}-${tone}-${Math.round(scale * 100)}`;
  return (
    <svg
      className={className}
      style={{
        ...style,
        opacity,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
      aria-hidden
    >
      <defs>{tileFor(id, name, pal, scale)}</defs>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function tileFor(
  id: string,
  name: DsPatternName,
  pal: Palette,
  scale: number
) {
  const s = scale;
  switch (name) {
    /* ─────────────── Prehispanic — Greek key ─────────────── */
    case "prehispanic": {
      const w = 80 * s;
      const h = 28 * s;
      return (
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={w}
          height={h}
        >
          <rect width={w} height={h} fill={pal.bg} />
          {/* Bottom-anchored step */}
          <path
            d={`M 0 ${h} L 0 ${h * 0.45} L ${w * 0.18} ${h * 0.45} L ${w * 0.18} ${h * 0.1} L ${w * 0.5} ${h * 0.1} L ${w * 0.5} ${h * 0.45} L ${w * 0.32} ${h * 0.45} L ${w * 0.32} ${h} Z`}
            fill={pal.primary}
          />
          {/* Top-anchored step (mirrored, offset) */}
          <path
            d={`M ${w * 0.5} 0 L ${w * 0.5} ${h * 0.55} L ${w * 0.68} ${h * 0.55} L ${w * 0.68} ${h * 0.9} L ${w} ${h * 0.9} L ${w} ${h * 0.55} L ${w * 0.82} ${h * 0.55} L ${w * 0.82} 0 Z`}
            fill={pal.primary}
          />
        </pattern>
      );
    }

    /* ─────────────── Natura — vine ─────────────── */
    case "natura": {
      const w = 56 * s;
      const h = 60 * s;
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width={w} height={h}>
          <rect width={w} height={h} fill={pal.bg} />
          {/* Left petal (pointing up-left) */}
          <path
            d={`M ${w * 0.25} ${h * 0.15} Q ${w * 0.05} ${h * 0.32}, ${w * 0.15} ${h * 0.55} Q ${w * 0.35} ${h * 0.42}, ${w * 0.25} ${h * 0.15} Z`}
            fill={pal.primary}
          />
          {/* Right petal (pointing up-right) */}
          <path
            d={`M ${w * 0.55} ${h * 0.15} Q ${w * 0.75} ${h * 0.32}, ${w * 0.65} ${h * 0.55} Q ${w * 0.45} ${h * 0.42}, ${w * 0.55} ${h * 0.15} Z`}
            fill={pal.primary}
          />
          {/* Dot below */}
          <circle cx={w * 0.4} cy={h * 0.7} r={3 * s} fill={pal.primary} />
        </pattern>
      );
    }

    /* ─────────────── Leafs — stacked petals ─────────────── */
    case "leafs": {
      const w = 60 * s;
      const h = 80 * s;
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width={w} height={h}>
          <rect width={w} height={h} fill={pal.bg} />
          {/* Two leaves stacked in a column, each is a pointed oval */}
          <path
            d={`M ${w / 2} ${h * 0.05} C ${w * 0.95} ${h * 0.18}, ${w * 0.95} ${h * 0.42}, ${w / 2} ${h * 0.5} C ${w * 0.05} ${h * 0.42}, ${w * 0.05} ${h * 0.18}, ${w / 2} ${h * 0.05} Z`}
            fill={pal.primary}
          />
          <path
            d={`M ${w / 2} ${h * 0.55} C ${w * 0.95} ${h * 0.68}, ${w * 0.95} ${h * 0.92}, ${w / 2} ${h} C ${w * 0.05} ${h * 0.92}, ${w * 0.05} ${h * 0.68}, ${w / 2} ${h * 0.55} Z`}
            fill={pal.secondary}
          />
        </pattern>
      );
    }

    /* ─────────────── Lines — 2x2 line tile ─────────────── */
    case "lines": {
      const w = 60 * s;
      const h = 60 * s;
      const stroke = 1.2 * s;
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width={w} height={h}>
          <rect width={w} height={h} fill={pal.bg} />
          {/* Top-left: vertical lines */}
          {Array.from({ length: 4 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={(w / 2) * (i / 4)}
              y1={0}
              x2={(w / 2) * (i / 4)}
              y2={h / 2}
              stroke={pal.primary}
              strokeWidth={stroke}
            />
          ))}
          {/* Top-right: horizontal lines */}
          {Array.from({ length: 4 }).map((_, i) => (
            <line
              key={`hr-${i}`}
              x1={w / 2}
              y1={(h / 2) * (i / 4)}
              x2={w}
              y2={(h / 2) * (i / 4)}
              stroke={pal.primary}
              strokeWidth={stroke}
            />
          ))}
          {/* Bottom-left: diagonal / */}
          {Array.from({ length: 5 }).map((_, i) => {
            const off = ((i + 1) / 5) * (w / 2);
            return (
              <line
                key={`d1-${i}`}
                x1={0}
                y1={h / 2 + off}
                x2={off}
                y2={h / 2}
                stroke={pal.primary}
                strokeWidth={stroke}
              />
            );
          })}
          {/* Bottom-right: diagonal \ */}
          {Array.from({ length: 5 }).map((_, i) => {
            const off = ((i + 1) / 5) * (w / 2);
            return (
              <line
                key={`d2-${i}`}
                x1={w / 2 + off}
                y1={h / 2}
                x2={w}
                y2={h - off}
                stroke={pal.primary}
                strokeWidth={stroke}
              />
            );
          })}
        </pattern>
      );
    }

    /* ─────────────── ZigZag — single chevron column ─────────────── */
    case "zigzag": {
      const w = 32 * s;
      const h = 36 * s;
      const stroke = 7 * s;
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width={w} height={h}>
          <rect width={w} height={h} fill={pal.bg} />
          <path
            d={`M 0 0 L ${w / 2} ${h * 0.4} L ${w} 0 L ${w} ${h * 0.4} L ${w / 2} ${h * 0.8} L 0 ${h * 0.4} Z`}
            fill={pal.primary}
          />
        </pattern>
      );
    }

    /* ─────────────── Curves — scallop column ─────────────── */
    case "curves": {
      const w = 36 * s;
      const h = 36 * s;
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width={w} height={h}>
          <rect width={w} height={h} fill={pal.bg} />
          <path
            d={`M 0 0 Q ${w / 2} ${h * 0.6}, ${w} 0 L ${w} ${h * 0.5} Q ${w / 2} ${h * 1.1}, 0 ${h * 0.5} Z`}
            fill={pal.primary}
          />
        </pattern>
      );
    }

    /* ─────────────── Sun — 8-petal radial ─────────────── */
    case "sun": {
      const w = 80 * s;
      const h = 80 * s;
      const cx = w / 2;
      const cy = h / 2;
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width={w} height={h}>
          <rect width={w} height={h} fill={pal.bg} />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4;
            const x1 = cx + Math.cos(angle) * (8 * s);
            const y1 = cy + Math.sin(angle) * (8 * s);
            const x2 = cx + Math.cos(angle) * (28 * s);
            const y2 = cy + Math.sin(angle) * (28 * s);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={pal.primary}
                strokeWidth={6 * s}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={cx} cy={cy} r={5 * s} fill={pal.primary} />
        </pattern>
      );
    }

    /* ─────────────── Sparkle — 4-point asterisk ─────────────── */
    case "sparkle": {
      const w = 60 * s;
      const h = 60 * s;
      const cx = w / 2;
      const cy = h / 2;
      const r = 16 * s;
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width={w} height={h}>
          <rect width={w} height={h} fill={pal.bg} />
          {[0, 1].map((axis) => (
            <line
              key={axis}
              x1={axis === 0 ? cx : cx - r}
              y1={axis === 0 ? cy - r : cy}
              x2={axis === 0 ? cx : cx + r}
              y2={axis === 0 ? cy + r : cy}
              stroke={pal.primary}
              strokeWidth={3 * s}
              strokeLinecap="round"
            />
          ))}
          {[Math.PI / 4, (3 * Math.PI) / 4].map((angle, idx) => (
            <line
              key={`d-${idx}`}
              x1={cx + Math.cos(angle) * r}
              y1={cy + Math.sin(angle) * r}
              x2={cx - Math.cos(angle) * r}
              y2={cy - Math.sin(angle) * r}
              stroke={pal.primary}
              strokeWidth={2 * s}
              strokeLinecap="round"
              opacity={0.7}
            />
          ))}
        </pattern>
      );
    }

    /* ─────────────── Flower — 4-petal mark ─────────────── */
    case "flower": {
      const w = 56 * s;
      const h = 56 * s;
      const cx = w / 2;
      const cy = h / 2;
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width={w} height={h}>
          <rect width={w} height={h} fill={pal.bg} />
          {[0, 1, 2, 3].map((i) => {
            const angle = (i * Math.PI) / 2;
            const dx = Math.cos(angle) * 14 * s;
            const dy = Math.sin(angle) * 14 * s;
            return (
              <ellipse
                key={i}
                cx={cx + dx}
                cy={cy + dy}
                rx={i % 2 === 0 ? 12 * s : 6 * s}
                ry={i % 2 === 0 ? 6 * s : 12 * s}
                fill={pal.primary}
              />
            );
          })}
        </pattern>
      );
    }
  }
}
