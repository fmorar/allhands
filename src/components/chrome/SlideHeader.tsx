export function SlideHeader({
  section,
  slideLabel,
}: {
  section: string;
  slideLabel: string;
}) {
  return (
    <div className="absolute left-0 right-0 top-0">
      <div className="flex items-center justify-between px-24 pt-10 pb-6 text-[18px] uppercase tracking-[0.14em]">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-[var(--latam-red)]" />
          <span className="text-[var(--latam-black)]">{section}</span>
        </div>
        <div className="text-[var(--latam-muted)]">{slideLabel}</div>
      </div>
      <div className="mx-0 h-px bg-[var(--latam-rule)]" />
    </div>
  );
}
