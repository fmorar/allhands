type BrandColor = "red" | "purple" | "black" | "white";

const hex: Record<BrandColor, string> = {
  red: "#e90130",
  purple: "#616290",
  black: "#000000",
  white: "#ffffff",
};

/**
 * 4-petal cross-flower mark. Drop-in inline glyph — sizes with `size` (px).
 * Use as a bullet marker, divider accent, or hover decoration.
 */
export function FlowerMark({
  color = "red",
  size = 14,
  className,
}: {
  color?: BrandColor;
  size?: number;
  className?: string;
}) {
  const c = hex[color];
  const r = size / 2;
  // 4 oval petals meeting at the center
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <ellipse cx="12" cy="6" rx="3.2" ry="5.2" fill={c} />
      <ellipse cx="18" cy="12" rx="5.2" ry="3.2" fill={c} />
      <ellipse cx="12" cy="18" rx="3.2" ry="5.2" fill={c} />
      <ellipse cx="6" cy="12" rx="5.2" ry="3.2" fill={c} />
      <circle cx="12" cy="12" r="1.6" fill="white" />
    </svg>
  );
}
