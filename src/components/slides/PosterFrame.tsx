"use client";

import { createContext, useContext, type ReactNode } from "react";
import { SlideStage } from "../SlideStage";
import {
  DsPattern,
  type DsPatternName,
  type DsTone,
} from "../library/dsPatterns";
import { FlowerMark } from "../library/FlowerMark";

type Tone = "loud" | "quiet";

export type PosterVariant =
  | "cream"
  | "black"
  | "purple"
  | "red"
  | "gradient-warm"
  | "gradient-cool";

type VariantSpec = {
  background: string;
  text: string;
  /** DS pattern tone used for the corner motifs. */
  patternTone: DsTone;
  cardBg: string;
  cardText: string;
  cardOffsetBg: string;
  outlineStroke: string;
  cityRule: string;
  flowerA: "red" | "purple" | "black" | "white";
  flowerB: "red" | "purple" | "black" | "white";
  flowerC: "red" | "purple" | "black" | "white";
};

const VARIANTS: Record<PosterVariant, VariantSpec> = {
  // Default — calm off-white background, red+purple accents.
  cream: {
    background: "var(--latam-offwhite)",
    text: "#000000",
    patternTone: "red",
    cardBg: "#000000",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-red)",
    outlineStroke: "rgba(0,0,0,0.65)",
    cityRule: "rgba(0,0,0,0.18)",
    flowerA: "red",
    flowerB: "purple",
    flowerC: "black",
  },
  // High-contrast — black background, red/cream patterns.
  black: {
    background: "var(--latam-black)",
    text: "#ffffff",
    patternTone: "red",
    cardBg: "var(--latam-red)",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-purple)",
    outlineStroke: "rgba(255,255,255,0.85)",
    cityRule: "rgba(255,255,255,0.25)",
    flowerA: "red",
    flowerB: "white",
    flowerC: "red",
  },
  // Cool — Latam purple with red+light patterns.
  purple: {
    background: "var(--latam-purple)",
    text: "#ffffff",
    patternTone: "light",
    cardBg: "#000000",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-red)",
    outlineStroke: "rgba(255,255,255,0.85)",
    cityRule: "rgba(255,255,255,0.3)",
    flowerA: "white",
    flowerB: "black",
    flowerC: "red",
  },
  // Loud — Radiant Red bg (use sparingly). Patterns in dark.
  red: {
    background: "var(--latam-red)",
    text: "#ffffff",
    patternTone: "dark",
    cardBg: "#000000",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-purple)",
    outlineStroke: "rgba(255,255,255,0.85)",
    cityRule: "rgba(255,255,255,0.3)",
    flowerA: "black",
    flowerB: "black",
    flowerC: "white",
  },
  "gradient-warm": {
    background:
      "linear-gradient(155deg, #faf9f6 0%, #f7c3cf 60%, #e90130 130%)",
    text: "#000000",
    patternTone: "red",
    cardBg: "#000000",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-red)",
    outlineStroke: "rgba(0,0,0,0.7)",
    cityRule: "rgba(0,0,0,0.22)",
    flowerA: "black",
    flowerB: "red",
    flowerC: "purple",
  },
  "gradient-cool": {
    background:
      "linear-gradient(160deg, #faf9f6 0%, #cfcfe2 60%, #616290 130%)",
    text: "#000000",
    patternTone: "purple",
    cardBg: "#000000",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-purple)",
    outlineStroke: "rgba(0,0,0,0.7)",
    cityRule: "rgba(0,0,0,0.22)",
    flowerA: "black",
    flowerB: "purple",
    flowerC: "red",
  },
};

// ──────────────────────── corner layouts (DS) ────────────────────────
type Layout = {
  topLeft: { name: DsPatternName; w: number; h: number; scale: number };
  topMid: { name: DsPatternName; w: number; h: number; scale: number };
  topRight: { name: DsPatternName; w: number; h: number; scale: number };
  bottomLeft: { name: DsPatternName; w: number; h: number; scale: number };
  bottomRight: { name: DsPatternName; w: number; h: number; scale: number };
};

