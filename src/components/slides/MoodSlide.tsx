"use client";

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { PosterFrame, TitleCard, type PosterVariant } from "./PosterFrame";
import { MOODS, type MoodId } from "@/lib/moodStore";

type Counts = Record<MoodId, number>;
type State = { counts: Counts; total: number; version: number };

const EMPTY: State = {
  counts: { sad: 0, meh: 0, ok: 0, great: 0, love: 0 },
  total: 0,
  version: 0,
};

export function MoodSlide({
  variant = "red",
  layoutSeed = 2,
  question = "¿Cómo te sientes hoy?",
  pollMs = 1500,
}: {
  variant?: PosterVariant;
  layoutSeed?: number;
  question?: string;
  pollMs?: number;
}) {
  const [state, setState] = useState<State>(EMPTY);
  const [voteUrl, setVoteUrl] = useState<string>("/mood");
  const lastVersion = useRef(0);
  const flashing = useRef<MoodId | null>(null);
  const [flashId, setFlashId] = useState<MoodId | null>(null);

  // Build vote URL from current host so QR works for anyone on the same network.
  useEffect(() => {
    if (typeof window === "undefined") return;
    setVoteUrl(`${window.location.origin}/mood`);
  }, []);

  // Poll the mood API.
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const r = await fetch("/api/mood", { cache: "no-store" });
        if (!r.ok) return;
        const next = (await r.json()) as State;
        if (cancelled) return;
        if (next.version !== lastVersion.current) {
          // Find which mood changed since last update for the flash animation.
          setState((prev) => {
            const changed = (Object.keys(next.counts) as MoodId[]).find(
              (k) => next.counts[k] !== prev.counts[k]
            );
            if (changed) {
              flashing.current = changed;
              setFlashId(changed);
              setTimeout(() => setFlashId(null), 700);
            }
            return next;
          });
          lastVersion.current = next.version;
        }
      } catch {
        // ignore transient errors
      }
    };
    tick();
    const id = setInterval(tick, pollMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [pollMs]);

  const max = Math.max(1, ...Object.values(state.counts));

  return (
    <PosterFrame
      tone="quiet"
      variant={variant}
      layoutSeed={layoutSeed}
      showXMark={false}
    >
      <TitleCard minWidth={1500} maxWidth={1700} padding={56}>
        <div className="flex items-start gap-12">
          {/* LEFT: thermometer */}
          <div className="flex-1">
            <div className="flex items-center gap-3 text-[20px] font-semibold tracking-[0.18em] text-[var(--latam-red)]">
              <span className="inline-block h-[3px] w-12 bg-[var(--latam-red)]" />
              EN VIVO
            </div>
            <h2 className="mt-4 text-[56px] font-semibold leading-[1.02] tracking-[-0.015em]">
              {question}
            </h2>
            <div className="mt-2 text-[18px] text-white/65">
              {state.total === 0
                ? "Esperando los primeros votos…"
                : `${state.total} ${state.total === 1 ? "voto" : "votos"}`}
            </div>

            <ul className="mt-6 flex flex-col gap-3">
              {MOODS.map((m) => {
                const count = state.counts[m.id];
                const pct = (count / max) * 100;
                const isFlashing = flashId === m.id;
                return (
                  <li key={m.id} className="flex items-center gap-5">
                    <div
                      className="text-[44px] leading-none transition-transform"
                      style={{
                        transform: isFlashing ? "scale(1.25)" : "scale(1)",
                        filter: isFlashing
                          ? "drop-shadow(0 0 12px rgba(255,255,255,0.6))"
                          : "none",
                        transition: "transform .3s ease, filter .3s ease",
                      }}
                    >
                      {m.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[16px] font-semibold uppercase tracking-[0.18em] text-white/75">
                          {m.label}
                        </span>
                        <span className="text-[22px] font-semibold tabular-nums">
                          {count}
                        </span>
                      </div>
                      <div className="mt-1.5 h-4 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(pct, count > 0 ? 4 : 0)}%`,
                            background: barColor(m.id),
                            transition: "width 600ms cubic-bezier(.2,.7,.2,1)",
                          }}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* RIGHT: QR code */}
          <div className="flex w-[320px] flex-col items-center gap-4">
            <div className="rounded-2xl bg-white p-5">
              <QRCodeSVG
                value={voteUrl}
                size={260}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
                marginSize={1}
              />
            </div>
            <div className="text-center">
              <div className="text-[12px] uppercase tracking-[0.18em] text-white/65">
                Escanea para votar
              </div>
              <div className="mt-1 break-all text-[14px] font-mono text-white/80">
                {voteUrl}
              </div>
            </div>
          </div>
        </div>
      </TitleCard>
    </PosterFrame>
  );
}

function barColor(id: MoodId): string {
  switch (id) {
    case "sad":
      return "var(--latam-purple)";
    case "meh":
      return "#9a9ab3";
    case "ok":
      return "#f7c3cf";
    case "great":
      return "var(--latam-red)";
    case "love":
      return "linear-gradient(90deg, #e90130 0%, #ff385f 100%)";
  }
}
