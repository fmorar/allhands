"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
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
        />
      )}
      {status === "comparing" && state && (
        <ComparingState
          submissions={state.submissions}
          referenceSrc={referenceSrc}
          onReset={reset}
        />
      )}
    </PosterFrame>
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
}: {
  submissions: Submission[];
  voteUrl: string;
  onCompare: () => void;
  onReset: () => void;
}) {
  return (
    <TitleCard minWidth={1500} maxWidth={1700} padding={48}>
      <div className="flex items-center gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-4 text-[20px] font-semibold tracking-[0.18em] text-[var(--latam-red)]">
            <span className="inline-block h-[3px] w-12 bg-[var(--latam-red)]" />
            EN VIVO · SUBIENDO
          </div>
          <h2 className="mt-3 text-[56px] font-semibold leading-[1.02] tracking-[-0.015em]">
            ¿Cómo lo recrearon?
          </h2>
          <p className="mt-2 text-[18px] text-white/65">
            {submissions.length === 0
              ? "Esperando intentos…"
              : `${submissions.length} ${
                  submissions.length === 1 ? "intento" : "intentos"
                }`}
          </p>

          <div
            className="mt-6 grid grid-cols-4 gap-3"
            style={{ minHeight: 380 }}
          >
            {submissions.length === 0
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-white/5 border border-white/10"
                  />
                ))
              : submissions.slice(-12).map((s) => (
                  <figure
                    key={s.id}
                    className="relative aspect-square overflow-hidden rounded-xl bg-black"
                  >
                    <img
                      src={s.url}
                      alt={s.name ?? "intento"}
                      className="h-full w-full object-cover"
                    />
                    {s.name ? (
                      <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent px-3 py-2 text-[12px] font-medium text-white">
                        {s.name}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
          </div>

          <button
            onClick={onCompare}
            className="mt-6 inline-flex items-center gap-3 rounded-full bg-[var(--latam-red)] px-7 py-3 text-[16px] font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-red-900/30 transition-transform active:scale-[0.98]"
          >
            <span>🪄</span> Mostrar original
          </button>
        </div>

        <div className="flex w-[240px] flex-col items-center gap-3">
          <div className="rounded-xl bg-white p-3">
            <QRCodeSVG value={voteUrl} size={180} level="M" />
          </div>
          <div className="text-center text-[10px] uppercase tracking-[0.18em] text-white/65">
            Sube tu intento
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
}: {
  submissions: Submission[];
  referenceSrc: string;
  onReset: () => void;
}) {
  return (
    <TitleCard minWidth={1700} maxWidth={1820} padding={36}>
      <div className="flex items-center gap-4 text-[20px] font-semibold tracking-[0.18em] text-[var(--latam-red)]">
        <span className="inline-block h-[3px] w-12 bg-[var(--latam-red)]" />
        COMPARATIVA
      </div>
      <h2 className="mt-2 text-[44px] font-semibold leading-[1.02] tracking-[-0.015em]">
        Original vs. los intentos
      </h2>

      <div className="mt-5 grid grid-cols-[1fr_1fr] gap-6">
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
        <div className="grid grid-cols-3 gap-2 content-start">
          {submissions.length === 0 ? (
            <div className="col-span-3 grid place-items-center rounded-xl bg-white/5 border border-white/10 py-12 text-[14px] text-white/50">
              No hubo intentos
            </div>
          ) : (
            submissions.slice(-9).map((s) => (
              <figure
                key={s.id}
                className="relative aspect-square overflow-hidden rounded-lg bg-black"
              >
                <img
                  src={s.url}
                  alt={s.name ?? "intento"}
                  className="h-full w-full object-cover"
                />
                {s.name ? (
                  <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent px-2 py-1 text-[10px] font-medium text-white">
                    {s.name}
                  </figcaption>
                ) : null}
              </figure>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end">
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