const LAYOUTS: Layout[] = [
  // 0 — Editorial: prehispanic strip, lines tile, leafs column
  {
    topLeft: { name: "lines", w: 380, h: 300, scale: 2.4 },
    topMid: { name: "prehispanic", w: 540, h: 90, scale: 1.6 },
    topRight: { name: "leafs", w: 220, h: 360, scale: 1.4 },
    bottomLeft: { name: "natura", w: 460, h: 150, scale: 1.3 },
    bottomRight: { name: "lines", w: 420, h: 320, scale: 2.4 },
  },
  // 1 — Botanical: leafs + natura prominent
  {
    topLeft: { name: "leafs", w: 220, h: 360, scale: 1.4 },
    topMid: { name: "zigzag", w: 200, h: 240, scale: 2 },
    topRight: { name: "natura", w: 460, h: 150, scale: 1.3 },
    bottomLeft: { name: "prehispanic", w: 460, h: 90, scale: 1.6 },
    bottomRight: { name: "leafs", w: 220, h: 360, scale: 1.4 },
  },
  // 2 — Geometric: prehispanic + lines tile
  {
    topLeft: { name: "prehispanic", w: 540, h: 90, scale: 1.6 },
    topMid: { name: "lines", w: 320, h: 320, scale: 2.4 },
    topRight: { name: "sun", w: 240, h: 240, scale: 1.4 },
    bottomLeft: { name: "lines", w: 360, h: 300, scale: 2.4 },
    bottomRight: { name: "prehispanic", w: 540, h: 90, scale: 1.6 },
  },
  // 3 — Quiet: subtle line tiles + sparkles
  {
    topLeft: { name: "lines", w: 380, h: 300, scale: 2.4 },
    topMid: { name: "sparkle", w: 320, h: 200, scale: 1.6 },
    topRight: { name: "lines", w: 260, h: 260, scale: 2.4 },
    bottomLeft: { name: "natura", w: 460, h: 150, scale: 1.3 },
    bottomRight: { name: "curves", w: 380, h: 220, scale: 2 },
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
  variant = "cream",
  layoutSeed = 0,
  hashtag = "#XDLATAM",
  edgeWords = DEFAULT_WORDS,
  cities = DEFAULT_CITIES,
  pageNumber,
  showXMark = false,
}: {
  children: ReactNode;
  tone?: Tone;
  variant?: PosterVariant;
  layoutSeed?: number;
  hashtag?: string;
  edgeWords?: string[];
  cities?: Array<[string, string]>;
  /** Two-digit page number rendered bottom-center per the guide. */
  pageNumber?: number | string;
  showXMark?: boolean;
}) {
  const v = VARIANTS[variant];
  const layout = LAYOUTS[layoutSeed % LAYOUTS.length];
  const quiet = tone === "quiet";
  const op = quiet ? 0.5 : 0.85;
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
        <DsPattern
          name={layout.topLeft.name}
          tone={v.patternTone}
          scale={layout.topLeft.scale}
          opacity={op}
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: layout.topLeft.w,
            height: layout.topLeft.h,
          }}
        />
        <DsPattern
          name={layout.topMid.name}
          tone={v.patternTone}
          scale={layout.topMid.scale}
          opacity={op}
          className="absolute"
          style={{
            left: 400,
            top: 30,
            width: layout.topMid.w,
            height: layout.topMid.h,
          }}
        />
        <DsPattern
          name={layout.topRight.name}
          tone={v.patternTone}
          scale={layout.topRight.scale}
          opacity={op}
          className="absolute"
          style={{
            right: 60,
            top: 120,
            width: layout.topRight.w,
            height: layout.topRight.h,
          }}
        />
        <DsPattern
          name={layout.bottomLeft.name}
          tone={v.patternTone}
          scale={layout.bottomLeft.scale}
          opacity={op}
          className="absolute"
          style={{
            left: 60,
            bottom: 80,
            width: layout.bottomLeft.w,
            height: layout.bottomLeft.h,
          }}
        />
        <DsPattern
          name={layout.bottomRight.name}
          tone={v.patternTone}
          scale={layout.bottomRight.scale}
          opacity={op}
          className="absolute"
          style={{
            right: 40,
            bottom: 120,
            width: layout.bottomRight.w,
            height: layout.bottomRight.h,
          }}
        />

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
            <CardContext.Provider
              value={{
                bg: v.cardBg,
                fg: v.cardText,
                offset: v.cardOffsetBg,
                accent: "var(--latam-red)",
              }}
            >
              {children}
            </CardContext.Provider>
          </div>
        </div>

        {/* PAGE NUMBER (bottom-center, per guide) */}
        {pageNumber !== undefined && (
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[14px] tracking-[0.18em] tabular-nums"
            style={{ color: v.text, opacity: 0.55 }}
          >
            {typeof pageNumber === "number"
              ? String(pageNumber).padStart(2, "0")
              : pageNumber}
          </div>
        )}

        {/* CITIES FOOTER */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-24 mb-8 flex items-end justify-between text-[22px]">
            {cities.map(([place, phrase]) => (
              <div key={place} className="flex items-baseline gap-3">
                <span className="italic font-semibold">{place}</span>
                <span style={{ opacity: 0.6 }}>·</span>
                <span className="italic">{phrase}</span>
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
