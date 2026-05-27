import { PosterFrame, TitleCard, type PosterVariant } from "./PosterFrame";
import type { DsPatternName } from "../library/dsPatterns";

export function SectionDividerSlide({
  number,
  title,
  description,
  variant = "black",
  patternName = "natura",
  bgImage,
  showPattern = true,
}: {
  number: string;
  title: string;
  description?: string;
  variant?: PosterVariant;
  patternName?: DsPatternName;
  bgImage?: string;
  showPattern?: boolean;
}) {
  return (
    <PosterFrame tone="loud" variant={variant} patternName={patternName} bgImage={bgImage} showPattern={showPattern}>
      <TitleCard minWidth={1100} height={520}>
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="text-[28px] font-semibold tracking-[0.32em] text-[var(--latam-red)]">
            SECCIÓN {number}
          </div>
          <h2
            className="mt-2 whitespace-nowrap font-semibold leading-[0.92] tracking-[-0.025em] text-white"
            style={{ fontSize: titleSize(title) }}
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-6 max-w-[900px] text-[22px] leading-snug text-white/85">
              {description}
            </p>
          ) : null}
        </div>
      </TitleCard>
    </PosterFrame>
  );
}

function titleSize(title: string) {
  const n = title.length;
  if (n <= 8) return 180;
  if (n <= 12) return 150;
  if (n <= 16) return 120;
  return 96;
}
