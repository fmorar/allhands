import { QRCodeSVG } from "qrcode.react";
import { PosterFrame, TitleCard, type PosterVariant } from "./PosterFrame";
import type { DsPatternName } from "../library/dsPatterns";

/**
 * Reminder slide for Figma Config — call-to-action card with the event year,
 * a short pitch, and a QR linking to the registration / info page.
 */
export function FigmaConfigSlide({
  year = "2026",
  dates,
  pitch = "Inspiración fresca para todo el equipo. Apártalo en tu calendario.",
  url = "https://config.figma.com",
  variant = "cream",
  patternName = "flower",
  bgImage,
  showPattern = true,
}: {
  year?: string;
  dates?: string;
  pitch?: string;
  url?: string;
  variant?: PosterVariant;
  patternName?: DsPatternName;
  bgImage?: string;
  showPattern?: boolean;
}) {
  return (
    <PosterFrame
      tone="quiet"
      variant={variant}
      patternName={patternName}
      bgImage={bgImage}
      showPattern={showPattern}
      showXMark={false}
    >
      <TitleCard minWidth={1500} maxWidth={1700} padding={56}>
        <div className="flex items-center gap-12">
          {/* LEFT */}
          <div className="flex-1">
            <div className="flex items-center gap-4 text-[20px] font-semibold tracking-[0.22em] text-[var(--latam-red)]">
              <span className="inline-block h-[3px] w-12 bg-[var(--latam-red)]" />
              RESERVA LA FECHA
            </div>

            <div className="mt-3 text-[20px] uppercase tracking-[0.18em] text-white/55">
              No te pierdas
            </div>

            <h2 className="mt-1 text-[160px] font-semibold leading-[0.9] tracking-[-0.025em] text-white">
              Figma
              <br />
              Config
            </h2>

            <div className="mt-5 inline-flex items-center gap-4 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-[20px] font-semibold tracking-[0.16em] text-white">
              <span className="tabular-nums">{year}</span>
              {dates ? (
                <>
                  <span className="opacity-50">·</span>
                  <span>{dates}</span>
                </>
              ) : null}
            </div>

            <p className="mt-7 max-w-[780px] text-[22px] leading-snug text-white/85">
              {pitch}
            </p>
          </div>

          {/* RIGHT — QR */}
          <div className="flex w-[280px] flex-col items-center gap-3">
            <div className="rounded-2xl bg-white p-4">
              <QRCodeSVG value={url} size={220} level="M" />
            </div>
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">
                Escanéalo para más info
              </div>
              <div className="mt-1 break-all text-[12px] font-mono text-white/65">
                {url.replace(/^https?:\/\//, "")}
              </div>
            </div>
          </div>
        </div>
      </TitleCard>
    </PosterFrame>
  );
}
