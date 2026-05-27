export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 text-[22px] font-semibold text-[var(--latam-red)]">
      <span className="inline-block h-[3px] w-14 bg-[var(--latam-red)]" />
      <span>{children}</span>
    </div>
  );
}
