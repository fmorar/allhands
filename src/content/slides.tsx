import type { ReactNode } from "react";
import type { DeckSlide } from "@/components/Deck";
import { CoverSlide } from "@/components/slides/CoverSlide";
import { IndexSlide } from "@/components/slides/IndexSlide";
import { SectionDividerSlide } from "@/components/slides/SectionDividerSlide";
import { ContentSlide } from "@/components/slides/ContentSlide";
import { QuoteSlide } from "@/components/slides/QuoteSlide";
import { ClosingSlide } from "@/components/slides/ClosingSlide";
import { MoodSlide } from "@/components/slides/MoodSlide";
import { IcebreakerSlide } from "@/components/slides/IcebreakerSlide";

/**
 * Variant rotation gives the deck rhythm without breaking the shared
 * poster grammar. Cover and closing match (red/loud), section dividers
 * are darker (black), and content slides alternate between red, cream,
 * purple, and gradient backgrounds.
 */
type RawSlide = { id: string; build: () => ReactNode };

const raw: RawSlide[] = [
  {
    id: "cover",
    build: () => (
      <CoverSlide title="Bienvenida" variant="red" layoutSeed={0} />
    ),
  },
  {
    id: "mood",
    build: () => (
      <MoodSlide
        variant="red"
        layoutSeed={1}
        question="¿Cómo te sientes hoy?"
      />
    ),
  },
  {
    id: "index",
    build: () => (
      <IndexSlide
        variant="cream"
        layoutSeed={3}
        intro="Lo que vamos a cubrir hoy."
        sections={[
          {
            title: "Agenda",
            entries: [
              { label: "Welcome", page: "01" },
              { label: "Icebreaker", page: "02" },
              { label: "Team Updates", page: "04" },
              { label: "Alejandra", page: "06" },
            ],
          },
          {
            title: "Demos & Cierre",
            entries: [
              { label: "AI Caravan · Showcase", page: "08" },
              { label: "Q&A", page: "10" },
              { label: "Figma Config", page: "12" },
            ],
          },
        ]}
      />
    ),
  },
  {
    id: "section-1",
    build: () => (
      <SectionDividerSlide
        variant="black"
        layoutSeed={1}
        number="01"
        title="Introducción"
        description="De dónde venimos y qué queremos lograr hoy."
      />
    ),
  },
  {
    id: "icebreaker",
    build: () => (
      <IcebreakerSlide variant="red" layoutSeed={2} />
    ),
  },
  {
    id: "highlights",
    build: () => (
      <ContentSlide
        variant="gradient-warm"
        layoutSeed={2}
        sectionLabel="Highlights"
        title="Lo que nos mueve este trimestre."
      >
        <ul className="grid grid-cols-2 gap-x-12 gap-y-4 text-[22px]">
          <Highlight label="Métrica 1" value="—" hint="Reemplazar" />
          <Highlight label="Métrica 2" value="—" hint="Reemplazar" />
          <Highlight label="Métrica 3" value="—" hint="Reemplazar" />
          <Highlight label="Métrica 4" value="—" hint="Reemplazar" />
        </ul>
      </ContentSlide>
    ),
  },
  {
    id: "section-2",
    build: () => (
      <SectionDividerSlide
        variant="purple"
        layoutSeed={2}
        number="02"
        title="Updates"
        description="Qué pasó, qué aprendimos, qué viene."
      />
    ),
  },
  {
    id: "update-product",
    build: () => (
      <ContentSlide
        variant="cream"
        layoutSeed={3}
        sectionLabel="Producto"
        title="Lo que envió Producto."
      >
        <ul className="list-disc pl-6 space-y-3 max-w-[1000px]">
          <li>Bullet 1 — reemplazar.</li>
          <li>Bullet 2 — reemplazar.</li>
          <li>Bullet 3 — reemplazar.</li>
        </ul>
      </ContentSlide>
    ),
  },
  {
    id: "update-design",
    build: () => (
      <ContentSlide
        variant="purple"
        layoutSeed={1}
        sectionLabel="Diseño"
        title="Cómo está avanzando Diseño."
      >
        <ul className="list-disc pl-6 space-y-3 max-w-[1000px]">
          <li>Bullet 1 — reemplazar.</li>
          <li>Bullet 2 — reemplazar.</li>
        </ul>
      </ContentSlide>
    ),
  },
  {
    id: "quote",
    build: () => (
      <QuoteSlide
        variant="gradient-warm"
        layoutSeed={2}
        quote="Una frase corta que resuma el espíritu del trimestre."
        attribution="Pega aquí el autor o el equipo"
      />
    ),
  },
  {
    id: "section-3",
    build: () => (
      <SectionDividerSlide
        variant="black"
        layoutSeed={3}
        number="03"
        title="Próximos pasos"
        description="A dónde vamos y cómo llegamos juntos."
      />
    ),
  },
  {
    id: "roadmap",
    build: () => (
      <ContentSlide
        variant="gradient-cool"
        layoutSeed={0}
        sectionLabel="Roadmap"
        title="Lo que viene."
      >
        <div className="grid grid-cols-3 gap-4 text-[18px]">
          {["Ahora", "Próximo", "Después"].map((col) => (
            <div
              key={col}
              className="rounded-xl border border-white/15 bg-white/5 p-5"
            >
              <div className="text-[16px] font-semibold uppercase tracking-[0.18em] text-[var(--latam-red)]">
                {col}
              </div>
              <ul className="mt-3 list-disc pl-5 space-y-2">
                <li>—</li>
                <li>—</li>
              </ul>
            </div>
          ))}
        </div>
      </ContentSlide>
    ),
  },
  {
    id: "closing",
    build: () => (
      <ClosingSlide
        variant="red"
        layoutSeed={0}
        title="Gracias"
        subtitle="Preguntas, ideas, abrazos — todo bienvenido."
        contacts={[
          { label: "Slack", value: "#all-hands" },
          { label: "Email", value: "team@example.com" },
        ]}
      />
    ),
  },
];

export const slides: DeckSlide[] = raw.map((s) => ({
  id: s.id,
  node: s.build(),
}));

function Highlight({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <li className="border-t border-white/20 pt-3">
      <div className="text-[14px] uppercase tracking-[0.18em] text-white/60">
        {label}
      </div>
      <div className="mt-1 text-[44px] font-semibold leading-none tracking-[-0.01em]">
        {value}
      </div>
      {hint ? (
        <div className="mt-1 text-[14px] text-white/60">{hint}</div>
      ) : null}
    </li>
  );
}
