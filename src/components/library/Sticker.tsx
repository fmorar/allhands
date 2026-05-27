/* eslint-disable @next/next/no-img-element */

/**
 * Sticker — loads from /public/stickers/<name>.png.
 *
 * To add new stickers: export the sticker frames from the Figma library as
 * PNGs at 2x (transparent background) and drop them in public/stickers/.
 * Name them in kebab-case, e.g. `cafe.png`, `taco.png`, `corazon.png`.
 */
export function Sticker({
  name,
  size = 64,
  className,
  rotate = 0,
  alt,
}: {
  name: string;
  size?: number;
  className?: string;
  rotate?: number;
  alt?: string;
}) {
  return (
    <img
      src={`/stickers/${name}.png`}
      width={size}
      height={size}
      alt={alt ?? name}
      className={className}
      style={{
        transform: `rotate(${rotate}deg)`,
        display: "inline-block",
        objectFit: "contain",
      }}
    />
  );
}
