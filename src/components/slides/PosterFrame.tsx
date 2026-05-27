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
  patternTone: DsTone;
  cardBg: string;
  cardText: string;
  cardOffsetBg: string;
  cityRule: string;
  flowerA: "red" | "purple" | "black" | "white";
  flowerB: "red" | "purple" | "black" | "white";
  flowerC: "red" | "purple" | "black" | "white";
};

const VARIANTS: Record<PosterVariant, VariantSpec> = {
  cream: {
    background: "var(--latam-offwhite)",
    text: "#000000",
    patternTone: "red",
    cardBg: "#000000",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-red)",
    cityRule: "rgba(0,0,0,0.18)",
    flowerA: "red",
    flowerB: "purple",
    flowerC: "black",
  },
  black: {
    background: "var(--latam-black)",
    text: "#ffffff",
    patternTone: "cream",
    cardBg: "var(--latam-red)",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-purple)",
    cityRule: "rgba(255,255,255,0.25)",
    flowerA: "red",
    flowerB: "white",
    flowerC: "red",
  },
  purple: {
    background: "var(--latam-purple)",
    text: "#ffffff",
    patternTone: "cream",
    cardBg: "#000000",
    cardText: "#ffffff",
    cardOffsetBg: "#4D4D72",
    cityRule: "rgba(255,255,255,0.3)",
    flowerA: "white",
    flowerB: "black",
    flowerC: "red",
  },
  red: {
    background: "var(--latam-red)",
    text: "#ffffff",
    patternTone: "black",
    cardBg: "#000000",
    cardText: "#ffffff",
    cardOffsetBg: "var(--latam-purple)",
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
    cityRule: "rgba(0,0,0,0.22)",
    flowerA: "black",
    flowerB: "purple",
    flowerC: "red",
  },
};

/* ──────────── Placement profiles by pattern shape ────────────
 *
 * Patterns have very different natural aspect ratios. We pick a
 * placement template per pattern type so a SINGLE pattern can be
 * placed at 2-3 corners in a way that respects its shape:
 *
 *   - "strip"  → wide & short. Place as top + bottom strip.
 *   - "column" → tall & narrow. Place as left + right column.
 *   - "tile"   → square-ish. Place at 2 diagonal corners.
 */
type Placement = { left?: number; right?: number; top?: number; bottom?: number; w: number; h: number };

type Profile = { kind: "strip" | "column" | "tile"; placements: Placement[] };

const STRIP_H = 110;
const COLUMN_W = 220;
const TILE_SIZE = 360;

const PROFILES: Record<DsPatternName, Profile> = {
  // "Strip" patterns sit as a single horizontal band at the top so they
  // read as a header decoration instead of "framing brackets".
  prehispanic: {
    kind: "strip",
    placements: [
      { left: 0, right: 0, top: 40, w: 0, h: STRIP_H },
    ],
  },
  natura: {
    kind: "strip",
    placements: [
      { left: 0, right: 0, top: 40, w: 0, h: STRIP_H },
    ],
  },
  // "Column" patterns: placed asymmetrically (one side) so they feel like
  // intentional accents, not framing brackets.
  zigzag: {
    kind: "column",
    placements: [
      { left: 24, top: 60, bottom: 200, w: COLUMN_W, h: 0 },
    ],
  },
  "zigzag-simple": {
    kind: "column",
    placements: [
      { right: 36, top: 60, bottom: 200, w: 160, h: 0 },
    ],
  },
  curves: {
    kind: "column",
    placements: [
      { left: 24, top: 100, bottom: 220, w: COLUMN_W, h: 0 },
    ],
  },
  leafs: {
    kind: "column",
    placements: [
      { left: 24, top: 60, bottom: 200, w: COLUMN_W, h: 0 },
      { right: 30, top: 280, w: 160, h: 240 },
    ],
  },
  lines: {
    kind: "tile",
    placements: [
      { left: 30, top: 50, w: TILE_SIZE, h: TILE_SIZE },
      { right: 30, bottom: 110, w: TILE_SIZE, h: TILE_SIZE },
    ],
  },
  flower: {
    kind: "tile",
    placements: [
      { left: 40, top: 60, w: 300, h: 300 },
      { right: 40, bottom: 130, w: 300, h: 300 },
    ],
  },
  sun: {
    kind: "tile",
    placements: [
      { left: 60, top: 80, w: 240, h: 240 },
      { right: 60, bottom: 130, w: 240, h: 240 },
      { left: 1500, top: 100, w: 160, h: 160 },
    ],
  },
  sparkle: {
    kind: "tile",
    placements: [
      { left: 80, top: 100, w: 200, h: 200 },
      { right: 80, bottom: 160, w: 200, h: 200 },
      { left: 400, bottom: 200, w: 140, h: 140 },
    ],
  },
};

