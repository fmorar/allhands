import { PosterFrame, TitleCard, type PosterVariant } from "./PosterFrame";

export type IndexEntry = { label: string; page: string };
export type IndexSection = { title: string; entries: IndexEntry[] };

export function IndexSlide({
  pageNumber: _pageNumber,
  intro,
  sections,
  variant = "cream",
  layoutSeed = 3,
}: {
  pageNumber?: number | string;
  intro: string;
  sections: IndexSection[];
  variant?: PosterVariant;
  layoutSeed?: number;
}) {
  const half = Math.ceil(sections.length / 2);
  const left = sections.slice(0, half);
  const right = sections.slice(half);

  return (
    <PosterFrame tone="quiet" variant={variant} layoutSeed={layoutSeed}>
      <TitleCard minWidth={1400} maxWidth={1600} padding={72}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4 text-[22px] font-semibold tracking-[0.18em] text-[var(--latam-red)]">
            <span className="inline-block h-[3px] w-12 bg-[var(--latam-red)]" />
            ÍNDICE
          </div>

          <h2 className="text-[64px] font-semibold leading-[1.02] tracking-[-0.015em] text-white max-w-[1200px]">
            {intro}
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-x-16 gap-y-6">
            {[left, right].map((col, ci) => (
              <div key={ci} className="flex flex-col gap-6">
                {col.map((s) => (
                  <div key={s.title}>
                    <div className="border-t border-white/20 pt-2 text-[16px] font-semibold uppercase tracking-[0.18em] text-[var(--latam-red)]">
                      {s.title}
                    </div>
                    <ul className="mt-2 flex flex-col gap-1.5 text-[22px] text-white">
                      {s.entries.map((e) => (
                        <li
                          key={e.label}
                          className="flex items-baseline justify-between gap-5"
                        >
                          <span>{e.label}</span>
                          <span className="tabular-nums text-white/50">
                            {e.page}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </TitleCard>
    </PosterFrame>
  );
}
