import type { ReactNode } from "react";
import { PosterFrame, TitleCard, type PosterVariant } from "./PosterFrame";
import type { DsPatternName } from "../library/dsPatterns";

export function ContentSlide({
  sectionLabel,
  title,
  pageNumber: _pageNumber,
  children,
  variant = "cream",
  patternName = "prehispanic",
  bgImage,
  showPattern = true,
}: {
  section?: string;
  slideLabel?: string;
  sectionLabel?: string;
  title: string;
  eyebrow?: string;
  pageNumber?: number | string;
  children?: ReactNode;
  variant?: PosterVariant;
  patternName?: DsPatternName;
  bgImage?: string;
  showPattern?: boolean;
}) {
  return (
    <PosterFrame tone="quiet" variant={variant} patternName={patternName} bgImage={bgImage} showPattern={showPattern}>
      <TitleCard minWidth={1300} maxWidth={1500} padding={72}>
        <div className="flex flex-col gap-6">
          {sectionLabel ? (
            <div className="flex items-center gap-4 text-[22px] font-semibold tracking-[0.18em] text-[var(--latam-red)]">
              <span className="inline-block h-[3px] w-12 bg-[var(--latam-red)]" />
              <span>{sectionLabel.toUpperCase()}</span>
            </div>
          ) : null}

          <h2
            className="font-semibold leading-[1.02] tracking-[-0.015em] text-white"
            style={{ fontSize: titleSize(title) }}
          >
            {title}
          </h2>

          {children ? (
            <div className="mt-4 text-[26px] leading-[1.45] text-white/90">
              {children}
            </div>
          ) : null}
        </div>
      </TitleCard>
    </PosterFrame>
  );
}

function titleSize(title: string) {
  const n = title.length;
  if (n <= 18) return 96;
  if (n <= 28) return 80;
  if (n <= 40) return 64;
  return 52;
}
