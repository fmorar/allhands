"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { PosterFrame, TitleCard, type PosterVariant } from "./PosterFrame";

type Status = "idle" | "revealing" | "uploading" | "comparing";
type Submission = { id: string; url: string; name?: string; ts: number };
type State = {
  status: Status;
  revealStartedAt: number | null;
  revealDurationMs: number;
  submissions: Submission[];
  version: number;
};

const POLL_MS = 1200;

export function IcebreakerSlide({
  variant = "red",
  layoutSeed = 2,
  referenceSrc = "/icebreaker/reference.png",
}: {
  variant?: PosterVariant;
  layoutSeed?: number;
  referenceSrc?: string;
}) {
  const [state, setState] = useState<State | null>(null);
  const [voteUrl, setVoteUrl] = useState("/icebreaker");
  const [now, setNow] = useState(Date.now());
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const lastVersion = useRef(-1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setVoteUrl(`${window.location.origin}/icebreaker`);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const r = await fetch("/api/icebreaker", { cache: "no-store" });
        if (!r.ok) return;
        const next = (await r.json()) as State;
        if (cancelled) return;
        if (next.version !== lastVersion.current) {
          lastVersion.current = next.version;
          setState(next);
        }
      } catch {}
    };
    tick();
    const id = setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  async function start() {
    await fetch("/api/icebreaker/start", { method: "POST" });
  }
  async function compare() {
    await fetch("/api/icebreaker/compare", { method: "POST" });
  }
  async function reset() {
    await fetch("/api/icebreaker", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });
  }

  const status = state?.status ?? "idle";
  const submissions = state?.submissions ?? [];
  const remaining =
    state?.status === "revealing" && state.revealStartedAt
      ? Math.max(
          0,
          Math.ceil(
            (state.revealStartedAt + state.revealDurationMs - now) / 1000
          )
        )
      : null;

  return (
    <>
      <PosterFrame
        tone="quiet"
        variant={variant}
        layoutSeed={layoutSeed}
        showXMark={false}
      >
        {status === "idle" && <IdleState onStart={start} voteUrl={voteUrl} />}
        {status === "revealing" && (
          <RevealingState referenceSrc={referenceSrc} remaining={remaining} />
        )}
        {status === "uploading" && state && (
          <UploadingState
            submissions={state.submissions}
            voteUrl={voteUrl}
            onCompare={compare}
            onReset={reset}
            onOpen={(idx) => setLightboxIdx(idx)}
          />
        )}
        {status === "comparing" && state && (
          <ComparingState
            submissions={state.submissions}
            referenceSrc={referenceSrc}
            onReset={reset}
            onOpen={(idx) => setLightboxIdx(idx)}
          />
        )}
      </PosterFrame>

      {lightboxIdx !== null && submissions[lightboxIdx] && (
        <Lightbox
          submissions={submissions}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onPrev={() =>
            setLightboxIdx((i) =>
              i === null ? 0 : (i - 1 + submissions.length) % submissions.length
            )
          }
          onNext={() =>
            setLightboxIdx((i) =>
              i === null ? 0 : (i + 1) % submissions.length
            )
          }
        />
      )}
    </>
  );
}

