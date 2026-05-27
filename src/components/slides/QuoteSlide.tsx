import { PosterFrame, TitleCard, type PosterVariant } from "./PosterFrame";
import type { DsPatternName } from "../library/dsPatterns";

export function QuoteSlide({
  quote,
  attribution,
  pageNumber: _pageNumber,
  variant = "gradient-warm",
  patternName = "zigzag-simple",
  bgImage,
  showPattern = true,
}: {
  quote: string;
  attribution?: string;
  pageNumber?: number | string;
  variant?: PosterVariant;
  patternName?: DsPatternName;
  bgImage?: string;
  showPattern?: boolean;
}) {
  return (
    <PosterFrame tone="quiet" variant={variant} patternName={patternName} bgImage={bgImage} showPattern={showPattern}>
      <TitleCard minWidth={1300} maxWidth={1500} padding={72}>
        <div className="flex flex-col">
          <div className="text-[140px] leading-[0.8] text-[var(--latam-red)] font-semibold">
            “
          </div>
          <blockquote
            className="mt-4 font-medium leading-[1.15] tracking-[-0.015em] text-white"
            style={{ fontSize: quoteSize(quote) }}
          >
            {quote}
          </blockquote>
          {attribution ? (
            <div className="mt-8 text-[20px] uppercase tracking-[0.14em] text-white/70">
              — {attribution}
            </div>
          ) : null}
        </div>
      </TitleCard>
    </PosterFrame>
  );
}

function quoteSize(quote: string) {
  const n = quote.length;
  if (n <= 50) return 72;
  if (n <= 100) return 56;
  if (n <= 160) return 44;
  return 36;
}
