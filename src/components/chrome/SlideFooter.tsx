export function SlideFooter({ pageNumber }: { pageNumber: number | string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0">
      <div className="mx-0 h-px bg-[var(--latam-rule)]" />
      <div className="flex items-center justify-center py-6 text-[18px] text-[var(--latam-muted)]">
        {String(pageNumber).padStart(2, "0")}
      </div>
    </div>
  );
}
