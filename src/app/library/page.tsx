import {
  PatternFill,
  PATTERN_NAMES,
  FlowerMark,
  BrandCard,
  CARD_TONES,
  GradientBg,
  GRADIENT_NAMES,
  NoiseOverlay,
  Sticker,
} from "@/components/library";

const tonePairs: Array<[
  "red" | "purple" | "black" | "offwhite",
  "red" | "purple" | "black" | "offwhite" | "pink" | "lilac" | "white",
]> = [
  ["red", "white"],
  ["red", "black"],
  ["purple", "white"],
  ["purple", "offwhite"],
  ["black", "white"],
  ["offwhite", "black"],
];

export default function LibraryPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-8 py-16 space-y-16">
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-[var(--latam-muted)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--latam-red)]" />
          XD Latam · All Hands
        </div>
        <h1 className="text-[56px] font-semibold leading-[1.02] tracking-[-0.02em]">
          Library
        </h1>
        <p className="max-w-[640px] text-[16px] text-[var(--latam-muted)]">
          Reusable primitives from the All Hands style guide. Drop them into
          slides as accents, backgrounds, dividers, or full-bleed art.
        </p>
        <a
          href="/"
          className="inline-block text-[13px] font-medium text-[var(--latam-red)] underline-offset-2 hover:underline"
        >
          ← Back to deck
        </a>
      </header>

      <Section title="Foundations · Color" subtitle="Brand palette">
        <div className="grid grid-cols-5 gap-3">
          {[
            ["White", "#FFFFFF"],
            ["Black", "#000000"],
            ["Radiant Red", "#E90130"],
            ["Off-White", "#FAF9F6"],
            ["Latam Purple", "#616290"],
          ].map(([name, h]) => (
            <div
              key={name}
              className="rounded-xl border border-black/5 overflow-hidden"
            >
              <div
                className="h-28"
                style={{ background: h, borderBottom: "1px solid #00000010" }}
              />
              <div className="p-3 text-[12px]">
                <div className="font-semibold">{name}</div>
                <div className="text-[var(--latam-muted)] font-mono">{h}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Foundations · Type"
        subtitle="Display: Lexend · Body: Lexend · Accent: Kalam"
      >
        <div className="space-y-4 rounded-xl border border-black/5 bg-white p-8">
          <div className="text-[72px] font-semibold leading-[1.02] tracking-[-0.02em]">
            Display 72 / Lexend
          </div>
          <div className="text-[40px] font-semibold tracking-[-0.01em]">
            Page title 40
          </div>
          <div className="text-[28px] font-semibold">Section head 28</div>
          <div className="text-[20px] font-semibold">Sub-heading 20</div>
          <div className="text-[15px]">Body 15 — el quick brown fox saltó.</div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--latam-muted)]">
            Label 11
          </div>
          <div
            className="text-[24px] italic"
            style={{ fontFamily: "var(--font-hand)" }}
          >
            que tuanis · que chimba · que chido
          </div>
        </div>
      </Section>

      <Section title="Patterns" subtitle="<PatternFill pattern=… colors=… />">
        <div className="grid grid-cols-4 gap-4">
          {PATTERN_NAMES.map((p) => (
            <div
              key={p}
              className="rounded-xl border border-black/5 overflow-hidden"
            >
              <div className="relative h-32 bg-white">
                <PatternFill
                  pattern={p}
                  colors={["red", "offwhite"]}
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="px-3 py-2 text-[12px] font-medium">{p}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {tonePairs.map(([a, b]) => (
            <div
              key={`${a}-${b}`}
              className="rounded-xl border border-black/5 overflow-hidden"
            >
              <div className="relative h-32">
                <PatternFill
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  pattern="zigzag"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  colors={[a as any, b as any]}
                  className="absolute inset-0 h-full w-full"
                />
              </div>
              <div className="px-3 py-2 text-[12px] font-medium">
                zigzag · {a} on {b}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Flower marks" subtitle="<FlowerMark color=… size=… />">
        <div className="flex items-center gap-8 rounded-xl border border-black/5 bg-white p-8">
          {(["red", "purple", "black"] as const).map((c) => (
            <div key={c} className="flex flex-col items-center gap-2">
              <FlowerMark color={c} size={48} />
              <div className="text-[11px] uppercase tracking-[0.14em] text-[var(--latam-muted)]">
                {c}
              </div>
            </div>
          ))}
          <div className="ml-auto flex items-baseline gap-3 text-[15px]">
            <FlowerMark color="red" size={14} />
            <span>Use as inline bullet marker</span>
          </div>
        </div>
      </Section>

      <Section title="Brand cards" subtitle="<BrandCard tone=… pattern=… />">
        <div className="grid grid-cols-4 gap-4">
          {CARD_TONES.map((t) => (
            <BrandCard key={t} tone={t} pattern="leaf-row" patternOpacity={0.14}>
              <div className="p-5">
                <div className="text-[11px] uppercase tracking-[0.14em] opacity-70">
                  Tone
                </div>
                <div className="mt-1 text-[22px] font-semibold capitalize">
                  {t}
                </div>
                <div className="mt-4 text-[13px] opacity-90">
                  leaf-row pattern · 14% opacity
                </div>
              </div>
            </BrandCard>
          ))}
        </div>
      </Section>

      <Section
        title="Gradient backgrounds"
        subtitle="<GradientBg variant=… />"
      >
        <div className="grid grid-cols-2 gap-4">
          {GRADIENT_NAMES.map((g) => (
            <div
              key={g}
              className="relative h-40 rounded-xl overflow-hidden border border-black/5"
            >
              <GradientBg
                variant={g}
                className="absolute inset-0 h-full w-full"
              />
              <NoiseOverlay
                opacity={0.08}
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute bottom-3 left-3 text-[12px] font-semibold text-white drop-shadow">
                {g}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Stickers"
        subtitle="<Sticker name='cafe' size=… /> · drop PNGs in /public/stickers"
      >
        <div className="rounded-xl border border-black/5 bg-white p-6 text-[13px] text-[var(--latam-muted)]">
          Export the sticker frames you want from Figma (transparent PNG @2x)
          into <code className="font-mono">public/stickers/</code>. Sample render
          (will 404 until assets are added):
          <div className="mt-3 flex flex-wrap gap-4">
            {["cafe", "taco", "corazon", "estrella"].map((n) => (
              <div key={n} className="flex flex-col items-center gap-1">
                <Sticker name={n} size={56} />
                <div className="text-[11px] font-mono">{n}.png</div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-4 border-t border-[var(--latam-rule)] pt-4">
        <h2 className="text-[24px] font-semibold tracking-[-0.01em]">{title}</h2>
        {subtitle ? (
          <div className="text-[12px] font-mono text-[var(--latam-muted)]">
            {subtitle}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}
