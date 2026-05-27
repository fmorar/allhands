/**
 * Pattern primitives — reusable SVG <pattern> tiles you can stamp anywhere.
 *
 * Usage:
 *   <PatternFill pattern="zigzag" colors={["red","purple"]} className="absolute inset-0" />
 */
import type { CSSProperties } from "react";

type BrandColor = "red" | "purple" | "black" | "white" | "offwhite" | "pink" | "lilac";

const hex: Record<BrandColor, string> = {
  red: "#e90130",
  purple: "#616290",
  black: "#000000",
  white: "#ffffff",
  offwhite: "#faf9f6",
  pink: "#f7c3cf",
  lilac: "#cfcfe2",
};

type PatternName =
  | "zigzag"
  | "scallop"
  | "leaf-row"
  | "single-leaf"
  | "sun"
  | "dots"
  | "stripes"
  | "grid";

export function PatternFill({
  pattern,
  colors = ["red", "white"],
  scale = 1,
  rotate = 0,
  className,
  style,
}: {
  pattern: PatternName;
  colors?: [BrandColor, BrandColor] | [BrandColor];
  scale?: number;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const [a, b = "offwhite"] = colors;
  const id = `pat-${pattern}-${a}-${b}-${Math.round(scale * 100)}`;
  return (
    <svg
      className={className}
      style={{ ...style, transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <defs>{patternDef(id, pattern, hex[a], hex[b], scale)}</defs>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

function patternDef(
  id: string,
  name: PatternName,
  a: string,
  b: string,
  scale: number
) {
  const s = scale;
  switch (name) {
    case "zigzag":
      return (
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={24 * s}
          height={16 * s}
        >
          <rect width={24 * s} height={16 * s} fill={b} />
          <path
            d={`M0 ${12 * s} L${6 * s} ${4 * s} L${12 * s} ${12 * s} L${18 * s} ${4 * s} L${24 * s} ${12 * s}`}
            stroke={a}
            strokeWidth={3 * s}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </pattern>
      );
    case "scallop":
      return (
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={20 * s}
          height={20 * s}
        >
          <rect width={20 * s} height={20 * s} fill={b} />
          <path
            d={`M0 ${10 * s} A ${5 * s} ${5 * s} 0 0 1 ${10 * s} ${10 * s} A ${5 * s} ${5 * s} 0 0 1 ${20 * s} ${10 * s}`}
            stroke={a}
            strokeWidth={2 * s}
            fill="none"
          />
          <path
            d={`M0 ${20 * s} A ${5 * s} ${5 * s} 0 0 1 ${10 * s} ${20 * s} A ${5 * s} ${5 * s} 0 0 1 ${20 * s} ${20 * s}`}
            stroke={a}
            strokeWidth={2 * s}
            fill="none"
          />
        </pattern>
      );
    case "leaf-row":
      return (
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={18 * s}
          height={24 * s}
        >
          <rect width={18 * s} height={24 * s} fill={b} />
          <path
            d={`M${9 * s} ${4 * s} C ${15 * s} ${8 * s}, ${15 * s} ${18 * s}, ${9 * s} ${22 * s} C ${3 * s} ${18 * s}, ${3 * s} ${8 * s}, ${9 * s} ${4 * s} Z`}
            fill={a}
          />
        </pattern>
      );
    case "single-leaf":
      return (
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={48 * s}
          height={56 * s}
        >
          <rect width={48 * s} height={56 * s} fill={b} />
          <path
            d={`M${24 * s} ${8 * s} C ${42 * s} ${20 * s}, ${42 * s} ${42 * s}, ${24 * s} ${50 * s} C ${6 * s} ${42 * s}, ${6 * s} ${20 * s}, ${24 * s} ${8 * s} Z`}
            fill={a}
          />
          <line
            x1={24 * s}
            y1={12 * s}
            x2={24 * s}
            y2={46 * s}
            stroke={b}
            strokeWidth={1.5 * s}
          />
        </pattern>
      );
    case "sun":
      return (
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={40 * s}
          height={40 * s}
        >
          <rect width={40 * s} height={40 * s} fill={b} />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4;
            const cx = 20 * s;
            const cy = 20 * s;
            const r1 = 4 * s;
            const r2 = 14 * s;
            const x1 = cx + Math.cos(angle) * r1;
            const y1 = cy + Math.sin(angle) * r1;
            const x2 = cx + Math.cos(angle) * r2;
            const y2 = cy + Math.sin(angle) * r2;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={a}
                strokeWidth={3 * s}
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={20 * s} cy={20 * s} r={3 * s} fill={a} />
        </pattern>
      );
    case "dots":
      return (
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={12 * s}
          height={12 * s}
        >
          <rect width={12 * s} height={12 * s} fill={b} />
          <circle cx={6 * s} cy={6 * s} r={1.6 * s} fill={a} />
        </pattern>
      );
    case "stripes":
      return (
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={8 * s}
          height={8 * s}
          patternTransform="rotate(45)"
        >
          <rect width={8 * s} height={8 * s} fill={b} />
          <rect width={3 * s} height={8 * s} fill={a} />
        </pattern>
      );
    case "grid":
      return (
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={20 * s}
          height={20 * s}
        >
          <rect width={20 * s} height={20 * s} fill={b} />
          <path
            d={`M${20 * s} 0 L0 0 0 ${20 * s}`}
            fill="none"
            stroke={a}
            strokeWidth={0.8 * s}
          />
        </pattern>
      );
  }
}

export const PATTERN_NAMES: PatternName[] = [
  "zigzag",
  "scallop",
  "leaf-row",
  "single-leaf",
  "sun",
  "dots",
  "stripes",
  "grid",
];
