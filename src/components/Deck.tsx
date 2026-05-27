"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

export type DeckSlide = {
  id: string;
  node: ReactNode;
};

export function Deck({ slides }: { slides: DeckSlide[] }) {
  const [index, setIndex] = useState(0);

  // Sync to URL hash so refresh / share keeps position.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace(/^#\/?/, "");
      const n = parseInt(h, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= slides.length) {
        setIndex(n - 1);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [slides.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const nextHash = `#/${index + 1}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [index]);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.min(slides.length - 1, Math.max(0, i + delta)));
    },
    [slides.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
        case "j":
        case "l":
          e.preventDefault();
          go(1);
          break;
        case "ArrowLeft":
        case "PageUp":
        case "k":
        case "h":
          e.preventDefault();
          go(-1);
          break;
        case "Home":
          e.preventDefault();
          setIndex(0);
          break;
        case "End":
          e.preventDefault();
          setIndex(slides.length - 1);
          break;
        case "f":
          e.preventDefault();
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
          } else {
            document.exitFullscreen?.();
          }
          break;
        case "p":
          e.preventDefault();
          window.print();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, slides.length]);

  const current = slides[index];

  return (
    <div className="fixed inset-0 flex flex-col bg-black">
      <div className="flex-1 min-h-0">{current.node}</div>

      <div className="deck-chrome group pointer-events-none absolute bottom-0 left-0 right-0 flex translate-y-[calc(100%-12px)] items-center justify-between gap-4 bg-black/70 px-6 py-3 text-[11px] uppercase tracking-[0.14em] text-white/80 backdrop-blur transition-transform duration-300 hover:translate-y-0 focus-within:translate-y-0">
        <div className="pointer-events-auto flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--latam-red)]" />
          XD Latam · All Hands
        </div>
        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={() => go(-1)}
            className="rounded border border-white/20 px-2 py-1 hover:bg-white/10 disabled:opacity-40"
            disabled={index === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <span className="tabular-nums text-white">
            {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
          <button
            onClick={() => go(1)}
            className="rounded border border-white/20 px-2 py-1 hover:bg-white/10 disabled:opacity-40"
            disabled={index === slides.length - 1}
            aria-label="Next slide"
          >
            →
          </button>
        </div>
        <div className="pointer-events-auto hidden gap-4 sm:flex">
          <span>← → navigate</span>
          <span>F fullscreen</span>
          <span>P print</span>
        </div>
      </div>
    </div>
  );
}
