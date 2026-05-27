"use client";

import { createContext, useContext, type ReactNode } from "react";
import { SlideStage } from "../SlideStage";
import { PatternFill } from "../library/patterns";
import { FlowerMark } from "../library/FlowerMark";

type Tone = "loud" | "quiet";

export type PosterVariant =
  | "red"
  | "purple"
  | "cream"
  | "black"
  | "gradient-warm"
  | "gradient-cool";

type VariantSpec = {
  background: string;
  text: string;
  patternA: "red" | "purple" | "black" | "white" | "offwhite";
  patternB: "red" | "purple" | "black" | "white" | "offwhite";
  cardBg: string;
  cardText: string;
  cardOffsetBg: string;
  accentRed: string;
  outlineStroke: string;
  cityRule: string;
  flowerA: "red" | "purple" | "black" | "white";
  flowerB: "red" | "purple" | "black" | "white";
  flowerC: "red" | "purple" | "black" | "white";
};

const VARIANTS: Record<PosterVariant, VariantSpec> = {
  red: {
    background: "var(--latam-red)",
    text: "#ffffff",
    patternA: "black",
    patternB: "red",
    cardBg: "#000000",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-purple)",
    accentRed: "var(--latam-red)",
    outlineStroke: "rgba(255,255,255,0.85)",
    cityRule: "rgba(255,255,255,0.3)",
    flowerA: "black",
    flowerB: "black",
    flowerC: "white",
  },
  purple: {
    background: "var(--latam-purple)",
    text: "#ffffff",
    patternA: "black",
    patternB: "purple",
    cardBg: "#000000",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-red)",
    accentRed: "var(--latam-red)",
    outlineStroke: "rgba(255,255,255,0.85)",
    cityRule: "rgba(255,255,255,0.3)",
    flowerA: "white",
    flowerB: "black",
    flowerC: "red",
  },
  cream: {
    background: "var(--latam-offwhite)",
    text: "#000000",
    patternA: "red",
    patternB: "offwhite",
    cardBg: "#000000",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-red)",
    accentRed: "var(--latam-red)",
    outlineStroke: "rgba(0,0,0,0.7)",
    cityRule: "rgba(0,0,0,0.2)",
    flowerA: "red",
    flowerB: "purple",
    flowerC: "black",
  },
  black: {
    background: "var(--latam-black)",
    text: "#ffffff",
    patternA: "red",
    patternB: "black",
    cardBg: "var(--latam-red)",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-purple)",
    accentRed: "#ffffff",
    outlineStroke: "rgba(255,255,255,0.85)",
    cityRule: "rgba(255,255,255,0.3)",
    flowerA: "red",
    flowerB: "white",
    flowerC: "red",
  },
  "gradient-warm": {
    background:
      "linear-gradient(155deg, #e90130 0%, #f7c3cf 70%, #faf9f6 100%)",
    text: "#000000",
    patternA: "black",
    patternB: "red",
    cardBg: "#000000",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-red)",
    accentRed: "var(--latam-red)",
    outlineStroke: "rgba(0,0,0,0.75)",
    cityRule: "rgba(0,0,0,0.25)",
    flowerA: "black",
    flowerB: "red",
    flowerC: "purple",
  },
  "gradient-cool": {
    background:
      "linear-gradient(160deg, #616290 0%, #cfcfe2 60%, #faf9f6 100%)",
    text: "#000000",
    patternA: "black",
    patternB: "purple",
    cardBg: "#000000",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-purple)",
    accentRed: "var(--latam-red)",
    outlineStroke: "rgba(0,0,0,0.75)",
    cityRule: "rgba(0,0,0,0.25)",
    flowerA: "black",
    flowerB: "purple",
    flowerC: "red",
  },
};

