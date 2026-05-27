"use client";

import { useEffect, useState } from "react";
import { PosterFrame, TitleCard, type PosterVariant } from "./PosterFrame";
import type { DsPatternName } from "../library/dsPatterns";

export function AICaravanResultsSlide({
  variant = "purple",
  patternName = "lines",
  bgImage,
  showPattern = true,
}: {
  variant?: PosterVariant;
  patternName?: DsPatternName;
  bgImage?: string;
  showPattern?: boolean;
}) {
  // Re-trigger entrance animations every time the slide is navigated to by
  // bumping a `cycle` counter on mount.
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    setCycle((c) => c + 1);
  }, []);

  // Cards in DOM order; the index drives the stagger delay.
  type CardSpec = {
    value: string;
    suffix?: string;
    label: string;
    hint?: string;
    big?: boolean;
    tone?: MetricTone;
  };

  const row1: CardSpec[] = [
    { value: "40", label: "Total de personas", big: true },
    { value: "93%", label: "Inscripción", hint: "37 participantes", tone: "red" },
    { value: "8%", label: "Apáticos", hint: "3 colaboradores" },
    { value: "85%", label: "Asistencia", tone: "red" },
  ];
  const row2: CardSpec[] = [
    { value: "39%", label: "Muy comprometidos", hint: "10 participantes", tone: "success" },
    { value: "42%", label: "Parcialmente comprometidos", hint: "17 participantes", tone: "warn" },
    { value: "18%", label: "Sin compromiso", hint: "6 participantes", tone: "danger" },
  ];
  const row3: CardSpec[] = [
    { value: "60%", label: "Entrega de tareas" },
    { value: "4.7", suffix: "/5", label: "Score promedio", tone: "red" },
    { value: "70.5%", label: "Respuesta a encuesta" },
    { value: "8.2", suffix: "/10", label: "Speakers", tone: "red" },
  ];
  const all = [...row1, ...row2, ...row3];
  const indexOf = (spec: CardSpec) => all.indexOf(spec);

  return (
    <PosterFrame tone="quiet" variant={variant} patternName={patternName} bgImage={bgImage} showPattern={showPattern}>
      <TitleCard minWidth={1720} maxWidth={1820} padding={48}>
        <div
          key={cycle}
          className="flex items-center gap-4 text-[18px] font-semibold tracking-[0.18em] text-[var(--latam-red)] anim-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          <span className="inline-block h-[3px] w-12 bg-[var(--latam-red)]" />
          AI CARAVAN · RESULTADOS
        </div>
        <h2
          className="mt-2 text-[52px] font-semibold leading-[1.02] tracking-[-0.015em] text-white anim-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          40 personas, así nos fue.
        </h2>

        <div className="mt-6 grid grid-cols-4 gap-3">
          {row1.map((c) => (
            <Metric key={c.label} {...c} delay={300 + indexOf(c) * 90} cycle={cycle} />
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {row2.map((c) => (
            <Metric key={c.label} {...c} delay={300 + indexOf(c) * 90} cycle={cycle} />
          ))}
        </div>

        <div className="mt-3 grid grid-cols-4 gap-3">
          {row3.map((c) => (
            <Metric key={c.label} {...c} delay={300 + indexOf(c) * 90} cycle={cycle} />
          ))}
        </div>
      </TitleCard>

      {/* Local CSS for entrance + bar grow */}
      <style>{`
        @keyframes anim-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up {
          opacity: 0;
          animation: anim-fade-up 600ms cubic-bezier(.2,.7,.2,1) forwards;
        }
        @keyframes anim-bar-grow {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </PosterFrame>
  );
}

type MetricTone = "neutral" | "red" | "success" | "warn" | "danger";

function Metric({
  value,
  suffix,
  label,
  hint,
  big = false,
  tone = "neutral",
  delay = 0,
  cycle,
}: {
  value: string;
  suffix?: string;
  label: string;
  hint?: string;
  big?: boolean;
  tone?: MetricTone;
  delay?: number;
  cycle: number;
}) {
  const toneStyles: Record<MetricTone, { bg: string; fg: string; bar: string }> = {
    neutral: { bg: "bg-white/5", fg: "text-white", bar: "bg-white/15" },
    red: { bg: "bg-[var(--latam-red)]/15", fg: "text-[var(--latam-red)]", bar: "bg-[var(--latam-red)]" },
    success: { bg: "bg-white/5", fg: "text-[#7ee08a]", bar: "bg-[#7ee08a]" },
    warn: { bg: "bg-white/5", fg: "text-[#f3c45e]", bar: "bg-[#f3c45e]" },
    danger: { bg: "bg-white/5", fg: "text-[var(--latam-red)]", bar: "bg-[var(--latam-red)]" },
  };
  const t = toneStyles[tone];

  const displayed = useCountUp(value, { duration: 1100, delay: delay + 150, cycle });

  return (
    <div
      key={cycle}
      className={`relative rounded-xl border border-white/10 ${t.bg} px-5 py-4 overflow-hidden anim-fade-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className={`absolute left-0 top-0 bottom-0 w-[3px] origin-bottom ${t.bar}`}
        style={{
          animation: `anim-bar-grow 700ms cubic-bezier(.2,.7,.2,1) forwards`,
          animationDelay: `${delay + 80}ms`,
          transform: "scaleY(0)",
        }}
      />
      <div
        className={`font-semibold tabular-nums leading-none tracking-[-0.02em] ${t.fg}`}
        style={{ fontSize: big ? 88 : 64 }}
      >
        {displayed}
        {suffix ? (
          <span className="text-[24px] text-white/50 font-medium align-baseline ml-1">
            {suffix}
          </span>
        ) : null}
      </div>
      <div className="mt-3 text-[14px] font-semibold uppercase tracking-[0.14em] text-white/85">
        {label}
      </div>
      {hint ? (
        <div className="mt-0.5 text-[12px] text-white/55">{hint}</div>
      ) : null}
    </div>
  );
}

/**
 * Animate a numeric value from 0 to target.
 * Accepts strings like "40", "93%", "4.7", "70.5%" — preserves the % suffix
 * and decimal precision of the source string.
 */
function useCountUp(
  target: string,
  opts: { duration?: number; delay?: number; cycle: number }
) {
  const { duration = 1000, delay = 0, cycle } = opts;
  const { numeric, hasPercent, decimals } = parseValue(target);
  const [v, setV] = useState(0);

  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const t = now - start - delay;
      if (t < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(t / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(numeric * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [numeric, duration, delay, cycle]);

  const text = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
  return hasPercent ? `${text}%` : text;
}

function parseValue(s: string): {
  numeric: number;
  hasPercent: boolean;
  decimals: number;
} {
  const hasPercent = s.includes("%");
  const cleaned = s.replace("%", "").replace(",", ".").trim();
  const numeric = parseFloat(cleaned) || 0;
  const dotIdx = cleaned.indexOf(".");
  const decimals = dotIdx >= 0 ? cleaned.length - dotIdx - 1 : 0;
  return { numeric, hasPercent, decimals };
}
