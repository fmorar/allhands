/* eslint-disable @next/next/no-img-element */
import { PosterFrame, TitleCard, type PosterVariant } from "./PosterFrame";

/**
 * "Now presenting" intro slide. Big name in a black card with an avatar on
 * the side (photo if `photoSrc` is provided, otherwise a stylized initial);
 * subtitle calls out the topic / showcase name.
 */
export function PresenterIntroSlide({
  name,
  topic,
  description,
  label = "Showcase",
  photoSrc,
  variant = "gradient-cool",
  layoutSeed = 0,
}: {
  name: string;
  topic: string;
  description?: string;
  label?: string;
  photoSrc?: string;
  variant?: PosterVariant;
  layoutSeed?: number;
}) {
  const initial = (name.trim()[0] ?? "?").toUpperCase();

  return (
    <PosterFrame
      tone="quiet"
      variant={variant}
      layoutSeed={layoutSeed}
      showXMark={false}
    >
      <TitleCard minWidth={1500} maxWidth={1700} padding={56}>
        <div className="flex items-center gap-14">
          {/* LEFT — text */}
          <div className="flex-1">
            <div className="flex items-center gap-4 text-[20px] font-semibold tracking-[0.22em] text-[var(--latam-red)]">
              <span className="inline-block h-[3px] w-12 bg-[var(--latam-red)]" />
              {label.toUpperCase()}
            </div>

            <div className="mt-3 text-[20px] uppercase tracking-[0.18em] text-white/55">
              Presenta
            </div>

            <h2
              className="mt-1 font-semibold leading-[0.92] tracking-[-0.025em] text-white"
              style={{ fontSize: nameSize(name) }}
            >
              {name}
            </h2>

            <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-[18px] font-semibold tracking-[0.16em] text-white">
              {topic}
            </div>

            {description ? (
              <p className="mt-7 max-w-[820px] text-[22px] leading-snug text-white/85">
                {description}
              </p>
            ) : null}
          </div>

          {/* RIGHT — photo or initial avatar */}
          <div className="relative flex h-[420px] w-[420px] shrink-0 items-center justify-center">
            {/* Red ring */}
            <div
              className="absolute h-full w-full rounded-full"
              style={{ background: "var(--latam-red)" }}
            />
            {/* Inner circle (photo) */}
            <div
              className="absolute h-[92%] w-[92%] overflow-hidden rounded-full"
              style={{ background: "var(--latam-purple)" }}
            >
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span
                    className="font-semibold leading-none text-white"
                    style={{ fontSize: 240, letterSpacing: "-0.05em" }}
                  >
                    {initial}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </TitleCard>
    </PosterFrame>
  );
}

function nameSize(name: string) {
  const n = name.length;
  if (n <= 7) return 180;
  if (n <= 11) return 150;
  if (n <= 16) return 120;
  return 96;
}
