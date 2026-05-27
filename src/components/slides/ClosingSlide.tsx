import { PosterFrame, TitleCard, type PosterVariant } from "./PosterFrame";
import type { DsPatternName } from "../library/dsPatterns";

export function ClosingSlide({
  title = "Gracias",
  subtitle,
  contacts,
  variant = "black",
  patternName = "sun",
  bgImage,
  showPattern = true,
}: {
  title?: string;
  subtitle?: string;
  contacts?: Array<{ label: string; value: string }>;
  variant?: PosterVariant;
  patternName?: DsPatternName;
  bgImage?: string;
  showPattern?: boolean;
}) {
  return (
    <PosterFrame tone="loud" variant={variant} hashtag="#XDLATAM" patternName={patternName} bgImage={bgImage} showPattern={showPattern}>
      <TitleCard minWidth={1000} maxWidth={1500} height={560} padding={64}>
        <div className="flex h-full flex-col items-center justify-center text-center">
          <h2
            className="whitespace-nowrap font-semibold leading-[0.92] tracking-[-0.025em] text-white"
            style={{ fontSize: titleSize(title) }}
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-6 max-w-[1100px] text-[24px] leading-snug text-white/85">
              {subtitle}
            </p>
          ) : null}
          {contacts && contacts.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-x-16 gap-y-3 text-[20px]">
              {contacts.map((c) => (
                <div key={c.label} className="flex items-baseline gap-3">
                  <span className="text-[14px] uppercase tracking-[0.18em] text-white/60">
                    {c.label}
                  </span>
                  <span className="font-medium text-white">{c.value}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </TitleCard>
    </PosterFrame>
  );
}

function titleSize(title: string) {
  const n = title.length;
  if (n <= 6) return 260;
  if (n <= 10) return 200;
  if (n <= 14) return 160;
  return 120;
}
