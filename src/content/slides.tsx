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
import { AICaravanResultsSlide } from "@/components/slides/AICaravanResultsSlide";
import { PresenterIntroSlide } from "@/components/slides/PresenterIntroSlide";
import { ProjectEmbedSlide } from "@/components/slides/ProjectEmbedSlide";
import { FigmaConfigSlide } from "@/components/slides/FigmaConfigSlide";
import { DsPattern } from "@/components/library/dsPatterns";

/* Custom decoration for the cover — full-bleed prehispanic header band
 * + a sun mark anchored to the top-right corner. Both touch slide edges
 * so they read as architectural, not floating. */
const COVER_MIX = (
  <>
    <DsPattern
      name="prehispanic"
      tone="red"
      opacity={0.9}
      className="absolute"
      style={{ left: 0, right: 0, top: 0, height: 120 }}
    />
    <DsPattern
      name="sun"
      tone="red"
      opacity={0.9}
      className="absolute"
      style={{ right: 0, bottom: 0, width: 240, height: 240 }}
    />
  </>
);

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
      <CoverSlide
        title="Bienvenida"
        variant="cream"
        bgImage="/bg/Textura.png"
        decoration={COVER_MIX}
      />
    ),
  },
  {
    id: "mood",
    build: () => (
      <MoodSlide
        variant="cream"
        patternName="natura"
        bgImage="/bg/Textura-1.png"
        question="¿Cómo te sientes hoy?"
      />
    ),
  },
  {
    id: "index",
    build: () => (
      <IndexSlide
        variant="cream"
        patternName="sparkle"
        bgImage="/bg/Textura.png"
        intro="Lo que vamos a cubrir hoy."
        sections={[
          {
            title: "Agenda",
            entries: [
              { label: "Bienvenida", page: "01" },
              { label: "Rompehielo · check-in", page: "02" },
              { label: "Rompehielo · actividad", page: "05" },
              { label: "Updates del equipo", page: "06" },
            ],
          },
          {
            title: "Demos y cierre",
            entries: [
              { label: "AI Caravan · Resultados", page: "11" },
              { label: "Alejandra · NOIRE", page: "12" },
              { label: "Figma Config 2026", page: "14" },
              { label: "Gracias", page: "15" },
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
        patternName="curves"
        bgImage="/bg/V4.png"
        showPattern={false}
        number="01"
        title="Introducción"
        description="De dónde venimos y qué queremos lograr hoy."
      />
    ),
  },
  {
    id: "icebreaker",
    build: () => (
      <IcebreakerSlide variant="cream" patternName="sun" bgImage="/bg/Textura.png" />
    ),
  },
  {
    id: "team-updates-divider",
    build: () => (
      <SectionDividerSlide
        variant="black"
        patternName="sparkle"
        bgImage="/bg/V5.png"
        showPattern={false}
        number="01"
        title="Updates del equipo"
        description="Visibilidad, asignación y crecimiento del talento — dónde estamos y cómo encajas tú."
      />
    ),
  },
  {
    id: "team-updates-1",
    build: () => (
      <ContentSlide
        variant="cream"
        patternName="prehispanic"
        bgImage="/bg/Textura.png"
        sectionLabel="Updates · 01"
        title="¿Qué estamos haciendo?"
      >
        <p className="text-[24px] text-white/85 max-w-[1100px]">
          Mejor visibilidad, asignación y crecimiento del talento dentro
          de Experience.
        </p>
        <ul className="mt-6 space-y-3 text-[22px] list-disc pl-6 max-w-[1100px]">
          <li>Alinear skills, perfiles y demanda con los estándares globales.</li>
          <li>Reforzar las rutas de upskilling conectadas a oportunidades reales de proyecto.</li>
          <li>Más transparencia en staffing y manejo del bench.</li>
        </ul>
        <Callout label="Resultado">
          Mejor match entre personas, skills y oportunidades.
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: "team-updates-2",
    build: () => (
      <ContentSlide
        variant="cream"
        patternName="flower"
        bgImage="/bg/Sloths.png"
        showPattern={false}
        sectionLabel="Updates · 02"
        title="¿Cómo puedes ayudar?"
      >
        <p className="text-[22px] text-white/85 max-w-[1100px]">
          Tu participación es clave para que esto funcione.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-6">
          <RoleBlock title="Colaboradores individuales">
            <li>Ayuda a tu People Manager a entender tu proyecto.</li>
            <li>Stakeholders clave (nombre, rol, contacto).</li>
            <li>Estructura y dinámica del proyecto.</li>
            <li>Conversa con tu PM las oportunidades que identifiques dentro del proyecto.</li>
            <li>Si tienes un skillset secundario desarrollado, crea un perfil aparte.</li>
            <li className="opacity-70">
              <em>(Próximamente)</em> Mantén tu perfil de Enrich+ actualizado y preciso.
            </li>
          </RoleBlock>
          <RoleBlock title="People Managers">
            <li>Da feedback claro y accionable a los miembros del equipo.</li>
            <li>Identifica gaps de skills y oportunidades de crecimiento.</li>
          </RoleBlock>
        </div>
        <Callout label="Impacto">
          Mejores decisiones, staffing más rápido y mejores resultados de proyecto.
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: "team-updates-3",
    build: () => (
      <ContentSlide
        variant="purple"
        patternName="zigzag"
        bgImage="/bg/Flowers.png"
        showPattern={false}
        sectionLabel="Updates · 03"
        title="¿Qué necesitamos ya?"
      >
        <p className="text-[22px] text-white/85 max-w-[1100px]">
          Prioridades a corto plazo.
        </p>
        <ul className="mt-6 space-y-3 text-[22px] list-disc pl-6 max-w-[1100px]">
          <li>Perfiles actualizados con skill tagging preciso para todo el equipo.</li>
          <li>Visibilidad clara del bench y de su estado de disponibilidad.</li>
          <li>Identificación de gaps críticos de skills en el pipeline de proyectos.</li>
          <li>Alineación con los Leads sobre roles prioritarios y demanda próxima.</li>
        </ul>
        <Callout label="Foco · próximas semanas">
          Tomar decisiones de staffing más rápidas y precisas.
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: "quote",
    build: () => (
      <QuoteSlide
        variant="gradient-warm"
        patternName="zigzag-simple"
        bgImage="/bg/V2.png"
        showPattern={false}
        quote="No somos valiosos por las herramientas que usamos, somos valiosos por cómo pensamos, cómo aprendemos y cómo convertimos esas herramientas en impacto."
        attribution="Fabs"
      />
    ),
  },
  {
    id: "ai-caravan-results",
    build: () => (
      <AICaravanResultsSlide
        variant="purple"
        patternName="lines"
        bgImage="/bg/Oxcart.png"
        showPattern={false}
      />
    ),
  },
  {
    id: "alejandra-showcase",
    build: () => (
      <PresenterIntroSlide
        name="Alejandra"
        topic="AI Caravan · Showcase"
        description="Un repaso de lo que construimos, lo que aprendimos y cómo lo estamos llevando al día a día del equipo."
        label="Showcase"
        photoSrc="/presenters/alejandra.jpg"
        variant="gradient-cool"
        patternName="curves"
        bgImage="/bg/V3.png"
        showPattern={false}
      />
    ),
  },
  {
    id: "alejandra-noire",
    build: () => (
      <ProjectEmbedSlide
        presenter="Alejandra"
        projectName="NOIRE · Maison de Lunel"
        src="/alejandra/index.html"
      />
    ),
  },
  {
    id: "figma-config",
    build: () => (
      <FigmaConfigSlide
        year="2026"
        pitch="La conferencia anual de Figma — inspiración fresca para todo el equipo. Apártalo en tu calendario y nos vemos ahí."
        url="https://config.figma.com"
        variant="cream"
        patternName="flower"
        bgImage="/bg/Tucans.png"
        showPattern={false}
      />
    ),
  },
  {
    id: "closing",
    build: () => (
      <ClosingSlide
        variant="black"
        patternName="sun"
        bgImage="/bg/V1.png"
        showPattern={false}
        title="Gracias"
        subtitle="Preguntas, ideas, abrazos — todo bienvenido."
      />
    ),
  },
];

export const slides: DeckSlide[] = raw.map((s) => ({
  id: s.id,
  node: s.build(),
}));

function Callout({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-7 inline-flex max-w-[1200px] items-start gap-5 rounded-xl border-l-4 border-[var(--latam-red)] bg-white/5 px-6 py-4">
      <div className="text-[14px] font-semibold uppercase tracking-[0.18em] text-[var(--latam-red)] whitespace-nowrap pt-1">
        {label}
      </div>
      <div className="text-[22px] font-medium leading-snug">{children}</div>
    </div>
  );
}

function RoleBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-5">
      <div className="text-[14px] font-semibold uppercase tracking-[0.18em] text-[var(--latam-red)]">
        {title}
      </div>
      <ul className="mt-3 list-disc pl-5 space-y-1.5 text-[18px] leading-snug">
        {children}
      </ul>
    </div>
  );
}
