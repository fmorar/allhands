"use client";

import { SlideStage } from "../SlideStage";

/**
 * Embeds a self-contained HTML project (typically demo) inside the slide.
 * Pointer events are forwarded to the iframe so the presenter can interact
 * with the demo live. Brand chrome stays around the edges so we don't
 * forget we're inside the deck.
 */
export function ProjectEmbedSlide({
  src,
  presenter,
  projectName,
  background = "#0a0807",
}: {
  src: string;
  presenter: string;
  projectName: string;
  background?: string;
}) {
  return (
    <SlideStage background={background}>
      <div className="relative h-full w-full">
        {/* Top chrome */}
        <div className="absolute top-6 left-12 right-12 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[20px] uppercase tracking-[0.18em] text-white/85">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--latam-red)]" />
            {presenter} · {projectName}
          </div>
          <div className="text-[20px] uppercase tracking-[0.2em] text-white/55">
            #XDLATAM
          </div>
        </div>

        {/* Iframe frame */}
        <div
          className="absolute overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
          style={{ top: 86, left: 48, right: 48, bottom: 80 }}
        >
          <iframe
            src={src}
            className="h-full w-full"
            allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope; magnetometer"
            loading="lazy"
          />
        </div>

        {/* Bottom chrome */}
        <div className="absolute bottom-7 left-12 right-12 flex items-center justify-between text-[14px] uppercase tracking-[0.18em] text-white/45">
          <div>XD Latam · All Hands</div>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/65 hover:text-white"
          >
            Abrir en pestaña ↗
          </a>
        </div>
      </div>
    </SlideStage>
  );
}
