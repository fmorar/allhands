import { PosterFrame, TitleCard, type PosterVariant } from "./PosterFrame";

export function CoverSlide({
  title,
  subtitle,
  badge = "XD Latam",
  year = "2026",
  hashtag = "#XDLATAM",
  edgeWords,
  cities,
  variant = "red",
  layoutSeed = 0,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  year?: string;
  hashtag?: string;
  edgeWords?: string[];
  cities?: Array<[string, string]>;
  variant?: PosterVariant;
  layoutSeed?: number;
}) {
  return (
    <PosterFrame
      tone="loud"
      variant={variant}
      layoutSeed={layoutSeed}
      hashtag={hashtag}
      edgeWords={edgeWords}
      cities={cities}
    >
      <TitleCard minWidth={920} height={480}>
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="text-[28px] uppercase tracking-[0.32em] text-white/80">
            All Hands
          </div>
          <h1
            className="mt-2 whitespace-nowrap font-semibold leading-[0.92] tracking-[-0.025em] text-white"
            style={{ fontSize: titleSize(title) }}
          >
            {title}
          </h1>
          <div className="mt-6 flex items-center gap-4 text-[24px] tracking-[0.2em] text-white/70">
            <span>{badge}</span>
            <span className="opacity-50">·</span>
            <span className="tabular-nums">{year}</span>
          </div>
          {subtitle ? (
            <div className="mt-6 max-w-[1000px] text-[22px] leading-snug text-white/85">
              {subtitle}
            </div>
          ) : null}
        </div>
      </TitleCard>
    </PosterFrame>
  );
}

function titleSize(title: string) {
  const n = title.length;
  if (n <= 7) return 220;
  if (n <= 10) return 180;
  if (n <= 13) return 150;
  if (n <= 16) return 120;
  return 96;
}