// Different corner pattern layouts so variants don't all look identical.
type Layout = {
  topLeft: PatternName;
  topMid: PatternName;
  topRight: PatternName;
  bottomLeft: PatternName;
  bottomRight: PatternName;
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

const LAYOUTS: Layout[] = [
  // A — original
  {
    topLeft: "dots",
    topMid: "zigzag",
    topRight: "leaf-row",
    bottomLeft: "scallop",
    bottomRight: "sun",
  },
  // B — busier top, leaf bottom
  {
    topLeft: "zigzag",
    topMid: "sun",
    topRight: "dots",
    bottomLeft: "leaf-row",
    bottomRight: "scallop",
  },
  // C — diagonal weight
  {
    topLeft: "sun",
    topMid: "leaf-row",
    topRight: "scallop",
    bottomLeft: "dots",
    bottomRight: "zigzag",
  },
  // D — calm grid
  {
    topLeft: "grid",
    topMid: "dots",
    topRight: "stripes",
    bottomLeft: "leaf-row",
    bottomRight: "scallop",
  },
];

const DEFAULT_WORDS = ["CONECTA", "CRECE", "DESCUBRE", "EQUIPO"];
const DEFAULT_CITIES: Array<[string, string]> = [
  ["Costa Rica", "que tuanis"],
  ["Colombia", "que chimba"],
  ["México", "que chido"],
];

export function PosterFrame({
  children,
  tone = "loud",
  variant = "red",
  layoutSeed = 0,
  hashtag = "#XDLATAM",
  edgeWords = DEFAULT_WORDS,
  cities = DEFAULT_CITIES,
  showXMark = true,
}: {
  children: ReactNode;
  tone?: Tone;
  variant?: PosterVariant;
  layoutSeed?: number;
  hashtag?: string;
  edgeWords?: string[];
  cities?: Array<[string, string]>;
  showXMark?: boolean;
}) {
  const v = VARIANTS[variant];
  const layout = LAYOUTS[layoutSeed % LAYOUTS.length];
  const quiet = tone === "quiet";
  const op = quiet ? 0.45 : 1;
  const [w1, w2, w3, w4] = [
    edgeWords[0] ?? "",
    edgeWords[1] ?? "",
    edgeWords[2] ?? "",
    edgeWords[3] ?? "",
  ];

  return (
    <SlideStage background={v.background}>
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ color: v.text }}
      >
        {/* CORNER PATTERNS */}
        <div style={{ opacity: op }}>
          <PatternFill
            pattern={layout.topLeft}
            colors={[v.patternA, v.patternB]}
            className="absolute left-0 top-0 h-[340px] w-[440px]"
          />
          <PatternFill
            pattern={layout.topMid}
            colors={[v.patternA, v.patternB]}
            scale={1.6}
            className="absolute left-[380px] top-[40px] h-[220px] w-[420px]"
          />
          <PatternFill
            pattern={layout.topRight}
            colors={[v.patternA, v.patternB]}
            scale={1.3}
            className="absolute right-[80px] top-[120px] h-[260px] w-[260px]"
          />
          <PatternFill
            pattern={layout.bottomLeft}
            colors={[v.patternA, v.patternB]}
            scale={1.4}
            className="absolute left-[60px] bottom-[80px] h-[180px] w-[360px]"
          />
          <PatternFill
            pattern={layout.bottomRight}
            colors={[v.patternA, v.patternB]}
            scale={1.2}
            className="absolute right-[40px] bottom-[120px] h-[380px] w-[480px]"
          />
        </div>

        {/* OUTLINE EDGE WORDS */}
        {!quiet && (
          <>
            <OutlineWord
              text={w1}
              stroke={v.outlineStroke}
              className="absolute left-[60px] top-1/2 -translate-y-1/2 -rotate-90"
            />
            <OutlineWord
              text={w2}
              stroke={v.outlineStroke}
              size={120}
              className="absolute right-[60px] top-[160px]"
            />
            <OutlineWord
              text={w3}
              stroke={v.outlineStroke}
              size={120}
              className="absolute right-[80px] bottom-[60px] rotate-90"
            />
            <OutlineWord
              text={w4}
              stroke={v.outlineStroke}
              size={80}
              className="absolute left-1/2 top-[60px] -translate-x-1/2"
            />
          </>
        )}

        {/* FLOWER ACCENTS */}
        <FlowerMark
          color={v.flowerA}
          size={56}
          className="absolute left-[120px] top-[420px]"
        />
        <FlowerMark
          color={v.flowerB}
          size={42}
          className="absolute right-[260px] bottom-[260px]"
        />
        <FlowerMark
          color={v.flowerC}
          size={36}
          className="absolute left-[300px] bottom-[200px]"
        />

        {/* HASHTAG */}
        <div className="absolute right-24 top-[30px] text-[18px] font-semibold tracking-[0.2em]">
          {hashtag}
        </div>

        {/* X mark */}
        {showXMark && (
          <div
            className="absolute left-1/2 top-[140px] -translate-x-1/2 text-[60px] font-semibold"
            style={{ color: v.text }}
          >
            ×
          </div>
        )}

        {/* CENTRAL CONTENT */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <CardContext.Provider value={{ bg: v.cardBg, fg: v.cardText, offset: v.cardOffsetBg, accent: v.accentRed }}>
              {children}
            </CardContext.Provider>
          </div>
        </div>

        {/* CITIES FOOTER */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-24 mb-8 flex items-end justify-between text-[22px]">
            {cities.map(([place, phrase]) => (
              <div key={place} className="flex items-baseline gap-3">
                <span
                  style={{ fontFamily: "var(--font-hand)" }}
                  className="italic"
                >
                  {place}
                </span>
                <span style={{ opacity: 0.6 }}>·</span>
                <span
                  style={{ fontFamily: "var(--font-hand)" }}
                  className="italic"
                >
                  {phrase}
                </span>
              </div>
            ))}
          </div>
          <div className="h-px w-full" style={{ background: v.cityRule }} />
        </div>
      </div>
    </SlideStage>
  );
}

function OutlineWord({
  text,
  className,
  size = 160,
  stroke,
}: {
  text: string;
  className?: string;
  size?: number;
  stroke: string;
}) {
  return (
    <div
      className={className}
      style={{
        fontFamily: "var(--font-lexend), sans-serif",
        fontWeight: 700,
        fontSize: size,
        lineHeight: 0.9,
        letterSpacing: "-0.02em",
        color: "transparent",
        WebkitTextStroke: `2px ${stroke}`,
      }}
    >
      {text}
    </div>
  );
}

const CardContext = createContext<{
  bg: string;
  fg: string;
  offset: string;
  accent: string;
}>({
  bg: "#000000",
  fg: "#ffffff",
  offset: "var(--latam-purple)",
  accent: "var(--latam-red)",
});

export function useCardStyle() {
  return useContext(CardContext);
}

/**
 * Black title card used as the central focus for poster slides. Pulls colors
 * from the surrounding PosterFrame variant via context.
 */
export function TitleCard({
  children,
  minWidth = 920,
  maxWidth = 1500,
  height,
  padding = 64,
}: {
  children: ReactNode;
  minWidth?: number;
  maxWidth?: number;
  height?: number;
  padding?: number;
}) {
  const c = useCardStyle();
  return (
    <div className="relative">
      <div
        className="absolute"
        style={{
          background: c.offset,
          inset: 0,
          transform: "translate(40px, 40px)",
        }}
      />
      <div
        className="relative flex flex-col"
        style={{
          background: c.bg,
          color: c.fg,
          minWidth,
          maxWidth,
          height,
          padding,
        }}
      >
        {children}
      </div>
    </div>
  );
}
