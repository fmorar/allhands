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
              { label: "Icebreaker · check-in", page: "02" },
              { label: "Icebreaker · activity", page: "05" },
              { label: "Team Updates", page: "06" },
            ],
          },
          {
            title: "Demos & Cierre",
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
    id: "team-updates-divider",
    build: () => (
      <SectionDividerSlide
        variant="black"
        layoutSeed={1}
        number="01"
        title="Team Updates"
        description="Talent visibility, allocation & growth — where we are and how you fit in."
      />
    ),
  },
  {
    id: "team-updates-1",
    build: () => (
      <ContentSlide
        variant="red"
        layoutSeed={0}
        sectionLabel="Team Updates · 01"
        title="What are we doing?"
      >
        <p className="text-[24px] text-white/85 max-w-[1100px]">
          Driving better talent visibility, allocation & growth across
          Experience.
        </p>
        <ul className="mt-6 space-y-3 text-[22px] list-disc pl-6 max-w-[1100px]">
          <li>Aligning skills, profiles, and demand needs with global standards.</li>
          <li>Strengthening upskilling pathways tied to real project opportunities.</li>
          <li>Increasing transparency in staffing & bench management.</li>
        </ul>
        <Callout label="Outcome">
          Better matchmaking between people, skills, and opportunities.
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: "team-updates-2",
    build: () => (
      <ContentSlide
        variant="cream"
        layoutSeed={3}
        sectionLabel="Team Updates · 02"
        title="How can you help?"
      >
        <p className="text-[22px] text-white/85 max-w-[1100px]">
          Your participation is key to making this work.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-6">
          <RoleBlock title="Individual Contributors">
            <li>Help your People Manager understand your project.</li>
            <li>Key stakeholders (name, role, contact).</li>
            <li>Project structure & dynamics.</li>
            <li>Discuss opportunities identified within your project with your PM.</li>
            <li>If you have a fully developed secondary skillset, create a separate profile.</li>
            <li className="opacity-70">
              <em>(Coming soon)</em> Keep your Enrich+ profile updated and accurate.
            </li>
          </RoleBlock>
          <RoleBlock title="People Managers">
            <li>Provide clear, actionable feedback on team members.</li>
            <li>Identify skill gaps and growth opportunities.</li>
          </RoleBlock>
        </div>
        <Callout label="Impact">
          Stronger decisions, faster staffing, and better project outcomes.
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: "team-updates-3",
    build: () => (
      <ContentSlide
        variant="purple"
        layoutSeed={2}
        sectionLabel="Team Updates · 03"
        title="What do we need immediately?"
      >
        <p className="text-[22px] text-white/85 max-w-[1100px]">
          Short-term priorities.
        </p>
        <ul className="mt-6 space-y-3 text-[22px] list-disc pl-6 max-w-[1100px]">
          <li>Updated profiles + accurate skill tagging for all team members.</li>
          <li>Clear visibility on bench resources and readiness status.</li>
          <li>Identification of critical skill gaps across the project pipeline.</li>
          <li>Alignment from Leads on priority roles & upcoming demand.</li>
        </ul>
        <Callout label="Focus · next few weeks">
          Enable faster, more accurate staffing decisions.
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: "quote",
    build: () => (
      <QuoteSlide
        variant="gradient-warm"
        layoutSeed={2}
        quote="No somos valiosos por las herramientas que usamos, somos valiosos por cómo pensamos, cómo aprendemos y cómo convertimos esas herramientas en impacto."
        attribution="Fabs"
      />
    ),
  },
  {
    id: "ai-caravan-results",
    build: () => <AICaravanResultsSlide variant="purple" layoutSeed={3} />,
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
        layoutSeed={0}
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
        layoutSeed={1}
      />
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
