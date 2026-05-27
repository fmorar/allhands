/**
 * DS pattern asset references. Each pattern was exported from Figma as a
 * full-resolution SVG into /public/patterns-ds/. We just <img> them — the
 * SVG scales perfectly and keeps Figma's exact geometry and fills.
 *
 * The `tone` prop picks a color variant per pattern. Tones map to specific
 * exported files based on the colour each `<path fill>` uses in the SVG.
 */

/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";

export type DsPatternName =
  | "prehispanic"
  | "natura"
  | "leafs"
  | "lines"
  | "zigzag" // = "Multiple" (multi-line zigzag) in Figma
  | "zigzag-simple"
  | "curves"
  | "flower"
  | "sun"
  | "sparkle";

export type DsTone =
  | "red"
  | "pink"
  | "purple"
  | "lilac" // light purple
  | "cream"
  | "dark-cream"
  | "gray"
  | "black"
  | "multi" // tri-color (red/purple/off-white)
  | "light"; // alias used by callers — maps to "cream" / "lilac"

type Lookup = Partial<Record<DsTone, string>>;

/* Mapping: tone → SVG filename (in /public/patterns-ds/). */
const FILES: Record<DsPatternName, Lookup> = {
  prehispanic: {
    red: "Prehispanic-1.svg",
    cream: "Prehispanic-2.svg",
    "dark-cream": "Prehispanic-6.svg",
    gray: "Prehispanic-3.svg",
    pink: "Prehispanic-4.svg",
    lilac: "Prehispanic-5.svg",
    purple: "Prehispanic-7.svg",
    black: "Prehispanic-8.svg",
    multi: "Prehispanic.svg",
    light: "Prehispanic-2.svg",
  },
  natura: {
    red: "Natura.svg",
    pink: "Natura-1.svg",
    lilac: "Natura-2.svg",
    black: "Natura-3.svg",
    gray: "Natura-9.svg",
    "dark-cream": "Natura-5.svg",
    purple: "Natura-7.svg",
    cream: "Natura-10.svg",
    multi: "Natura.svg",
    light: "Natura-10.svg",
  },
  leafs: {
    pink: "Leafs-1.svg",
    purple: "Leafs-2.svg",
    cream: "Leafs-3.svg",
    multi: "Leafs.svg",
    red: "Leafs.svg",
    light: "Leafs-3.svg",
    lilac: "Leafs-2.svg",
  },
  lines: {
    red: "Lines.svg",
    purple: "Lines-1.svg",
    cream: "Lines-2.svg",
    black: "Lines-3.svg",
    pink: "Lines-4.svg",
    lilac: "Lines-5.svg",
    gray: "Lines-6.svg",
    "dark-cream": "Lines-7.svg",
    light: "Lines-2.svg",
    multi: "Lines.svg",
  },
  zigzag: {
    pink: "Multiple-1.svg",
    red: "Multiple-2.svg",
    lilac: "Multiple-3.svg",
    purple: "Multiple-4.svg",
    "dark-cream": "Multiple-5.svg",
    cream: "Multiple-6.svg",
    black: "Multiple-7.svg",
    multi: "Multiple.svg",
    light: "Multiple-6.svg",
    gray: "Multiple-7.svg",
  },
  "zigzag-simple": {
    red: "Simple.svg",
    pink: "Simple-1.svg",
    purple: "Simple-2.svg",
    lilac: "Simple-3.svg",
    "dark-cream": "Simple-5.svg",
    cream: "Simple-4.svg",
    black: "Simple-6.svg",
    multi: "Simple.svg",
    light: "Simple-4.svg",
  },
  curves: {
    multi: "Curves.svg",
    purple: "Curves-1.svg",
    cream: "Curves-2.svg",
    red: "Curves-3.svg",
    lilac: "Curves-4.svg",
    "dark-cream": "Curves-5.svg",
    pink: "Curves-3.svg",
    light: "Curves-5.svg",
  },
  flower: {
    red: "Flower.svg",
    black: "Flower-1.svg",
    purple: "Flower-2.svg",
    pink: "Flower-3.svg",
    cream: "Flower-4.svg",
    lilac: "Flower-5.svg",
    "dark-cream": "Flower-4.svg",
    multi: "Flower.svg",
    light: "Flower-4.svg",
  },
  sun: {
    red: "Sun.svg",
    cream: "Sun-2.svg",
    lilac: "Sun-6.svg",
    purple: "Sun-8.svg",
    gray: "Sun-12.svg",
    pink: "Sun-14.svg",
    "dark-cream": "Sun-16.svg",
    black: "Sun-10.svg",
    light: "Sun-2.svg",
    multi: "Sun.svg",
  },
  sparkle: {
    red: "Sparkle.svg",
    cream: "Sparkle-2.svg",
    lilac: "Sparkle-6.svg",
    purple: "Sparkle-8.svg",
    gray: "Sparkle-12.svg",
    pink: "Sparkle-14.svg",
    "dark-cream": "Sparkle-16.svg",
    black: "Sparkle-10.svg",
    light: "Sparkle-2.svg",
    multi: "Sparkle.svg",
  },
};

function resolveFile(name: DsPatternName, tone: DsTone): string {
  const lookup = FILES[name];
  const file = lookup[tone] ?? lookup.red ?? Object.values(lookup)[0]!;
  return `/patterns-ds/${file}`;
}

export function DsPattern({
  name,
  tone = "red",
  opacity = 1,
  rotate = 0,
  className,
  style,
  // The next two are deprecated but kept so existing callers don't break.
  scale: _scale,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}: {
  name: DsPatternName;
  tone?: DsTone;
  opacity?: number;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
  /** @deprecated kept for back-compat; size via style instead. */
  scale?: number;
}) {
  return (
    <img
      src={resolveFile(name, tone)}
      alt=""
      aria-hidden
      className={className}
      style={{
        ...style,
        opacity,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        objectFit: "fill",
        pointerEvents: "none",
      }}
    />
  );
}
