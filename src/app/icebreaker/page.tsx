"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "revealing" | "uploading" | "comparing";
type Submission = { id: string; url: string; name?: string; ts: number };
type State = {
  status: Status;
  revealStartedAt: number | null;
  revealDurationMs: number;
  submissions: Submission[];
  version: number;
};

const POLL_MS = 1500;

export default function IcebreakerPage() {
  const [state, setState] = useState<State | null>(null);
  const [name, setName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Poll state
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const r = await fetch("/api/icebreaker", { cache: "no-store" });
        if (!r.ok) return;
        const next = (await r.json()) as State;
        if (!cancelled) setState(next);
      } catch {}
    };
    tick();
    const id = setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Live countdown during reveal
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 300);
    return () => clearInterval(id);
  }, []);

  const status = state?.status ?? "idle";
  const remaining =
    state?.status === "revealing" && state.revealStartedAt
      ? Math.max(
          0,
          Math.ceil((state.revealStartedAt + state.revealDurationMs - now) / 1000)
        )
      : null;

  function pickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  async function submit() {
    if (!file) return;
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("name", name);
      const r = await fetch("/api/icebreaker/upload", {
        method: "POST",
        body: fd,
      });
      if (!r.ok) throw new Error(`upload failed (${r.status})`);
      setDone(true);
    } catch (e) {
      setError(String((e as Error).message ?? e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--latam-red)] text-white flex flex-col">
      <header className="px-6 pt-8 pb-4">
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.18em]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
          XD Latam · All Hands · Icebreaker
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {status === "idle" && (
          <div className="text-center max-w-[420px]">
            <div className="text-[80px]">⏳</div>
            <h1 className="mt-4 text-[36px] font-semibold leading-tight">
              Espera al presentador
            </h1>
            <p className="mt-3 text-[16px] opacity-85">
              En un momento te vamos a mostrar una imagen durante 30 segundos.
              Memorizala — luego la vas a recrear con IA.
            </p>
          </div>
        )}

        {status === "revealing" && (
          <div className="text-center">
            <div className="text-[80px]">👀</div>
            <h1 className="mt-4 text-[36px] font-semibold leading-tight">
              Mira la pantalla
            </h1>
            <p className="mt-3 text-[16px] opacity-85">
              Memoriza la imagen. En seguida la escondemos.
            </p>
            {remaining !== null && (
              <div className="mt-8 text-[88px] font-semibold leading-none tabular-nums">
                {remaining}s
              </div>
            )}
          </div>
        )}

        {status === "uploading" && !done && (
          <div className="w-full max-w-[420px]">
            <h1 className="text-center text-[32px] font-semibold leading-tight">
              Sube tu intento
            </h1>
            <p className="mt-2 text-center text-[15px] opacity-85">
              Recreala con tu IA favorita (Midjourney, Imagen, DALL-E…) y subila.
            </p>

            <label className="mt-6 block">
              <span className="text-[12px] uppercase tracking-[0.18em] opacity-80">
                Tu nombre (opcional)
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. Ana"
                className="mt-2 w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-[16px] outline-none placeholder:text-white/40"
              />
            </label>

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/30 bg-black/20 px-5 py-8 text-[16px] font-medium"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="max-h-[220px] rounded-md"
                />
              ) : (
                <>
                  <span className="text-[32px]">📸</span>
                  Elegir imagen
                </>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={pickFile}
              className="hidden"
            />

            <button
              onClick={submit}
              disabled={!file || submitting}
              className="mt-4 w-full rounded-full bg-black px-5 py-4 text-[18px] font-semibold disabled:opacity-50"
            >
              {submitting ? "Subiendo…" : "Subir mi intento"}
            </button>

            {error ? (
              <div className="mt-3 text-[14px] text-yellow-200 text-center">
                {error}
              </div>
            ) : null}
          </div>
        )}

        {done && (
          <div className="text-center max-w-[420px]">
            <div className="text-[100px]">🎉</div>
            <h1 className="mt-4 text-[36px] font-semibold leading-tight">
              ¡Subido!
            </h1>
            <p className="mt-3 text-[16px] opacity-85">
              Tu intento ya está en la pantalla. Vamos a ver cómo te fue.
            </p>
          </div>
        )}

        {status === "comparing" && (
          <div className="text-center max-w-[420px]">
            <div className="text-[80px]">🖼️</div>
            <h1 className="mt-4 text-[36px] font-semibold leading-tight">
              Mira la pantalla
            </h1>
            <p className="mt-3 text-[16px] opacity-85">
              Estamos comparando los intentos con la imagen original.
            </p>
          </div>
        )}
      </div>

      <footer className="px-6 pb-6 text-[11px] uppercase tracking-[0.18em] opacity-70 text-center">
        #XDLATAM
      </footer>
    </main>
  );
}