const DEFAULT_CITIES: Array<[string, string]> = [
  ["Costa Rica", "que tuanis"],
  ["Colombia", "que chimba"],
  ["México", "que chido"],
];

export function PosterFrame({
  children,
  tone = "loud",
  variant = "cream",
  patternName = "prehispanic",
  bgImage,
  hashtag = "#XDLATAM",
  cities = DEFAULT_CITIES,
  pageNumber,
  showXMark = false,
  showPattern = true,
  decoration,
}: {
  children: ReactNode;
  tone?: Tone;
  variant?: PosterVariant;
  patternName?: DsPatternName;
  /** Optional full-bleed background image (covers the variant color). */
  bgImage?: string;
  hashtag?: string;
  cities?: Array<[string, string]>;
  pageNumber?: number | string;
  showXMark?: boolean;
  /** Toggle the default decorative pattern overlay. */
  showPattern?: boolean;
  /** Custom decoration JSX rendered above the bg, below the title card.
   *  When set, the standard `patternName` overlay is skipped. */
  decoration?: ReactNode;
}) {
  const v = VARIANTS[variant];
  const profile = PROFILES[patternName];
  const quiet = tone === "quiet";
  const op = quiet ? 0.55 : 0.9;

  return (
    <SlideStage background={v.background} backgroundImage={bgImage}>
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ color: v.text }}
      >

        {/* CUSTOM DECORATION (skips the default pattern overlay) */}
        {decoration ? (
          decoration
        ) : showPattern ? (
          profile.placements.map((p, i) => (
            <DsPattern
              key={i}
              name={patternName}
              tone={v.patternTone}
              opacity={op}
              className="absolute"
              style={{
                left: p.left,
                right: p.right,
                top: p.top,
                bottom: p.bottom,
                width: p.w || undefined,
                height: p.h || undefined,
              }}
            />
          ))
        ) : null}

        {/* FLOWER ACCENTS — only on pattern slides, since they read as
            orphan marks on bg-only slides. */}
        {showPattern && !decoration ? (
          <>
            <FlowerMark
              color={v.flowerA}
              size={48}
              className="absolute left-[80px] top-1/2 -translate-y-1/2"
            />
            <FlowerMark
              color={v.flowerB}
              size={36}
              className="absolute right-[60px] top-[60px]"
            />
            <FlowerMark
              color={v.flowerC}
              size={32}
              className="absolute right-[100px] bottom-[140px]"
            />
          </>
        ) : null}

        {/* HASHTAG top-right */}
        <div className="absolute right-24 top-[30px] text-[18px] font-semibold tracking-[0.2em]">
          {hashtag}
        </div>

        {/* Optional X mark (opt-in) */}
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

        {/* Page number bottom-center (per guide) */}
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
              <div key={place} className="flex items-baseline gap-3 font-normal">
                <span>{place}</span>
                <span style={{ opacity: 0.6 }}>·</span>
                <span>{phrase}</span>
              </div>
            ))}
          </div>
          <div className="h-px w-full" style={{ background: v.cityRule }} />
        </div>
      </div>
    </SlideStage>
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