function IdleState({
  onStart,
  voteUrl,
}: {
  onStart: () => void;
  voteUrl: string;
}) {
  return (
    <TitleCard minWidth={1400} maxWidth={1600} padding={64}>
      <div className="flex items-center gap-12">
        <div className="flex-1">
          <div className="flex items-center gap-4 text-[22px] font-semibold tracking-[0.18em] text-[var(--latam-red)]">
            <span className="inline-block h-[3px] w-12 bg-[var(--latam-red)]" />
            ACTIVIDAD · EN GRUPO
          </div>
          <h2 className="mt-4 text-[140px] font-semibold leading-[0.95] tracking-[-0.025em]">
            Icebreaker
          </h2>
          <p className="mt-6 max-w-[900px] text-[24px] leading-snug text-white/85">
            Voy a mostrar una imagen durante{" "}
            <b className="text-white">30 segundos</b>. Memorízala. Después la
            escondemos y cada quien debe recrearla usando su IA favorita. Suban
            su intento desde el celular.
          </p>

          <button
            onClick={onStart}
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[var(--latam-red)] px-10 py-5 text-[28px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-red-900/30 transition-transform active:scale-[0.98]"
          >
            <span>▶</span> Empezar
          </button>
        </div>

        <div className="flex w-[280px] flex-col items-center gap-3">
          <div className="rounded-2xl bg-white p-4">
            <QRCodeSVG value={voteUrl} size={220} level="M" />
          </div>
          <div className="text-center">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/70">
              Escanea para participar
            </div>
            <div className="mt-1 break-all text-[12px] font-mono text-white/70">
              {voteUrl}
            </div>
          </div>
        </div>
      </div>
    </TitleCard>
  );
}

function RevealingState({
  referenceSrc,
  remaining,
}: {
  referenceSrc: string;
  remaining: number | null;
}) {
  return (
    <div className="relative">
      <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
        <img
          src={referenceSrc}
          alt="Imagen a recrear"
          style={{
            width: "min(1500px, 90vw)",
            height: "auto",
            display: "block",
          }}
        />
      </div>
      {remaining !== null && (
        <div className="absolute -top-6 -right-6 flex h-[140px] w-[140px] items-center justify-center rounded-full bg-black text-white shadow-2xl">
          <div className="text-center">
            <div className="text-[12px] uppercase tracking-[0.18em] text-white/60">
              Quedan
            </div>
            <div className="text-[56px] font-semibold leading-none tabular-nums">
              {remaining}
            </div>
            <div className="text-[12px] text-white/60">seg</div>
          </div>
        </div>
      )}
    </div>
  );
}

function UploadingState({
  submissions,
  voteUrl,
  onCompare,
  onReset,
  onOpen,
}: {
  submissions: Submission[];
  voteUrl: string;
  onCompare: () => void;
  onReset: () => void;
  onOpen: (idx: number) => void;
}) {
  return (
    <TitleCard minWidth={1700} maxWidth={1820} padding={40}>
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 text-[20px] font-semibold tracking-[0.18em] text-[var(--latam-red)]">
            <span className="inline-block h-[3px] w-12 bg-[var(--latam-red)]" />
            EN VIVO · SUBIENDO
          </div>
          <h2 className="mt-3 text-[48px] font-semibold leading-[1.02] tracking-[-0.015em]">
            ¿Cómo lo recrearon?
          </h2>
          <p className="mt-1 text-[18px] text-white/65">
            {submissions.length === 0
              ? "Esperando intentos…"
              : `${submissions.length} ${
                  submissions.length === 1 ? "intento" : "intentos"
                }`}
          </p>

          <SubmissionGrid
            submissions={submissions}
            columns={6}
            maxHeight={620}
            onOpen={onOpen}
          />

          <button
            onClick={onCompare}
            className="mt-5 inline-flex items-center gap-3 rounded-full bg-[var(--latam-red)] px-7 py-3 text-[16px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-red-900/30 transition-transform active:scale-[0.98]"
          >
            <span>🪄</span> Mostrar original
          </button>
        </div>

        <div className="flex w-[260px] shrink-0 flex-col items-center gap-3">
          <div className="rounded-xl bg-white p-3">
            <QRCodeSVG value={voteUrl} size={180} level="M" />
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/65">
              Sube tu intento
            </div>
            <div className="mt-1 break-all text-[12px] font-mono text-white/70">
              {voteUrl}
            </div>
          </div>
          <button
            onClick={onReset}
            className="mt-4 text-[10px] uppercase tracking-[0.18em] text-white/40 hover:text-white/70"
          >
            Reset
          </button>
        </div>
      </div>
    </TitleCard>
  );
}

function ComparingState({
  submissions,
  referenceSrc,
  onReset,
  onOpen,
}: {
  submissions: Submission[];
  referenceSrc: string;
  onReset: () => void;
  onOpen: (idx: number) => void;
}) {
  return (
    <TitleCard minWidth={1740} maxWidth={1820} padding={32}>
      <div className="flex items-center gap-4 text-[18px] font-semibold tracking-[0.18em] text-[var(--latam-red)]">
        <span className="inline-block h-[3px] w-12 bg-[var(--latam-red)]" />
        COMPARATIVA
      </div>
      <h2 className="mt-1 text-[36px] font-semibold leading-[1.02] tracking-[-0.015em]">
        Original vs. los intentos
      </h2>

      <div className="mt-4 grid grid-cols-[1fr_1.4fr] gap-6">
        <figure className="overflow-hidden rounded-xl bg-black">
          <img
            src={referenceSrc}
            alt="Imagen original"
            className="block h-auto w-full"
          />
          <figcaption className="bg-black px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-white/70">
            Original
          </figcaption>
        </figure>
        <SubmissionGrid
          submissions={submissions}
          columns={5}
          maxHeight={720}
          emptyText="No hubo intentos"
          onOpen={onOpen}
        />
      </div>

      <div className="mt-3 flex items-center justify-end">
        <button
          onClick={onReset}
          className="text-[10px] uppercase tracking-[0.18em] text-white/40 hover:text-white/70"
        >
          Reset
        </button>
      </div>
    </TitleCard>
  );
}

function SubmissionGrid({
  submissions,
  columns,
  maxHeight,
  emptyText = "Esperando intentos…",
  onOpen,
}: {
  submissions: Submission[];
  columns: number;
  maxHeight: number;
  emptyText?: string;
  onOpen: (idx: number) => void;
}) {
  if (submissions.length === 0) {
    return (
      <div
        className="mt-5 grid place-items-center rounded-xl border border-white/10 bg-white/5 text-[16px] text-white/50"
        style={{ minHeight: 320 }}
      >
        {emptyText}
      </div>
    );
  }
  return (
    <div
      className="mt-5 overflow-y-auto pr-2"
      style={{
        maxHeight,
        scrollbarColor: "rgba(255,255,255,0.25) transparent",
        scrollbarWidth: "thin",
      }}
    >
      <div
        className="grid gap-2.5"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {submissions.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => onOpen(idx)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-black ring-0 ring-white/30 hover:ring-2 transition-shadow"
          >
            <img
              src={s.url}
              alt={s.name ?? "intento"}
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.04]"
            />
            {s.name ? (
              <span className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent px-2 py-1 text-left text-[11px] font-medium text-white">
                {s.name}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function Lightbox({
  submissions,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  submissions: Submission[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const current = submissions[index];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="absolute right-6 top-6 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-[14px] uppercase tracking-[0.18em] text-white hover:bg-white/15"
      >
        Cerrar · esc
      </button>

      {/* Prev */}
      {submissions.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous"
          className="absolute left-8 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white/5 px-5 py-3 text-[24px] text-white hover:bg-white/15"
        >
          ←
        </button>
      )}

      {/* Image */}
      <figure
        className="flex max-h-[88vh] max-w-[92vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.url}
          alt={current.name ?? "intento"}
          className="max-h-[80vh] max-w-full rounded-lg shadow-2xl"
        />
        <figcaption className="mt-4 text-center text-white">
          {current.name ? (
            <div className="text-[20px] font-semibold">{current.name}</div>
          ) : null}
          <div className="mt-1 text-[12px] uppercase tracking-[0.18em] text-white/55">
            {index + 1} / {submissions.length}
          </div>
        </figcaption>
      </figure>

      {/* Next */}
      {submissions.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next"
          className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white/5 px-5 py-3 text-[24px] text-white hover:bg-white/15"
        >
          →
        </button>
      )}
    </div>
  );
}
