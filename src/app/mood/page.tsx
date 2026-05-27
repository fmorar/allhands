"use client";

import { useState } from "react";
import { MOODS, type MoodId } from "@/lib/moodStore";

export default function MoodVotePage() {
  const [picked, setPicked] = useState<MoodId | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function vote(id: MoodId) {
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch("/api/mood", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!r.ok) throw new Error("vote failed");
      setPicked(id);
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
          XD Latam · All Hands
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-10">
        {picked ? (
          <ThankYou
            mood={picked}
            onReset={() => {
              setPicked(null);
            }}
          />
        ) : (
          <>
            <h1 className="text-center text-[42px] font-semibold leading-[1.05] tracking-[-0.015em]">
              ¿Cómo te sientes ahora?
            </h1>
            <p className="mt-3 max-w-[420px] text-center text-[16px] opacity-85">
              Pica una opción. Tu voto se ve en pantalla al instante.
            </p>

            <div className="mt-10 grid w-full max-w-[420px] grid-cols-1 gap-3">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => vote(m.id)}
                  disabled={submitting}
                  className="flex items-center gap-5 rounded-2xl border border-white/20 bg-black/30 px-5 py-4 text-left transition-transform active:scale-[0.98] disabled:opacity-50"
                >
                  <span className="text-[44px] leading-none">{m.emoji}</span>
                  <span className="text-[20px] font-semibold">{m.label}</span>
                </button>
              ))}
            </div>

            {error ? (
              <div className="mt-4 text-[14px] text-yellow-200">{error}</div>
            ) : null}
          </>
        )}
      </div>

      <footer className="px-6 pb-6 text-[11px] uppercase tracking-[0.18em] opacity-70 text-center">
        #XDLATAM
      </footer>
    </main>
  );
}

function ThankYou({
  mood,
  onReset,
}: {
  mood: MoodId;
  onReset: () => void;
}) {
  const m = MOODS.find((x) => x.id === mood);
  return (
    <div className="text-center">
      <div className="text-[140px] leading-none">{m?.emoji}</div>
      <h2 className="mt-6 text-[40px] font-semibold leading-tight">
        ¡Gracias!
      </h2>
      <p className="mt-2 text-[16px] opacity-85">Tu mood se registró.</p>
      <button
        onClick={onReset}
        className="mt-8 rounded-full border border-white/30 px-5 py-2 text-[14px] font-medium"
      >
        Cambiar voto
      </button>
    </div>
  );
}
